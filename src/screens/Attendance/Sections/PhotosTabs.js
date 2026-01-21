// Sections/PhotosTabs.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  ScrollView,
  Modal,
} from 'react-native';
import {
  EyeIconModal,
  Lixeira,
  CircleAlert,
} from '../../../components/Icons/Icons';
import { ms } from 'react-native-size-matters';

const WarningBox = ({ text }) => (
  <View style={styles.warningBox}>
    <CircleAlert
      name="info-outline"
      size={24}
      color="#FFA500"
      style={styles.warningIcon}
    />
    <Text style={styles.warningText} maxFontSizeMultiplier={1.0}>
      {text}
    </Text>
  </View>
);

export default function PhotosTab({
  inseminacaoVisit,
  hasCameraPermission,
  loading,
  getLocationPhoto,
  images,
  handleDeleteImage,
}) {
  const [selectedImage, setSelectedImage] = useState(null);

  const renderPhotoItem = ({ item, index }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.uri }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.brand} maxFontSizeMultiplier={1.0}>
          Foto {index + 1}
        </Text>
        <Text style={styles.title} maxFontSizeMultiplier={1.0}>
          {item.date_time || 'Sem data'}
        </Text>
        <Text style={styles.description} maxFontSizeMultiplier={1.0}>
          {item.sent == 0 ? 'Pendente' : 'Enviado'}
        </Text>
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity
          onPress={() => setSelectedImage(item.uri)}
          style={styles.iconButton}
        >
          <EyeIconModal />
        </TouchableOpacity>
        {inseminacaoVisit &&
          inseminacaoVisit.id &&
          !inseminacaoVisit.checkout && (
            <TouchableOpacity
              onPress={() => handleDeleteImage(item.id)}
              style={styles.iconButton}
            >
              <Lixeira />
            </TouchableOpacity>
          )}
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <Modal
          visible={!!selectedImage}
          transparent={true}
          onRequestClose={() => setSelectedImage(null)}
        >
          <View style={styles.imageModalContainer}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setSelectedImage(null)}
            >
              <Text style={styles.modalCloseText} maxFontSizeMultiplier={1.0}>
                Fechar
              </Text>
            </TouchableOpacity>
            {selectedImage && (
              <Image
                source={{ uri: selectedImage }}
                style={styles.fullImage}
                resizeMode="contain"
              />
            )}
          </View>
        </Modal>

        {!inseminacaoVisit.id && (
          <WarningBox text="  Inicie o Atendimento para adicionar fotos!" />
        )}

        {inseminacaoVisit && inseminacaoVisit.id && (
          <>
            {inseminacaoVisit.pending == 0 && (
              <View style={styles.listContainer}>
                <TouchableOpacity
                  style={[
                    styles.addButton,
                    !hasCameraPermission && loading && styles.disabledButton,
                  ]}
                  onPress={getLocationPhoto}
                  activeOpacity={0.8}
                  disabled={!hasCameraPermission && loading}
                >
                  <Text
                    style={styles.addButtonText}
                    maxFontSizeMultiplier={1.0}
                  >
                    {loading
                      ? 'Carregando...'
                      : images.length > 0
                      ? 'Adicionar Nova Foto'
                      : 'Tirar Primeira Foto'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {images.length > 0 ? (
              <FlatList
                data={images}
                keyExtractor={item =>
                  item.id ? item.id.toString() : Math.random().toString()
                }
                renderItem={renderPhotoItem}
                style={styles.listContainer}
                scrollEnabled={false}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <WarningBox text="Aviso: Cada atendimento deve conter no mínimo 3 fotos e no máximo 5 fotos." />
              </View>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F9F7',
    paddingTop: ms(10),
  },
  listContainer: {
    paddingHorizontal: ms(5),
  },
  card: {
    flexDirection: 'row',
    marginVertical: ms(5),
    padding: ms(10),
    backgroundColor: '#ffffffff',
    borderRadius: ms(8),
    elevation: 2,
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
    marginLeft: ms(15),
  },
  brand: {
    color: '#2a9df4',
    fontSize: ms(14),
    fontWeight: 'bold',
  },
  title: {
    fontSize: ms(12),
    fontWeight: 'bold',
    marginVertical: ms(2),
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
  addButton: {
    backgroundColor: '#008346',
    borderRadius: ms(8),
    paddingVertical: ms(12),
    alignItems: 'center',
    width: '100%',
    marginBottom: ms(15),
    marginTop: ms(5),
    elevation: 3,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: ms(14),
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    borderWidth: 1,
    borderColor: '#FFE5B3',
    borderRadius: ms(8),
    padding: ms(12),
    marginBottom: ms(15),
    width: '95%',
    alignSelf: 'center',
  },
  warningIcon: {
    marginRight: ms(10),
  },
  warningText: {
    flex: 1,
    fontSize: ms(12),
    color: '#665A3E',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: ms(10),
  },
  imageModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '90%',
    height: '80%',
  },
  modalCloseButton: {
    position: 'absolute',
    top: ms(50),
    right: ms(20),
    zIndex: ms(10),
    padding: ms(10),
  },
  modalCloseText: {
    color: '#FFF',
    fontSize: ms(16),
    fontWeight: 'bold',
  },
});
