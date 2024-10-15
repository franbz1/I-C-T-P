import { firestore } from '../../../firebase'
import { collection, doc, addDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore'

// Obtener todos los comentarios de un proyecto
export const getCommentsByProjectId = async (projectId) => {
  try {
    const commentsCollection = collection(firestore, `projects/${projectId}/comentarios`)
    const commentsSnapshot = await getDocs(commentsCollection)
    const commentsList = commentsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    return commentsList
  } catch (error) {
    console.error('Error al obtener comentarios: ', error)
    throw error
  }
}

// Actualizar un comentario específico
export const updateComment = async (projectId, commentId, updatedData) => {
  try {
    const commentDoc = doc(firestore, `projects/${projectId}/comentarios`, commentId)
    await updateDoc(commentDoc, {
      resuelto: updatedData.resuelto,
      titulo: updatedData.titulo,
      cuerpo: updatedData.cuerpo,
    })
  } catch (error) {
    console.error('Error al actualizar el comentario: ', error)
    throw error
  }
}

// Eliminar un comentario específico
export const deleteComment = async (projectId, commentId) => {
  try {
    const commentDoc = doc(firestore, `projects/${projectId}/comentarios`, commentId)
    await deleteDoc(commentDoc)
  } catch (error) {
    console.error('Error al eliminar el comentario: ', error)
    throw error
  }
}

// Agregar un nuevo comentario a un proyecto
export const addComment = async (projectId, commentData) => {
  try {
    const commentsCollection = collection(firestore, `projects/${projectId}/comentarios`)
    await addDoc(commentsCollection, {
      titulo: commentData.titulo,
      cuerpo: commentData.cuerpo,
      resuelto: commentData.resuelto || false,
    })
  } catch (error) {
    console.error('Error al agregar el comentario: ', error)
    throw error
  }
}
