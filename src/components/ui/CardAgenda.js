import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, View, Text } from 'react-native';
import { ScaledSheet, ms } from 'react-native-size-matters';
import { formatDate } from '../../utils/dateFormat';
import { dataAtual } from '../../utils/date';

import {
  OutlineCalendarToday,
  CowFace,
  PersonIcon,
  ArrowRightIcon,
} from '../Icons/Icons';
import Toast from 'react-native-toast-message';

const STATUS_THEME = {
  Aguardando: { bg: '#FFF8E1', text: '#F57C00', borderColor: '#FFE0B2' },
  'Em Progresso': { bg: '#E3F2FD', text: '#1976D2', borderColor: '#BBDEFB' },
  Realizado: { bg: '#E8F5E9', text: '#2E7D32', borderColor: '#C8E6C9' },
  Desincronizado: { bg: '#ECEFF1', text: '#455A64', borderColor: '#CFD8DC' },
  'já atendida': { bg: '#FFEBEE', text: '#C62828', borderColor: '#FFCDD2' },
  'Fora da Data': { bg: '#F3E5F5', text: '#6A1B9A', borderColor: '#E1BEE7' },
  default: { bg: '#FAFAFA', text: '#616161', borderColor: '#EEEEEE' },
};

export default function CardAgenda({
  scheduleId,
  title,
  date,
  datatime,
  status,
  grupo,
  produtor,
  protocolStep,
  pending,
  sent,
}) {
  const navigation = useNavigation();

  const handleCardPress = async () => {
    if (status == 1 && pending == null && sent == null) {
      return Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Atendimento realizado em outro aplicativo!',
        visibilityTime: 3000,
      });
    }
    navigation.navigate('AgendaPrevious', { scheduleId });
  };

  const getStatusText = () => {
    if (status == 1 && pending == null && sent == null) return ' já atendida';
    if (pending == 1 && sent == 1) return ' Realizado';
    if (pending == 0) return 'Em Progresso';
    if (pending == 1 && sent == 0) return 'Desincronizado';
    const today = dataAtual();
    if (date != today) return 'Fora da Data';
    return 'Aguardando';
  };

  const statusText = getStatusText();
  const currentTheme = STATUS_THEME[statusText] || STATUS_THEME.default;

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={handleCardPress}
      activeOpacity={0.7}
    >
      <View style={styles.topSection}>
        <View style={styles.bigIconCircle}>
          <CowFace width={ms(24)} height={ms(24)} color="#2E6B46" />
        </View>

        <View style={styles.headerTextContainer}>
          <View style={styles.titleRow}>
            <View style={styles.protocolBadge}>
              <Text style={styles.protocolText} maxFontSizeMultiplier={1.0}>
                {protocolStep}
              </Text>
            </View>
            <Text
              style={styles.titleText}
              numberOfLines={1}
              maxFontSizeMultiplier={1.0}
            >
              {title}
            </Text>
          </View>

          <View style={styles.producerRow}>
            <PersonIcon width={ms(14)} height={ms(14)} color="#757575" />
            <Text
              style={styles.infoText}
              numberOfLines={1}
              maxFontSizeMultiplier={1.0}
            >
              {produtor}
            </Text>
          </View>
        </View>

        <View style={styles.arrowContainer}>
          <ArrowRightIcon width={ms(16)} height={ms(16)} color="#9E9E9E" />
        </View>
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.dateTimeRow}>
          <View style={styles.dateItem}>
            <OutlineCalendarToday
              width={ms(14)}
              height={ms(14)}
              color="#757575"
            />
            <Text style={styles.dateText} maxFontSizeMultiplier={1.0}>
              {formatDate(date)}
            </Text>
          </View>

          {datatime && (
            <View style={[styles.dateItem, { marginLeft: ms(16) }]}>
              <Text style={{ fontSize: ms(12) }}>🕒</Text>
              <Text style={styles.dateText} maxFontSizeMultiplier={1.0}>
                {datatime}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: currentTheme.bg,
                borderColor: currentTheme.borderColor,
              },
            ]}
          >
            <Text style={{ fontSize: ms(10), marginRight: ms(4) }}>⏱</Text>
            <Text
              style={[styles.statusText, { color: currentTheme.text }]}
              maxFontSizeMultiplier={1.0}
            >
              {statusText}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = ScaledSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16@ms',
    padding: '16@ms',
    marginBottom: '12@ms',
    flexDirection: 'column',

    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },

  topSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: '12@ms',
  },

  bigIconCircle: {
    width: '48@ms',
    height: '48@ms',
    borderRadius: '24@ms',
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '12@ms',
  },

  headerTextContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: '2@ms',
  },

  arrowContainer: {
    paddingTop: '4@ms',
    paddingLeft: '4@ms',
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '6@ms',
  },
  protocolBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: '6@ms',
    paddingVertical: '2@ms',
    borderRadius: '4@ms',
    marginRight: '8@ms',
  },
  protocolText: {
    color: '#2E6B46',
    fontSize: '11@ms',
    fontWeight: 'bold',
  },
  titleText: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: '14@ms',
    color: '#212121',
    flex: 1,
    fontWeight: 'bold',
  },

  producerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: '13@ms',
    color: '#616161',
    marginLeft: '6@ms',
    fontFamily: 'Ubuntu-Regular',
  },

  bottomSection: {
    marginTop: '2@ms',
  },

  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '10@ms',
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: '13@ms',
    color: '#424242',
    marginLeft: '6@ms',
  },

  statusRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  statusBadge: {
    paddingVertical: '6@ms',
    paddingHorizontal: '12@ms',
    borderRadius: '20@ms',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: '12@ms',
    fontWeight: 'bold',
  },
});
