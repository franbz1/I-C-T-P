import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  View,
  TextInput,
  Alert,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createBitacoraEntry } from '../../Backend/services/BitacoraService';
import { getEmpleadosByProyecto, getEmpleadoById } from '../../Backend/services/Empleado';
import { styled } from 'nativewind';
import ModalListaEmpleados from '../components/Nomina/ModalListaEmpleados';
import BarraOpciones from '../components/BarraOpciones';
import useImageUpload from '../Hooks/useImageUpload';

const Container = styled(View);
const StyledTextInput = styled(TextInput);
const StyledText = styled(Text);

export default function FormularioBitacora() {
  const [detalles, setDetalles] = useState('');
  const [idsEmpleadosSeleccionados, setIdsEmpleadosSeleccionados] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [fotos, setFotos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;

  const { pickImageFromGallery, takePhotoWithCamera, handleUploadImage, uploading } = useImageUpload();

  const handleSave = useCallback(async () => {
    if (!detalles || idsEmpleadosSeleccionados.length === 0) {
      Alert.alert('Error', 'Todos los campos son requeridos');
      return;
    }

    try {
      await createBitacoraEntry(id, {
        fecha: new Date(),
        detalles,
        fotos,
        empleados: idsEmpleadosSeleccionados,
      });
      Alert.alert('Éxito', 'Entrada creada correctamente');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear la entrada');
    }
  }, [detalles, idsEmpleadosSeleccionados, fotos, id, navigation]);

  const fetchEmpleadosProyecto = useCallback(async () => {
    try {
      const empleadosData = await getEmpleadosByProyecto(id);
      setEmpleados(empleadosData);
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener la lista de empleados del proyecto');
    }
  }, [id]);

  const handleOpenModal = useCallback(() => {
    if (empleados.length === 0) fetchEmpleadosProyecto();
    setModalVisible(true);
  }, [empleados.length, fetchEmpleadosProyecto]);

  const handleConfirmSelection = useCallback((selectedEmpleados) => {
    setIdsEmpleadosSeleccionados(selectedEmpleados);
    setModalVisible(false);
  }, []);

  const handleSelectImage = useCallback(() => {
    Alert.alert(
      'Subir Imagen',
      'Elige una opción',
      [
        {
          text: 'Galería',
          onPress: async () => {
            const uri = await pickImageFromGallery();
            if (uri) {
              const uploadedUri = await handleUploadImage(uri);
              setFotos((prevFotos) => [...prevFotos, uploadedUri]);
            }
          },
        },
        {
          text: 'Cámara',
          onPress: async () => {
            const uri = await takePhotoWithCamera();
            if (uri) {
              const uploadedUri = await handleUploadImage(uri);
              setFotos((prevFotos) => [...prevFotos, uploadedUri]);
            }
          },
        },
        { text: 'Cancelar', style: 'cancel' },
      ],
      { cancelable: true }
    );
  }, [handleUploadImage, pickImageFromGallery, takePhotoWithCamera]);

  const empleadosSeleccionados = useMemo(() => {
    return empleados.filter((emp) => idsEmpleadosSeleccionados.includes(emp.id));
  }, [empleados, idsEmpleadosSeleccionados]);

  return (
    <SafeAreaView className="flex-1 bg-black">
      <BarraOpciones />
      <ScrollView className="p-4">
        <StyledText className="text-xl text-yellow-400 font-semibold mb-4">
          Crear Entrada de Bitácora
        </StyledText>

        {/* Detalles */}
        <StyledText className="text-white">Detalles de la bitácora:</StyledText>
        <Container className="mb-4">
          <StyledTextInput
            value={detalles}
            onChangeText={setDetalles}
            placeholder="Escribe los detalles"
            placeholderTextColor="#facc15"
            multiline
            numberOfLines={10}
            className="text-white border-b border-yellow-400 p-2"
            style={{ height: 150, verticalAlign: 'top' }}
          />
        </Container>

        {/* Empleados */}
        <StyledText className="text-white">Empleados en el día de hoy</StyledText>
        <TouchableOpacity
          onPress={handleOpenModal}
          className="bg-black rounded-full mb-4 active:opacity-70"
        >
          <Text className="text-left border-b border-yellow-400 text-yellow-400 p-2">
            Seleccionar empleados
          </Text>
        </TouchableOpacity>

        {/* Mostrar empleados seleccionados */}
        {empleadosSeleccionados.length > 0 && (
          <View className="mb-4">
            <StyledText className="text-white">Empleados seleccionados:</StyledText>
            {empleadosSeleccionados.map((empleado) => (
              <StyledText key={empleado.id} className="p-2 text-yellow-400">
                {empleado.Nombres} {empleado.Apellidos}
              </StyledText>
            ))}
          </View>
        )}

        {/* Fotos */}
        <StyledText className="text-white">Fotos del trabajo realizado</StyledText>
        <TouchableOpacity
          onPress={handleSelectImage}
          disabled={uploading}
          className="bg-black rounded-full mb-10 active:opacity-70"
        >
          <Text className="text-left border-b border-yellow-400 text-yellow-400 p-2">
            {uploading ? 'Subiendo imagen...' : 'Seleccionar fotos'}
          </Text>
        </TouchableOpacity>

        {/* Mostrar fotos seleccionadas */}
        {fotos.length > 0 && (
          <View className="mb-4">
            <StyledText className="text-white">Fotos seleccionadas:</StyledText>
            {fotos.map((fotoUri, index) => (
              <Image
                key={index}
                source={{ uri: fotoUri }}
                style={{ width: 100, height: 100 }}
                className="mb-2"
              />
            ))}
          </View>
        )}

        {/* Botón Guardar */}
        <TouchableOpacity
          onPress={handleSave}
          className="bg-yellow-400 p-4 rounded-full mb-10 active:opacity-70"
        >
          <Text className="text-center text-black font-bold">Guardar</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal para seleccionar empleados */}
      <ModalListaEmpleados
        visible={modalVisible}
        empleados={empleados}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirmSelection}
      />
    </SafeAreaView>
  );
}
