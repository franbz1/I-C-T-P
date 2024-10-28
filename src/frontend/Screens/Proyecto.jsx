// screens/Proyecto.js
import React, { useEffect, useState, useMemo } from 'react';
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

const LoadingIndicator = () => (
  <View className="flex-1 justify-center items-center bg-black">
    <ActivityIndicator size="large" color="#FFD700" />
  </View>
);

const NotFoundMessage = () => (
  <View className="flex-1 justify-center items-center bg-black">
    <Text className="text-yellow-400 text-lg">Proyecto no encontrado</Text>
  </View>
);

const ProjectInfo = ({ nombre, contrato, fechaInicio, fechaFin }) => (
  <View>
    <Text className="text-yellow-400 text-2xl font-bold">{nombre}</Text>
    <Text className="text-white mt-1">Número de Contrato: {contrato}</Text>
    <Text className="text-white">
      Desde: {fechaInicio} | Hasta: {fechaFin}
    </Text>
  </View>
);

const ProjectImage = ({ imageUrl }) => (
  <Image
    source={{ uri: imageUrl || 'https://via.placeholder.com/150' }}
    className="mt-2 w-full h-64 rounded-lg"
    resizeMode="cover"
  />
);

export default function Proyecto() {
  const route = useRoute();
  const { id } = route.params;
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const fetchedProject = await getProjectById(id);
        setProject(fetchedProject);
      } catch (error) {
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    return timestamp.toDate().toLocaleDateString();
  };

  const fechaInicio = useMemo(() => formatTimestamp(project?.FechaInicio), [project?.FechaInicio]);
  const fechaFin = useMemo(() => formatTimestamp(project?.FechaFin), [project?.FechaFin]);

  if (loading) return <LoadingIndicator />;
  if (!project) return <NotFoundMessage />;

  return (
    <SafeAreaView className="flex-1 bg-black">
      <BarraOpciones />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-4">
        <View className="space-y-4">
          <ProjectInfo
            nombre={project.Nombre}
            contrato={project.Contrato}
            fechaInicio={fechaInicio}
            fechaFin={fechaFin}
          />
          <ProjectImage imageUrl={project.Imagen} />
          <View className="mt-6 space-y-2">
            <BotonNavegacionProyecto texto="Bitácora" ruta="Bitacora" id={id} />
            <BotonNavegacionProyecto proyecto={project} texto="Informe" ruta="Informe" id={id} />
            <BotonNavegacionProyecto texto="Nómina Proyecto" ruta="NominaProyecto" id={id} />
          </View>
          <Comentarios projectId={id} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
