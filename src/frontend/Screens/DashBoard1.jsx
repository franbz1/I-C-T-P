import React, { useEffect, useState } from 'react';
import { Alert, FlatList, ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { deleteProject, subscribeToProjects } from '../../Backend/services/ProjectoService';
import ProjectCard from '../components/Dahsboard1/projectCard';
import AddProjectCard from '../components/Dahsboard1/AddProjectCard';
import ModalCrearProyecto from '../components/Dahsboard1/ModalCrearProyecto';
import BarraOpciones from '../components/BarraOpciones';

export default function DashBoard1() {
  const [projects, setProjects] = useState([]);
  const [isProjectModalVisible, setIsProjectModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToProjects((projectsData) => {
      setProjects(projectsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDeleteProject = async (projectId) => {
    try {
      await deleteProject(projectId);
    } catch {
      Alert.alert('Error', 'No se pudo eliminar el proyecto.');
    }
  };

  const handleAddProject = (newProject) => setProjects(prevProjects => [...prevProjects, newProject]);

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
