import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
} from 'firebase/firestore'
import { firestore } from '../../../firebase'

// Validación de los datos de un objetivo
const validateObjective = (objective) => {
  if (!objective.title) throw new Error('El título del objetivo es obligatorio')
  if (!objective.description)
    throw new Error('La descripción del objetivo es obligatoria')
}

class ObjetivosService {
  constructor(projectId, informeId) {
    this.objectivesCollection = collection(
      firestore,
      `Proyectos/${projectId}/Informe/${informeId}/Objetivos`
    )
  }

  // Crear un nuevo objetivo
  async createObjective(objectiveData) {
    try {
      // Validar los datos del objetivo antes de continuar
      validateObjective(objectiveData)

      const docRef = await addDoc(this.objectivesCollection, {
        Titulo: objectiveData.title,
        Descripcion: objectiveData.description,
        Completado: objectiveData.completed,
      })

      return { success: true, id: docRef.id } // Retornar el ID del objetivo creado
    } catch (error) {
      console.error('Error al crear el objetivo:', error.message)
      throw new Error(
        'No se pudo crear el objetivo, por favor intente nuevamente.'
      )
    }
  }

  // Actualizar un objetivo
  async updateObjective(objectiveId, objectiveData) {
    try {
      // Validar los datos del objetivo antes de continuar
      validateObjective(objectiveData)

      const docRef = doc(this.objectivesCollection, objectiveId)
      await updateDoc(docRef, {
        Titulo: objectiveData.title,
        Descripcion: objectiveData.description,
        Completado: objectiveData.completed,
      })

      return { success: true, id: objectiveId } // Retornar el ID del objetivo actualizado
    } catch (error) {
      console.error('Error al actualizar el objetivo:', error.message)
      throw new Error(
        'No se pudo actualizar el objetivo, por favor intente nuevamente.'
      )
    }
  }

  // Eliminar un objetivo
  async deleteObjective(objectiveId) {
    try {
      const docRef = doc(this.objectivesCollection, objectiveId)
      await deleteDoc(docRef)
      return { success: true, id: objectiveId }
    } catch (error) {
      console.error('Error al eliminar el objetivo:', error.message)
      throw new Error(
        'No se pudo eliminar el objetivo, por favor intente nuevamente.'
      )
    }
  }

  async getObjectives(projectId, informeId) {
    try {
      const objetivosCollection = collection(firestore, `Proyectos/${projectId}/informe/${informeId}/Objetivos`);
      const objetivosSnapshot = await getDocs(objetivosCollection);
      const objetivosList = objetivosSnapshot.docs.map(doc => ({
        ObjetivoID: doc.id,
        ProyectoID: projectId,
        ...doc.data(),
      }));
      
      return objetivosList;
    } catch (error) {
      console.error('Error al obtener los objetivos:', error);
      throw new Error('No se pudieron obtener los objetivos');
    }
  }
}

export const getObjetivoById = async (projectId, informeId, objetivoId) => {
  try {
    const objetivoDoc = doc(firestore, `Proyectos/${projectId}/informe/${informeId}/Objetivos`, objetivoId);
    const objetivoSnapshot = await getDoc(objetivoDoc);
    
    if (!objetivoSnapshot.exists()) {
      throw new Error('Objetivo no encontrado');
    }

    return { ObjetivoID: objetivoSnapshot.id, ProyectoID: projectId, ...objetivoSnapshot.data() };
  } catch (error) {
    console.error('Error al obtener el objetivo:', error);
    throw new Error('No se pudo obtener el objetivo');
  }
};

export default ObjetivosService
