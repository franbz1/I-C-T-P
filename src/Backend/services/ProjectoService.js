// services/projectService.js
import { firestore } from '../../../firebase';
import { collection, Timestamp, doc, addDoc, getDocs, getDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { deleteCollection } from './utils';

// Crear un nuevo proyecto
export const createProject = async (projectData) => {
  try {
    const proyectosCollection = collection(firestore, 'Proyectos');

    // Crear el documento del proyecto sin comentarios
    const docRef = await addDoc(proyectosCollection, {
      Contrato: projectData.contract, // Contrato único
      Nombre: projectData.projectName,
      FechaInicio: Timestamp.fromDate(new Date(projectData.startDate)),
      FechaFin: Timestamp.fromDate(new Date(projectData.endDate)),
      Empleados: projectData.empleados || [],
      Imagen: projectData.imageUrl || '', // Imagen opcional
    });

    console.log('Proyecto creado con éxito.');
    return docRef.id;
  } catch (error) {
    console.error('Error al crear el proyecto: ', error);
    throw error;
  }
};

// Obtener todos los proyectos
export const getAllProjects = async () => {
  try {
    const proyectosCollection = collection(firestore, 'Proyectos');
    const proyectosSnapshot = await getDocs(proyectosCollection);
    const proyectosList = proyectosSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return proyectosList;
  } catch (error) {
    console.error('Error al obtener proyectos: ', error);
    throw error;
  }
};

// Obtener un proyecto por su ID
export const getProjectById = async (projectId) => {
  try {
    const proyectoDoc = doc(firestore, 'Proyectos', projectId);
    const proyectoSnapshot = await getDoc(proyectoDoc);
    if (proyectoSnapshot.exists()) {
      return { id: proyectoSnapshot.id, ...proyectoSnapshot.data() };
    } else {
      throw new Error('Proyecto no encontrado');
    }
  } catch (error) {
    console.error('Error al obtener el proyecto: ', error);
    throw error;
  }
};

// Actualizar un proyecto por su ID
export const updateProject = async (projectId, updatedData) => {
  try {
    const proyectoDoc = doc(firestore, 'Proyectos', projectId);
    await updateDoc(proyectoDoc, {
      Contrato: updatedData.contract,
      Nombre: updatedData.projectName,
      FechaInicio: Timestamp.fromDate(new Date(updatedData.startDate)),
      FechaFin: Timestamp.fromDate(new Date(updatedData.endDate)),
      Imagen: updatedData.imageUrl || '',
    });
    console.log('Proyecto actualizado con éxito.');
  } catch (error) {
    console.error('Error al actualizar el proyecto: ', error);
    throw error;
  }
};

// Eliminar un proyecto por su ID
export const deleteProject = async (projectId) => {
  try {
    const proyectoDoc = doc(firestore, 'Proyectos', projectId);

    // Eliminar subcolecciones relacionadas con el proyecto
    const subcollections = ['EntradaBitacora', 'Informe', 'ComentarioContratista'];
    for (const sub of subcollections) {
      await deleteCollection(`Proyectos/${projectId}/${sub}`);
    }

    // Eliminar el documento del proyecto
    await deleteDoc(proyectoDoc);
    console.log('Proyecto eliminado con éxito.');
  } catch (error) {
    console.error('Error al eliminar el proyecto: ', error);
    throw error;
  }
};

// Obteniendo proyectos en tiempo real
export const subscribeToProjects = (callback) => {
  const projectsCollection = collection(firestore, 'Proyectos');

  // Establecer el listener
  const unsubscribe = onSnapshot(projectsCollection, (snapshot) => {
    const projectsList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(projectsList);
  }, (error) => {
    console.error('Error al obtener proyectos: ', error);
    // Manejar el error si es necesario
  });

  // Retornar la función de desuscripción
  return unsubscribe;
};