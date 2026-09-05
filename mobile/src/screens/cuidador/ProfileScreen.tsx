import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert
} from 'react-native';
import { User, Shield, Moon, Sun, LogOut, ArrowRightLeft, Phone, Mail, Building } from 'lucide-react-native';
import { useAuthStore, UserRole } from '../../store/auth.store';
import { Colors } from '../../constants/theme';

export const ProfileScreen: React.FC = () => {
  const { user, role, isDarkMode, toggleDarkMode, switchRole, logout } = useAuthStore();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const handleLogout = () => {
    Alert.alert('Cerrar Sesión', '¿Está seguro de que desea salir del sistema?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: () => logout() }
    ]);
  };

  const handleRoleSwitch = (newRole: UserRole) => {
    switchRole(newRole);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View style={[styles.userCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={[styles.avatarCircle, { backgroundColor: theme.primaryLight }]}>
            <User size={36} color={theme.primary} />
          </View>
          <Text style={[styles.userName, { color: theme.text }]}>
            {user?.nombreCompleto || 'Usuario SAMANYA'}
          </Text>
          <View style={[styles.roleBadge, { backgroundColor: theme.primaryLight }]}>
            <Shield size={12} color={theme.primary} />
            <Text style={[styles.roleText, { color: theme.primary }]}>
              {user?.nombreRol || role || 'CUIDADOR'}
            </Text>
          </View>
          <Text style={[styles.userEmail, { color: theme.textSecondary }]}>
            {user?.email || 'usuario@samanya.org'}
          </Text>
        </View>

        {/* Center / Institution Info */}
        <View style={[styles.sectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.sectionHeader}>
            <Building size={18} color={theme.primary} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Centro Geriátrico</Text>
          </View>
          <Text style={[styles.infoText, { color: theme.text }]}>
            Residencia Geriátrica Samanya Hogar
          </Text>
          <Text style={[styles.subText, { color: theme.textSecondary }]}>
            Sede Central · Bogotá D.C.
          </Text>
        </View>

        {/* Quick Role Switcher for Testing */}
        <View style={[styles.sectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.sectionHeader}>
            <ArrowRightLeft size={18} color={theme.primary} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Cambiar Vista de Rol</Text>
          </View>
          <View style={styles.rolesRow}>
            {(['CUIDADOR', 'FAMILIAR', 'ADMIN'] as const).map((r) => {
              const isSelected = role === r;
              return (
                <TouchableOpacity
                  key={r}
                  onPress={() => handleRoleSwitch(r)}
                  style={[
                    styles.roleSwitchBtn,
                    {
                      backgroundColor: isSelected ? theme.primary : theme.background,
                      borderColor: isSelected ? theme.primary : theme.border
                    }
                  ]}
                >
                  <Text
                    style={[
                      styles.roleSwitchText,
                      { color: isSelected ? '#FFFFFF' : theme.text }
                    ]}
                  >
                    {r}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Preferences */}
        <View style={[styles.sectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <TouchableOpacity onPress={toggleDarkMode} style={styles.prefRow}>
            <View style={styles.prefLeft}>
              {isDarkMode ? (
                <Sun size={20} color={theme.primary} />
              ) : (
                <Moon size={20} color={theme.text} />
              )}
              <Text style={[styles.prefText, { color: theme.text }]}>Modo Oscuro</Text>
            </View>
            <Text style={[styles.prefValue, { color: theme.primary }]}>
              {isDarkMode ? 'Activado' : 'Desactivado'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          style={[styles.logoutButton, { borderColor: '#EF4444' }]}
        >
          <LogOut size={18} color="#EF4444" />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    padding: 16,
    gap: 16
  },
  userCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center'
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  userName: {
    fontSize: 18,
    fontWeight: '800'
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 6
  },
  roleText: {
    fontSize: 12,
    fontWeight: '800'
  },
  userEmail: {
    fontSize: 13
  },
  sectionCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800'
  },
  infoText: {
    fontSize: 14,
    fontWeight: '700'
  },
  subText: {
    fontSize: 12,
    marginTop: 2
  },
  rolesRow: {
    flexDirection: 'row',
    gap: 10
  },
  roleSwitchBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center'
  },
  roleSwitchText: {
    fontSize: 11,
    fontWeight: '800'
  },
  prefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4
  },
  prefLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  prefText: {
    fontSize: 14,
    fontWeight: '700'
  },
  prefValue: {
    fontSize: 13,
    fontWeight: '700'
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 14,
    gap: 8,
    marginTop: 10
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '800'
  }
});
