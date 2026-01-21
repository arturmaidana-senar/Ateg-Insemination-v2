import { useState, useEffect } from 'react';
import { Platform, PermissionsAndroid, Alert, Linking } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import Toast from 'react-native-toast-message';
import GetLocation from 'react-native-get-location';
import {
  getLoadImages,
  saveImage,
  deleteImage,
} from '../../../database/modelImage';
import { dateInteger } from '../../../utils/date';

export function usePhotoHandler(scheduleId, isHaveAttendence) {
  const [images, setImages] = useState([]);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);

  const loadImages = () => {
    getLoadImages(setImages, scheduleId);
  };

  useEffect(() => {
    loadImages();
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    if (Platform.OS === 'android') {
      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      setHasCameraPermission(hasPermission);
      return hasPermission;
    }
    // No iOS, assumimos true inicialmente, o launchCamera pedirá se necessário
    // ou o usuário já deu permissão.
    setHasCameraPermission(true);
    return true;
  };

  const requestAndroidPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Permissão da Câmera',
          message:
            'Este aplicativo precisa acessar sua câmera para tirar fotos.',
          buttonPositive: 'OK',
        },
      );
      const isGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
      setHasCameraPermission(isGranted);
      return isGranted;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const handleTakePhoto = async () => {
    if (images.length >= 5 || (images.length >= 1 && isHaveAttendence)) {
      return Toast.show({ type: 'info', text1: 'Limite de fotos atingido!' });
    }

    // Verifica permissão no Android explicitamente
    if (Platform.OS === 'android') {
      const hasPerm = await checkPermissions();
      if (!hasPerm) {
        const granted = await requestAndroidPermission();
        if (!granted) return;
      }
    }

    setPhotoLoading(true);

    // Pega Localização antes de abrir a câmera
    GetLocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 60000 })
      .then(location => {
        captureImage(location.latitude, location.longitude);
      })
      .catch(error => {
        setPhotoLoading(false);
        console.log('Erro GPS:', error);

        // No iOS, às vezes o GPS demora ou precisa de permissão também
        Alert.alert(
          'Erro de Localização',
          'Não foi possível obter sua localização. Verifique se o GPS está ativado.',
          [{ text: 'OK' }],
        );
      });
  };

  const captureImage = (lat, long) => {
    const options = {
      mediaType: 'photo',
      maxWidth: 800,
      maxHeight: 800,
      quality: 0.8,
      saveToPhotos: false, // No iOS isso evita pedir permissão extra de "Add to Library" se não for necessário
      cameraType: 'back',
    };

    launchCamera(options, async response => {
      setPhotoLoading(false);

      if (response.didCancel) {
        return;
      } else if (response.errorCode) {
        // Tratamento específico de erros de permissão no iOS
        if (response.errorCode === 'permission') {
          Alert.alert(
            'Permissão Negada',
            'Você precisa permitir o acesso à câmera nas configurações do iPhone.',
            [
              { text: 'Cancelar' },
              {
                text: 'Abrir Configurações',
                onPress: () => Linking.openSettings(),
              },
            ],
          );
        } else {
          Toast.show({
            type: 'error',
            text1: 'Erro na câmera',
            text2: response.errorMessage,
          });
        }
        return;
      }

      try {
        const asset = response.assets[0];
        const tempUri = asset.uri;

        // Correção crítica para iOS: fileName às vezes vem null
        const originalFileName = asset.fileName || `photo_${Date.now()}.jpg`;
        const fileName = `${scheduleId}_${dateInteger()}.jpg`;

        const destPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
        // No iOS, file:// já vem no URI normalmente, mas para o DB precisa ser consistente
        const finalPath = `file://${destPath}`;

        // No iOS, o tempUri já pode ser usado diretamente, mas vamos mover para garantir persistência
        if (await RNFS.exists(tempUri)) {
          // copyFile é mais seguro que moveFile no iOS entre diretórios temporários e document
          await RNFS.copyFile(tempUri, destPath);

          // Opcional: deletar o original temp se quiser economizar espaço, mas o SO limpa depois
          // await RNFS.unlink(tempUri).catch(() => {});

          saveImage(scheduleId, lat, long, fileName, finalPath, loadImages);
        } else {
          // Fallback se o arquivo não for encontrado (raro)
          Toast.show({
            type: 'error',
            text1: 'Erro',
            text2: 'Arquivo de foto não encontrado.',
          });
        }
      } catch (err) {
        console.log('Erro salvar foto:', err);
        Toast.show({
          type: 'error',
          text1: 'Erro ao salvar foto',
          text2: err.message,
        });
      }
    });
  };

  const handleDeleteImage = id => {
    Alert.alert('Excluir', 'Deseja excluir esta imagem?', [
      { text: 'Cancelar' },
      { text: 'OK', onPress: () => deleteImage(id, loadImages) },
    ]);
  };

  return {
    images,
    hasCameraPermission,
    photoLoading,
    handleTakePhoto,
    handleDeleteImage,
  };
}
