import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Resident, ClinicalRecord, ClinicalRecordCategory, DeletedClinicalRecord } from '../../types';
import { api } from '../../services/api';
import {
  X,
  Download,
  FileText,
  Image as ImageIcon,
  ChevronDown,
  Upload,
  CheckCircle2,
  Loader2
} from 'lucide-react';

interface ClinicalHistorySectionProps {
  resident: Resident;
}

export const ClinicalHistorySection: React.FC<ClinicalHistorySectionProps> = ({ resident }) => {
  const {
    clinicalRecords,
    deletedClinicalRecords,
    addClinicalRecord,
    updateClinicalRecord,
    deleteClinicalRecord,
    canEditOrDeleteClinicalRecord,
    showToast,
    selectedDate
  } = useApp();

  // Subview in Historia clínica: 'activos' | 'eliminados'
  const [viewMode, setViewMode] = useState<'activos' | 'eliminados'>('activos');

  // Notification tracker: has user viewed deleted records
  const [hasSeenDeleted, setHasSeenDeleted] = useState(false);

  // Filter for Historia clínica categories (dropdown)
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'todos' | ClinicalRecordCategory>('todos');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState<ClinicalRecord | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<ClinicalRecord | null>(null);
  const [previewFile, setPreviewFile] = useState<ClinicalRecord | null>(null);
  const [selectedDeletedRecord, setSelectedDeletedRecord] = useState<DeletedClinicalRecord | null>(null);

  // Form states for adding a record
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<ClinicalRecordCategory>('receta');
  const [formEntryType, setFormEntryType] = useState<'archivo' | 'nota_texto'>('archivo');
  const [formFileType, setFormFileType] = useState<'pdf' | 'imagen'>('pdf');
  const [formFileName, setFormFileName] = useState('');
  const [formDescription, setFormDescription] = useState('');

  // File upload states for adding a record
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formFileSize, setFormFileSize] = useState('');
  const [fileObjectUrl, setFileObjectUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Archivos registrados en base de datos para este residente
  const [residentArchivos, setResidentArchivos] = useState<any[]>([]);

  const fetchResidentArchivos = () => {
    const resNumericId = Number(String(resident.id).replace(/\D/g, '')) || 1;
    api.getArchivosResidente(resNumericId)
      .then(archivos => {
        if (Array.isArray(archivos)) {
          setResidentArchivos(archivos);

          // Sincronizar archivos activos de SMY_ARCHIVOS con clinicalRecords si no están presentes
          archivos.forEach((a: any) => {
            if (a.idEstadoArchivo === 1) {
              const alreadyExists = clinicalRecords.some(
                r => r.idArchivo === a.id ||
                     (r.fileName && r.fileName.toLowerCase() === a.nombreArchivo?.toLowerCase())
              );
              if (!alreadyExists) {
                addClinicalRecord({
                  residentId: resident.id,
                  residentName: resident.name,
                  title: (a.nombreArchivo || 'Documento adjunto').replace(/\.[^/.]+$/, ''),
                  category: 'examen',
                  categoryLabel: a.nombreClase || 'Documentación médica',
                  entryType: 'archivo',
                  fileType: a.extension?.toLowerCase().includes('pdf') ? 'pdf' : 'imagen',
                  fileName: a.nombreArchivo,
                  fileSize: `${Math.round((a.tamanoBytes || 0) / 1024)} KB`,
                  fileUrl: api.getArchivoVerUrl(a.id),
                  idArchivo: a.id,
                  description: `Archivo oficial registrado en Oracle DB (ID: ${a.id})`,
                  date: a.fechaCreacion ? a.fechaCreacion.split('T')[0] : new Date().toISOString().split('T')[0]
                });
              }
            }
          });
        }
      })
      .catch(err => console.warn('No se pudieron obtener archivos del residente:', err));
  };

  useEffect(() => {
    fetchResidentArchivos();
  }, [resident.id]);

  // Resuelve la URL de visualización (imagen o documento)
  const getRecordViewUrl = (record: ClinicalRecord): string | undefined => {
    // Si ya contiene la URL de streaming de nuestra API con token
    if (record.fileUrl && record.fileUrl.includes('/ver')) {
      return record.fileUrl;
    }

    // Buscar coincidencia en archivos registrados de BD
    if (record.fileName && residentArchivos.length > 0) {
      const match = residentArchivos.find(
        (a: any) =>
          a.nombreArchivo?.toLowerCase() === record.fileName?.toLowerCase() ||
          a.nombreArchivoAlmacenado?.toLowerCase() === record.fileName?.toLowerCase()
      );
      if (match && match.id) {
        return api.getArchivoVerUrl(match.id);
      }
    }

    // Si es un blob recién generado en la sesión actual
    if (record.fileUrl && record.fileUrl.startsWith('blob:')) {
      return record.fileUrl;
    }

    return record.fileUrl;
  };

  // Resuelve la URL de descarga directa
  const getRecordDownloadUrl = (record: ClinicalRecord): string | undefined => {
    if (record.fileName && residentArchivos.length > 0) {
      const match = residentArchivos.find(
        (a: any) =>
          a.nombreArchivo?.toLowerCase() === record.fileName?.toLowerCase() ||
          a.nombreArchivoAlmacenado?.toLowerCase() === record.fileName?.toLowerCase()
      );
      if (match && match.id) {
        return api.getArchivoDescargarUrl(match.id);
      }
    }

    if (record.fileUrl && record.fileUrl.includes('/ver')) {
      return record.fileUrl.replace('/ver', '/descargar');
    }

    return record.fileUrl;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const processSelectedFile = (file: File) => {
    setSelectedFile(file);
    setFormFileName(file.name);
    setFormFileSize(formatFileSize(file.size));

    // Determinar formato de archivo a partir del archivo
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (isPdf) {
      setFormFileType('pdf');
    } else {
      setFormFileType('imagen');
    }

    // Si el título del documento o nota está vacío, sugerir a partir del nombre del archivo
    if (!formTitle.trim()) {
      const cleanTitle = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[_-]+/g, ' ')
        .trim();
      if (cleanTitle) {
        setFormTitle(cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1));
      }
    }

    if (fileObjectUrl) {
      URL.revokeObjectURL(fileObjectUrl);
    }
    const url = URL.createObjectURL(file);
    setFileObjectUrl(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setFormFileName('');
    setFormFileSize('');
    if (fileObjectUrl) {
      URL.revokeObjectURL(fileObjectUrl);
      setFileObjectUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setFormTitle('');
    setFormDescription('');
    setFormFileName('');
    setFormFileSize('');
    setSelectedFile(null);
    if (fileObjectUrl) {
      URL.revokeObjectURL(fileObjectUrl);
      setFileObjectUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setFormCategory('receta');
    setFormEntryType('archivo');
  };

  // Form states for editing
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState<ClinicalRecordCategory>('receta');
  const [editDescription, setEditDescription] = useState('');

  // Helper to remove any parentheses from author names
  const cleanPersonName = (name: string) => {
    if (!name) return '';
    return name.replace(/\s*\([^)]*\)/g, '').trim();
  };

  // Category labels map
  const categoryLabels: Record<ClinicalRecordCategory, string> = {
    receta: 'Recetas médicas',
    laboratorio: 'Resultados de laboratorio',
    examen: 'Exámenes e informes',
    nota_clinica: 'Notas clínicas',
    administrativo: 'Administrativo / Contrato',
    legal_personal: 'Documentación personal / DNI',
    consentimiento: 'Consentimientos / Autorizaciones',
    otro: 'Otros documentos'
  };

  // Filtered clinical records for this resident
  const residentRecords = useMemo(() => {
    if (!resident) return [];
    return clinicalRecords.filter(r => {
      const matchesResident = r.residentId === resident.id || r.residentName === resident.name;
      if (!matchesResident) return false;
      if (activeCategoryFilter === 'todos') return true;
      return r.category === activeCategoryFilter;
    });
  }, [clinicalRecords, resident, activeCategoryFilter]);

  const totalResidentRecordsCount = useMemo(() => {
    if (!resident) return 0;
    return clinicalRecords.filter(r => r.residentId === resident.id || r.residentName === resident.name).length;
  }, [clinicalRecords, resident]);

  // Deleted records for this resident
  const deletedResidentRecords = useMemo(() => {
    if (!resident) return [];
    return (deletedClinicalRecords || []).filter(
      r => r.residentId === resident.id || r.residentName === resident.name
    );
  }, [deletedClinicalRecords, resident]);

  // Handle Add Submit
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    let finalFileName = formFileName.trim();
    if (formEntryType === 'archivo' && !finalFileName) {
      finalFileName = formFileType === 'pdf' ? `${formTitle.replace(/\s+/g, '_')}.pdf` : `${formTitle.replace(/\s+/g, '_')}.jpg`;
    }

    let cloudFileUrl = formEntryType === 'archivo' && fileObjectUrl ? fileObjectUrl : undefined;
    let uploadedArchivoId: number | undefined = undefined;

    // Si se seleccionó un archivo físico, subir a Google Drive y registrar en SMY_ARCHIVOS
    if (formEntryType === 'archivo' && selectedFile) {
      setIsUploading(true);
      try {
        const resNumericId = Number(String(resident.id).replace(/\D/g, '')) || 1;
        const uploadResult = await api.uploadArchivo({
          file: selectedFile,
          idCentro: 1,
          idResidente: resNumericId,
          idClaseArchivo: 1, // 1 = Documentación médica / clínica
          tablaOrigen: 'SMY_DOCUMENTOS_CLINICOS'
        });

        if (uploadResult?.data) {
          const fileData = uploadResult.data;
          if (fileData.id) {
            uploadedArchivoId = fileData.id;
            cloudFileUrl = api.getArchivoVerUrl(fileData.id);
          } else if (fileData.enlaceVisualizacion) {
            cloudFileUrl = fileData.enlaceVisualizacion;
          }
          if (fileData.nombreArchivo || fileData.nombreOriginal) {
            finalFileName = fileData.nombreArchivo || fileData.nombreOriginal;
          }
          fetchResidentArchivos();
        }
      } catch (uploadError: any) {
        console.error('Error al subir archivo a Google Drive / Oracle:', uploadError);
      } finally {
        setIsUploading(false);
      }
    }

    addClinicalRecord({
      residentId: resident.id,
      residentName: resident.name,
      title: formTitle.trim(),
      category: formCategory,
      categoryLabel: categoryLabels[formCategory] || 'Documento',
      entryType: formEntryType,
      fileType: formEntryType === 'archivo' ? formFileType : undefined,
      fileName: formEntryType === 'archivo' ? finalFileName : undefined,
      fileSize: formEntryType === 'archivo' ? (formFileSize || '1.4 MB') : undefined,
      fileUrl: cloudFileUrl,
      idArchivo: uploadedArchivoId,
      description: formDescription.trim() || undefined,
      date: selectedDate || new Date().toISOString().split('T')[0]
    });

    // Reset and close
    handleCloseAddModal();
  };

  // Open Edit Modal
  const handleOpenEdit = (record: ClinicalRecord) => {
    setRecordToEdit(record);
    setEditTitle(record.title);
    setEditCategory(record.category);
    setEditDescription(record.description || '');
    setIsEditModalOpen(true);
  };

  // Handle Edit Submit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordToEdit || !editTitle.trim()) return;

    updateClinicalRecord(recordToEdit.id, {
      title: editTitle.trim(),
      category: editCategory,
      categoryLabel: categoryLabels[editCategory] || 'Documento',
      description: editDescription.trim() || undefined
    });

    setIsEditModalOpen(false);
    setRecordToEdit(null);
  };

  // Confirm Delete (Borrado lógico en BD: ID_ESTADO_ARCHIVO = 2)
  const handleConfirmDelete = async () => {
    if (!recordToDelete) return;
    setIsDeleting(true);

    try {
      const resNumericId = Number(String(resident.id).replace(/\D/g, '')) || 1;

      // 1. Obtener lista actualizada de archivos desde la base de datos si es necesario
      let archivosList = residentArchivos;
      try {
        const freshArchivos = await api.getArchivosResidente(resNumericId);
        if (Array.isArray(freshArchivos) && freshArchivos.length > 0) {
          archivosList = freshArchivos;
          setResidentArchivos(freshArchivos);
        }
      } catch (fetchErr) {
        console.warn('Error al verificar lista de archivos en backend:', fetchErr);
      }

      // 2. Resolver el ID del archivo en SMY_ARCHIVOS
      let targetArchivoId: number | undefined = recordToDelete.idArchivo;

      // Por URL de API SAMANYA: /archivos/123/ver
      if (!targetArchivoId && recordToDelete.fileUrl) {
        const matchUrl = recordToDelete.fileUrl.match(/\/archivos\/(\d+)\//);
        if (matchUrl) {
          targetArchivoId = Number(matchUrl[1]);
        }
      }

      // Por enlace o ID de Google Drive
      if (!targetArchivoId && recordToDelete.fileUrl) {
        const driveMatch = recordToDelete.fileUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
                           recordToDelete.fileUrl.match(/id=([a-zA-Z0-9_-]+)/);
        if (driveMatch) {
          const driveId = driveMatch[1];
          const matchDrive = archivosList.find(
            (a: any) =>
              a.metadatosJson?.gdriveFileId === driveId ||
              a.rutaCompletaAlmacenamiento?.includes(driveId)
          );
          if (matchDrive && matchDrive.id) {
            targetArchivoId = matchDrive.id;
          }
        }
      }

      // Por coincidencia exacta de nombre de archivo
      if (!targetArchivoId && recordToDelete.fileName && archivosList.length > 0) {
        const matchName = archivosList.find(
          (a: any) =>
            a.nombreArchivo?.toLowerCase() === recordToDelete.fileName?.toLowerCase() ||
            a.nombreArchivoAlmacenado?.toLowerCase() === recordToDelete.fileName?.toLowerCase()
        );
        if (matchName && matchName.id) {
          targetArchivoId = matchName.id;
        }
      }

      // Por nombre sin extensión o por título
      if (!targetArchivoId && archivosList.length > 0) {
        const targetClean = (recordToDelete.fileName || recordToDelete.title || '')
          .replace(/\.[^/.]+$/, '')
          .toLowerCase()
          .trim();

        const matchFuzzy = archivosList.find((a: any) => {
          const aClean = (a.nombreArchivo || '').replace(/\.[^/.]+$/, '').toLowerCase().trim();
          return aClean === targetClean || aClean.includes(targetClean) || targetClean.includes(aClean);
        });

        if (matchFuzzy && matchFuzzy.id) {
          targetArchivoId = matchFuzzy.id;
        }
      }

      // 3. Si se localizó el archivo en SMY_ARCHIVOS, actualizar ID_ESTADO_ARCHIVO = 2 vía API backend
      if (targetArchivoId) {
        try {
          const res = await api.deleteArchivo(targetArchivoId, 'Eliminado por el usuario desde Historia Clínica');
          console.log(`✅ Archivo ID ${targetArchivoId} marcado con ID_ESTADO_ARCHIVO = 2 en SMY_ARCHIVOS:`, res);
          showToast(`Archivo ID ${targetArchivoId} marcado como eliminado (Estado 2 en BD)`, 'success');
          fetchResidentArchivos();
        } catch (dbError: any) {
          console.error('Error al marcar ID_ESTADO_ARCHIVO = 2 en la base de datos:', dbError);
          showToast(`Aviso BD: ${dbError.message || 'No se pudo actualizar estado en BD'}`, 'alert');
        }
      } else {
        console.warn('Documento local eliminado sin registro asociado en SMY_ARCHIVOS:', recordToDelete);
      }

      // 4. Registrar eliminación lógica en la interfaz y timeline
      deleteClinicalRecord(recordToDelete.id);
      setRecordToDelete(null);
      if (viewMode === 'activos') {
        setHasSeenDeleted(false);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // Trigger file download
  const handleDownloadFile = (record: ClinicalRecord) => {
    const filename = record.fileName || `${record.title.replace(/\s+/g, '_')}.${record.fileType === 'imagen' ? 'jpg' : 'pdf'}`;
    const downloadUrl = getRecordDownloadUrl(record);

    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    const fileContent = `SAMANYA SENIOR LIVING - DOCUMENTO OFICIAL\n\nResidente: ${record.residentName}\nDocumento: ${record.title}\nCategoría: ${record.categoryLabel}\nFecha de registro: ${record.date} ${record.time}\nSubido por: ${cleanPersonName(record.uploadedByName)}\n\n${record.description ? `Notas / Descripción:\n${record.description}\n\n` : ''}Archivo adjunto certificado: ${filename}`;
    
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handle toggling "Ver eliminados"
  const handleToggleDeletedView = () => {
    if (viewMode === 'activos') {
      setViewMode('eliminados');
      setHasSeenDeleted(true);
    } else {
      setViewMode('activos');
    }
  };

  // Badge notification logic
  const showNotificationBadge = deletedResidentRecords.length > 0 && !hasSeenDeleted && viewMode !== 'eliminados';

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Botón para agregar una nueva entrada */}
      <button
        type="button"
        id="btn-add-clinical-record"
        onClick={() => setIsAddModalOpen(true)}
        className="touch-target w-full py-3 px-4 bg-[#068591] text-white font-bold text-xs rounded-2xl shadow-xs hover:bg-[#056c76] active:scale-[0.99] transition-all text-center"
      >
        + Añadir documento o registro
      </button>

      {/* Barra de control: Desplegable de categorías (izq) y Botón de alternar eliminados (der) */}
      <div className="flex items-center justify-between gap-2.5">
        <div className="relative flex-1 min-w-0">
          <select
            id="select-category-filter"
            value={activeCategoryFilter}
            disabled={viewMode === 'eliminados'}
            onChange={(e) => setActiveCategoryFilter(e.target.value as 'todos' | ClinicalRecordCategory)}
            className={`w-full appearance-none bg-white border border-[#DEDBD1] rounded-2xl py-2.5 pl-3.5 pr-8 text-xs font-bold text-[#292A24] focus:outline-none focus:ring-1 focus:ring-[#068591] shadow-2xs ${
              viewMode === 'eliminados' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            <option value="todos">Todos los documentos ({totalResidentRecordsCount})</option>
            <option value="receta">Recetas médicas</option>
            <option value="laboratorio">Resultados de laboratorio</option>
            <option value="examen">Exámenes e informes</option>
            <option value="nota_clinica">Notas clínicas</option>
            <option value="administrativo">Administrativo / Contrato</option>
            <option value="legal_personal">Documentación personal / DNI</option>
            <option value="consentimiento">Consentimientos / Autorizaciones</option>
            <option value="otro">Otros documentos</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#5C6058]">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        {/* Botón "Ver eliminados" */}
        <button
          type="button"
          id="btn-ver-eliminados"
          onClick={handleToggleDeletedView}
          className={`touch-target px-3.5 py-2.5 rounded-2xl border text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 shadow-2xs ${
            viewMode === 'eliminados'
              ? 'bg-[#068591] text-white border-[#068591]'
              : 'bg-white text-[#5C6058] border-[#DEDBD1] hover:text-[#292A24] hover:bg-[#F7F7F8]'
          }`}
        >
          <span>Ver eliminados</span>
          {showNotificationBadge && (
            <span className="bg-[#8C2E2E] text-white px-1.5 py-0.2 rounded-full text-[10px] font-black animate-pulse">
              {deletedResidentRecords.length}
            </span>
          )}
        </button>
      </div>

      {/* VISTA 1: REGISTROS ACTIVOS */}
      {viewMode === 'activos' && (
        <div className="space-y-3">
          {residentRecords.length > 0 ? (
            residentRecords.map((record) => {
              const canEditOrDelete = canEditOrDeleteClinicalRecord(record);
              return (
                <article
                  key={record.id}
                  className="bg-white rounded-3xl p-5 border border-[#DEDBD1] space-y-3.5 shadow-2xs"
                >
                  {/* Encabezado del registro: Título a la izquierda, Fecha/hora y Etiqueta blanca a la derecha */}
                  <div className="flex items-start justify-between gap-3 border-b border-[#DEDBD1]/70 pb-3">
                    <h4 className="font-bold text-base text-[#292A24] leading-snug">
                      {record.title}
                    </h4>
                    <div className="flex flex-col items-end shrink-0 gap-1.5 text-right">
                      <span className="text-xs font-medium text-[#5C6058]">
                        {record.date} · {record.time}
                      </span>
                      {/* Etiqueta con fondo blanco */}
                      <span className="text-xs font-bold text-[#292A24] bg-white px-2.5 py-0.5 rounded-lg border border-[#DEDBD1]">
                        {record.categoryLabel}
                      </span>
                    </div>
                  </div>

                  {/* Descripción limpia */}
                  {record.description && (
                    <p className="text-xs text-[#292A24] leading-relaxed">
                      {record.description}
                    </p>
                  )}

                  {/* Archivo adjunto interactivo */}
                  {record.entryType === 'archivo' && record.fileName && (
                    <div
                      onClick={() => setPreviewFile(record)}
                      className="bg-[#F7F7F8] hover:bg-[#EFECE6] cursor-pointer p-3.5 rounded-2xl border border-[#DEDBD1] flex items-center justify-between gap-3 transition-all active:scale-[0.99] group"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setPreviewFile(record);
                        }
                      }}
                    >
                      <div className="min-w-0 flex items-center gap-2.5">
                        {record.fileType === 'imagen' ? (
                          <ImageIcon className="w-5 h-5 text-[#068591] shrink-0" />
                        ) : (
                          <FileText className="w-5 h-5 text-[#068591] shrink-0" />
                        )}
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-[#292A24] group-hover:text-[#068591] transition-colors truncate">
                            {record.fileName}
                          </div>
                          <div className="text-[11px] text-[#5C6058] mt-0.5">
                            {record.fileSize || '1.4 MB'} · Formato {record.fileType?.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Subido por y estado de edición/eliminación */}
                  <div className="pt-2 border-t border-[#DEDBD1]/60 flex items-center justify-between text-xs text-[#5C6058]">
                    <div>
                      Subido por: <strong className="text-[#292A24]">{cleanPersonName(record.uploadedByName)}</strong>
                    </div>

                    {canEditOrDelete ? (
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(record)}
                          className="text-xs font-bold text-[#075158] hover:opacity-80 transition-opacity"
                        >
                          Editar
                        </button>
                        <span className="text-[#DEDBD1]">|</span>
                        <button
                          type="button"
                          onClick={() => setRecordToDelete(record)}
                          className="text-xs font-bold text-[#8C2E2E] hover:opacity-80 transition-opacity"
                        >
                          Eliminar
                        </button>
                      </div>
                    ) : (
                      <div className="text-right text-[11px] font-medium text-[#8C8F89]">
                        No editable (&gt;24 h)
                      </div>
                    )}
                  </div>
                </article>
              );
            })
          ) : (
            <div className="bg-white p-8 rounded-3xl border border-[#DEDBD1] text-center space-y-2">
              <div className="font-bold text-sm text-[#292A24]">No hay documentos registrados</div>
              <div className="text-xs text-[#5C6058]">
                {activeCategoryFilter === 'todos'
                  ? 'Aún no se han subido documentos ni notas para este residente.'
                  : `No hay entradas registradas bajo la categoría "${categoryLabels[activeCategoryFilter]}".`}
              </div>
            </div>
          )}
        </div>
      )}

      {/* VISTA 2: LISTA INLINE DE REGISTROS ELIMINADOS */}
      {viewMode === 'eliminados' && (
        <div className="space-y-3 animate-in fade-in duration-150">
          {deletedResidentRecords.length > 0 ? (
            deletedResidentRecords.map((del) => (
              <article
                key={del.id}
                onClick={() => setSelectedDeletedRecord(del)}
                className="bg-white rounded-3xl p-5 border border-[#DEDBD1] hover:border-[#068591] cursor-pointer transition-all active:scale-[0.99] space-y-3 shadow-2xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-base text-[#292A24] leading-snug">
                      {del.title}
                    </h4>
                  </div>
                  <div className="flex flex-col items-end shrink-0 gap-1.5 text-right">
                    {/* Etiqueta con fondo blanco */}
                    <span className="text-xs font-bold text-[#292A24] bg-white px-2.5 py-0.5 rounded-lg border border-[#DEDBD1]">
                      {del.categoryLabel}
                    </span>
                    {/* Fecha y hora de eliminación */}
                    <span className="text-[11px] font-medium text-[#8C2E2E]">
                      Eliminado: {del.deletedAt}
                    </span>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="bg-white p-8 rounded-3xl border border-[#DEDBD1] text-center space-y-2">
              <div className="font-bold text-sm text-[#292A24]">No hay elementos eliminados</div>
              <div className="text-xs text-[#5C6058]">
                No se han registrado bajas en los documentos de {resident.name}.
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL DE PREVISUALIZACIÓN DE ARCHIVO */}
      {previewFile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#DEDBD1] shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#DEDBD1] pb-3">
              <h3 className="font-bold text-base text-[#292A24] pr-2">
                {previewFile.title}
              </h3>
              <button
                type="button"
                id="btn-close-file-preview"
                onClick={() => setPreviewFile(null)}
                aria-label="Cerrar"
                className="touch-target p-1.5 text-[#5C6058] hover:text-[#292A24] hover:bg-[#F7F7F8] rounded-xl transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {(() => {
              const viewUrl = getRecordViewUrl(previewFile);

              return (
                <div className="bg-[#F7F7F8] p-5 rounded-2xl border border-[#DEDBD1] space-y-4 text-center">
                  {previewFile.fileType === 'imagen' && viewUrl ? (
                    <div className="max-h-60 overflow-hidden rounded-2xl border border-[#DEDBD1] bg-black/5 flex items-center justify-center p-2">
                      <img
                        src={viewUrl}
                        alt={previewFile.fileName}
                        className="max-h-56 object-contain rounded-xl shadow-xs"
                        onError={(e) => {
                          console.warn('Error al cargar imagen en vista previa:', viewUrl);
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-white border border-[#DEDBD1] mx-auto flex items-center justify-center text-[#068591]">
                      {previewFile.fileType === 'imagen' ? (
                        <ImageIcon className="w-6 h-6" />
                      ) : (
                        <FileText className="w-6 h-6" />
                      )}
                    </div>
                  )}

                  <div>
                    <div className="font-bold text-sm text-[#292A24]">
                      {previewFile.fileName}
                    </div>
                    <div className="text-xs text-[#5C6058] mt-0.5">
                      {previewFile.fileSize || '1.4 MB'} · Formato {previewFile.fileType?.toUpperCase()}
                    </div>
                  </div>

                  <button
                    type="button"
                    id="btn-download-file"
                    onClick={() => handleDownloadFile(previewFile)}
                    className="touch-target w-full py-2.5 px-4 bg-[#068591] text-white rounded-xl text-xs font-bold hover:bg-[#056c76] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>Descargar archivo</span>
                  </button>

                  {previewFile.description && (
                    <div className="pt-3 text-xs text-[#5C6058] border-t border-[#DEDBD1]/60 text-left leading-relaxed">
                      <div className="font-semibold text-[#292A24] mb-1">Notas asistenciales:</div>
                      {previewFile.description}
                    </div>
                  )}
                </div>
              );
            })()}

            <div className="flex items-center justify-between text-[11px] text-[#5C6058] pt-1">
              <span>Subido por: <strong className="text-[#292A24]">{cleanPersonName(previewFile.uploadedByName)}</strong></span>
              <span>{previewFile.date} · {previewFile.time}</span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: AÑADIR NUEVA ENTRADA */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#DEDBD1] shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#DEDBD1] pb-3">
              <h3 className="font-bold text-base text-[#292A24]">
                Añadir documento o nota
              </h3>
              <button
                type="button"
                id="btn-close-add-modal"
                onClick={handleCloseAddModal}
                aria-label="Cerrar"
                className="touch-target p-1.5 text-[#5C6058] hover:text-[#292A24] hover:bg-[#F7F7F8] rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#292A24] block mb-1.5">
                  Tipo de entrada
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormEntryType('archivo')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                      formEntryType === 'archivo'
                        ? 'bg-[#068591] text-white border-[#068591]'
                        : 'bg-[#F7F7F8] text-[#5C6058] border-[#DEDBD1]'
                    }`}
                  >
                    Documento adjunto (PDF / Imagen)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormEntryType('nota_texto')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                      formEntryType === 'nota_texto'
                        ? 'bg-[#068591] text-white border-[#068591]'
                        : 'bg-[#F7F7F8] text-[#5C6058] border-[#DEDBD1]'
                    }`}
                  >
                    Nota de texto
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#292A24] block mb-1.5">
                  Categoría de documento
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as ClinicalRecordCategory)}
                  className="w-full bg-[#F7F7F8] border border-[#DEDBD1] rounded-xl p-2.5 text-xs text-[#292A24] font-medium focus:outline-none focus:ring-1 focus:ring-[#068591]"
                >
                  <option value="receta">Receta médica</option>
                  <option value="laboratorio">Resultados de laboratorio</option>
                  <option value="examen">Exámenes médicos e informes</option>
                  <option value="nota_clinica">Nota asistencial / clínica</option>
                  <option value="administrativo">Administrativo / Contrato / Seguro</option>
                  <option value="legal_personal">Documentación personal / DNI / Identificación</option>
                  <option value="consentimiento">Consentimientos / Autorizaciones</option>
                  <option value="otro">Otro tipo de documento</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#292A24] block mb-1.5">
                  Título del documento o nota
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Receta de oftalmología, Contrato de residencia, DNI..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-[#F7F7F8] border border-[#DEDBD1] rounded-xl p-2.5 text-xs text-[#292A24] font-medium focus:outline-none focus:ring-1 focus:ring-[#068591]"
                />
              </div>

              {formEntryType === 'archivo' && (
                <div className="space-y-3 bg-[#F7F7F8] p-3.5 rounded-2xl border border-[#DEDBD1]">
                  {/* Selector nativo oculto */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,application/pdf,image/*"
                    className="hidden"
                  />

                  {/* 1. Solicitar el archivo */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-bold text-[#292A24] block">
                        Archivo adjunto <span className="text-[#8C2E2E]">*</span>
                      </label>
                      {selectedFile && (
                        <span className="text-[11px] font-semibold text-[#068591] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Archivo cargado
                        </span>
                      )}
                    </div>

                    {!selectedFile ? (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        className="border-2 border-dashed border-[#DEDBD1] hover:border-[#068591] bg-white rounded-2xl p-4 text-center cursor-pointer transition-all hover:bg-[#F7F7F8] group"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#068591]/10 text-[#068591] mx-auto flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                          <Upload className="w-5 h-5" />
                        </div>
                        <div className="font-bold text-xs text-[#292A24] group-hover:text-[#068591] transition-colors">
                          Haz clic aquí para seleccionar tu archivo o arrástralo
                        </div>
                        <p className="text-[11px] text-[#5C6058] mt-1">
                          PDF o Imágenes (JPG, PNG, WEBP). Se autocompletará el formato y nombre.
                        </p>
                      </div>
                    ) : (
                      <div className="bg-white border border-[#DEDBD1] rounded-2xl p-3 flex items-center justify-between gap-3 shadow-2xs">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-[#068591]/10 text-[#068591] flex items-center justify-center shrink-0">
                            {formFileType === 'imagen' ? (
                              <ImageIcon className="w-5 h-5" />
                            ) : (
                              <FileText className="w-5 h-5" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-xs text-[#292A24] truncate" title={selectedFile.name}>
                              {selectedFile.name}
                            </div>
                            <div className="text-[11px] text-[#5C6058]">
                              {formFileSize} · {formFileType === 'pdf' ? 'PDF detectado' : 'Imagen detectada'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-2.5 py-1 text-[11px] font-bold text-[#068591] hover:bg-[#068591]/10 rounded-lg transition-colors"
                          >
                            Cambiar
                          </button>
                          <button
                            type="button"
                            onClick={handleClearFile}
                            aria-label="Quitar archivo"
                            className="p-1 text-[#5C6058] hover:text-[#8C2E2E] hover:bg-red-50 rounded-lg transition-colors"
                            title="Quitar archivo"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 2. Formato de archivo (autollenado a partir del archivo) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-bold text-[#292A24] block">
                        Formato de archivo
                      </label>
                      {selectedFile && (
                        <span className="text-[10px] text-[#5C6058] italic font-medium">
                          (Autodetectado del archivo)
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setFormFileType('pdf')}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                          formFileType === 'pdf'
                            ? 'bg-white text-[#075158] border-[#068591] shadow-2xs'
                            : 'bg-[#F7F7F8] text-[#5C6058] border-[#DEDBD1]'
                        }`}
                      >
                        Documento PDF
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormFileType('imagen')}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                          formFileType === 'imagen'
                            ? 'bg-white text-[#075158] border-[#068591] shadow-2xs'
                            : 'bg-[#F7F7F8] text-[#5C6058] border-[#DEDBD1]'
                        }`}
                      >
                        Fotografía / Imagen
                      </button>
                    </div>
                  </div>

                  {/* 3. Nombre de archivo (autollenado a partir del archivo) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-bold text-[#292A24] block">
                        Nombre de archivo
                      </label>
                      {selectedFile && (
                        <span className="text-[10px] text-[#5C6058] italic font-medium">
                          (Autocompletado del archivo)
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder={formFileType === 'pdf' ? 'archivo_informe.pdf' : 'captura_documento.jpg'}
                      value={formFileName}
                      onChange={(e) => setFormFileName(e.target.value)}
                      className="w-full bg-white border border-[#DEDBD1] rounded-xl p-2.5 text-xs text-[#292A24] font-medium focus:outline-none focus:ring-1 focus:ring-[#068591]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="font-bold text-[#292A24] block mb-1.5">
                  Descripción o comentarios adicionales
                </label>
                <textarea
                  rows={3}
                  placeholder="Detalles sobre el documento, indicaciones o comentarios..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-[#F7F7F8] border border-[#DEDBD1] rounded-xl p-2.5 text-xs text-[#292A24] font-medium focus:outline-none focus:ring-1 focus:ring-[#068591]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#DEDBD1]">
                <button
                  type="button"
                  onClick={handleCloseAddModal}
                  className="touch-target px-4 py-2.5 rounded-xl border border-[#DEDBD1] text-xs font-bold text-[#5C6058] hover:bg-[#F7F7F8]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className={`touch-target px-4 py-2.5 rounded-xl bg-[#068591] text-white text-xs font-bold hover:bg-[#056c76] shadow-xs flex items-center gap-2 ${
                    isUploading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Subiendo a Google Drive y BD...</span>
                    </>
                  ) : (
                    <span>Guardar documento</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR ENTRADA */}
      {isEditModalOpen && recordToEdit && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#DEDBD1] shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#DEDBD1] pb-3">
              <h3 className="font-bold text-base text-[#292A24]">
                Editar documento
              </h3>
              <button
                type="button"
                id="btn-close-edit-modal"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setRecordToEdit(null);
                }}
                aria-label="Cerrar"
                className="touch-target p-1.5 text-[#5C6058] hover:text-[#292A24] hover:bg-[#F7F7F8] rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#292A24] block mb-1.5">
                  Categoría de documento
                </label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value as ClinicalRecordCategory)}
                  className="w-full bg-[#F7F7F8] border border-[#DEDBD1] rounded-xl p-2.5 text-xs text-[#292A24] font-medium focus:outline-none focus:ring-1 focus:ring-[#068591]"
                >
                  <option value="receta">Receta médica</option>
                  <option value="laboratorio">Resultados de laboratorio</option>
                  <option value="examen">Exámenes médicos e informes</option>
                  <option value="nota_clinica">Nota asistencial / clínica</option>
                  <option value="administrativo">Administrativo / Contrato / Seguro</option>
                  <option value="legal_personal">Documentación personal / DNI / Identificación</option>
                  <option value="consentimiento">Consentimientos / Autorizaciones</option>
                  <option value="otro">Otro tipo de documento</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#292A24] block mb-1.5">
                  Título del documento o nota
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-[#F7F7F8] border border-[#DEDBD1] rounded-xl p-2.5 text-xs text-[#292A24] font-medium focus:outline-none focus:ring-1 focus:ring-[#068591]"
                />
              </div>

              <div>
                <label className="font-bold text-[#292A24] block mb-1.5">
                  Descripción o notas
                </label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full bg-[#F7F7F8] border border-[#DEDBD1] rounded-xl p-2.5 text-xs text-[#292A24] font-medium focus:outline-none focus:ring-1 focus:ring-[#068591]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#DEDBD1]">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setRecordToEdit(null);
                  }}
                  className="touch-target px-4 py-2.5 rounded-xl border border-[#DEDBD1] text-xs font-bold text-[#5C6058] hover:bg-[#F7F7F8]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="touch-target px-4 py-2.5 rounded-xl bg-[#068591] text-white text-xs font-bold hover:bg-[#056c76] shadow-xs"
                >
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DIÁLOGO DE CONFIRMACIÓN DE ELIMINACIÓN */}
      {recordToDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-[#DEDBD1] shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#DEDBD1] pb-2">
              <h3 className="font-bold text-base text-[#8C2E2E]">
                Eliminar documento
              </h3>
              <button
                type="button"
                onClick={() => setRecordToDelete(null)}
                aria-label="Cerrar"
                className="touch-target p-1 text-[#5C6058] hover:text-[#292A24] hover:bg-[#F7F7F8] rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-[#5C6058] leading-relaxed">
              ¿Deseas eliminar el documento <strong>"{recordToDelete.title}"</strong>? Quedará registrado en la lista de elementos eliminados.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#DEDBD1]">
              <button
                type="button"
                onClick={() => setRecordToDelete(null)}
                className="touch-target px-4 py-2.5 rounded-xl border border-[#DEDBD1] text-xs font-bold text-[#5C6058] hover:bg-[#F7F7F8]"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="touch-target px-4 py-2.5 rounded-xl bg-[#8C2E2E] text-white text-xs font-bold hover:bg-[#722525] disabled:opacity-50 shadow-xs"
              >
                {isDeleting ? 'Eliminando...' : 'Confirmar eliminación'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE DETALLE DE REGISTRO ELIMINADO */}
      {selectedDeletedRecord && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#DEDBD1] shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#DEDBD1] pb-3">
              <h3 className="font-bold text-base text-[#292A24] pr-2">
                {selectedDeletedRecord.title}
              </h3>
              <button
                type="button"
                id="btn-close-deleted-detail"
                onClick={() => setSelectedDeletedRecord(null)}
                aria-label="Cerrar"
                className="touch-target p-1.5 text-[#5C6058] hover:text-[#292A24] hover:bg-[#F7F7F8] rounded-xl transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-[#DEDBD1]/60">
                <span className="font-bold text-[#5C6058]">Categoría:</span>
                <span className="font-bold text-[#292A24] bg-white px-2.5 py-0.5 rounded-lg border border-[#DEDBD1]">
                  {selectedDeletedRecord.categoryLabel}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-[#DEDBD1]/60">
                <span className="font-bold text-[#5C6058]">Fecha y hora de registro:</span>
                <span className="font-medium text-[#292A24]">
                  {selectedDeletedRecord.date || '—'} · {selectedDeletedRecord.time || '—'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-[#DEDBD1]/60">
                <span className="font-bold text-[#5C6058]">Subido por:</span>
                <span className="font-medium text-[#292A24]">
                  {cleanPersonName(selectedDeletedRecord.uploadedByName || 'Familiar')}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-[#DEDBD1]/60">
                <span className="font-bold text-[#5C6058]">Fecha y hora de eliminación:</span>
                <span className="font-semibold text-[#8C2E2E]">
                  {selectedDeletedRecord.deletedAt}
                </span>
              </div>

              {selectedDeletedRecord.entryType === 'archivo' && selectedDeletedRecord.fileName && (
                <div className="flex items-center justify-between py-1 border-b border-[#DEDBD1]/60">
                  <span className="font-bold text-[#5C6058]">Archivo adjunto:</span>
                  <span className="font-medium text-[#292A24] truncate max-w-[200px]">
                    {selectedDeletedRecord.fileName} ({selectedDeletedRecord.fileSize || 'PDF'})
                  </span>
                </div>
              )}

              <div className="pt-1 space-y-1">
                <div className="font-bold text-[#5C6058]">Descripción:</div>
                <p className="text-xs text-[#292A24] leading-relaxed">
                  {selectedDeletedRecord.description || 'Sin notas adicionales.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
