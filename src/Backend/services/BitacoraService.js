// services/bitacoraService.js
import { firestore } from '../../../firebase';
import { collection, Timestamp, doc, addDoc, getDocs, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

// Helper para convertir fechas de Timestamp de Firebase a JavaScript Date
const convertTimestampToDate = (timestamp) => {
  return timestamp instanceof Timestamp ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
};

// Crear una entrada de bitácora para un proyecto específico
export const createBitacoraEntry = async (projectId, bitacoraData) => {
  try {
    const bitacoraCollection = collection(firestore, `Proyectos/${projectId}/EntradaBitacora`);
    
    // Verificar que el array de IDs de empleados no sea null o vacío
    if (!bitacoraData.empleados || bitacoraData.empleados.length === 0) {
      throw new Error('El array de IDs de empleados no puede estar vacío.');
    }
    
    const bitacoraRef = await addDoc(bitacoraCollection, {
      Fecha: Timestamp.fromDate(new Date(bitacoraData.fecha)), // Convertir fecha a Timestamp
      Detalles: bitacoraData.detalles,
      Fotos: bitacoraData.fotos || [], // Asegurar que sea un array, aunque sea vacío
      Empleados: bitacoraData.empleados, // Asegurar que tiene un array de IDs de empleados
    });

    console.log('Entrada de bitácora creada con éxito.');
    return bitacoraRef.id;
  } catch (error) {
    console.error('Error al crear la entrada de bitácora: ', error);
    throw error;
  }
};

// Obtener todas las entradas de bitácora de un proyecto
export const getBitacoraEntries = async (projectId) => {
  try {
    const bitacoraCollection = collection(firestore, `Proyectos/${projectId}/EntradaBitacora`);
    const bitacoraSnapshot = await getDocs(bitacoraCollection);
    const bitacoraList = bitacoraSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      Fecha: convertTimestampToDate(doc.data().Fecha), // Convertir Timestamp a Date
    }));
    return bitacoraList;
  } catch (error) {
    console.error('Error al obtener las entradas de bitácora: ', error);
    throw error;
  }
};

// Obtener una entrada específica de bitácora por su ID
export const getBitacoraEntryById = async (projectId, bitacoraId) => {
  try {
    const bitacoraDoc = doc(firestore, `Proyectos/${projectId}/EntradaBitacora`, bitacoraId);
    const bitacoraSnapshot = await getDoc(bitacoraDoc);
    if (bitacoraSnapshot.exists()) {
      return { id: bitacoraSnapshot.id, ...bitacoraSnapshot.data(), Fecha: convertTimestampToDate(bitacoraSnapshot.data().Fecha) };
    } else {
      throw new Error('Entrada de bitácora no encontrada');
    }
  } catch (error) {
    console.error('Error al obtener la entrada de bitácora: ', error);
    throw error;
  }
};

// Actualizar una entrada de bitácora
export const updateBitacoraEntry = async (projectId, bitacoraId, updatedData) => {
  try {
    const bitacoraDoc = doc(firestore, `Proyectos/${projectId}/EntradaBitacora`, bitacoraId);
    await updateDoc(bitacoraDoc, {
      Fecha: Timestamp.fromDate(new Date(updatedData.fecha)), // Convertir fecha a Timestamp
      Detalles: updatedData.detalles,
      Fotos: updatedData.fotos || [],
      Empleados: updatedData.empleados, // Asegurar que se actualizan los IDs de empleados
    });
    console.log('Entrada de bitácora actualizada con éxito.');
  } catch (error) {
    console.error('Error al actualizar la entrada de bitácora: ', error);
    throw error;
  }
};

// Eliminar una entrada de bitácora
export const deleteBitacoraEntry = async (projectId, bitacoraId) => {
  try {
    const bitacoraDoc = doc(firestore, `Proyectos/${projectId}/EntradaBitacora`, bitacoraId);
    await deleteDoc(bitacoraDoc);
    console.log('Entrada de bitácora eliminada con éxito.');
  } catch (error) {
    console.error('Error al eliminar la entrada de bitácora: ', error);
    throw error;
  }
};
