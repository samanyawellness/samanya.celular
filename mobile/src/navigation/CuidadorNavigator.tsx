import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, CheckSquare, Users, FileCheck2, User } from 'lucide-react-native';
import { CuidadorTabParamList } from './navigation.types';
import { useAuthStore } from '../store/auth.store';
import { Colors } from '../constants/theme';
import { HomeScreen } from '../screens/cuidador/HomeScreen';
import { TasksScreen } from '../screens/cuidador/TasksScreen';
import { ResidentsScreen } from '../screens/cuidador/ResidentsScreen';
import { ConsentsScreen } from '../screens/cuidador/ConsentsScreen';
import { ProfileScreen } from '../screens/cuidador/ProfileScreen';

const Tab = createBottomTabNavigator<CuidadorTabParamList>();

export const CuidadorNavigator: React.FC = () => {
  const { isDarkMode } = useAuthStore();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: theme.card, elevation: 1, shadowOpacity: 0.05 },
        headerTitleStyle: { color: theme.text, fontWeight: '800', fontSize: 18 },
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          height: 62,
          paddingBottom: 8,
          paddingTop: 6
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' }
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={HomeScreen}
        options={{
          title: 'Inicio',
          headerTitle: 'SAMANYA Cuidador',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Tareas"
        component={TasksScreen}
        options={{
          title: 'Tareas',
          headerTitle: 'Tareas del Turno',
          tabBarIcon: ({ color, size }) => <CheckSquare color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Residentes"
        component={ResidentsScreen}
        options={{
          title: 'Residentes',
          headerTitle: 'Censo de Residentes',
          tabBarIcon: ({ color, size }) => <Users color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Consentimientos"
        component={ConsentsScreen}
        options={{
          title: 'Consent.',
          headerTitle: 'Consentimientos Informados',
          tabBarIcon: ({ color, size }) => <FileCheck2 color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          headerTitle: 'Mi Perfil',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />
        }}
      />
    </Tab.Navigator>
  );
};
