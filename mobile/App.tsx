import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useAuthStore } from './src/store/auth.store';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutos de frescura
      gcTime: 1000 * 60 * 30 // 30 minutos en caché
    }
  }
});

export default function App() {
  const isDarkMode = useAuthStore((s) => s.isDarkMode);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        <RootNavigator />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
