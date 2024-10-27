// hooks/useImageUpload.js
import { useState } from 'react';
import { launchCameraAsync, launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker';
import { Alert } from 'react-native';
import { uploadImage } from '../../Backend/services/utils'; // La función que ya tienes

const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [uriUploaded, setUriUploaded] = useState(null);

  // Seleccionar imagen desde la galería
  const pickImageFromGallery = async () => {
    const result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      return result.assets[0].uri;
    }
    return null;
  };

  // Tomar una foto con la cámara
  const takePhotoWithCamera = async () => {
    const result = await launchCameraAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      return result.assets[0].uri;
    }
    return null;
  };

  // Subir la imagen a Firebase Storage
  const handleUploadImage = async (uri) => {
    if (!uri) return;
    setUploading(true);
    try {
      const url = await uploadImage(uri);
      Alert.alert('Éxito', 'Imagen subida correctamente');
      return url; // Retornar la URL de descarga
    } catch (error) {
      Alert.alert('Error', 'No se pudo subir la imagen');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSelectImage = () => {
    return new Promise((resolve) => {
      Alert.alert(
        'Subir Imagen',
        'Elige una opción',
        [
          {
            text: 'Galería',
            onPress: async () => {
              const uri = await pickImageFromGallery();
              const uriUploaded = await handleUploadImage(uri);
              resolve(uriUploaded); // Retorna la URL subida
            },
          },
          {
            text: 'Cámara',
            onPress: async () => {
              const uri = await takePhotoWithCamera();
              const uriUploaded = await handleUploadImage(uri);
              resolve(uriUploaded); // Retorna la URL subida
            },
          },
          { text: 'Cancelar', style: 'cancel', onPress: () => resolve(null) },
        ],
        { cancelable: true }
      );
    });
  };
  

  return {
    imageUri,
    uploading,
    pickImageFromGallery,
    takePhotoWithCamera,
    handleUploadImage,
    handleSelectImage,
    uriUploaded,
  };
};

export default useImageUpload;
