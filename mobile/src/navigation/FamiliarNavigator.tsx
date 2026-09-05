import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, ClipboardList, UserCheck, User } from 'lucide-react-native';
import { FamiliarTabParamList } from './navigation.types';
import { useAuthStore } from '../store/auth.store';
import { Colors } from '../constants/theme';
import { FamiliarHomeScreen } from '../screens/familiar/FamiliarHomeScreen';
import { FamiliarBitacoraScreen } from '../screens/familiar/FamiliarBitacoraScreen';
import { FamiliarResidenteScreen } from '../screens/familiar/FamiliarResidenteScreen';
import { ProfileScreen } from '../screens/cuidador/ProfileScreen';

const Tab = createBottomTabNavigator<FamiliarTabParamList>();

export const FamiliarNavigator: React.FC = () => {
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
        component={FamiliarHomeScreen}
        options={{
          title: 'Inicio',
          headerTitle: 'Portal Familiar SAMANYA',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Bitacora"
        component={FamiliarBitacoraScreen}
        options={{
          title: 'Bitácora',
          headerTitle: 'Bitácora de Cuidados',
          tabBarIcon: ({ color, size }) => <ClipboardList color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Residente"
        component={FamiliarResidenteScreen}
        options={{
          title: 'Residente',
          headerTitle: 'Ficha del Residente',
          tabBarIcon: ({ color, size }) => <UserCheck color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          headerTitle: 'Mi Cuenta',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />
        }}
      />
    </Tab.Navigator>
  );
};
