import { firestore } from '../../../firebase';
import { collection, addDoc, getDocs, getDoc, updateDoc, deleteDoc, doc, query, where, arrayUnion, arrayRemove } from 'firebase/firestore';

// Crear un empleado
export const createEmpleado = async (empleadoData) => {
  try {
    const empleadosCollection = collection(firestore, 'Empleados');
    const empleadoRef = await addDoc(empleadosCollection, {
      Cedula: empleadoData.cedula,
      Nombres: empleadoData.nombres,
      Apellidos: empleadoData.apellidos,
      Correo: empleadoData.correo,
      Telefono: empleadoData.telefono,
      Direccion: empleadoData.direccion,
      NombresAcudiente: empleadoData.nombresAcudiente,
      TelefonoAcudiente: empleadoData.telefonoAcudiente,
      SeguroLaboral: empleadoData.seguroLaboral,
      EPS: empleadoData.eps,
      TipoSangineo: empleadoData.tipoSangineo,
      Cargo: empleadoData.cargo,
      Proyectos: empleadoData.proyectos || [],  // Array de IDs de proyectos
      Foto: empleadoData.foto || null,
    });
    console.log('Empleado creado con éxito.');
    return empleadoRef.id;
  } catch (error) {
    console.error('Error al crear el empleado: ', error);
    throw error;
  }
};

// Obtener todos los empleados
export const getEmpleados = async () => {
  try {
    const empleadosCollection = collection(firestore, 'Empleados');
    const empleadosSnapshot = await getDocs(empleadosCollection);
    return empleadosSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error al obtener los empleados: ', error);
    throw error;
  }
};

// Obtener empleados por proyecto (basado en el ID del proyecto)
export const getEmpleadosByProyecto = async (proyectoId) => {
  try {
    const empleadosCollection = collection(firestore, 'Empleados');
    // Usamos el operador array-contains para verificar si el proyectoId está en el array de Proyectos
    const empleadosQuery = query(empleadosCollection, where('Proyectos', 'array-contains', proyectoId));
    const empleadosSnapshot = await getDocs(empleadosQuery);

    // Retorna la lista de empleados que están en el proyecto
    return empleadosSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error al obtener empleados por proyecto: ', error);
    throw error;
  }
};

// Obtener un empleado por su ID
export const getEmpleadoById = async (empleadoId) => {
  try {
    const empleadoDoc = doc(firestore, 'Empleados', empleadoId);
    const empleadoSnapshot = await getDoc(empleadoDoc);
    if (empleadoSnapshot.exists()) {
      return { id: empleadoSnapshot.id, ...empleadoSnapshot.data() };
    } else {
      throw new Error('Empleado no encontrado');
    }
  } catch (error) {
    console.error('Error al obtener el empleado: ', error);
    throw error;
  }
};

// Actualizar un empleado
export const updateEmpleado = async (empleadoId, updatedData) => {
  try {
    const empleadoDoc = doc(firestore, 'Empleados', empleadoId);
    await updateDoc(empleadoDoc, updatedData);
    console.log('Empleado actualizado con éxito.');
  } catch (error) {
    console.error('Error al actualizar el empleado: ', error);
    throw error;
  }
};

// Eliminar un empleado
export const deleteEmpleado = async (empleadoId) => {
  try {
    const empleadoDoc = doc(firestore, 'Empleados', empleadoId);
    await deleteDoc(empleadoDoc);
    console.log('Empleado eliminado con éxito.');
  } catch (error) {
    console.error('Error al eliminar el empleado: ', error);
    throw error;
  }
};

// Actualizar los proyectos del empleado
export const agregarProyectoAEmpleado = async (empleadoId, proyectoId) => {
  try {
    const empleadoDoc = doc(firestore, 'Empleados', empleadoId);
    // Usa arrayUnion para agregar el proyecto a la lista sin duplicados
    await updateDoc(empleadoDoc, {
      Proyectos: arrayUnion(proyectoId),
    });
    console.log('Proyecto agregado al empleado con éxito.');
  } catch (error) {
    console.error('Error al agregar el proyecto al empleado: ', error);
    throw error;
  }
};

// Eliminar a un empleado de un proyecto
export const eliminarProyectoAEmpleado = async (empleadoId, proyectoId) => {
  try {
    const empleadoDoc = doc(firestore, 'Empleados', empleadoId);
    // Usa arrayUnion para eliminar el proyecto de la lista sin duplicados
    await updateDoc(empleadoDoc, {
      Proyectos: arrayRemove(proyectoId),
    });
    console.log('Proyecto eliminado del empleado con éxito.');
  } catch (error) {
    console.error('Error al agregar el eliminar el proyecto del empleado: ', error);
    throw error;
  }
};