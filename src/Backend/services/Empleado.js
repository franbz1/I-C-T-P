import { firestore } from '../../../firebase';
import { collection, addDoc, getDocs, getDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

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
      Foto: empleadoData.foto || null, // Opcional, puede ser null
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
