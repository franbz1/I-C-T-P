import { collection, addDoc, Timestamp } from 'firebase/firestore'; 
import { firestore } from '../config/firebase'; // Configuración de Firestore

// Validación de datos del informe
const validateInformeData = (informeData) => {
  if (!informeData.projectName) throw new Error('El nombre del proyecto es obligatorio');
  if (!informeData.contract) throw new Error('El número de contrato es obligatorio');
  if (!informeData.startDate) throw new Error('La fecha de inicio es obligatoria');
  if (!informeData.endDate) throw new Error('La fecha de fin es obligatoria');
  if (!informeData.nominations || !Array.isArray(informeData.nominations) || informeData.nominations.length === 0) {
    throw new Error('La nómina es obligatoria y debe contener al menos un empleado');
  }
};

export const createInforme = async (projectId, informeData) => {
  try {
    // Validar los datos antes de continuar
    validateInformeData(informeData);

    const informeCollection = collection(firestore, `Proyectos/${projectId}/Informe`);
    
    // Verificar si el contrato ya existe
    const contractExists = await getDocs(query(informeCollection, where('Contrato', '==', informeData.contract)));
    if (!contractExists.empty) {
      throw new Error('Ya existe un informe con este número de contrato.');
    }

    // Crear el documento del informe en Firestore
    const docRef = await addDoc(informeCollection, {
      NombreProyecto: informeData.projectName,
      Contrato: informeData.contract,
      FechaInicio: informeData.startDate ? Timestamp.fromDate(new Date(informeData.startDate)) : null,
      FechaFin: informeData.endDate ? Timestamp.fromDate(new Date(informeData.endDate)) : null,
      FotoPrincipal: informeData.fotoPrincipal || '',
      Introduccion: informeData.introduction || '',
      Desarrollo: informeData.desarrollo || '',
      Presupuesto: informeData.budget ? Math.round(informeData.budget * 100) : 0,  // En centavos
      Estado: informeData.state || 0,
      Fotos: informeData.fotos || [],
      Nomina: informeData.nominations || [],
      Contratistas: informeData.contractors || [],
    });

    return { success: true, id: docRef.id }; // Retornar el ID del documento creado
  } catch (error) {
    console.error('Error al crear el informe:', error.message);
    throw new Error('No se pudo crear el informe, por favor intente nuevamente.');
  }
}

// Obtener un informe por su ID
export const getInformeById = async (projectId, informeId) => {
  try {
    const docRef = doc(firestore, `Proyectos/${projectId}/Informe/${informeId}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() };
    } else {
      throw new Error('No se encontró el informe solicitado.');
    }
  } catch (error) {
    console.error('Error al obtener el informe:', error.message);
    throw new Error('No se pudo obtener el informe, por favor intente nuevamente.');
  }
};

// Validar datos de actualización del informe
const validateUpdatedInformeData = (informeData) => {
  if (informeData.projectName && informeData.projectName.trim() === '') {
    throw new Error('El nombre del proyecto no puede estar vacío.');
  }
  if (informeData.contract && informeData.contract.trim() === '') {
    throw new Error('El número de contrato no puede estar vacío.');
  }
  if (informeData.startDate && !(informeData.startDate instanceof Date)) {
    throw new Error('La fecha de inicio debe ser una fecha válida.');
  }
  if (informeData.endDate && !(informeData.endDate instanceof Date)) {
    throw new Error('La fecha de fin debe ser una fecha válida.');
  }
};

export const updateInforme = async (projectId, informeId, informeData) => {
  try {
    // Validar los datos antes de proceder
    validateUpdatedInformeData(informeData);

    const docRef = doc(firestore, `Proyectos/${projectId}/Informe/${informeId}`);

    // Actualizar el documento con los datos proporcionados
    const updatedData = {
      ...(informeData.projectName && { NombreProyecto: informeData.projectName }),
      ...(informeData.contract && { Contrato: informeData.contract }),
      ...(informeData.startDate && { FechaInicio: Timestamp.fromDate(new Date(informeData.startDate)) }),
      ...(informeData.endDate && { FechaFin: Timestamp.fromDate(new Date(informeData.endDate)) }),
      ...(informeData.fotoPrincipal !== undefined && { FotoPrincipal: informeData.fotoPrincipal || '' }),
      ...(informeData.introduction !== undefined && { Introduccion: informeData.introduction || '' }),
      ...(informeData.desarrollo !== undefined && { Desarrollo: informeData.desarrollo || '' }),
      ...(informeData.budget !== undefined && { Presupuesto: Math.round(informeData.budget * 100) || 0 }),
      ...(informeData.state !== undefined && { Estado: informeData.state || 0 }),
      ...(informeData.fotos !== undefined && { Fotos: informeData.fotos || [] }),
      ...(informeData.nominations !== undefined && { Nomina: informeData.nominations || [] }),
      ...(informeData.contractors !== undefined && { Contratistas: informeData.contractors || [] })
    };

    await updateDoc(docRef, updatedData);

    return { success: true, id: informeId }; // Retornar el ID del informe actualizado
  } catch (error) {
    console.error('Error al actualizar el informe:', error.message);
    throw new Error('No se pudo actualizar el informe, por favor intente nuevamente.');
  }
};

// Eliminar un informe por su ID
export const deleteInforme = async (projectId, informeId) => {
  try {
    const docRef = doc(firestore, `Proyectos/${projectId}/Informe/${informeId}`);

    // Eliminar todos los objetivos asociados (si los tienes como subcolección)
    const objectivesCollection = collection(firestore, `Proyectos/${projectId}/Informe/${informeId}/Objetivos`);
    const objectivesSnapshot = await getDocs(objectivesCollection);

    // Eliminar todos los documentos de la subcolección de objetivos
    const batch = firestore.batch();
    objectivesSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    // Eliminar el informe después de borrar los objetivos
    await deleteDoc(docRef);

    return { success: true, id: informeId };
  } catch (error) {
    console.error('Error al eliminar el informe:', error.message);
    throw new Error('No se pudo eliminar el informe, por favor intente nuevamente.');
  }
};

// Obtener todos los informes de un proyecto
export const getAllInformes = async (projectId) => {
  try {
    const informesCollection = collection(firestore, `Proyectos/${projectId}/Informe`);
    const querySnapshot = await getDocs(informesCollection);

    const informes = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, data: informes };
  } catch (error) {
    console.error('Error al obtener los informes:', error.message);
    throw new Error('No se pudieron obtener los informes, por favor intente nuevamente.');
  }
};