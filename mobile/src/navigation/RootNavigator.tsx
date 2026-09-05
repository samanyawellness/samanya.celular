import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuthStore } from '../store/auth.store';
import { Colors } from '../constants/theme';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { CuidadorNavigator } from './CuidadorNavigator';
import { FamiliarNavigator } from './FamiliarNavigator';
import { AdminNavigator } from './AdminNavigator';

const Stack = createNativeStackNavigator();

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, role, isLoading, isDarkMode, loadSession } = useAuthStore();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  useEffect(() => {
    loadSession();
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : role === 'FAMILIAR' ? (
          <Stack.Screen name="FamiliarRoot" component={FamiliarNavigator} />
        ) : role === 'ADMIN' ? (
          <Stack.Screen name="AdminRoot" component={AdminNavigator} />
        ) : (
          <Stack.Screen name="CuidadorRoot" component={CuidadorNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' }
});
