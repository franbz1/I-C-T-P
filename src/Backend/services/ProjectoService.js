// services/projectService.js
import { firestore } from '../../../firebase'
import { collection, Timestamp, doc, addDoc, getDocs, getDoc, updateDoc,deleteDoc } from 'firebase/firestore'
import { deleteCollection } from './utils'

export const createProject = async (projectData) => {
  try {
    const projectsCollection = collection(firestore, 'projects')

    // Crear el documento del proyecto sin los comentarios (solo los datos principales)
    const docRef = await addDoc(projectsCollection, {
      contractNumber: projectData.contractNumber,
      projectName: projectData.projectName,
      startDate: Timestamp.fromDate(new Date(projectData.startDate)),
      endDate: Timestamp.fromDate(new Date(projectData.endDate)),
      imageUrl: projectData.imageUrl || '', // Usar el link por defecto si está vacío o no definido
    })

    // Ahora que tienes el ID del proyecto, puedes agregar la subcolección 'comentarios'
    const comentariosCollection = collection(firestore, `projects/${docRef.id}/comentarios`)

    // Puedes inicializar la subcolección con un comentario de ejemplo o dejarla vacía
    await addDoc(comentariosCollection, {
      titulo: 'Comentario inicial',
      cuerpo: 'Este es un comentario inicial de prueba',
      resuelto: false,
    })

    console.log('Proyecto creado con éxito y subcolección de comentarios inicializada.')
    return docRef.id
  } catch (error) {
    console.error('Error al crear el proyecto: ', error)
    throw error
  }
}


// Obtener todos los proyectos
export const getAllProjects = async () => {
  try {
    const projectsCollection = collection(firestore, 'projects')
    const projectSnapshot = await getDocs(projectsCollection)
    const projectsList = projectSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    return projectsList
  } catch (error) {
    console.error('Error al obtener proyectos: ', error)
    throw error
  }
}

// Obtener un proyecto específico por ID
export const getProjectById = async (projectId) => {
  try {
    const projectDoc = doc(firestore, 'projects', projectId)
    const projectSnapshot = await getDoc(projectDoc)
    if (projectSnapshot.exists()) {
      return { id: projectSnapshot.id, ...projectSnapshot.data() }
    } else {
      throw new Error('Proyecto no encontrado')
    }
  } catch (error) {
    console.error('Error al obtener el proyecto: ', error)
    throw error
  }
}

//Actualiza un proyecto por su ID
export const updateProject = async (projectId, updatedData) => {
  try {
    const projectDoc = doc(firestore, 'projects', projectId)
    await updateDoc(projectDoc, {
      contractNumber: updatedData.contractNumber,
      projectName: updatedData.projectName,
      startDate: Timestamp.fromDate(new Date(updatedData.startDate)),
      endDate: Timestamp.fromDate(new Date(updatedData.endDate)),
      imageUrl: updatedData.imageUrl || '',
    })
  } catch (error) {
    console.error('Error al actualizar el proyecto: ', error)
    throw error
  }
}

//Elimina un proyecto por su ID
export const deleteProject = async (projectId) => {
  try {
    const projectDoc = doc(firestore, 'projects', projectId)

    // Eliminar subcolecciones (bitacora, informe, nomina)
    const subcollections = ['bitacora', 'informe', 'nomina']
    for (const sub of subcollections) {
      await deleteCollection(`projects/${projectId}/${sub}`)
    }

    // Eliminar el documento del proyecto
    await deleteDoc(projectDoc)
  } catch (error) {
    console.error('Error al eliminar el proyecto: ', error)
    throw error
  }
}
