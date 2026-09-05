import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import {
  Users,
  Bed,
  UserCheck,
  ShieldAlert,
  FileCheck2,
  Activity,
  Calendar,
  Building
} from 'lucide-react-native';
import { useAuthStore } from '../../store/auth.store';
import { Colors } from '../../constants/theme';
import { MOCK_RESIDENTS, MOCK_TASKS, MOCK_CONSENTS } from '../../data/mockData';

export const AdminDashboardScreen: React.FC = () => {
  const { user, isDarkMode } = useAuthStore();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const kpis = [
    {
      title: 'Censo Total',
      value: '48',
      unit: 'residentes',
      icon: <Users size={20} color={theme.primary} />,
      bg: theme.primaryLight
    },
    {
      title: 'Ocupación',
      value: '92%',
      unit: 'camas activas',
      icon: <Bed size={20} color="#3B82F6" />,
      bg: isDarkMode ? '#1E293B' : '#EFF6FF'
    },
    {
      title: 'Personal en Turno',
      value: '12',
      unit: 'cuidadores / enfermeros',
      icon: <UserCheck size={20} color="#10B981" />,
      bg: isDarkMode ? '#142E24' : '#ECFDF5'
    },
    {
      title: 'Incidentes Abiertos',
      value: '1',
      unit: 'requiere seguimiento',
      icon: <ShieldAlert size={20} color="#EF4444" />,
      bg: isDarkMode ? '#3B1818' : '#FEF2F2'
    }
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.greetingRole, { color: theme.textSecondary }]}>
            Consola de Dirección y Administración
          </Text>
          <Text style={[styles.greetingName, { color: theme.text }]}>
            Bienvenido, {user?.nombreCompleto || 'Administrador'}
          </Text>
        </View>

        {/* KPIs Grid */}
        <View style={styles.kpiGrid}>
          {kpis.map((kpi, idx) => (
            <View
              key={idx}
              style={[
                styles.kpiCard,
                { backgroundColor: theme.card, borderColor: theme.border }
              ]}
            >
              <View style={[styles.kpiIconBox, { backgroundColor: kpi.bg }]}>
                {kpi.icon}
              </View>
              <Text style={[styles.kpiValue, { color: theme.text }]}>
                {kpi.value}
              </Text>
              <Text style={[styles.kpiTitle, { color: theme.textSecondary }]}>
                {kpi.title}
              </Text>
              <Text style={[styles.kpiUnit, { color: theme.textSecondary }]}>
                {kpi.unit}
              </Text>
            </View>
          ))}
        </View>

        {/* Operational Status */}
        <View style={[styles.sectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Estado de Turnos del Día
          </Text>
          <View style={[styles.shiftRow, { borderBottomColor: theme.border }]}>
            <View>
              <Text style={[styles.shiftName, { color: theme.text }]}>Turno Mañana (07:00 - 15:00)</Text>
              <Text style={[styles.shiftDetail, { color: theme.textSecondary }]}>8 cuidadores · 2 enfermeros · 1 médico</Text>
            </View>
            <View style={[styles.shiftStatusBadge, { backgroundColor: '#D1FAE5' }]}>
              <Text style={styles.shiftStatusText}>En Curso</Text>
            </View>
          </View>

          <View style={styles.shiftRow}>
            <View>
              <Text style={[styles.shiftName, { color: theme.text }]}>Turno Tarde (15:00 - 23:00)</Text>
              <Text style={[styles.shiftDetail, { color: theme.textSecondary }]}>7 cuidadores · 2 enfermeros programados</Text>
            </View>
            <View style={[styles.shiftStatusBadge, { backgroundColor: isDarkMode ? '#24302C' : '#F3F4F6' }]}>
              <Text style={[styles.shiftStatusText, { color: theme.textSecondary }]}>Programado</Text>
            </View>
          </View>
        </View>

        {/* Compliance and Consents */}
        <View style={[styles.sectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Consentimientos y Auditoría
          </Text>
          <View style={styles.auditRow}>
            <FileCheck2 size={20} color={theme.primary} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.auditTitle, { color: theme.text }]}>Consentimientos Digitales</Text>
              <Text style={[styles.auditSubtitle, { color: theme.textSecondary }]}>
                1 autorización pendiente de firma por familiar
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 36
  },
  header: {
    marginBottom: 4
  },
  greetingRole: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2
  },
  greetingName: {
    fontSize: 20,
    fontWeight: '800'
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  kpiCard: {
    width: '48%',
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,
    gap: 6
  },
  kpiIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: '800'
  },
  kpiTitle: {
    fontSize: 12,
    fontWeight: '700'
  },
  kpiUnit: {
    fontSize: 10
  },
  sectionCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    gap: 12
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4
  },
  shiftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10
  },
  shiftName: {
    fontSize: 13,
    fontWeight: '700'
  },
  shiftDetail: {
    fontSize: 11,
    marginTop: 2
  },
  shiftStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  shiftStatusText: {
    color: '#065F46',
    fontSize: 10,
    fontWeight: '800'
  },
  auditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4
  },
  auditTitle: {
    fontSize: 13,
    fontWeight: '700'
  },
  auditSubtitle: {
    fontSize: 11,
    marginTop: 2
  }
});
