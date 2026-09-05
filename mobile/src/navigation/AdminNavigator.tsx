import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LayoutDashboard, Users2, UserPlus2, ShieldAlert, Settings } from 'lucide-react-native';
import { AdminTabParamList } from './navigation.types';
import { useAuthStore } from '../store/auth.store';
import { Colors } from '../constants/theme';
import { AdminDashboardScreen } from '../screens/admin/AdminDashboardScreen';
import { ResidentsScreen } from '../screens/cuidador/ResidentsScreen';
import { ConsentsScreen } from '../screens/cuidador/ConsentsScreen';
import { ProfileScreen } from '../screens/cuidador/ProfileScreen';

const Tab = createBottomTabNavigator<AdminTabParamList>();

export const AdminNavigator: React.FC = () => {
  const { isDarkMode } = useAuthStore();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
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
        name="Dashboard"
        component={AdminDashboardScreen}
        options={{
          title: 'Panel',
          headerTitle: 'Panel Administrativo',
          tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Admisiones"
        component={ResidentsScreen}
        options={{
          title: 'Censo',
          headerTitle: 'Censo y Admisiones',
          tabBarIcon: ({ color, size }) => <Users2 color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Auditoria"
        component={ConsentsScreen}
        options={{
          title: 'Consent.',
          headerTitle: 'Auditoría y Consentimientos',
          tabBarIcon: ({ color, size }) => <ShieldAlert color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Ajustes"
        component={ProfileScreen}
        options={{
          title: 'Ajustes',
          headerTitle: 'Configuración SAMANYA',
          tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />
        }}
      />
    </Tab.Navigator>
  );
};
