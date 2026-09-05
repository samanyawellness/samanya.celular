import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import { X, FileCheck2, ShieldCheck, Check, AlertTriangle } from 'lucide-react-native';
import { useAuthStore } from '../../store/auth.store';
import { Colors } from '../../constants/theme';
import { ConsentRecord } from '../../data/mockData';

interface FamiliarConsentModalProps {
  consent: ConsentRecord | null;
  visible: boolean;
  onClose: () => void;
  onConsentSigned: (id: string) => void;
}

export const FamiliarConsentModal: React.FC<FamiliarConsentModalProps> = ({
  consent,
  visible,
  onClose,
  onConsentSigned
}) => {
  const { user, isDarkMode } = useAuthStore();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const [hasAgreed, setHasAgreed] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  if (!consent) return null;

  const handleSign = () => {
    if (!hasAgreed) {
      Alert.alert('Consentimiento Requerido', 'Debe marcar la casilla de aceptación para continuar.');
      return;
    }

    setIsSigning(true);
    setTimeout(() => {
      setIsSigning(false);
      onConsentSigned(consent.id);
      Alert.alert(
        'Consentimiento Firmado',
        'Su autorización digital ha sido registrada y respaldada con sello de tiempo.',
        [{ text: 'Aceptar', onPress: onClose }]
      );
    }, 600);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <View style={styles.headerLeft}>
              <View style={[styles.iconCircle, { backgroundColor: theme.primaryLight }]}>
                <FileCheck2 size={20} color={theme.primary} />
              </View>
              <Text style={[styles.headerTitle, { color: theme.text }]}>
                Firma de Consentimiento
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            <Text style={[styles.consentType, { color: theme.text }]}>
              {consent.type}
            </Text>
            <Text style={[styles.residentName, { color: theme.primary }]}>
              Residente: {consent.residentName}
            </Text>

            <View style={[styles.detailBox, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <Text style={[styles.boxLabel, { color: theme.textSecondary }]}>Descripción del Procedimiento</Text>
              <Text style={[styles.boxText, { color: theme.text }]}>
                {consent.description}
              </Text>
            </View>

            <View style={[styles.detailBox, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <Text style={[styles.boxLabel, { color: theme.textSecondary }]}>Solicitado por</Text>
              <Text style={[styles.boxText, { color: theme.text }]}>
                {consent.requestedBy} ({consent.requestedAt})
              </Text>
            </View>

            {/* Legal terms check */}
            <TouchableOpacity
              onPress={() => setHasAgreed(!hasAgreed)}
              style={styles.checkRow}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.checkbox,
                  {
                    borderColor: hasAgreed ? theme.primary : theme.border,
                    backgroundColor: hasAgreed ? theme.primary : 'transparent'
                  }
                ]}
              >
                {hasAgreed && <Check size={14} color="#FFFFFF" />}
              </View>
              <Text style={[styles.checkLabel, { color: theme.text }]}>
                Declaro que he sido informado sobre el procedimiento, beneficios y riesgos, y autorizo su ejecución en mi calidad de acudiente legal.
              </Text>
            </TouchableOpacity>

            {/* Sign Action Button */}
            <TouchableOpacity
              onPress={handleSign}
              disabled={isSigning}
              style={[
                styles.signBtn,
                {
                  backgroundColor: hasAgreed ? theme.primary : theme.border,
                  opacity: hasAgreed ? 1 : 0.6
                }
              ]}
            >
              <ShieldCheck size={18} color="#FFFFFF" />
              <Text style={styles.signBtnText}>
                {isSigning ? 'Registrando firma digital...' : 'Firmar y Autorizar Digitalmente'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end'
  },
  card: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '85%',
    paddingBottom: 24
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    borderBottomWidth: 1
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800'
  },
  closeBtn: {
    padding: 4
  },
  body: {
    padding: 18
  },
  consentType: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 4
  },
  residentName: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 14
  },
  detailBox: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12
  },
  boxLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4
  },
  boxText: {
    fontSize: 13,
    lineHeight: 18
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 8,
    marginBottom: 16
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2
  },
  checkLabel: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17
  },
  signBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 16,
    paddingVertical: 14,
    marginBottom: 14
  },
  signBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  }
});
