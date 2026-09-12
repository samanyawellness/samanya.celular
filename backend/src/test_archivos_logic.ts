import crypto from 'crypto';

function sanitizarCadena(cadena: string): string {
  if (!cadena) return 'GENERAL';
  let limpio = cadena
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Remover diacríticos/tildes
  limpio = limpio.replace(/[^A-Z0-9_-]+/g, '-');
  limpio = limpio.replace(/-+/g, '-');
  limpio = limpio.replace(/^-|-$/g, '');
  return limpio || 'GENERAL';
}

function normalizarExtension(ext: string): string {
  if (!ext) return '.bin';
  const lastDot = ext.lastIndexOf('.');
  const extStr = lastDot >= 0 ? ext.substring(lastDot) : `.${ext}`;
  return extStr.toLowerCase().trim();
}

function generarNombreAlmacenado(id: number, extension: string): string {
  const extNorm = normalizarExtension(extension);
  const hashId = crypto.createHash('sha256').update(String(id)).digest('hex');
  return `${hashId}${extNorm}`;
}

function construirRutaSede(idSede: number, nombreSede: string): string {
  return `${idSede}_${sanitizarCadena(nombreSede)}`;
}

function construirRutaResidente(idResidente: number, identificacion: string): string {
  return `${idResidente}_${sanitizarCadena(identificacion)}`;
}

function construirRutaDocumentos(idSede: number, nombreSede: string, idResidente: number, identificacion: string): string {
  return `${construirRutaSede(idSede, nombreSede)}/${construirRutaResidente(idResidente, identificacion)}/Documentos`;
}

console.log('🧪 VERIFICACIÓN DE LÓGICA DE RUTAS Y NOMBRES HASHEADOS:');

// Test 1: Ejemplo de usuario: 1_SEDE-CENTRAL / 1_19234567 / Documentos
const idSede = 1;
const nombreSede = 'SEDE-CENTRAL';
const idResidente = 1;
const identificacion = '19234567';

const rutaSede = construirRutaSede(idSede, nombreSede);
console.log(`✅ Ruta Sede: ${rutaSede}`);
if (rutaSede !== '1_SEDE-CENTRAL') throw new Error(`Fallo en ruta sede: ${rutaSede}`);

const rutaRes = construirRutaResidente(idResidente, identificacion);
console.log(`✅ Ruta Residente: ${rutaRes}`);
if (rutaRes !== '1_19234567') throw new Error(`Fallo en ruta residente: ${rutaRes}`);

const rutaDoc = construirRutaDocumentos(idSede, nombreSede, idResidente, identificacion);
console.log(`✅ Ruta Documentos Completa: ${rutaDoc}`);
if (rutaDoc !== '1_SEDE-CENTRAL/1_19234567/Documentos') throw new Error(`Fallo en ruta doc: ${rutaDoc}`);

// Test 2: Nombre hasheado a partir del ID
const idArchivo = 1;
const extension = '.pdf';
const nombreAlmacenado = generarNombreAlmacenado(idArchivo, extension);
console.log(`✅ Nombre Archivo Almacenado (ID=${idArchivo}): ${nombreAlmacenado}`);
if (!nombreAlmacenado.endsWith('.pdf') || nombreAlmacenado.length !== 64 + 4) {
  throw new Error(`Fallo en nombre almacenado: ${nombreAlmacenado}`);
}

console.log('🎉 TODAS LAS PRUEBAS DE LÓGICA DE RUTAS Y HASHEO PASARON EXITOSAMENTE!');
