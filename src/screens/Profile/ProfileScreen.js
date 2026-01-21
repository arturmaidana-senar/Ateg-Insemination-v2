import React, { useState, useContext, useCallback } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { ScaledSheet, ms } from 'react-native-size-matters';
import { AuthContext } from '../../contexts/auth';

import TermsOfUseModal from '../../components/Moldals/TermsOfUseModal';
import NotesUpdates from '../../components/Moldals/NotesUpdates';
import LogoutModal from '../../components/Moldals/LogoutModal';
import SyncModal from '../../components/Moldals/SyncModal';
import HelpModal from '../../components/Moldals/HelpModal';

import {
  ShieldCheckIcon,
  HelpIcon,
  CheckBadgeIcon,
  LogoutIcon,
  ArrowRightFilledIcon,
  CloudSync,
} from '../../components/Icons/Icons';

import ScreenContainer from '../../components/ui/ScreenContainer';

const ProfileRow = ({ iconName, text, isDestructive = false, onPress }) => {
  const textColor = isDestructive ? '#D9534F' : '#333';

  const renderIcon = () => {
    const props = { width: ms(20), height: ms(20), color: '#333' };
    if (isDestructive) props.color = '#D9534F';

    switch (iconName) {
      case 'shield':
        return <ShieldCheckIcon {...props} />;
      case 'cloud':
        return <CloudSync {...props} />;
      case 'check-circle':
        return <CheckBadgeIcon {...props} />;
      case 'help-circle':
        return <HelpIcon {...props} />;
      case 'log-out':
        return <LogoutIcon {...props} />;
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.6}>
      <View style={styles.rowIconContainer}>{renderIcon()}</View>
      <Text
        style={[styles.rowText, { color: textColor }]}
        maxFontSizeMultiplier={1.0}
      >
        {text}
      </Text>
      <ArrowRightFilledIcon width={ms(16)} height={ms(16)} color="#C4C4C4" />
    </TouchableOpacity>
  );
};

export default function ProfileScreen() {
  const [isQrModalVisible, setQrModalVisible] = useState(false);
  const [isTermsModalVisible, setTermsModalVisible] = useState(false);
  const [isNotesModalVisible, setNotesModalVisible] = useState(false);
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
  const [isHelpModalVisible, setHelpModalVisible] = useState(false);
  const [isSyncModalVisible, setSyncModalVisible] = useState(false);

  const [userName, setUserName] = useState('Carregando...');
  const [userEmail, setUserEmail] = useState('...');
  const [userAvatar, setUserAvatar] = useState(
    require('../../assets/AdminPhoto.png'),
  );

  const { logoff } = useContext(AuthContext);

  async function loadUserProfile() {
    try {
      const storedName = await AsyncStorage.getItem('@ategInsemincaoName');

      const storedEmail = await AsyncStorage.getItem('@ategInsemincaoEmail');

      if (storedName) setUserName(storedName);
      else setUserName('Técnico de Campo');

      if (storedEmail) setUserEmail(storedEmail);
      else setUserEmail('email@senarmt.org.br');
    } catch (error) {
      console.log('Erro ao carregar perfil:', error);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadUserProfile();
    }, []),
  );

  const confirmLogout = () => {
    logoff();
  };

  return (
    <ScreenContainer>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}
      >
        <Text style={styles.pageTitle} maxFontSizeMultiplier={1.0}>
          Gerencie suas informações e acessos.
        </Text>

        <View style={styles.card}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Image style={styles.avatar} source={userAvatar} />
            </View>

            <Text style={styles.userName} maxFontSizeMultiplier={1.0}>
              {userName}
            </Text>
            <Text style={styles.userEmail} maxFontSizeMultiplier={1.0}>
              {userEmail}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.0}>
              Informações
            </Text>
            <ProfileRow
              iconName="shield"
              text="Termos de Uso"
              onPress={() => setTermsModalVisible(true)}
            />
            <View style={styles.separator} />
            <ProfileRow
              iconName="cloud"
              text="Sincronizar Dados"
              onPress={() => setSyncModalVisible(true)}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.0}>
              Outros
            </Text>
            <ProfileRow
              iconName="help-circle"
              text="Ajuda"
              onPress={() => setHelpModalVisible(true)}
            />
            <View style={styles.separator} />
            <ProfileRow
              iconName="check-circle"
              text="Notas de Atualização"
              onPress={() => setNotesModalVisible(true)}
            />
            <View style={styles.separator} />
            <ProfileRow
              iconName="log-out"
              text="Sair da Conta"
              isDestructive={true}
              onPress={() => setLogoutModalVisible(true)}
            />
          </View>
        </View>
      </ScrollView>

      <LogoutModal
        isVisible={isLogoutModalVisible}
        onClose={() => setLogoutModalVisible(false)}
        onConfirm={confirmLogout}
      />
      <SyncModal
        isVisible={isSyncModalVisible}
        onClose={() => setSyncModalVisible(false)}
      />
      <TermsOfUseModal
        isVisible={isTermsModalVisible}
        onClose={() => setTermsModalVisible(false)}
      />
      <NotesUpdates
        isVisible={isNotesModalVisible}
        onClose={() => setNotesModalVisible(false)}
      />
      <HelpModal
        isVisible={isHelpModalVisible}
        onClose={() => setHelpModalVisible(false)}
      />
    </ScreenContainer>
  );
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContentContainer: {
    paddingHorizontal: ms(20),
    paddingBottom: ms(100),
  },
  pageTitle: {
    fontSize: ms(20),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: ms(30),
    lineHeight: ms(28),
    paddingHorizontal: ms(5),
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: ms(16),
    paddingVertical: ms(25),
    paddingHorizontal: ms(20),
    marginBottom: ms(20),

    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },

  profileHeader: {
    alignItems: 'center',
    marginBottom: ms(30),
  },
  avatarContainer: {
    padding: ms(4),
    borderRadius: ms(50),
    borderWidth: ms(2),
    borderColor: '#00A859',
    marginBottom: ms(10),
  },
  avatar: {
    width: ms(70),
    height: ms(70),
    borderRadius: ms(35),
    backgroundColor: '#E0E0E0',
  },
  userName: {
    fontWeight: 'bold',
    fontSize: ms(18),
    color: '#333',
    marginTop: ms(5),
    textAlign: 'center',
  },
  userEmail: {
    fontWeight: 'medium',
    fontSize: ms(13),
    color: '#757575',
    marginTop: ms(2),
    textAlign: 'center',
  },

  section: {
    marginBottom: ms(5),
  },
  sectionTitle: {
    fontWeight: '500',
    fontSize: ms(13),
    color: '#9E9E9E',
    marginBottom: ms(10),
    marginLeft: ms(5),
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: ms(14),
  },
  rowIconContainer: {
    width: ms(30),
    alignItems: 'flex-start',
  },
  rowText: {
    fontWeight: 'regular',
    flex: 1,
    fontSize: ms(15),
    marginLeft: ms(5),
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: ms(35),
  },
});
