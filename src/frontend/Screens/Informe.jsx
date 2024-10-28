import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  ScrollView,
  Pressable,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  createInforme,
  validateInformeData,
  getAllInformes,
} from '../../Backend/services/InformeService';
import { getProjectById } from '../../Backend/services/ProjectoService';
import BarraOpciones from '../components/BarraOpciones';
import InformeEntry from '../components/informe/InformeEntry';
import BotonEditInforme from '../components/informe/BotonEditInforme';

export default function Informe() {
  const { id, proyecto } = useRoute().params;
  const navigation = useNavigation();
  
  const [informe, setInforme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Función para cargar el informe del proyecto
  const fetchInformeData = useCallback(async () => {
    try {
      const fetchedInforme = await getAllInformes(id);
      setInforme(fetchedInforme.data[0]);
    } catch {
      Alert.alert('Error', 'No se pudo obtener el informe de este proyecto.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Crear el informe inicial con datos del proyecto
  const handleCreateInforme = async () => {
    setLoading(true);
    try {
      const Proyecto = await getProjectById(id);
      const informeData = {
        projectName: Proyecto.Nombre,
        contract: Proyecto.Contrato,
        startDate: Proyecto.FechaInicio,
        endDate: Proyecto.FechaFin,
        fotoPrincipal: Proyecto.Imagen,
        introduction: '',
        desarrollo: '',
        budget: 0,
        state: 0,
        fotos: [],
        nominations: Proyecto.Empleados,
        contractors: [],
      };

      validateInformeData(informeData);
      await createInforme(id, informeData);
      Alert.alert('Éxito', 'Informe creado con éxito');
      await fetchInformeData();
    } catch (error) {
      const errorMessage = error.message === '12'
        ? 'La nómina es obligatoria y debe contener al menos un empleado. Por favor asigna un empleado a este proyecto.'
        : 'Error al crear el informe.';

      Alert.alert('Error', errorMessage);
      if (error.message === '12') navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  // Cargar informe al montar el componente
  useEffect(() => {
    fetchInformeData();
  }, [fetchInformeData]);

  const handleToggleEditMode = () => setIsEditing((prev) => !prev);

  // Retorno condicional para los estados de carga e informe no creado
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <BarraOpciones />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FFD700" />
        </View>
      </SafeAreaView>
    );
  }

  if (!informe) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <BarraOpciones />
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 justify-center items-center">
            <Text className="text-yellow-400 text-lg">
              El informe aún no ha sido creado
            </Text>
            <Pressable
              className="bg-yellow-400 rounded-lg p-2 mt-4"
              onPress={handleCreateInforme}
            >
              <Text className="text-white text-center">Crear Informe</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <BarraOpciones />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-2">
        <View className="space-y-4">
          <InformeEntry proyecto={proyecto} id={id} informe={informe} isEditing={isEditing} />
        </View>
      </ScrollView>
      <BotonEditInforme CambioEditando={handleToggleEditMode} />
    </SafeAreaView>
  );
}
