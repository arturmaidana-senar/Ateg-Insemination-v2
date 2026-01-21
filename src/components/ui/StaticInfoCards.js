import { View, Text, StyleSheet } from 'react-native';
import {
  OutlineLocationOn,
  AccountCowboyHatOutline,
  Doctor,
  PhoneOutline,
  DocumentMedicineBroken,
  Vaccine,
  CowFace,
} from '../../components/Icons/Icons';
import { ms } from 'react-native-size-matters';

export const StaticInfoCards = ({ schedule, racas }) => {
  const InfoItem = ({ icon, label, value }) => (
    <View style={styles.infoItem}>
      {icon}
      <View style={styles.infoCardTextContainer}>
        <Text style={styles.infoCardLabel} maxFontSizeMultiplier={1.0}>
          {label}
        </Text>
        <Text
          style={styles.infoCardValue}
          numberOfLines={1}
          maxFontSizeMultiplier={1.0}
        >
          {value || '-'}
        </Text>
      </View>
    </View>
  );

  const StatItem = ({ icon, label, value }) => (
    <View style={styles.statItem}>
      {icon}
      <Text style={styles.statLabel} maxFontSizeMultiplier={1.0}>
        {label}
      </Text>
      <Text style={styles.statValue} maxFontSizeMultiplier={1.0}>
        {value || '-'}
      </Text>
    </View>
  );

  return (
    <>
      <View style={styles.infoCard}>
        <InfoItem
          icon={<OutlineLocationOn />}
          label="Propriedade"
          value={schedule.property}
        />
        <View style={styles.cardDivider} />
        <InfoItem
          icon={<AccountCowboyHatOutline />}
          label="Produtor"
          value={schedule.producer}
        />
      </View>

      <View style={styles.infoCard}>
        <InfoItem
          icon={<Doctor />}
          label="Técnico de Campo"
          value={schedule.name_tecnico}
        />
        <View style={styles.cardDivider} />
        <InfoItem
          icon={<PhoneOutline />}
          label="Telefone"
          value={schedule.telephone}
        />
      </View>

      <View style={styles.statCard}>
        <StatItem
          icon={<DocumentMedicineBroken />}
          label="Protocolo"
          value={schedule.protocolo}
        />
        <StatItem
          icon={<Vaccine />}
          label="Diagnóstico"
          value={schedule.diagnosis_gestation}
        />
        <StatItem icon={<CowFace />} label="Raças" value={racas?.name} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: ms(10),
    padding: ms(16),
    marginBottom: ms(16),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 1,
  },
  infoCardTextContainer: {
    flex: 1,
    marginLeft: ms(12),
  },
  infoCardLabel: {
    fontSize: ms(13),
    color: '#8C8C8C',
    marginBottom: ms(2),
  },
  infoCardValue: {
    fontSize: ms(15),
    color: '#333333',
    fontWeight: '500',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: ms(8),
    marginLeft: ms(36),
  },
  statCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: ms(10),
    paddingVertical: ms(16),
    paddingHorizontal: ms(8),
    marginBottom: ms(16),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: ms(8),
  },
  statLabel: {
    fontWeight: '500',
    fontSize: ms(14),
    color: '#8C8C8C',
    marginBottom: ms(8),
    marginTop: ms(8),
  },
  statValue: {
    fontSize: ms(12.5),
    color: '#333333',
    fontWeight: '600',
  },
});
