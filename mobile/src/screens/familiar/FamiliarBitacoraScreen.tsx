import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { Clock, Coffee, Pill, Smile, AlertCircle, FileText, User } from 'lucide-react-native';
import { useAuthStore } from '../../store/auth.store';
import { Colors } from '../../constants/theme';
import { MOCK_BITACORA, BitacoraEntry } from '../../data/mockData';

export const FamiliarBitacoraScreen: React.FC = () => {
  const { isDarkMode } = useAuthStore();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const [activeCategory, setActiveCategory] = useState<string>('todas');

  const categories = [
    { id: 'todas', label: 'Todas' },
    { id: 'alimentacion', label: 'Alimentación' },
    { id: 'medicacion', label: 'Medicación' },
    { id: 'animo', label: 'Bienestar' }
  ];

  const filteredEntries = useMemo(() => {
    if (activeCategory === 'todas') return MOCK_BITACORA;
    return MOCK_BITACORA.filter((b) => b.category === activeCategory);
  }, [activeCategory]);

  const renderEntry = ({ item }: { item: BitacoraEntry }) => {
    const getCategoryIcon = () => {
      switch (item.category) {
        case 'alimentacion':
          return <Coffee size={16} color={theme.primary} />;
        case 'medicacion':
          return <Pill size={16} color={theme.primary} />;
        case 'animo':
          return <Smile size={16} color="#10B981" />;
        default:
          return <FileText size={16} color={theme.primary} />;
      }
    };

    return (
      <View
        style={[
          styles.entryCard,
          { backgroundColor: theme.card, borderColor: theme.border }
        ]}
      >
        <View style={styles.entryHeader}>
          <View style={styles.catRow}>
            <View style={[styles.catIconCircle, { backgroundColor: theme.primaryLight }]}>
              {getCategoryIcon()}
            </View>
            <Text style={[styles.catName, { color: theme.primary }]}>
              {item.category.toUpperCase()}
            </Text>
          </View>
          <View style={styles.timeRow}>
            <Clock size={12} color={theme.textSecondary} />
            <Text style={[styles.timeText, { color: theme.textSecondary }]}>
              {item.time}
            </Text>
          </View>
        </View>

        <Text style={[styles.entryTitle, { color: theme.text }]}>
          {item.title}
        </Text>

        <Text style={[styles.entryDesc, { color: theme.textSecondary }]}>
          {item.description}
        </Text>

        <View style={[styles.footer, { borderTopColor: theme.border }]}>
          <User size={12} color={theme.textSecondary} />
          <Text style={[styles.authorText, { color: theme.textSecondary }]}>
            Registrado por: {item.author} ({item.authorRole})
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Category Pills */}
      <View style={styles.catPillsRow}>
        {categories.map((c) => {
          const isSelected = activeCategory === c.id;
          return (
            <TouchableOpacity
              key={c.id}
              onPress={() => setActiveCategory(c.id)}
              style={[
                styles.catChip,
                {
                  backgroundColor: isSelected ? theme.primary : theme.card,
                  borderColor: isSelected ? theme.primary : theme.border
                }
              ]}
            >
              <Text
                style={[
                  styles.catChipText,
                  { color: isSelected ? '#FFFFFF' : theme.text }
                ]}
              >
                {c.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={filteredEntries}
        keyExtractor={(item) => item.id}
        renderItem={renderEntry}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  catPillsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8
  },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1
  },
  catChipText: {
    fontSize: 12,
    fontWeight: '700'
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12
  },
  entryCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    gap: 8
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  catIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  catName: {
    fontSize: 11,
    fontWeight: '800'
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  timeText: {
    fontSize: 11,
    fontWeight: '600'
  },
  entryTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: 2
  },
  entryDesc: {
    fontSize: 13,
    lineHeight: 18
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderTopWidth: 1,
    paddingTop: 8,
    marginTop: 4
  },
  authorText: {
    fontSize: 11
  }
});
