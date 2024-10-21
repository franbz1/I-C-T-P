//comandos para el almacenamiento local (no usar con metodos firebase)
// Función para insertar un nuevo empleado en la tabla 'Empleados'.
// Retorna el ID del empleado insertado.
const insertarEmpleado = async (db, empleado) => {
    const { cedula, nombres, apellidos, correo, telefono, direccion, seguroLaboral, eps, tipoSangineo, cargo, foto } = empleado;
    const result = await db.runAsync(
      `INSERT INTO Empleados (Cedula, Nombres, Apellidos, Correo, Telefono, Direccion, SeguroLaboral, EPS, TipoSangineo, Cargo, Foto) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [cedula, nombres, apellidos, correo, telefono, direccion, seguroLaboral, eps, tipoSangineo, cargo, foto]
    );
    return result.lastInsertRowId;
  };
  
  // Función para modificar los datos de un empleado en la tabla 'Empleados'.
  // Retorna el número de filas afectadas.
  const modificarEmpleado = async (db, empleadoId, nuevoEmpleado) => {
    const { cedula, nombres, apellidos, correo, telefono, direccion, seguroLaboral, eps, tipoSangineo, cargo, foto } = nuevoEmpleado;
    const result = await db.runAsync(
      `UPDATE Empleados SET Cedula = ?, Nombres = ?, Apellidos = ?, Correo = ?, Telefono = ?, Direccion = ?, 
       SeguroLaboral = ?, EPS = ?, TipoSangineo = ?, Cargo = ?, Foto = ? WHERE EmpleadoID = ?`,
      [cedula, nombres, apellidos, correo, telefono, direccion, seguroLaboral, eps, tipoSangineo, cargo, foto, empleadoId]
    );
    return result.rowsAffected;
  };
  
  // Función para eliminar un empleado de la tabla 'Empleados'.
  // Retorna el número de filas afectadas.
  const eliminarEmpleado = async (db, empleadoId) => {
    const result = await db.runAsync('DELETE FROM Empleados WHERE EmpleadoID = ?', [empleadoId]);
    return result.rowsAffected;
  };
  
  // Función para insertar un nuevo proyecto en la tabla 'Proyectos'.
  // Retorna el ID del proyecto insertado.
  const insertarProyecto = async (db, proyecto) => {
    const { contrato, nombre, fechaInicio, fechaFin, empleados, imagen } = proyecto;
    const result = await db.runAsync(
      `INSERT INTO Proyectos (Contrato, Nombre, FechaInicio, FechaFin, Empleados, Imagen) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [contrato, nombre, fechaInicio, fechaFin, JSON.stringify(empleados), imagen]
    );
    return result.lastInsertRowId;
  };
  
  // Función para modificar un proyecto en la tabla 'Proyectos'.
  // Retorna el número de filas afectadas.
  const modificarProyecto = async (db, proyectoId, nuevoProyecto) => {
    const { contrato, nombre, fechaInicio, fechaFin, empleados, imagen } = nuevoProyecto;
    const result = await db.runAsync(
      `UPDATE Proyectos SET Contrato = ?, Nombre = ?, FechaInicio = ?, FechaFin = ?, Empleados = ?, Imagen = ? WHERE ProyectoID = ?`,
      [contrato, nombre, fechaInicio, fechaFin, JSON.stringify(empleados), imagen, proyectoId]
    );
    return result.rowsAffected;
  };
  
  // Función para eliminar un proyecto de la tabla 'Proyectos'.
  // Retorna el número de filas afectadas.
  const eliminarProyecto = async (db, proyectoId) => {
    const result = await db.runAsync('DELETE FROM Proyectos WHERE ProyectoID = ?', [proyectoId]);
    return result.rowsAffected;
  };
  
  // Función para insertar un nuevo comentario en la tabla 'ComentarioContratista'.
  // Retorna el ID del comentario insertado.
  const insertarComentario = async (db, comentario) => {
    const { proyectoId, titulo, detalles, resuelto, fechaComentario } = comentario;
    const result = await db.runAsync(
      `INSERT INTO ComentarioContratista (ProyectoID, Titulo, Detalles, Resuelto, FechaComentario) 
       VALUES (?, ?, ?, ?, ?)`,
      [proyectoId, titulo, detalles, resuelto, fechaComentario]
    );
    return result.lastInsertRowId;
  };
  
  // Función para modificar un comentario en la tabla 'ComentarioContratista'.
  // Retorna el número de filas afectadas.
  const modificarComentario = async (db, comentarioId, nuevoComentario) => {
    const { titulo, detalles, resuelto, fechaResuelto } = nuevoComentario;
    const result = await db.runAsync(
      `UPDATE ComentarioContratista SET Titulo = ?, Detalles = ?, Resuelto = ?, FechaResuelto = ? WHERE ComentarioID = ?`,
      [titulo, detalles, resuelto, fechaResuelto, comentarioId]
    );
    return result.rowsAffected;
  };
  
  // Función para eliminar un comentario de la tabla 'ComentarioContratista'.
  // Retorna el número de filas afectadas.
  const eliminarComentario = async (db, comentarioId) => {
    const result = await db.runAsync('DELETE FROM ComentarioContratista WHERE ComentarioID = ?', [comentarioId]);
    return result.rowsAffected;
  };
  
  // Función para insertar una entrada en la tabla 'EntradaBitacora'.
  // Retorna el ID de la entrada insertada.
  const insertarEntradaBitacora = async (db, bitacora) => {
    const { proyectoId, fecha, detalles, fotos, empleados } = bitacora;
    const result = await db.runAsync(
      `INSERT INTO EntradaBitacora (ProyectoID, Fecha, Detalles, Fotos, Empleados) 
       VALUES (?, ?, ?, ?, ?)`,
      [proyectoId, fecha, detalles, JSON.stringify(fotos), JSON.stringify(empleados)]
    );
    return result.lastInsertRowId;
  };
  
  // Función para eliminar una entrada de bitácora.
  // Retorna el número de filas afectadas.
  const eliminarEntradaBitacora = async (db, bitacoraId) => {
    const result = await db.runAsync('DELETE FROM EntradaBitacora WHERE BitacoraID = ?', [bitacoraId]);
    return result.rowsAffected;
  };
  
  // Función para insertar un nuevo informe en la tabla 'Informe'.
  // Retorna el ID del informe insertado.
  const insertarInforme = async (db, informe) => {
    const { proyectoId, detalles } = informe;
    const result = await db.runAsync(
      `INSERT INTO Informe (ProyectoID, Detalles) 
       VALUES (?, ?)`,
      [proyectoId, detalles]
    );
    return result.lastInsertRowId;
  };
  
  // Función para modificar un informe en la tabla 'Informe'.
  // Retorna el número de filas afectadas.
  const modificarInforme = async (db, informeId, nuevoInforme) => {
    const { detalles } = nuevoInforme;
    const result = await db.runAsync(
      `UPDATE Informe SET Detalles = ? WHERE InformeID = ?`,
      [detalles, informeId]
    );
    return result.rowsAffected;
  };
  
  // Función para eliminar un informe de la tabla 'Informe'.
  // Retorna el número de filas afectadas.
  const eliminarInforme = async (db, informeId) => {
    const result = await db.runAsync('DELETE FROM Informe WHERE InformeID = ?', [informeId]);
    return result.rowsAffected;
  };

 // Crear tabla Metadata si no existe (para el control de actualizaciones)
  export const createMetadataTable = async (db) => {
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS Metadata (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        FechaActualizacion TIMESTAMP NOT NULL
      );
    `);
  };

  // Obtener la última fecha de actualización en SQLite
  export const getLastUpdateDate = async (db) => {
    const result = await db.getFirstAsync('SELECT MAX(FechaActualizacion) as fecha FROM Metadata');
    return result ? result.fecha : null;
  };
  
  // Actualizar la fecha de actualización en la tabla Metadata
  export const updateLastUpdateDate = async (db, date) => {
    await db.runAsync(
      'INSERT INTO Metadata (FechaActualizacion) VALUES (?)',
      [date]
    );
  };
  
  
  export {
    insertarEmpleado,
    modificarEmpleado,
    eliminarEmpleado,
    insertarProyecto,
    modificarProyecto,
    eliminarProyecto,
    insertarComentario,
    modificarComentario,
    eliminarComentario,
    insertarEntradaBitacora,
    eliminarEntradaBitacora,
    insertarInforme,
    modificarInforme,
    eliminarInforme
  };
  