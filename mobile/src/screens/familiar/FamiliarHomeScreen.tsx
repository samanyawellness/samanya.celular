import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import {
  AlertTriangle,
  ClipboardList,
  ChevronRight,
  User,
  Heart,
  Pill,
  Coffee,
  Activity
} from 'lucide-react-native';
import { useAuthStore } from '../../store/auth.store';
import { Colors } from '../../constants/theme';
import { MOCK_RESIDENTS, MOCK_CONSENTS, ConsentRecord } from '../../data/mockData';
import { FamiliarConsentModal } from './FamiliarConsentModal';

interface FamiliarHomeScreenProps {
  navigation: any;
}

export const FamiliarHomeScreen: React.FC<FamiliarHomeScreenProps> = ({ navigation }) => {
  const { user, isDarkMode } = useAuthStore();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const [selectedResident, setSelectedResident] = useState(MOCK_RESIDENTS[0]);
  const [consents, setConsents] = useState<ConsentRecord[]>(MOCK_CONSENTS);
  const [activeConsentToSign, setActiveConsentToSign] = useState<ConsentRecord | null>(null);

  const pendingConsent = consents.find((c) => c.status === 'pendiente');

  const handleConsentSigned = (id: string) => {
    setConsents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'firmado', signedAt: 'Hoy' } : c))
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 1. Greeting */}
        <View style={styles.header}>
          <Text style={[styles.greetingSubtitle, { color: theme.textSecondary }]}>
            Portal de Familiares y Acudientes
          </Text>
          <Text style={[styles.greetingTitle, { color: theme.text }]}>
            Hola, {user?.nombreCompleto || 'Familia Delgado'}
          </Text>
        </View>

        {/* 2. Resident Selector Chip */}
        <View
          style={[
            styles.residentSelectorCard,
            { backgroundColor: theme.card, borderColor: theme.border }
          ]}
        >
          <View style={styles.residentChipLeft}>
            <View style={[styles.residentAvatarSmall, { backgroundColor: theme.primaryLight }]}>
              <User size={18} color={theme.primary} />
            </View>
            <View>
              <Text style={[styles.resName, { color: theme.text }]}>
                {selectedResident.name}
              </Text>
              {/* High contrast room & bed text in dark mode */}
              <Text
                style={[
                  styles.resRoom,
                  { color: isDarkMode ? '#E5E7EB' : '#4B5563' }
                ]}
              >
                {selectedResident.room} · {selectedResident.bed}
              </Text>
            </View>
          </View>
          <View style={[styles.statusOnlineBadge, { backgroundColor: '#D1FAE5' }]}>
            <Text style={styles.statusOnlineText}>Bajo Cuidado</Text>
          </View>
        </View>

        {/* 3. AVISO: Consentimiento pendiente de firma */}
        {pendingConsent && (
          <View
            style={[
              styles.alertCard,
              {
                backgroundColor: isDarkMode ? '#241A10' : '#FEF3EB',
                borderColor: isDarkMode ? '#5C3D1B' : '#FAD7BC'
              }
            ]}
          >
            <View style={styles.alertHeader}>
              <View style={[styles.alertIconCircle, { backgroundColor: '#F57C00' }]}>
                <AlertTriangle size={18} color="#FFFFFF" />
              </View>
              <Text
                style={[
                  styles.alertTitle,
                  { color: isDarkMode ? '#FBBF24' : '#7A3600' }
                ]}
              >
                Autorización pendiente de firma
              </Text>
            </View>

            <Text
              style={[
                styles.alertText,
                { color: isDarkMode ? '#D1D5DB' : '#5C6058' }
              ]}
            >
              Se ha solicitado tu consentimiento para:{' '}
              <Text
                style={[
                  styles.alertStrong,
                  { color: isDarkMode ? '#FDE68A' : '#292A24' }
                ]}
              >
                {pendingConsent.type}
              </Text>{' '}
              — {pendingConsent.description}
            </Text>

            <View style={styles.alertActions}>
              <TouchableOpacity
                onPress={() => setActiveConsentToSign(pendingConsent)}
                style={[styles.signButton, { backgroundColor: theme.primary }]}
              >
                <Text style={styles.signButtonText}>Revisar y firmar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('Bitácora')}
                style={[
                  styles.bitacoraRefBtn,
                  {
                    backgroundColor: isDarkMode ? '#1C221F' : '#FFFFFF',
                    borderColor: theme.border
                  }
                ]}
              >
                <Text style={[styles.bitacoraRefText, { color: theme.text }]}>
                  Ver en Bitácora
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* 4. Resumen de hoy (2x2 grid) */}
        <View
          style={[
            styles.summaryCard,
            {
              backgroundColor: isDarkMode ? '#122123' : '#EBF7F8',
              borderColor: isDarkMode ? '#1D3F43' : '#BCE4E8'
            }
          ]}
        >
          <Text
            style={[
              styles.summaryTitle,
              { color: isDarkMode ? '#38D9E8' : '#075158' }
            ]}
          >
            Resumen de hoy
          </Text>

          <View style={styles.grid2x2}>
            <View
              style={[
                styles.gridItem,
                { backgroundColor: theme.card, borderColor: theme.border }
              ]}
            >
              <Text style={[styles.gridItemTitle, { color: theme.text }]}>Medicación</Text>
              <Text style={[styles.gridItemSub, { color: theme.textSecondary }]}>
                Al día (09:00h ✓)
              </Text>
            </View>

            <View
              style={[
                styles.gridItem,
                { backgroundColor: theme.card, borderColor: theme.border }
              ]}
            >
              <Text style={[styles.gridItemTitle, { color: theme.text }]}>Alimentación</Text>
              <Text style={[styles.gridItemSub, { color: theme.textSecondary }]}>
                Desayuno completo
              </Text>
            </View>

            <View
              style={[
                styles.gridItem,
                { backgroundColor: theme.card, borderColor: theme.border }
              ]}
            >
              <Text style={[styles.gridItemTitle, { color: theme.text }]}>Actividad</Text>
              <Text style={[styles.gridItemSub, { color: theme.textSecondary }]}>
                Taller de memoria 10h
              </Text>
            </View>

            <View
              style={[
                styles.gridItem,
                { backgroundColor: theme.card, borderColor: theme.border }
              ]}
            >
              <Text style={[styles.gridItemTitle, { color: theme.text }]}>Constantes</Text>
              <Text style={[styles.gridItemSub, { color: theme.textSecondary }]}>
                Estables (124/80)
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('Bitácora')}
            style={[styles.fullBitacoraBtn, { backgroundColor: theme.primary }]}
          >
            <ClipboardList size={16} color="#FFFFFF" />
            <Text style={styles.fullBitacoraText}>Ver bitácora completa de hoy</Text>
            <ChevronRight size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Consent Sign Modal */}
      <FamiliarConsentModal
        consent={activeConsentToSign}
        visible={!!activeConsentToSign}
        onClose={() => setActiveConsentToSign(null)}
        onConsentSigned={handleConsentSigned}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 36
  },
  header: {
    marginBottom: 4
  },
  greetingSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2
  },
  greetingTitle: {
    fontSize: 20,
    fontWeight: '800'
  },
  residentSelectorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 20,
    borderWidth: 1
  },
  residentChipLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  residentAvatarSmall: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center'
  },
  resName: {
    fontSize: 14,
    fontWeight: '800'
  },
  resRoom: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2
  },
  statusOnlineBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10
  },
  statusOnlineText: {
    color: '#065F46',
    fontSize: 10,
    fontWeight: '800'
  },
  alertCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
    gap: 12
  },
  alertHeader: {
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
  alertTitle: {
    fontSize: 15,
    fontWeight: '800'
  },
  alertText: {
    fontSize: 12,
    lineHeight: 18
  },
  alertStrong: {
    fontWeight: '800'
  },
  alertActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4
  },
  signButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  signButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  bitacoraRefBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bitacoraRefText: {
    fontSize: 12,
    fontWeight: '700'
  },
  summaryCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
    gap: 14
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '800'
  },
  grid2x2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  gridItem: {
    width: '48%',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1
  },
  gridItemTitle: {
    fontSize: 13,
    fontWeight: '800'
  },
  gridItemSub: {
    fontSize: 11,
    marginTop: 4
  },
  fullBitacoraBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 16,
    gap: 8,
    marginTop: 4
  },
  fullBitacoraText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  }
});
