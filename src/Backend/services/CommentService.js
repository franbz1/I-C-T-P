// services/comentarioService.js
import { firestore } from '../../../firebase';
import {
  collection,
  Timestamp,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';

// Crear un comentario
export const createComentario = async (projectId, comentarioData) => {
  try {
    const comentariosCollection = collection(firestore, `Proyectos/${projectId}/ComentarioContratista`);

    const comentario = {
      ProyectoID: projectId,
      Titulo: comentarioData.titulo,
      Detalles: comentarioData.detalles,
      Resuelto: comentarioData.resuelto || false,
      FechaComentario: Timestamp.fromDate(new Date(comentarioData.fechaComentario)),
      FechaResuelto: comentarioData.fechaResuelto ? Timestamp.fromDate(new Date(comentarioData.fechaResuelto)) : null,
    };

    const comentarioRef = await addDoc(comentariosCollection, comentario);
    console.log('Comentario creado con éxito:', comentarioRef.id);
    return comentarioRef.id;
  } catch (error) {
    console.error('Error al crear el comentario:', error);
    throw new Error('No se pudo crear el comentario');
  }
};

// Obtener todos los comentarios de un proyecto
export const getComentarios = async (projectId) => {
  try {
    const comentariosCollection = collection(firestore, `Proyectos/${projectId}/ComentarioContratista`);
    const comentariosSnapshot = await getDocs(comentariosCollection);

    const comentariosList = comentariosSnapshot.docs.map(doc => ({
      ComentarioID: doc.id,
      ProyectoID: projectId,
      ...doc.data(),
    }));
    
    return comentariosList;
  } catch (error) {
    console.error('Error al obtener los comentarios:', error);
    throw new Error('No se pudieron obtener los comentarios');
  }
};

// Obtener un comentario por su ID
export const getComentarioById = async (projectId, comentarioId) => {
  try {
    const comentarioDoc = doc(firestore, `Proyectos/${projectId}/ComentarioContratista`, comentarioId);
    const comentarioSnapshot = await getDoc(comentarioDoc);
    
    if (!comentarioSnapshot.exists()) {
      throw new Error('Comentario no encontrado');
    }

    return { ComentarioID: comentarioSnapshot.id, ProyectoID: projectId, ...comentarioSnapshot.data() };
  } catch (error) {
    console.error('Error al obtener el comentario:', error);
    throw new Error('No se pudo obtener el comentario');
  }
};

// Actualizar un comentario
export const updateComentario = async (projectId, comentarioId, updatedData) => {
  try {
    const comentarioDoc = doc(firestore, `Proyectos/${projectId}/ComentarioContratista`, comentarioId);
    
    const updatedComentario = {
      Titulo: updatedData.Titulo || updatedData.titulo,
      Detalles: updatedData.Detalles || updatedData.detalles,
      Resuelto: updatedData.Resuelto !== undefined ? updatedData.Resuelto : updatedData.resuelto,
      FechaResuelto: updatedData.FechaResuelto ? Timestamp.fromDate(new Date(updatedData.FechaResuelto)) : null,
    };

    await updateDoc(comentarioDoc, updatedComentario);
    console.log('Comentario actualizado con éxito:', comentarioId);
  } catch (error) {
    console.error('Error al actualizar el comentario:', error);
    throw new Error('No se pudo actualizar el comentario');
  }
};

// Eliminar un comentario
export const deleteComentario = async (projectId, comentarioId) => {
  try {
    const comentarioDoc = doc(firestore, `Proyectos/${projectId}/ComentarioContratista`, comentarioId);
    
    await deleteDoc(comentarioDoc);
    console.log('Comentario eliminado con éxito:', comentarioId);
  } catch (error) {
    console.error('Error al eliminar el comentario:', error);
    throw new Error('No se pudo eliminar el comentario');
  }
};

// Suscribirse a los comentarios de un proyecto en tiempo real
export const subscribeToComentarios = (projectId, callback) => {
  const comentariosCollection = collection(firestore, `Proyectos/${projectId}/ComentarioContratista`);

  // Establecer el listener
  const unsubscribe = onSnapshot(comentariosCollection, (snapshot) => {
    const comentariosList = snapshot.docs.map(doc => ({
      ComentarioID: doc.id,
      ProyectoID: projectId,
      ...doc.data(),
    }));
    callback(comentariosList);
  }, (error) => {
    console.error('Error al obtener los comentarios en tiempo real:', error);
  });

  // Retornar la función de desuscripción
  return unsubscribe;
};
