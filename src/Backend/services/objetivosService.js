import { collection, addDoc, doc, updateDoc, deleteDoc, getDocs, onSnapshot } from 'firebase/firestore';
import { firestore } from '../../../firebase';

// Validar los datos del objetivo
const validateObjective = (objective) => {
  if (!objective.Titulo) throw new Error('El título del objetivo es obligatorio');
  if (!objective.Descripcion) throw new Error('La descripción del objetivo es obligatoria');
};

// Crear un nuevo objetivo
export const createObjective = async (projectId, informeId, objectiveData) => {
  try {
    validateObjective(objectiveData);

    const objectivesCollection = collection(firestore, `Proyectos/${projectId}/Informe/${informeId}/Objetivos`);
    const docRef = await addDoc(objectivesCollection, { ...objectiveData });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error al crear el objetivo:', error);
    throw new Error('No se pudo crear el objetivo');
  }
};

// Actualizar un objetivo
export const updateObjective = async (projectId, informeId, objectiveId, objectiveData) => {
  try {
    validateObjective(objectiveData);

    const docRef = doc(firestore, `Proyectos/${projectId}/Informe/${informeId}/Objetivos`, objectiveId);
    await updateDoc(docRef, { ...objectiveData });

    return { success: true, id: objectiveId };
  } catch (error) {
    console.error('Error al actualizar el objetivo:', error);
    throw new Error('No se pudo actualizar el objetivo');
  }
};

// Eliminar un objetivo
export const deleteObjective = async (projectId, informeId, objectiveId) => {
  try {
    const docRef = doc(firestore, `Proyectos/${projectId}/Informe/${informeId}/Objetivos`, objectiveId);
    await deleteDoc(docRef);
    return { success: true, id: objectiveId };
  } catch (error) {
    console.error('Error al eliminar el objetivo:', error);
    throw new Error('No se pudo eliminar el objetivo');
  }
};

// Suscribirse a los objetivos en tiempo real
export const subscribeToObjectives = (projectId, informeId, callback) => {
  const objectivesCollection = collection(firestore, `Proyectos/${projectId}/Informe/${informeId}/Objetivos`);
  
  const unsubscribe = onSnapshot(objectivesCollection, (snapshot) => {
    const objectivesList = snapshot.docs.map((doc) => ({
      ObjetivoID: doc.id,
      ProyectoID: projectId,
      ...doc.data(),
    }));
    callback(objectivesList);
  }, (error) => {
    console.error('Error al obtener los objetivos en tiempo real:', error);
  });

  return unsubscribe;
};
