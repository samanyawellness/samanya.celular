import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { FileCheck2, Clock, CheckCircle, AlertCircle, ChevronRight, User } from 'lucide-react-native';
import { useAuthStore } from '../../store/auth.store';
import { Colors } from '../../constants/theme';
import { MOCK_CONSENTS, ConsentRecord } from '../../data/mockData';

export const ConsentsScreen: React.FC = () => {
  const { isDarkMode } = useAuthStore();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const [consents] = useState<ConsentRecord[]>(MOCK_CONSENTS);

  const renderConsentItem = ({ item }: { item: ConsentRecord }) => {
    const isSigned = item.status === 'firmado';
    const isPending = item.status === 'pendiente';

    return (
      <View
        style={[
          styles.consentCard,
          { backgroundColor: theme.card, borderColor: theme.border }
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.titleRow}>
            <FileCheck2 size={18} color={theme.primary} />
            <Text style={[styles.typeText, { color: theme.text }]}>
              {item.type}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: isSigned
                  ? '#D1FAE5'
                  : isPending
                  ? '#FEF3C7'
                  : '#FEE2E2'
              }
            ]}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color: isSigned
                    ? '#065F46'
                    : isPending
                    ? '#92400E'
                    : '#991B1B'
                }
              ]}
            >
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={[styles.desc, { color: theme.textSecondary }]}>
          {item.description}
        </Text>

        <View style={styles.residentBox}>
          <User size={13} color={theme.textSecondary} />
          <Text style={[styles.residentName, { color: theme.text }]}>
            {item.residentName}
          </Text>
        </View>

        <View style={[styles.footerRow, { borderTopColor: theme.border }]}>
          <Text style={[styles.requestedText, { color: theme.textSecondary }]}>
            Solicitado por: {item.requestedBy}
          </Text>
          {isSigned && item.signedAt && (
            <Text style={[styles.signedText, { color: '#10B981' }]}>
              Firmado el {item.signedAt}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={consents}
        keyExtractor={(c) => c.id}
        renderItem={renderConsentItem}
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
  listContent: {
    padding: 16,
    gap: 12
  },
  consentCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    gap: 10
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1
  },
  typeText: {
    fontSize: 14,
    fontWeight: '800'
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800'
  },
  desc: {
    fontSize: 12,
    lineHeight: 17
  },
  residentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  residentName: {
    fontSize: 12,
    fontWeight: '700'
  },
  footerRow: {
    borderTopWidth: 1,
    paddingTop: 10,
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  requestedText: {
    fontSize: 11
  },
  signedText: {
    fontSize: 11,
    fontWeight: '700'
  }
});
