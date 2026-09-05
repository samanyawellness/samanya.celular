import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { useAuthStore } from '../../store/auth.store';
import { Colors } from '../../constants/theme';

export const LoginScreen: React.FC = () => {
  const { login, isLoading, isDarkMode } = useAuthStore();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const [usernameOrEmail, setUsernameOrEmail] = useState('elena.morales');
  const [password, setPassword] = useState('123456');

  const handleLogin = async () => {
    if (!usernameOrEmail || !password) {
      Alert.alert('Campos requeridos', 'Por favor ingresa usuario y contraseña');
      return;
    }
    try {
      await login(usernameOrEmail, password);
    } catch (err: any) {
      Alert.alert(
        'Error de Autenticación',
        err.response?.data?.message || 'No se pudo conectar con el servidor SAMANYA'
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Brand Header */}
        <View style={styles.header}>
          <Text style={[styles.brandTitle, { color: theme.primary }]}>SAMANYA OS</Text>
          <Text style={[styles.brandSubtitle, { color: theme.textSecondary }]}>
            Sistema de Gestión Integral para Centros Geriátricos
          </Text>
        </View>

        {/* Login Card */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Iniciar Sesión</Text>
          <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
            Ingresa con tus credenciales asistenciales o de acudiente
          </Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Usuario o Correo</Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }
              ]}
              placeholder="ej. elena.morales@samanya.es"
              placeholderTextColor={theme.textSecondary}
              autoCapitalize="none"
              value={usernameOrEmail}
              onChangeText={setUsernameOrEmail}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Contraseña</Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }
              ]}
              placeholder="••••••••"
              placeholderTextColor={theme.textSecondary}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: theme.primary }]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.loginButtonText}>Acceder al Sistema</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24
  },
  header: { alignItems: 'center', marginBottom: 32 },
  brandTitle: { fontSize: 28, fontWeight: '900', letterSpacing: 1 },
  brandSubtitle: { fontSize: 13, textAlign: 'center', marginTop: 8, paddingHorizontal: 20 },
  card: {
    padding: 24,
    borderRadius: 28,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3
  },
  cardTitle: { fontSize: 20, fontWeight: '800', marginBottom: 4 },
  cardSubtitle: { fontSize: 12, marginBottom: 20 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '700', marginBottom: 6 },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 14
  },
  loginButton: {
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8
  },
  loginButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' }
});
