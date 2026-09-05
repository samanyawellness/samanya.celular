import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  StatusBar
} from 'react-native';
import {
  ShieldAlert,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Pill,
  Coffee,
  AlertCircle,
  Activity,
  UserCheck,
  Moon,
  Sun,
  X
} from 'lucide-react-native';
import { useAuthStore } from '../../store/auth.store';
import { Colors } from '../../constants/theme';
import { MOCK_RESIDENTS, MOCK_TASKS, TaskItem } from '../../data/mockData';
import { IncidentReportModal } from './IncidentReportModal';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user, isDarkMode, toggleDarkMode } = useAuthStore();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const [selectedDate, setSelectedDate] = useState<string>('2026-09-05');
  const [isIncidentModalVisible, setIsIncidentModalVisible] = useState(false);

  // Generate a list of days for carousel
  const daysList = useMemo(() => {
    const list = [];
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const monthNames = [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];
    const today = new Date(2026, 8, 5); // Sep 5 2026

    for (let i = -5; i < 20; i++) {
      const cur = new Date(today);
      cur.setDate(today.getDate() + i);
      const curYear = cur.getFullYear();
      const curMonth = String(cur.getMonth() + 1).padStart(2, '0');
      const curDay = String(cur.getDate()).padStart(2, '0');
      const fullDate = `${curYear}-${curMonth}-${curDay}`;

      list.push({
        fullDate,
        dayNum: String(cur.getDate()),
        dayName: dayNames[cur.getDay()],
        monthName: monthNames[cur.getMonth()],
        isToday: i === 0
      });
    }
    return list;
  }, []);

  const pendingTasks = useMemo(() => {
    return MOCK_TASKS.filter((t) => t.status === 'pendiente');
  }, []);

  const pendingMeds = useMemo(() => {
    return pendingTasks.filter((t) => t.type === 'medicacion');
  }, [pendingTasks]);

  const otherTasks = useMemo(() => {
    return pendingTasks.filter((t) => t.type !== 'medicacion');
  }, [pendingTasks]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 1. Header Greeting & Theme Toggle */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greetingLabel, { color: theme.textSecondary }]}>
              Turno en curso · 07:00 - 15:00
            </Text>
            <Text style={[styles.greetingName, { color: theme.text }]}>
              Hola, {user?.nombreCompleto || 'Cuidador'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={toggleDarkMode}
            style={[styles.iconButton, { backgroundColor: theme.card, borderColor: theme.border }]}
            accessibilityLabel="Alternar tema oscuro"
          >
            {isDarkMode ? (
              <Sun size={20} color={theme.primary} />
            ) : (
              <Moon size={20} color={theme.text} />
            )}
          </TouchableOpacity>
        </View>

        {/* 2. Urgent Shift Tasks Card */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              Tareas urgentes del turno
            </Text>
            <View style={[styles.badge, { backgroundColor: theme.primaryLight }]}>
              <Text style={[styles.badgeText, { color: theme.primary }]}>
                {pendingTasks.length} pendientes
              </Text>
            </View>
          </View>

          {/* Aggregated Medication Box */}
          {pendingMeds.length > 0 && (
            <View
              style={[
                styles.aggregatedBox,
                {
                  backgroundColor: isDarkMode ? '#172426' : '#F7FBFB',
                  borderColor: isDarkMode ? '#24454A' : '#D9F0F1'
                }
              ]}
            >
              <View style={styles.aggTopRow}>
                <View style={[styles.aggIconContainer, { backgroundColor: theme.primaryLight }]}>
                  <Pill size={18} color={theme.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.aggCategory, { color: theme.primary }]}>
                    Medicación pendiente
                  </Text>
                  <Text style={[styles.aggTitle, { color: theme.text }]}>
                    Ronda de fármacos prescritos
                  </Text>
                  <Text style={[styles.aggSubtitle, { color: theme.textSecondary }]}>
                    {MOCK_RESIDENTS.length} residentes en lista de control
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => navigation.navigate('Tareas')}
                style={[
                  styles.aggActionButton,
                  { backgroundColor: theme.primaryLight, borderColor: theme.primary }
                ]}
              >
                <Text style={[styles.aggActionText, { color: theme.primary }]}>
                  Ir a lista de tareas
                </Text>
                <ChevronRight size={16} color={theme.primary} />
              </TouchableOpacity>
            </View>
          )}

          {/* Individual / Group tasks */}
          {otherTasks.map((task) => (
            <View
              key={task.id}
              style={[
                styles.taskItemBox,
                {
                  backgroundColor: isDarkMode ? '#1E2322' : '#F9F9F9',
                  borderColor: theme.border
                }
              ]}
            >
              <View style={styles.taskItemHeader}>
                <Text style={[styles.taskTime, { color: theme.primary }]}>
                  {task.time}
                </Text>
                <Text style={[styles.taskScope, { color: theme.textSecondary }]}>
                  {task.scope === 'grupal' ? `${task.residentCount} residentes` : task.residentName}
                </Text>
              </View>
              <Text style={[styles.taskTitle, { color: theme.text }]}>
                {task.title}
              </Text>
              <Text style={[styles.taskDesc, { color: theme.textSecondary }]}>
                {task.description}
              </Text>
            </View>
          ))}

          <TouchableOpacity
            onPress={() => navigation.navigate('Tareas')}
            style={styles.seeAllButton}
          >
            <Text style={[styles.seeAllText, { color: theme.primary }]}>
              Ver todas las tareas ({MOCK_TASKS.length})
            </Text>
            <ChevronRight size={16} color={theme.primary} />
          </TouchableOpacity>
        </View>

        {/* 3. Direct Access: Report Incident Button */}
        <TouchableOpacity
          onPress={() => setIsIncidentModalVisible(true)}
          style={[styles.incidentButton, { backgroundColor: '#8C2E2E' }]}
          activeOpacity={0.88}
        >
          <View style={styles.incidentLeft}>
            <View style={styles.incidentIconCircle}>
              <ShieldAlert size={24} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.incidentTitle}>Reportar incidente</Text>
              <Text style={styles.incidentSubtitle}>
                Caídas, cambios de salud o reacciones adversas
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color="rgba(255,255,255,0.8)" />
        </TouchableOpacity>

        {/* 4. Horizontal Day Carousel */}
        <View style={styles.timelineSection}>
          <View style={styles.timelineHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Línea de tiempo de actividad
            </Text>
            <Text style={[styles.monthLabel, { color: theme.primary }]}>
              Septiembre 2026
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselScroll}
          >
            {daysList.map((item) => {
              const isSelected = selectedDate === item.fullDate;
              return (
                <TouchableOpacity
                  key={item.fullDate}
                  onPress={() => setSelectedDate(item.fullDate)}
                  style={[
                    styles.dayChip,
                    {
                      backgroundColor: isSelected
                        ? theme.primary
                        : item.isToday
                        ? theme.primaryLight
                        : theme.card,
                      borderColor: isSelected
                        ? theme.primary
                        : item.isToday
                        ? theme.primary
                        : theme.border
                    }
                  ]}
                >
                  <Text
                    style={[
                      styles.dayName,
                      {
                        color: isSelected
                          ? '#FFFFFF'
                          : item.isToday
                          ? theme.primary
                          : theme.textSecondary
                      }
                    ]}
                  >
                    {item.dayName}
                  </Text>
                  <Text
                    style={[
                      styles.dayNum,
                      {
                        color: isSelected
                          ? '#FFFFFF'
                          : item.isToday
                          ? theme.primary
                          : theme.text
                      }
                    ]}
                  >
                    {item.dayNum}
                  </Text>
                  {item.isToday && (
                    <Text
                      style={[
                        styles.todayTag,
                        {
                          backgroundColor: isSelected ? '#FFFFFF' : theme.primary,
                          color: isSelected ? theme.primary : '#FFFFFF'
                        }
                      ]}
                    >
                      HOY
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Incident Modal */}
      <IncidentReportModal
        visible={isIncidentModalVisible}
        onClose={() => setIsIncidentModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 36
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  greetingLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2
  },
  greetingName: {
    fontSize: 20,
    fontWeight: '800'
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800'
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800'
  },
  aggregatedBox: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12
  },
  aggTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 10
  },
  aggIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  aggCategory: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  aggTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2
  },
  aggSubtitle: {
    fontSize: 12,
    marginTop: 2
  },
  aggActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6
  },
  aggActionText: {
    fontSize: 12,
    fontWeight: '700'
  },
  taskItemBox: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10
  },
  taskItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  taskTime: {
    fontSize: 12,
    fontWeight: '700'
  },
  taskScope: {
    fontSize: 12,
    fontWeight: '500'
  },
  taskTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2
  },
  taskDesc: {
    fontSize: 12
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    gap: 4
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700'
  },
  incidentButton: {
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
    elevation: 3
  },
  incidentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1
  },
  incidentIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  incidentTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800'
  },
  incidentSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    marginTop: 2
  },
  timelineSection: {
    marginTop: 4
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800'
  },
  monthLabel: {
    fontSize: 12,
    fontWeight: '700'
  },
  carouselScroll: {
    gap: 8,
    paddingBottom: 8
  },
  dayChip: {
    width: 58,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dayName: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  dayNum: {
    fontSize: 17,
    fontWeight: '800',
    marginTop: 2
  },
  todayTag: {
    fontSize: 8,
    fontWeight: '900',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    marginTop: 4
  }
});
