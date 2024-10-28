import React, { useEffect, useState } from 'react';
import { Alert, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { deleteProject, subscribeToProjects } from '../../Backend/services/ProjectoService';
import ProjectCard from '../components/Dahsboard1/projectCard';
import AddProjectCard from '../components/Dahsboard1/AddProjectCard';
import ModalCrearProyecto from '../components/Dahsboard1/ModalCrearProyecto';
import BarraOpciones from '../components/BarraOpciones';

export default function DashBoard1() {
  const [projects, setProjects] = useState([]);
  const [isProjectModalVisible, setIsProjectModalVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToProjects(setProjects);
    return () => unsubscribe();
  }, []);

  const handleDeleteProject = async (projectId) => {
    try {
      await deleteProject(projectId);
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar el proyecto.');
    }
  };

  const handleAddProject = (project) => {
    setProjects(prevProjects => [...prevProjects, project]);
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <BarraOpciones />
      <FlatList
        data={[...projects, { id: 'add', name: 'Añadir Proyecto' }]}
        renderItem={({ item }) =>
          item.id === 'add' ? (
            <AddProjectCard onAdd={() => setIsProjectModalVisible(true)} />
          ) : (
            <ProjectCard project={item} onDelete={handleDeleteProject} />
          )
        }
        keyExtractor={(item) => item.id}
        numColumns={2}
      />
      <ModalCrearProyecto
        visible={isProjectModalVisible}
        onClose={() => setIsProjectModalVisible(false)}
        onProjectAdded={handleAddProject}
      />
    </SafeAreaView>
  );
}