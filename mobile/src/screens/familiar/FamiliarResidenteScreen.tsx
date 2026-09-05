import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView
} from 'react-native';
import { AlertTriangle, User, Heart, Shield, Phone, MapPin } from 'lucide-react-native';
import { useAuthStore } from '../../store/auth.store';
import { Colors } from '../../constants/theme';
import { MOCK_RESIDENTS } from '../../data/mockData';

export const FamiliarResidenteScreen: React.FC = () => {
  const { isDarkMode } = useAuthStore();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const resident = MOCK_RESIDENTS[0];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={[styles.profileCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Image source={{ uri: resident.avatar }} style={styles.avatar} />
          <Text style={[styles.name, { color: theme.text }]}>{resident.name}</Text>
          {/* Room and Bed with high contrast in dark mode */}
          <Text
            style={[
              styles.roomBed,
              { color: isDarkMode ? '#E5E7EB' : '#4B5563' }
            ]}
          >
            {resident.room} · {resident.bed} ({resident.age} años)
          </Text>
        </View>

        {/* Medical Alerts */}
        {resident.alerts.length > 0 && (
          <View
            style={[
              styles.alertBox,
              {
                backgroundColor: isDarkMode ? '#2B1717' : '#FEF2F2',
                borderColor: '#EF4444'
              }
            ]}
          >
            <View style={styles.alertHeader}>
              <AlertTriangle size={16} color="#EF4444" />
              <Text style={styles.alertTitle}>Alertas Médicas Registradas</Text>
            </View>
            {resident.alerts.map((a, i) => (
              <Text
                key={i}
                style={[
                  styles.alertItem,
                  { color: isDarkMode ? '#FCA5A5' : '#7F1D1D' }
                ]}
              >
                • {a}
              </Text>
            ))}
          </View>
        )}

        {/* Diet & Care Details */}
        <View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Pauta de Cuidado</Text>

          <View style={[styles.infoRow, { borderBottomColor: theme.border }]}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Dieta</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>{resident.diet}</Text>
          </View>

          <View style={[styles.infoRow, { borderBottomColor: theme.border }]}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Movilidad</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>{resident.mobility}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Fecha de Nacimiento</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>{resident.birthDate}</Text>
          </View>
        </View>

        {/* Assigned Staff */}
        <View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Equipo Asignado</Text>
          <View style={styles.staffRow}>
            <View style={[styles.staffAvatar, { backgroundColor: theme.primaryLight }]}>
              <User size={20} color={theme.primary} />
            </View>
            <View>
              <Text style={[styles.staffName, { color: theme.text }]}>Dra. Elena Ramos</Text>
              <Text style={[styles.staffRole, { color: theme.textSecondary }]}>Médico Geriatra Encargado</Text>
            </View>
          </View>

          <View style={[styles.staffRow, { marginTop: 10 }]}>
            <View style={[styles.staffAvatar, { backgroundColor: theme.primaryLight }]}>
              <User size={20} color={theme.primary} />
            </View>
            <View>
              <Text style={[styles.staffName, { color: theme.text }]}>Sonia Martínez</Text>
              <Text style={[styles.staffRole, { color: theme.textSecondary }]}>Cuidadora Titular del Turno</Text>
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
  profileCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center'
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12
  },
  name: {
    fontSize: 18,
    fontWeight: '800'
  },
  roomBed: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4
  },
  alertBox: {
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    gap: 6
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4
  },
  alertTitle: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '800'
  },
  alertItem: {
    fontSize: 12,
    fontWeight: '600'
  },
  infoCard: {
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
  infoRow: {
    paddingVertical: 8,
    borderBottomWidth: 1
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
  staffRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  staffAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  staffName: {
    fontSize: 13,
    fontWeight: '700'
  },
  staffRole: {
    fontSize: 11,
    marginTop: 2
  }
});
