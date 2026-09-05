import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image
} from 'react-native';
import {
  X,
  AlertTriangle,
  Pill,
  Heart,
  FileText,
  Phone,
  CheckCircle2,
  Clock
} from 'lucide-react-native';
import { useAuthStore } from '../../store/auth.store';
import { Colors } from '../../constants/theme';
import { Resident } from '../../data/mockData';

interface ResidentDetailModalProps {
  resident: Resident | null;
  visible: boolean;
  onClose: () => void;
}

export const ResidentDetailModal: React.FC<ResidentDetailModalProps> = ({
  resident,
  visible,
  onClose
}) => {
  const { isDarkMode } = useAuthStore();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const [activeTab, setActiveTab] = useState<'clinica' | 'medicacion' | 'contactos'>('clinica');

  if (!resident) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <View style={styles.headerProfileRow}>
              <Image source={{ uri: resident.avatar }} style={styles.avatar} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.name, { color: theme.text }]}>
                  {resident.name}
                </Text>
                {/* Room and Bed with guaranteed high-contrast in dark mode */}
                <Text
                  style={[
                    styles.roomBed,
                    { color: isDarkMode ? '#E5E7EB' : '#4B5563' }
                  ]}
                >
                  {resident.room} · {resident.bed} ({resident.age} años)
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Sub-tabs */}
          <View style={[styles.tabsRow, { borderBottomColor: theme.border }]}>
            {(['clinica', 'medicacion', 'contactos'] as const).map((tab) => {
              const isActive = activeTab === tab;
              const labels = {
                clinica: 'Ficha Clínica',
                medicacion: 'Medicación',
                contactos: 'Familiares'
              };
              return (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  style={[
                    styles.tabItem,
                    isActive && [styles.activeTabItem, { borderBottomColor: theme.primary }]
                  ]}
                >
                  <Text
                    style={[
                      styles.tabLabel,
                      { color: isActive ? theme.primary : theme.textSecondary }
                    ]}
                  >
                    {labels[tab]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {activeTab === 'clinica' && (
              <View style={styles.section}>
                {/* Alerts */}
                {resident.alerts.length > 0 && (
                  <View
                    style={[
                      styles.alertBox,
                      {
                        backgroundColor: isDarkMode ? '#2E1515' : '#FEF2F2',
                        borderColor: '#EF4444'
                      }
                    ]}
                  >
                    <AlertTriangle size={16} color="#EF4444" />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.alertTitle, { color: '#EF4444' }]}>
                        Alertas Médicas Activas
                      </Text>
                      {resident.alerts.map((alert, idx) => (
                        <Text
                          key={idx}
                          style={[
                            styles.alertItem,
                            { color: isDarkMode ? '#FCA5A5' : '#7F1D1D' }
                          ]}
                        >
                          • {alert}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}

                {/* Diet & Mobility */}
                <View
                  style={[
                    styles.infoRow,
                    { backgroundColor: theme.background, borderColor: theme.border }
                  ]}
                >
                  <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                    Dieta Prescrita
                  </Text>
                  <Text style={[styles.infoValue, { color: theme.text }]}>
                    {resident.diet}
                  </Text>
                </View>

                <View
                  style={[
                    styles.infoRow,
                    { backgroundColor: theme.background, borderColor: theme.border }
                  ]}
                >
                  <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                    Movilidad
                  </Text>
                  <Text style={[styles.infoValue, { color: theme.text }]}>
                    {resident.mobility}
                  </Text>
                </View>

                <View
                  style={[
                    styles.infoRow,
                    { backgroundColor: theme.background, borderColor: theme.border }
                  ]}
                >
                  <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                    Fecha Nacimiento
                  </Text>
                  <Text style={[styles.infoValue, { color: theme.text }]}>
                    {resident.birthDate}
                  </Text>
                </View>
              </View>
            )}

            {activeTab === 'medicacion' && (
              <View style={styles.section}>
                {resident.medications.map((med) => {
                  const isAdministered = med.status === 'administrado';
                  return (
                    <View
                      key={med.id}
                      style={[
                        styles.medCard,
                        {
                          backgroundColor: theme.background,
                          borderColor: isAdministered ? '#10B981' : theme.border
                        }
                      ]}
                    >
                      <View style={styles.medHeader}>
                        <View style={styles.medTitleRow}>
                          <Pill size={16} color={theme.primary} />
                          <Text style={[styles.medName, { color: theme.text }]}>
                            {med.drugName}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.medStatusBadge,
                            {
                              backgroundColor: isAdministered
                                ? '#D1FAE5'
                                : theme.primaryLight
                            }
                          ]}
                        >
                          <Text
                            style={[
                              styles.medStatusText,
                              {
                                color: isAdministered ? '#065F46' : theme.primary
                              }
                            ]}
                          >
                            {isAdministered ? 'Administrado' : 'Pendiente'}
                          </Text>
                        </View>
                      </View>
                      <Text style={[styles.medDose, { color: theme.textSecondary }]}>
                        {med.dose} · {med.route} · Hora: {med.time}
                      </Text>
                      {med.details && (
                        <Text style={[styles.medDetails, { color: theme.textSecondary }]}>
                          Indicación: {med.details}
                        </Text>
                      )}
                    </View>
                  );
                })}
              </View>
            )}

            {activeTab === 'contactos' && (
              <View style={styles.section}>
                {resident.responsible.map((resp, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.contactCard,
                      { backgroundColor: theme.background, borderColor: theme.border }
                    ]}
                  >
                    <Text style={[styles.contactName, { color: theme.text }]}>
                      {resp.name}
                    </Text>
                    <Text
                      style={[
                        styles.contactRelation,
                        { color: isDarkMode ? '#A7F3D0' : theme.primary }
                      ]}
                    >
                      {resp.relationship}
                    </Text>
                    {resp.phone && (
                      <View style={styles.contactItem}>
                        <Phone size={14} color={theme.textSecondary} />
                        <Text style={[styles.contactPhone, { color: theme.textSecondary }]}>
                          {resp.phone}
                        </Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end'
  },
  card: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '85%',
    paddingBottom: 24
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    borderBottomWidth: 1
  },
  headerProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24
  },
  name: {
    fontSize: 16,
    fontWeight: '800'
  },
  roomBed: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2
  },
  closeButton: {
    padding: 6
  },
  tabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center'
  },
  activeTabItem: {
    borderBottomWidth: 2
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '700'
  },
  body: {
    padding: 18
  },
  section: {
    gap: 12
  },
  alertBox: {
    flexDirection: 'row',
    gap: 10,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 6
  },
  alertTitle: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4
  },
  alertItem: {
    fontSize: 12,
    fontWeight: '600'
  },
  infoRow: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2
  },
  medCard: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1
  },
  medHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  medTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  medName: {
    fontSize: 14,
    fontWeight: '800'
  },
  medStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8
  },
  medStatusText: {
    fontSize: 11,
    fontWeight: '700'
  },
  medDose: {
    fontSize: 12
  },
  medDetails: {
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 4
  },
  contactCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1
  },
  contactName: {
    fontSize: 14,
    fontWeight: '800'
  },
  contactRelation: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6
  },
  contactPhone: {
    fontSize: 12
  }
});
