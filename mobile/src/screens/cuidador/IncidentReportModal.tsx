import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert
} from 'react-native';
import { X, ShieldAlert, Check } from 'lucide-react-native';
import { useAuthStore } from '../../store/auth.store';
import { Colors } from '../../constants/theme';
import { MOCK_RESIDENTS } from '../../data/mockData';

interface IncidentReportModalProps {
  visible: boolean;
  onClose: () => void;
}

export const IncidentReportModal: React.FC<IncidentReportModalProps> = ({
  visible,
  onClose
}) => {
  const { isDarkMode } = useAuthStore();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const [selectedResidentId, setSelectedResidentId] = useState<string>(MOCK_RESIDENTS[0].id);
  const [incidentType, setIncidentType] = useState<string>('caida');
  const [severity, setSeverity] = useState<'baja' | 'media' | 'alta'>('media');
  const [description, setDescription] = useState<string>('');
  const [actionTaken, setActionTaken] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!description.trim()) {
      Alert.alert('Campo Requerido', 'Por favor ingrese la descripción del incidente.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Incidente Reportado',
        'El reporte ha sido registrado y notificado al equipo médico y administrativo.',
        [{ text: 'Aceptar', onPress: onClose }]
      );
      setDescription('');
      setActionTaken('');
    }, 600);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalCard, { backgroundColor: theme.card }]}>
          {/* Modal Header */}
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <View style={styles.headerTitleRow}>
              <View style={[styles.alertIconCircle, { backgroundColor: '#8C2E2E' }]}>
                <ShieldAlert size={18} color="#FFFFFF" />
              </View>
              <Text style={[styles.headerTitle, { color: theme.text }]}>
                Reportar Incidente
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Resident Selector */}
            <Text style={[styles.label, { color: theme.text }]}>Residente Afectado</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
              {MOCK_RESIDENTS.map((r) => {
                const isSelected = r.id === selectedResidentId;
                return (
                  <TouchableOpacity
                    key={r.id}
                    onPress={() => setSelectedResidentId(r.id)}
                    style={[
                      styles.residentChip,
                      {
                        backgroundColor: isSelected ? theme.primary : theme.background,
                        borderColor: isSelected ? theme.primary : theme.border
                      }
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        { color: isSelected ? '#FFFFFF' : theme.text }
                      ]}
                    >
                      {r.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Type Selector */}
            <Text style={[styles.label, { color: theme.text, marginTop: 14 }]}>
              Tipo de Suceso
            </Text>
            <View style={styles.typesGrid}>
              {[
                { id: 'caida', label: 'Caída' },
                { id: 'salud', label: 'Cambio Clínico' },
                { id: 'medicacion', label: 'Reacción Fármaco' },
                { id: 'conducta', label: 'Comportamiento' }
              ].map((t) => {
                const isSelected = incidentType === t.id;
                return (
                  <TouchableOpacity
                    key={t.id}
                    onPress={() => setIncidentType(t.id)}
                    style={[
                      styles.typeButton,
                      {
                        backgroundColor: isSelected ? theme.primaryLight : theme.background,
                        borderColor: isSelected ? theme.primary : theme.border
                      }
                    ]}
                  >
                    <Text
                      style={[
                        styles.typeText,
                        { color: isSelected ? theme.primary : theme.text }
                      ]}
                    >
                      {t.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Severity */}
            <Text style={[styles.label, { color: theme.text, marginTop: 14 }]}>
              Nivel de Severidad
            </Text>
            <View style={styles.severityRow}>
              {(['baja', 'media', 'alta'] as const).map((lvl) => {
                const isSelected = severity === lvl;
                const colors = {
                  baja: '#10B981',
                  media: '#F59E0B',
                  alta: '#EF4444'
                };
                return (
                  <TouchableOpacity
                    key={lvl}
                    onPress={() => setSeverity(lvl)}
                    style={[
                      styles.severityChip,
                      {
                        backgroundColor: isSelected ? colors[lvl] : theme.background,
                        borderColor: colors[lvl]
                      }
                    ]}
                  >
                    <Text
                      style={[
                        styles.severityText,
                        { color: isSelected ? '#FFFFFF' : colors[lvl] }
                      ]}
                    >
                      {lvl.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Description input */}
            <Text style={[styles.label, { color: theme.text, marginTop: 14 }]}>
              Descripción Detallada
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="¿Qué ocurrió? Describa lugar, hora exacta y estado del residente..."
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={3}
              style={[
                styles.textArea,
                {
                  backgroundColor: theme.background,
                  color: theme.text,
                  borderColor: theme.border
                }
              ]}
            />

            {/* Immediate Action Taken */}
            <Text style={[styles.label, { color: theme.text, marginTop: 14 }]}>
              Acciones Inmediatas Aplicadas
            </Text>
            <TextInput
              value={actionTaken}
              onChangeText={setActionTaken}
              placeholder="Primeros auxilios, aviso al médico, reposo en cama..."
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={2}
              style={[
                styles.textArea,
                {
                  backgroundColor: theme.background,
                  color: theme.text,
                  borderColor: theme.border
                }
              ]}
            />

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isSubmitting}
              style={[styles.submitBtn, { backgroundColor: '#8C2E2E' }]}
            >
              <Text style={styles.submitBtnText}>
                {isSubmitting ? 'Registrando...' : 'Registrar Incidente Inmediato'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  modalCard: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
    paddingBottom: 24
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  alertIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800'
  },
  closeBtn: {
    padding: 4
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 12
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6
  },
  chipRow: {
    flexDirection: 'row',
    marginBottom: 4
  },
  residentChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 8
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700'
  },
  typesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1
  },
  typeText: {
    fontSize: 12,
    fontWeight: '700'
  },
  severityRow: {
    flexDirection: 'row',
    gap: 10
  },
  severityChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center'
  },
  severityText: {
    fontSize: 12,
    fontWeight: '800'
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    fontSize: 13,
    textAlignVertical: 'top'
  },
  submitBtn: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  }
});
