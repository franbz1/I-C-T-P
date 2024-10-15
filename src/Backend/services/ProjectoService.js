//services\ProjectoService.js
import { firestore } from '../../../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { deleteCollection } from "./utils";

// Crear proyecto y subcolecciones (bitácora e informe)
export const createProject = async (projectData) => {
  try {
      const projectsCollection = collection(firestore, 'projects');
      
      // Asignar un enlace placeholder si no se proporciona imageUrl
      const imageUrl = projectData.imageUrl ?? 'https://via.placeholder.com/150';
      
      const docRef = await addDoc(projectsCollection, {
          contractNumber: projectData.contractNumber,
          projectName: projectData.projectName,
          startDate: Timestamp.fromDate(new Date(projectData.startDate)),
          endDate: Timestamp.fromDate(new Date(projectData.endDate)),
          imageUrl: imageUrl, // Enlace por defecto si está vacío o no definido
      });

      // Crear subcolecciones para bitácora e informe dentro de projects
      const bitacoraCollection = collection(firestore, `projects/${docRef.id}/bitacora`);
      const informeCollection = collection(firestore, `projects/${docRef.id}/informe`);

      // Inicializar documentos predeterminados en bitácora con fecha y detalles
      await addDoc(bitacoraCollection, {
          fecha: Timestamp.fromDate(new Date()), // Fecha actual
          detalles: 'Bitácora inicializada' // Detalles iniciales
      });

      // Inicializar documentos predeterminados en informe con fecha y detalles
      await addDoc(informeCollection, {
          fecha: Timestamp.fromDate(new Date()), // Fecha actual
          detalles: 'Informe inicializado' // Detalles iniciales
      });

      return docRef.id;
  } catch (error) {
      console.error("Error al crear el proyecto: ", error);
      throw error;
  }
};

// Crear un registro en la colección independiente de nómina
export const createNomina = async (nominaData) => {
  try {
      const nominaCollection = collection(firestore, 'nomina');
      
      // Añadir el registro de nómina con todos los campos necesarios
      const docRef = await addDoc(nominaCollection, {
          nombre: nominaData.nombre || 'Nombre predeterminado',
          apellidos: nominaData.apellidos || 'Apellidos predeterminados',
          correo: nominaData.correo || 'correo@example.com',
          telefono: nominaData.telefono || '000-000-0000',
          direccion: nominaData.direccion || 'Dirección predeterminada',
          eps: nominaData.eps || 'EPS predeterminado',
          contrasena: nominaData.contrasena || 'contraseña123',
          cargo: nominaData.cargo || 'Cargo predeterminado',
      });

      return docRef.id;
  } catch (error) {
      console.error("Error al crear la nómina: ", error);
      throw error;
  }
};

// Obtener todos los proyectos
export const getAllProjects = async () => {
  try {
      const projectsCollection = collection(firestore, 'projects');
      const projectSnapshot = await getDocs(projectsCollection);
      const projectsList = projectSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return projectsList;
  } catch (error) {
      console.error("Error al obtener proyectos: ", error);
      throw error;
  }
};

// Obtener todos los registros de nómina
export const getAllNomina = async () => {
  try {
      const nominaCollection = collection(firestore, 'nomina');
      const nominaSnapshot = await getDocs(nominaCollection);
      const nominaList = nominaSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return nominaList;
  } catch (error) {
      console.error("Error al obtener la nómina: ", error);
      throw error;
  }
};

// Obtener un proyecto específico por ID
export const getProjectById = async (projectId) => {
  try {
      const projectDoc = doc(firestore, 'projects', projectId);
      const projectSnapshot = await getDoc(projectDoc);
      if (projectSnapshot.exists()) {
          return { id: projectSnapshot.id, ...projectSnapshot.data() };
      } else {
          throw new Error("Proyecto no encontrado");
      }
  } catch (error) {
      console.error("Error al obtener el proyecto: ", error);
      throw error;
  }
};

// Actualiza un proyecto por su ID
export const updateProject = async (projectId, updatedData) => {
  try {
      const projectDoc = doc(firestore, 'projects', projectId);
      await updateDoc(projectDoc, {
          contractNumber: updatedData.contractNumber,
          projectName: updatedData.projectName,
          startDate: Timestamp.fromDate(new Date(updatedData.startDate)),
          endDate: Timestamp.fromDate(new Date(updatedData.endDate)),
          imageUrl: updatedData.imageUrl || '',
      });
  } catch (error) {
      console.error("Error al actualizar el proyecto: ", error);
      throw error;
  }
};

// Elimina un proyecto por su ID
export const deleteProject = async (projectId) => {
  try {
      const projectDoc = doc(firestore, 'projects', projectId);

      // Eliminar subcolecciones (bitacora e informe)
      const subcollections = ['bitacora', 'informe'];
      for (const sub of subcollections) {
          await deleteCollection(`projects/${projectId}/${sub}`);
      }

      // Eliminar el documento del proyecto
      await deleteDoc(projectDoc);
  } catch (error) {
      console.error("Error al eliminar el proyecto: ", error);
      throw error;
  }
};

