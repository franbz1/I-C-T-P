import React, { useEffect, useState } from 'react';
import { Alert, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAllProjects, deleteProject, createProject, subscribeToProjects } from '../../Backend/services/ProjectoService';
import ProjectCard from '../components/Dahsboard1/projectCard';
import AddProjectCard from '../components/Dahsboard1/AddProjectCard';
import ModalCrearProyecto from '../components/Dahsboard1/ModalCrearProyecto';
import BarraOpciones from '../components/BarraOpciones';

export default function DashBoard1() {
  const [projects, setProjects] = useState([]);
  const [isProjectModalVisible, setIsProjectModalVisible] = useState(false);

  const loadTestData = async () => {
    const testProjects = [
      {
        projectName: 'Proyecto A',
        contract: '12345',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        imageUrl: 'https://via.placeholder.com/150',
      },
      {
        projectName: 'Proyecto B',
        contract: '67890',
        startDate: '2024-02-01',
        endDate: '2024-11-30',
        imageUrl: 'https://via.placeholder.com/150',
      },
      {
        projectName: 'Proyecto C',
        contract: '54321',
        startDate: '2024-03-01',
        endDate: '2024-10-31',
        imageUrl: 'https://via.placeholder.com/150',
      },
      {
        projectName: 'Proyecto D',
        contract: '98765',
        startDate: '2024-04-01',
        endDate: '2024-09-30',
        imageUrl: 'https://via.placeholder.com/150',
      },
    ];

    try {
      // Crear cada proyecto en Firestore
      for (const project of testProjects) {
        const projectId = await createProject(project);
        console.log(`Proyecto ${project.projectName} creado con ID: ${projectId}`);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'No se pudieron crear los proyectos de prueba.');
    }
  };

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
      <BarraOpciones btnDev={loadTestData} />
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
