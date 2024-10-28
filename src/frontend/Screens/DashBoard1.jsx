import React, { useEffect, useState } from 'react';
import { Alert, FlatList, ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { deleteProject, getAllProjects } from '../../Backend/services/ProjectoService'; // Cambia a getAllProjects
import ProjectCard from '../components/Dahsboard1/projectCard';
import AddProjectCard from '../components/Dahsboard1/AddProjectCard';
import ModalCrearProyecto from '../components/Dahsboard1/ModalCrearProyecto';
import BarraOpciones from '../components/BarraOpciones';

export default function DashBoard1() {
  const [projects, setProjects] = useState([]);
  const [isProjectModalVisible, setIsProjectModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const projectsData = await getAllProjects();
      setProjects(projectsData);
    } catch (error) {
      console.error("Error al obtener proyectos:", error);
      Alert.alert('Error', 'No se pudo cargar los proyectos.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await deleteProject(projectId);
      setProjects(prevProjects => prevProjects.filter(project => project.id !== projectId));
    } catch {
      Alert.alert('Error', 'No se pudo eliminar el proyecto.');
    }
  };

  const handleAddProject = (newProject) => {
    setProjects(prevProjects => [...prevProjects, newProject])
    fetchProjects();
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <BarraOpciones />
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FFC107" />
        </View>
      ) : (
        <FlatList
          data={[...projects, { id: 'add', name: 'Añadir Proyecto' }]}
          renderItem={({ item }) =>
            item.id === 'add' ? (
              <AddProjectCard onAdd={() => setIsProjectModalVisible(true)} />
            ) : (
              <ProjectCard project={item} onDelete={handleDeleteProject} />
            )
          }
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 8 }}
        />
      )}
      <ModalCrearProyecto
        visible={isProjectModalVisible}
        onClose={() => setIsProjectModalVisible(false)}
        onProjectAdded={handleAddProject}
      />
    </SafeAreaView>
  );
}
