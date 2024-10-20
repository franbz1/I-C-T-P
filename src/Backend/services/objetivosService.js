import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore'
import { firestore } from '../config/firebase'

// Validación de los datos de un objetivo
const validateObjective = (objective) => {
  if (!objective.title) throw new Error('El título del objetivo es obligatorio')
  if (!objective.description)
    throw new Error('La descripción del objetivo es obligatoria')
  if (typeof objective.resolved !== 'boolean') {
    throw new Error('El estado del objetivo debe ser booleano (true o false)')
  }
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
        Resuelto: objectiveData.resolved,
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
        Resuelto: objectiveData.resolved,
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
}

export default ObjetivosService
