import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { COLORS } from '../../../utils/theme.js';
import {
  LocationOn,
  Cancel,
  RouteBold,
} from '../../../components/Icons/Icons.js';
import { ms } from 'react-native-size-matters';

export default function LocationTab({ schedule, error }) {
  const [modalVisible, setModalVisible] = useState(false);
  const hasLocation = schedule.latitude && schedule.longitude;

  const openMap = () => {
    if (!hasLocation) {
      Alert.alert('Erro', 'A latitude e longitude não estão disponíveis.');
      return;
    }
    setModalVisible(true);
  };

  const handleOpenGoogleMaps = () => {
    const lat = parseFloat(schedule.latitude);
    const lng = parseFloat(schedule.longitude);
    const schemeAndroid = `google.navigation:q=${lat},${lng}`;
    const schemeIOS = `comgooglemaps://?daddr=${lat},${lng}&directionsmode=driving`;
    const schemeAppleMaps = `maps:0,0?daddr=${lat},${lng}`;

    const url = Platform.select({ ios: schemeIOS, android: schemeAndroid });

    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        if (Platform.OS === 'ios') Linking.openURL(schemeAppleMaps);
        else
          Alert.alert('Erro', 'Não foi possível abrir o aplicativo de mapas.');
      }
    });
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          {hasLocation ? (
            <>
              <MapView
                style={StyleSheet.absoluteFillObject}
                mapType="hybrid"
                initialRegion={{
                  latitude: parseFloat(schedule.latitude),
                  longitude: parseFloat(schedule.longitude),
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: parseFloat(schedule.latitude),
                    longitude: parseFloat(schedule.longitude),
                  }}
                  title="Local do Atendimento"
                />
              </MapView>

              <TouchableOpacity
                style={styles.closeFloatButton}
                onPress={() => setModalVisible(false)}
                activeOpacity={0.7}
              >
                <Cancel name="close" size={24} color="#333" />
              </TouchableOpacity>

              <View style={styles.bottomFloatContainer}>
                <TouchableOpacity
                  style={styles.routeFloatButton}
                  onPress={handleOpenGoogleMaps}
                  activeOpacity={0.8}
                >
                  <RouteBold
                    name="directions"
                    size={24}
                    color="#FFF"
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={styles.routeButtonText}
                    maxFontSizeMultiplier={1.0}
                  >
                    Traçar Rota no App
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.loadingContainer}>
              <Text style={styles.errorText} maxFontSizeMultiplier={1.0}>
                Localização inválida.
              </Text>
              <TouchableOpacity
                style={styles.closeSimpleButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: '#FFF' }} maxFontSizeMultiplier={1.0}>
                  Fechar
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>

      <View style={styles.section}>
        <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.0}>
          Localização da Propriedade
        </Text>

        {hasLocation ? (
          <>
            <View style={styles.coordinatesContainer}>
              <View style={styles.coordinateItem}>
                <Text
                  style={styles.coordinateLabel}
                  maxFontSizeMultiplier={1.0}
                >
                  Latitude:
                </Text>
                <Text
                  style={styles.coordinateValue}
                  maxFontSizeMultiplier={1.0}
                >
                  {schedule.latitude}
                </Text>
              </View>
              <View style={styles.coordinateItem}>
                <Text
                  style={styles.coordinateLabel}
                  maxFontSizeMultiplier={1.0}
                >
                  Longitude:
                </Text>
                <Text
                  style={styles.coordinateValue}
                  maxFontSizeMultiplier={1.0}
                >
                  {schedule.longitude}
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.mapButton} onPress={openMap}>
              <LocationOn color="#FFF" size={20} />
              <Text style={styles.mapButtonText} maxFontSizeMultiplier={1.0}>
                Visualizar no Mapa
              </Text>
            </TouchableOpacity>

            <View style={styles.infoBox}>
              <Text style={styles.infoText} maxFontSizeMultiplier={1.0}>
                ℹ️ Você pode visualizar a localização exata no mapa e traçar uma
                rota até o local.
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.warningContainer}>
            <Text style={styles.warningText} maxFontSizeMultiplier={1.0}>
              ⚠️ Localização não disponível
            </Text>
          </View>
        )}
      </View>

      {schedule.property && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.0}>
            Informações Adicionais
          </Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel} maxFontSizeMultiplier={1.0}>
              Propriedade:
            </Text>
            <Text style={styles.infoValue} maxFontSizeMultiplier={1.0}>
              {schedule.property}
            </Text>
          </View>

          {schedule.producer && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel} maxFontSizeMultiplier={1.0}>
                Produtor:
              </Text>
              <Text style={styles.infoValue} maxFontSizeMultiplier={1.0}>
                {schedule.producer}
              </Text>
            </View>
          )}

          {schedule.telephone && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel} maxFontSizeMultiplier={1.0}>
                Telefone:
              </Text>
              <Text style={styles.infoValue} maxFontSizeMultiplier={1.0}>
                {schedule.telephone}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: ms(16),
  },
  section: {
    marginBottom: ms(24),
  },
  sectionTitle: {
    fontSize: ms(16),
    fontWeight: '600',
    color: '#333',
    marginBottom: ms(16),
  },
  coordinatesContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: ms(8),
    padding: ms(16),
    marginBottom: ms(16),
  },
  coordinateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: ms(8),
  },
  coordinateLabel: {
    fontSize: ms(14),
    color: '#666',
    fontWeight: '500',
  },
  coordinateValue: {
    fontSize: ms(14),
    color: '#333',
    fontWeight: '600',
  },
  mapButton: {
    backgroundColor: COLORS.primary || '#008346',
    padding: ms(16),
    borderRadius: ms(8),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: ms(16),
  },
  mapButtonText: {
    color: '#FFF',
    fontSize: ms(16),
    fontWeight: 'bold',
    marginLeft: ms(8),
  },
  infoBox: {
    backgroundColor: '#e3f2fd',
    padding: ms(12),
    borderRadius: ms(8),
    borderLeftWidth: ms(4),
    borderLeftColor: '#2196F3',
  },
  infoText: {
    fontSize: ms(13),
    color: '#1565C0',
    lineHeight: ms(20),
  },
  warningContainer: {
    backgroundColor: '#fff3cd',
    padding: ms(12),
    borderRadius: ms(8),
    borderLeftWidth: ms(4),
    borderLeftColor: '#ffc107',
  },
  warningText: {
    color: '#856404',
    fontSize: ms(14),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: ms(8),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: ms(14),
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: ms(14),
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },

  modalView: {
    flex: 1,
    backgroundColor: '#FFF',
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
    elevation: ms(5),
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
  },
  routeButtonText: {
    color: '#FFF',
    fontSize: ms(16),
    fontWeight: 'bold',
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
});
