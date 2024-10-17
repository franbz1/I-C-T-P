// screens/Proyecto.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getProjectById } from '../../Backend/services/ProjectoService';
import BarraOpciones from '../components/BarraOpciones';
import BotonNavegacionProyecto from '../components/Proyecto/BotonNavegacionProyecto';
import Comentarios from '../components/Proyecto/Comentarios';

export default function Proyecto() {
  const route = useRoute();
  const { id } = route.params;
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        await fetchProject();
      } catch (error) {
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [id]);

  const fetchProject = async () => {
    const fetchedProject = await getProjectById(id);
    setProject(fetchedProject);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate(); // Firestore Timestamp tiene el método toDate()
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <View className='flex-1 justify-center items-center bg-black'>
        <ActivityIndicator
          size='large'
          color='#FFD700'
        />
      </View>
    );
  }

  if (!project) {
    return (
      <View className='flex-1 justify-center items-center bg-black'>
        <Text className='text-yellow-400 text-lg'>Proyecto no encontrado</Text>
      </View>
    );
  }


  return (
    <SafeAreaView className='flex-1 bg-black'>
      <BarraOpciones />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className='p-4'
      >
        <View className='space-y-4'>
          {/* Información del Proyecto */}
          <View>
            <Text className='text-yellow-400 text-2xl font-bold'>
              {project.Nombre}
            </Text>
            <Text className='text-white mt-1'>
              Número de Contrato: {project.Contrato}
            </Text>
            <Text className='text-white'>
              Desde: {formatTimestamp(project.FechaInicio)} | Hasta: {formatTimestamp(project.FechaFin)}
            </Text>
          </View>

          {/* Imagen del Proyecto */}
          <Image
            source={{
              uri: project.Imagen || 'https://via.placeholder.com/150',
            }}
            className='w-full h-64 rounded-lg'
            resizeMode='cover'
          />

          {/* Botones de navegación */}
          <View className='mt-6 space-y-2'>
            <BotonNavegacionProyecto texto='Bitácora' ruta='Bitacora' id={id} />
            <BotonNavegacionProyecto texto='Informe' ruta='Informe' id={id} />
            <BotonNavegacionProyecto texto='Nómina Proyecto' ruta='NominaProyecto' id={id} />
          </View>

          {/* Sección de comentarios */}
          <Comentarios projectId={id} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
