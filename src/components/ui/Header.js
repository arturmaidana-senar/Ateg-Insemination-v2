import React, { useEffect, useState } from 'react';
import { View, Image, Text } from 'react-native';
import { ScaledSheet, ms } from 'react-native-size-matters';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Header() {
  const [userName, setUserName] = useState('Carregando...');
  const [userAvatar, setUserAvatar] = useState(null);
  const [location, setLocation] = useState('');

  async function loadStorage() {
    try {
      const storageUser = await AsyncStorage.getItem('@ategInsemincaoName');
      setUserName(storageUser || 'Visitante');
      setUserAvatar(require('../../assets/AdminPhoto.png'));
      setLocation('Mato Grosso - 78120876');
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setUserName('Visitante');
    }
  }

  useEffect(() => {
    loadStorage();
  }, []);

  return (
    <View style={styles.headerContainer}>
      <View style={styles.contentRow}>
        <Image
          style={styles.avatar}
          source={userAvatar}
          defaultSource={require('../../assets/AdminPhoto.png')}
        />
        <View style={styles.userInfo}>
          <Text
            style={styles.welcomeText}
            maxFontSizeMultiplier={1.0}
            numberOfLines={1}
          >
            Bem-vindo, {userName}
          </Text>
          <Text
            style={styles.locationText}
            maxFontSizeMultiplier={1.0}
            numberOfLines={1}
          >
            {location}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = ScaledSheet.create({
  headerContainer: {
    backgroundColor: '#2E6B46',
    width: '100%',
    paddingTop: '50@ms',
    paddingBottom: '30@ms',
    paddingHorizontal: '20@ms',
    borderBottomLeftRadius: '30@ms',
    borderBottomRightRadius: '30@ms',

    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginBottom: '10@ms',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: '50@ms',
    height: '50@ms',
    borderRadius: '25@ms',
    backgroundColor: '#E0E0EE',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  userInfo: {
    flex: 1,
    marginLeft: '15@ms',
    justifyContent: 'center',
  },
  welcomeText: {
    fontFamily: 'Ubuntu-Bold',
    fontWeight: 'bold',
    fontSize: '16@ms',
    color: '#FFFFFF',
    marginBottom: '2@ms',
  },
  locationText: {
    fontFamily: 'Ubuntu-Regular',
    fontWeight: '400',
    fontSize: '12@ms',
    color: '#E0E0E0',
    opacity: 0.9,
  },
});
