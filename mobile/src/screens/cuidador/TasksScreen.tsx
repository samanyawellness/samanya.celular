import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { CheckCircle2, Circle, Clock, Filter, Pill, Coffee, Activity, User } from 'lucide-react-native';
import { useAuthStore } from '../../store/auth.store';
import { Colors } from '../../constants/theme';
import { MOCK_TASKS, TaskItem } from '../../data/mockData';

export const TasksScreen: React.FC = () => {
  const { isDarkMode } = useAuthStore();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const [tasks, setTasks] = useState<TaskItem[]>(MOCK_TASKS);
  const [activeFilter, setActiveFilter] = useState<string>('todas');

  const filterOptions = [
    { id: 'todas', label: 'Todas' },
    { id: 'medicacion', label: 'Medicación' },
    { id: 'alimentacion', label: 'Alimentación' },
    { id: 'fisioterapia', label: 'Fisioterapia' },
    { id: 'higiene', label: 'Higiene' }
  ];

  const filteredTasks = useMemo(() => {
    if (activeFilter === 'todas') return tasks;
    return tasks.filter((t) => t.type === activeFilter);
  }, [tasks, activeFilter]);

  const toggleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: t.status === 'completada' ? 'pendiente' : 'completada'
            }
          : t
      )
    );
  };

  const renderTaskItem = ({ item }: { item: TaskItem }) => {
    const isCompleted = item.status === 'completada';

    return (
      <TouchableOpacity
        onPress={() => toggleTaskStatus(item.id)}
        style={[
          styles.taskCard,
          {
            backgroundColor: theme.card,
            borderColor: isCompleted ? '#10B981' : theme.border,
            opacity: isCompleted ? 0.75 : 1
          }
        ]}
        activeOpacity={0.8}
      >
        <TouchableOpacity
          onPress={() => toggleTaskStatus(item.id)}
          style={styles.checkButton}
        >
          {isCompleted ? (
            <CheckCircle2 size={24} color="#10B981" />
          ) : (
            <Circle size={24} color={theme.textSecondary} />
          )}
        </TouchableOpacity>

        <View style={styles.taskBody}>
          <View style={styles.taskMetaRow}>
            <View style={styles.timeRow}>
              <Clock size={12} color={theme.primary} />
              <Text style={[styles.timeText, { color: theme.primary }]}>
                {item.time}
              </Text>
            </View>
            <View
              style={[
                styles.typeBadge,
                { backgroundColor: isDarkMode ? '#1E2B29' : '#EDF8F8' }
              ]}
            >
              <Text
                style={[
                  styles.typeBadgeText,
                  { color: isDarkMode ? '#A7F3D0' : theme.primary }
                ]}
              >
                {item.type.toUpperCase()}
              </Text>
            </View>
          </View>

          <Text
            style={[
              styles.taskTitle,
              {
                color: theme.text,
                textDecorationLine: isCompleted ? 'line-through' : 'none'
              }
            ]}
          >
            {item.title}
          </Text>

          <Text style={[styles.taskDesc, { color: theme.textSecondary }]}>
            {item.description}
          </Text>

          <View style={styles.residentRow}>
            <User size={12} color={theme.textSecondary} />
            <Text style={[styles.residentText, { color: theme.textSecondary }]}>
              {item.scope === 'grupal'
                ? `Grupo asistencial · ${item.residentCount} residentes`
                : item.residentName}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Category Pills */}
      <View style={styles.filterSection}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filterOptions}
          keyExtractor={(f) => f.id}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => {
            const isSelected = activeFilter === item.id;
            return (
              <TouchableOpacity
                onPress={() => setActiveFilter(item.id)}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isSelected ? theme.primary : theme.card,
                    borderColor: isSelected ? theme.primary : theme.border
                  }
                ]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    { color: isSelected ? '#FFFFFF' : theme.text }
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Task List */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(t) => t.id}
        renderItem={renderTaskItem}
        contentContainerStyle={styles.taskList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  filterSection: {
    paddingVertical: 10
  },
  filterList: {
    paddingHorizontal: 16,
    gap: 8
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '700'
  },
  taskList: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12
  },
  taskCard: {
    flexDirection: 'row',
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,
    gap: 12,
    alignItems: 'flex-start'
  },
  checkButton: {
    paddingTop: 2
  },
  taskBody: {
    flex: 1
  },
  taskMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  timeText: {
    fontSize: 12,
    fontWeight: '800'
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '800'
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4
  },
  taskDesc: {
    fontSize: 12,
    marginBottom: 8
  },
  residentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  residentText: {
    fontSize: 11,
    fontWeight: '600'
  }
});
