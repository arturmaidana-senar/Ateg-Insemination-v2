import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import { ms } from 'react-native-size-matters';

import { useServiceData } from './hooks/useServiceData';
import { usePhotoHandler } from './hooks/usePhotoHandler';
import { useAttendanceActions } from './hooks/useAttendanceActions';

import { StaticInfoCards } from '../../components/ui/StaticInfoCards';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ButtonContainer } from '../../components/ui/ButtonContainer';

import InformationTab from './Sections/InfoTabs';
import PhotosTab from './Sections/PhotosTabs';
import LocationTab from './Sections/LocationTabs';
import LoadingInfo from '../../components/ui/LoadingInfo';
import {
  CircleAlert,
  OutlineInsertPhoto,
  LocationOn,
  BackPage,
} from '../../components/Icons/Icons';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CONTENT_WIDTH = SCREEN_WIDTH - ms(32);

export default function Service() {
  const navigation = useNavigation();
  const route = useRoute();
  const { scheduleId } = route.params || {};

  const [activeTab, setActiveTab] = useState(0);
  const [isConnected, setIsConnected] = useState(true);

  const flatListRef = useRef(null);

  const [isHaveAttendence, setIsHaveAttendence] = useState(false);
  const [motivo, setMotivo] = useState(null);
  const [motivoId, setMotivoId] = useState(null);
  const [messageText, setMessageText] = useState('');

  const data = useServiceData(scheduleId);
  const photos = usePhotoHandler(scheduleId, isHaveAttendence);
  const actions = useAttendanceActions(
    scheduleId,
    data.technicianName,
    data.refreshVisit,
    data.inseminacaoVisit,
  );

  useEffect(() => {
    return NetInfo.addEventListener(state => setIsConnected(state.isConnected));
  }, []);

  const buttons = [
    { label: 'Informações', icon: CircleAlert },
    { label: 'Fotos', icon: OutlineInsertPhoto },
    { label: 'Localização', icon: LocationOn },
  ];

  const onTabPress = index => {
    setActiveTab(index);
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

  const onScrollEnd = event => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / CONTENT_WIDTH);
    if (index !== activeTab) {
      setActiveTab(index);
    }
  };

  const renderTabItem = ({ item, index }) => {
    return (
      <View style={{ width: CONTENT_WIDTH }}>
        {index === 0 && (
          <InformationTab
            schedule={data.schedule}
            inseminacaoVisit={data.inseminacaoVisit}
            inseminacaoVisitExist={data.inseminacaoVisitExist}
            technicianUsers={data.technicianUsers}
            justifications={data.justifications}
            isConnected={isConnected}
            technicianName={data.technicianName}
            setTechnicianName={data.setTechnicianName}
            isHaveAttendence={isHaveAttendence}
            setIsHaveAttendence={setIsHaveAttendence}
            motivoId={motivoId}
            setMotivoId={setMotivoId}
            motivo={motivo}
            setMotivo={setMotivo}
            messageText={messageText}
            setMessageText={setMessageText}
            handleStartService={actions.startService}
            handleEndService={() =>
              actions.endService(
                isHaveAttendence,
                motivoId,
                motivo,
                messageText,
                photos.images.length,
              )
            }
            // ---------------------------------------------------------
            // AQUI ESTÁ A MUDANÇA PARA DEBUG
            // ---------------------------------------------------------
            sendService={() => {
              console.log('\n\n========== 🕵️ DEBUG PRÉ-ENVIO ==========');
              console.log('📡 Status Conexão:', isConnected);
              console.log('📸 Total de Imagens:', photos.images.length);

              const debugPayload = photos.images.map((img, i) => ({
                index: i,
                uri: img.uri,
                name: img.name,
                // VERIFIQUE ESTA DATA: O backend aceita "YYYY-MM-DD HH:mm:ss"
                // ou exige "YYYY-MM-DDTHH:mm:ss.000Z"?
                date_time: img.date_time,
                latitude: img.latitude,
                longitude: img.longitude,
              }));

              console.log(
                '📦 Payload de Imagens:',
                JSON.stringify(debugPayload, null, 2),
              );

              if (photos.images.length === 0) {
                console.warn('⚠️ AVISO: Tentando enviar sem fotos!');
              }

              // Chama a função original
              actions.sendServiceToApi(photos.images, isConnected);
            }}
            // ---------------------------------------------------------
          />
        )}
        {index === 1 && (
          <PhotosTab
            inseminacaoVisit={data.inseminacaoVisit}
            images={photos.images}
            hasCameraPermission={photos.hasCameraPermission}
            loading={photos.photoLoading}
            getLocationPhoto={photos.handleTakePhoto}
            handleDeleteImage={photos.handleDeleteImage}
            isHaveAttendence={isHaveAttendence}
          />
        )}
        {index === 2 && <LocationTab schedule={data.schedule} />}
      </View>
    );
  };

  const tabData = [0, 1, 2];

  if (data.loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#008346" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <LoadingInfo
        visible={actions.actionLoading || photos.photoLoading}
        message={actions.loadingMessage || 'Processando...'}
      />

      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => navigation.goBack()}
        >
          <BackPage />
        </TouchableOpacity>
        <Text style={styles.headerTitle} maxFontSizeMultiplier={1.0}>
          Dados do Atendimento
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <StatusBadge
          visit={data.inseminacaoVisit}
          scheduleDate={data.schedule.date}
          exist={data.inseminacaoVisitExist}
        />

        <StaticInfoCards schedule={data.schedule} racas={data.racas} />

        <View style={styles.tabBarCard}>
          <ButtonContainer
            buttons={buttons}
            active={activeTab}
            onClick={onTabPress}
          />
        </View>

        <View style={styles.tabContentCard}>
          <FlatList
            ref={flatListRef}
            data={tabData}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            bounces={false}
            keyExtractor={item => item.toString()}
            renderItem={renderTabItem}
            onMomentumScrollEnd={onScrollEnd}
            scrollEventThrottle={16}
            getItemLayout={(data, index) => ({
              length: CONTENT_WIDTH,
              offset: CONTENT_WIDTH * index,
              index,
            })}
            initialScrollIndex={activeTab}
            onScrollToIndexFailed={info => {
              const wait = new Promise(resolve => setTimeout(resolve, 500));
              wait.then(() => {
                flatListRef.current?.scrollToIndex({
                  index: info.index,
                  animated: true,
                });
              });
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6F9F7',
  },
  screen: {
    flex: 1,
    backgroundColor: '#F6F9F7',
    paddingTop: ms(20),
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: ms(16),
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ms(16),
    paddingTop: Platform.OS === 'ios' ? ms(50) : ms(20),
    paddingBottom: ms(12),
    backgroundColor: '#F6F9F7',
  },
  headerIcon: {
    padding: ms(5),
    marginRight: ms(10),
  },
  headerTitle: {
    fontSize: ms(18),
    fontWeight: '600',
    color: '#333333',
  },
  tabBarCard: {
    backgroundColor: '#F6F9F7',
    borderRadius: ms(10),
    marginBottom: ms(16),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    overflow: 'hidden',
  },
  tabContentCard: {
    backgroundColor: '#F6F9F7',
    borderRadius: ms(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    overflow: 'hidden',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeSimpleButton: {
    marginTop: ms(20),
    backgroundColor: '#ff3b3b',
    padding: ms(10),
    borderRadius: ms(5),
  },
  statusBadge: {
    borderWidth: 1,
    borderRadius: ms(16),
    paddingVertical: ms(4),
    paddingHorizontal: ms(12),
    alignSelf: 'flex-start',
    marginBottom: ms(16),
    marginTop: ms(8),
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: ms(13),
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: '#F6F9F7',
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
  tabBarCard: {
    backgroundColor: '#F1EEE7',
    borderRadius: ms(10),
    marginBottom: ms(16),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    overflow: 'hidden',
  },
  tabContentCard: {
    backgroundColor: '#F6F9F7',
    borderRadius: ms(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    overflow: 'hidden',
  },

  btnContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    height: ms(55),
    width: '100%',
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ms(14),
  },
  btnText: {
    fontSize: ms(12),
    fontWeight: '500',
    marginLeft: ms(4),
  },
  activeBtnText: {
    color: '#333333',
    fontWeight: '600',
  },
  animatedBtnContainer: {
    height: 3,
    backgroundColor: '#008346',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },

  errorContainer: {
    padding: ms(10),
    backgroundColor: '#ffebee',
    marginHorizontal: ms(16),
  },
  labelErro: {
    color: 'red',
    fontSize: ms(14),
  },
  primaryButton: {
    backgroundColor: '#fff',
    padding: ms(16),
    borderRadius: ms(8),
    alignItems: 'center',
    marginVertical: ms(8),
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: ms(16),
    fontWeight: 'bold',
  },
  selectButton: {
    padding: ms(14),
    backgroundColor: '#F7F7F7',
    borderRadius: ms(8),
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {
    color: '#333',
    fontSize: ms(15),
  },
  cardes: {
    flexDirection: 'row',
    marginVertical: ms(10),
    padding: ms(10),
    backgroundColor: '#ffffffff',
    borderRadius: ms(8),
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  image: {
    width: ms(60),
    height: ms(60),
    borderRadius: ms(4),
  },
  details: {
    flex: 1,
    marginLeft: ms(12),
  },
  brand: {
    color: '#2a9df4',
    fontSize: ms(14),
    fontWeight: 'bold',
  },
  title: {
    fontSize: ms(12),
    fontWeight: 'bold',
    marginVertical: 2,
  },
  description: {
    fontSize: ms(12),
    color: '#666',
  },
  iconContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    paddingHorizontal: ms(8),
  },
  noDataText: {
    textAlign: 'center',
    fontSize: ms(16),
    color: '#666',
    marginTop: ms(32),
  },
  errorText: {
    color: 'red',
    fontSize: ms(14),
    textAlign: 'center',
    marginTop: ms(16),
  },
  imageModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  fullImage: {
    width: '90%',
    height: '70%',
    borderRadius: ms(8),
  },
  modalCloseButton: {
    position: 'absolute',
    top: ms(50),
    right: ms(20),
    zIndex: 1,
  },
  modalCloseText: {
    color: 'white',
    fontSize: ms(16),
    fontWeight: 'bold',
  },
  mapModalContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: ms(20),
    borderRadius: ms(10),
    width: '80%',
    maxHeight: '80%',
  },
  option: {
    padding: ms(15),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    color: '#333',
    fontSize: ms(16),
  },
  closeButton: {
    marginTop: ms(10),
    padding: ms(12),
    backgroundColor: '#f8f9fa',
    borderRadius: ms(8),
  },
  closeButtonText: {
    textAlign: 'center',
    color: '#333',
    fontSize: ms(16),
    fontWeight: 'bold',
  },
  mapButton: {
    marginTop: ms(20),
    padding: ms(10),
    backgroundColor: '#ffff',
    borderRadius: ms(5),
  },
  containerModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    flex: 1,
  },
  closeFloatButton: {
    position: 'absolute',
    top: ms(50),
    right: ms(20),
    backgroundColor: '#FFF',
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: ms(10),
  },
  bottomFloatContainer: {
    position: 'absolute',
    bottom: ms(40),
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: ms(10),
  },
  routeFloatButton: {
    flexDirection: 'row',
    backgroundColor: '#4285F4',
    paddingVertical: ms(12),
    paddingHorizontal: ms(24),
    borderRadius: ms(30),
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  routeButtonText: {
    color: '#FFF',
    fontSize: ms(16),
    fontWeight: 'bold',
  },
});
