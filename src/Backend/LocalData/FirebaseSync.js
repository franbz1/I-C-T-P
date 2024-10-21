import firestore from '../../../firebase';

const syncFirebaseToSQLite = async (db) => {
  // Sincronizar la tabla Empleados
  const empleadosSnapshot = await firestore().collection('empleado').get();
  empleadosSnapshot.forEach(async (doc) => {
    const empleado = doc.data();
    await db.runAsync(
      'INSERT OR IGNORE INTO Empleados (Cedula, Nombres, Apellidos, Correo, Telefono, Direccion, NombresAcudiente, TelefonoAcudiente, SeguroLaboral, EPS, TipoSangineo, Cargo, Proyectos, Foto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      empleado.Cedula, empleado.Nombres, empleado.Apellidos, empleado.Correo, empleado.Telefono, empleado.Direccion, empleado.NombresAcudiente, empleado.TelefonoAcudiente, empleado.SeguroLaboral, empleado.EPS, empleado.TipoSangineo, empleado.Cargo, JSON.stringify(empleado.Proyectos), empleado.Foto
    );
  });

  // Sincronizar la tabla Proyectos
  const proyectosSnapshot = await firestore().collection('proyecto').get();
  proyectosSnapshot.forEach(async (doc) => {
    const proyecto = doc.data();
    await db.runAsync(
      'INSERT OR IGNORE INTO Proyectos (Contrato, Nombre, FechaInicio, FechaFin, Empleados, Imagen) VALUES (?, ?, ?, ?, ?, ?)',
      proyecto.Contrato, proyecto.Nombre, proyecto.FechaInicio, proyecto.FechaFin, JSON.stringify(proyecto.Empleados), proyecto.Imagen
    );
  });

  // Sincronizar la tabla ComentarioContratista
  const comentariosSnapshot = await firestore().collection('comentarioContratista').get();
  comentariosSnapshot.forEach(async (doc) => {
    const comentario = doc.data();
    await db.runAsync(
      'INSERT OR IGNORE INTO ComentarioContratista (ProyectoID, Titulo, Detalles, Resuelto, FechaComentario, FechaResuelto) VALUES (?, ?, ?, ?, ?, ?)',
      comentario.ProyectoID, comentario.Titulo, comentario.Detalles, comentario.Resuelto, comentario.FechaComentario, comentario.FechaResuelto
    );
  });

  // Sincronizar la tabla EntradaBitacora
  const bitacoraSnapshot = await firestore().collection('entradaBitacora').get();
  bitacoraSnapshot.forEach(async (doc) => {
    const bitacora = doc.data();
    await db.runAsync(
      'INSERT OR IGNORE INTO EntradaBitacora (ProyectoID, Fecha, Detalles, Fotos, Empleados) VALUES (?, ?, ?, ?, ?)',
      bitacora.ProyectoID, bitacora.Fecha, bitacora.Detalles, JSON.stringify(bitacora.Fotos), JSON.stringify(bitacora.Empleados)
    );
  });

  // Sincronizar la tabla FotosBitacora
  const fotosBitacoraSnapshot = await firestore().collection('fotosBitacora').get();
  fotosBitacoraSnapshot.forEach(async (doc) => {
    const foto = doc.data();
    await db.runAsync(
      'INSERT OR IGNORE INTO FotosBitacora (BitacoraID, Url) VALUES (?, ?)',
      foto.BitacoraID, foto.Url
    );
  });

  // Sincronizar la tabla Informe
  const informesSnapshot = await firestore().collection('informe').get();
  informesSnapshot.forEach(async (doc) => {
    const informe = doc.data();
    await db.runAsync(
      'INSERT OR IGNORE INTO Informe (ProyectoID, Detalles) VALUES (?, ?)',
      informe.ProyectoID, informe.Detalles
    );
  });

  // Sincronizar la tabla FotosInforme
  const fotosInformeSnapshot = await firestore().collection('fotosInforme').get();
  fotosInformeSnapshot.forEach(async (doc) => {
    const fotoInforme = doc.data();
    await db.runAsync(
      'INSERT OR IGNORE INTO FotosInforme (InformeID, Url) VALUES (?, ?)',
      fotoInforme.InformeID, fotoInforme.Url
    );
  });

  // Sincronizar la tabla Empleado_Proyecto
  const empleadoProyectoSnapshot = await firestore().collection('empleadoProyecto').get();
  empleadoProyectoSnapshot.forEach(async (doc) => {
    const asignacion = doc.data();
    await db.runAsync(
      'INSERT OR IGNORE INTO Empleado_Proyecto (EmpleadoID, ProyectoID, FechaAsignacion) VALUES (?, ?, ?)',
      asignacion.EmpleadoID, asignacion.ProyectoID, asignacion.FechaAsignacion
    );
  });
};

export { syncFirebaseToSQLite };
