import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView
} from 'react-native';
import { Search, ChevronRight, AlertTriangle } from 'lucide-react-native';
import { useAuthStore } from '../../store/auth.store';
import { Colors } from '../../constants/theme';
import { MOCK_RESIDENTS, Resident } from '../../data/mockData';
import { ResidentDetailModal } from './ResidentDetailModal';

export const ResidentsScreen: React.FC = () => {
  const { isDarkMode } = useAuthStore();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);

  const filteredResidents = useMemo(() => {
    if (!searchQuery.trim()) return MOCK_RESIDENTS;
    const q = searchQuery.toLowerCase();
    return MOCK_RESIDENTS.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.room.toLowerCase().includes(q) ||
        r.bed.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const renderResidentItem = ({ item }: { item: Resident }) => {
    return (
      <TouchableOpacity
        onPress={() => setSelectedResident(item)}
        style={[
          styles.residentCard,
          { backgroundColor: theme.card, borderColor: theme.border }
        ]}
        activeOpacity={0.7}
      >
        <Image source={{ uri: item.avatar }} style={styles.avatar} />

        <View style={styles.cardInfo}>
          <Text style={[styles.name, { color: theme.text }]}>
            {item.name}
          </Text>

          {/* Room and Bed with high contrast in dark mode */}
          <Text
            style={[
              styles.roomBed,
              { color: isDarkMode ? '#E5E7EB' : '#4B5563' }
            ]}
          >
            {item.room} · {item.bed} · {item.age} años
          </Text>

          {/* Quick tags */}
          <View style={styles.tagsRow}>
            {item.alerts.length > 0 && (
              <View style={[styles.alertBadge, { backgroundColor: '#FEE2E2' }]}>
                <AlertTriangle size={11} color="#EF4444" />
                <Text style={styles.alertBadgeText}>
                  {item.alerts.length} {item.alerts.length === 1 ? 'alerta' : 'alertas'}
                </Text>
              </View>
            )}
            <View
              style={[
                styles.infoBadge,
                { backgroundColor: isDarkMode ? '#24302C' : '#EDF8F8' }
              ]}
            >
              <Text
                style={[
                  styles.infoBadgeText,
                  { color: isDarkMode ? '#A7F3D0' : theme.primary }
                ]}
              >
                {item.mobility}
              </Text>
            </View>
          </View>
        </View>

        <ChevronRight size={20} color={theme.textSecondary} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View
          style={[
            styles.searchBox,
            { backgroundColor: theme.card, borderColor: theme.border }
          ]}
        >
          <Search size={18} color={theme.textSecondary} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Buscar por nombre, habitación o cama..."
            placeholderTextColor={theme.textSecondary}
            style={[styles.searchInput, { color: theme.text }]}
          />
        </View>
      </View>

      {/* Residents List */}
      <FlatList
        data={filteredResidents}
        keyExtractor={(item) => item.id}
        renderItem={renderResidentItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No se encontraron residentes con ese criterio.
            </Text>
          </View>
        }
      />

      {/* Resident Detail Modal */}
      <ResidentDetailModal
        resident={selectedResident}
        visible={!!selectedResident}
        onClose={() => setSelectedResident(null)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 46,
    gap: 8
  },
  searchInput: {
    flex: 1,
    fontSize: 14
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12
  },
  residentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26
  },
  cardInfo: {
    flex: 1
  },
  name: {
    fontSize: 15,
    fontWeight: '800'
  },
  roomBed: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
    flexWrap: 'wrap'
  },
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8
  },
  alertBadgeText: {
    color: '#EF4444',
    fontSize: 10,
    fontWeight: '800'
  },
  infoBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8
  },
  infoBadgeText: {
    fontSize: 10,
    fontWeight: '700'
  },
  emptyState: {
    paddingTop: 48,
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 13
  }
});
