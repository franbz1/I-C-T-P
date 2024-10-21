// Commandos para el almacenamiento local teniendo en cuenta firebase
import firestore from '@react-native-firebase/firestore';
const updateSQLiteFromFirebase = async (db) => {
  try {
    // Obtener los datos actuales en SQLite antes de la actualización
    const existingEmpleados = await db.runAsync('SELECT Cedula FROM Empleados');
    const existingProyectos = await db.runAsync('SELECT Contrato FROM Proyectos');
    const existingComentarios = await db.runAsync('SELECT ComentarioID FROM ComentarioContratista');
    const existingBitacoras = await db.runAsync('SELECT BitacoraID FROM EntradaBitacora');
    const existingInformes = await db.runAsync('SELECT InformeID FROM Informe');
    const existingFotosBitacora = await db.runAsync('SELECT FotoID FROM FotosBitacora');
    const existingFotosInforme = await db.runAsync('SELECT FotoID FROM FotosInforme');
    const existingEmpleadoProyecto = await db.runAsync('SELECT EmpleadoID, ProyectoID FROM Empleado_Proyecto');

    // Sincronizar Empleados
    const empleadosSnapshot = await firestore().collection('empleado').get();
    const empleadosEnFirebase = [];

    empleadosSnapshot.forEach(async (doc) => {
      const empleado = doc.data();
      empleadosEnFirebase.push(empleado.Cedula);

      const existingEmpleado = await db.runAsync(
        'SELECT * FROM Empleados WHERE Cedula = ?',
        [empleado.Cedula]
      );

      if (existingEmpleado.rows.length > 0) {
        await db.runAsync(
          'UPDATE Empleados SET Nombres = ?, Apellidos = ?, Correo = ?, Telefono = ?, Direccion = ?, NombresAcudiente = ?, TelefonoAcudiente = ?, SeguroLaboral = ?, EPS = ?, TipoSangineo = ?, Cargo = ?, Proyectos = ?, Foto = ? WHERE Cedula = ?',
          [
            empleado.Nombres,
            empleado.Apellidos,
            empleado.Correo,
            empleado.Telefono,
            empleado.Direccion,
            empleado.NombresAcudiente,
            empleado.TelefonoAcudiente,
            empleado.SeguroLaboral,
            empleado.EPS,
            empleado.TipoSangineo,
            empleado.Cargo,
            JSON.stringify(empleado.Proyectos),
            empleado.Foto,
            empleado.Cedula,
          ]
        );
      } else {
        await db.runAsync(
          'INSERT INTO Empleados (Cedula, Nombres, Apellidos, Correo, Telefono, Direccion, NombresAcudiente, TelefonoAcudiente, SeguroLaboral, EPS, TipoSangineo, Cargo, Proyectos, Foto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [
            empleado.Cedula,
            empleado.Nombres,
            empleado.Apellidos,
            empleado.Correo,
            empleado.Telefono,
            empleado.Direccion,
            empleado.NombresAcudiente,
            empleado.TelefonoAcudiente,
            empleado.SeguroLaboral,
            empleado.EPS,
            empleado.TipoSangineo,
            empleado.Cargo,
            JSON.stringify(empleado.Proyectos),
            empleado.Foto,
          ]
        );
      }
    });

    // Eliminar empleados de SQLite que ya no estén en Firebase
    const empleadosSQLite = existingEmpleados.rows.map(row => row.Cedula);
    const empleadosAEliminar = empleadosSQLite.filter(cedula => !empleadosEnFirebase.includes(cedula));

    for (const cedula of empleadosAEliminar) {
      await db.runAsync('DELETE FROM Empleados WHERE Cedula = ?', [cedula]);
    }

    // Sincronizar Proyectos
    const proyectosSnapshot = await firestore().collection('proyecto').get();
    const proyectosEnFirebase = [];

    proyectosSnapshot.forEach(async (doc) => {
      const proyecto = doc.data();
      proyectosEnFirebase.push(proyecto.Contrato);

      const existingProyecto = await db.runAsync(
        'SELECT * FROM Proyectos WHERE Contrato = ?',
        [proyecto.Contrato]
      );

      if (existingProyecto.rows.length > 0) {
        await db.runAsync(
          'UPDATE Proyectos SET Nombre = ?, FechaInicio = ?, FechaFin = ?, Empleados = ?, Imagen = ? WHERE Contrato = ?',
          [
            proyecto.Nombre,
            proyecto.FechaInicio,
            proyecto.FechaFin,
            JSON.stringify(proyecto.Empleados),
            proyecto.Imagen,
            proyecto.Contrato,
          ]
        );
      } else {
        await db.runAsync(
          'INSERT INTO Proyectos (Contrato, Nombre, FechaInicio, FechaFin, Empleados, Imagen) VALUES (?, ?, ?, ?, ?, ?)',
          [
            proyecto.Contrato,
            proyecto.Nombre,
            proyecto.FechaInicio,
            proyecto.FechaFin,
            JSON.stringify(proyecto.Empleados),
            proyecto.Imagen,
          ]
        );
      }
    });

    // Eliminar proyectos de SQLite que ya no estén en Firebase
    const proyectosSQLite = existingProyectos.rows.map(row => row.Contrato);
    const proyectosAEliminar = proyectosSQLite.filter(contrato => !proyectosEnFirebase.includes(contrato));

    for (const contrato of proyectosAEliminar) {
      await db.runAsync('DELETE FROM Proyectos WHERE Contrato = ?', [contrato]);
    }

    // Sincronizar ComentarioContratista
const comentariosSnapshot = await firestore().collection('comentarioContratista').get();
const comentariosEnFirebase = [];

comentariosSnapshot.forEach(async (doc) => {
  const comentario = doc.data();
  comentariosEnFirebase.push(comentario.ComentarioID);

  const existingComentario = await db.runAsync(
    'SELECT * FROM ComentarioContratista WHERE ComentarioID = ?',
    [comentario.ComentarioID]
  );

  if (existingComentario.rows.length > 0) {
    await db.runAsync(
      'UPDATE ComentarioContratista SET ProyectoID = ?, Titulo = ?, Detalles = ?, Resuelto = ?, FechaComentario = ?, FechaResuelto = ? WHERE ComentarioID = ?',
      [
        comentario.ProyectoID,
        comentario.Titulo,
        comentario.Detalles,
        comentario.Resuelto,
        comentario.FechaComentario,
        comentario.FechaResuelto,
        comentario.ComentarioID,
      ]
    );
  } else {
    await db.runAsync(
      'INSERT INTO ComentarioContratista (ComentarioID, ProyectoID, Titulo, Detalles, Resuelto, FechaComentario, FechaResuelto) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        comentario.ComentarioID,
        comentario.ProyectoID,
        comentario.Titulo,
        comentario.Detalles,
        comentario.Resuelto,
        comentario.FechaComentario,
        comentario.FechaResuelto,
      ]
    );
  }
});

// Eliminar comentarios de SQLite que ya no estén en Firebase
const comentariosSQLite = existingComentarios.rows.map(row => row.ComentarioID);
const comentariosAEliminar = comentariosSQLite.filter(id => !comentariosEnFirebase.includes(id));

for (const id of comentariosAEliminar) {
  await db.runAsync('DELETE FROM ComentarioContratista WHERE ComentarioID = ?', [id]);
}

// Sincronizar EntradaBitacora
const bitacorasSnapshot = await firestore().collection('entradaBitacora').get();
const bitacorasEnFirebase = [];

bitacorasSnapshot.forEach(async (doc) => {
  const bitacora = doc.data();
  bitacorasEnFirebase.push(bitacora.BitacoraID);

  const existingBitacora = await db.runAsync(
    'SELECT * FROM EntradaBitacora WHERE BitacoraID = ?',
    [bitacora.BitacoraID]
  );

  if (existingBitacora.rows.length > 0) {
    await db.runAsync(
      'UPDATE EntradaBitacora SET ProyectoID = ?, Fecha = ?, Detalles = ?, Fotos = ?, Empleados = ? WHERE BitacoraID = ?',
      [
        bitacora.ProyectoID,
        bitacora.Fecha,
        bitacora.Detalles,
        JSON.stringify(bitacora.Fotos),
        JSON.stringify(bitacora.Empleados),
        bitacora.BitacoraID,
      ]
    );
  } else {
    await db.runAsync(
      'INSERT INTO EntradaBitacora (BitacoraID, ProyectoID, Fecha, Detalles, Fotos, Empleados) VALUES (?, ?, ?, ?, ?, ?)',
      [
        bitacora.BitacoraID,
        bitacora.ProyectoID,
        bitacora.Fecha,
        bitacora.Detalles,
        JSON.stringify(bitacora.Fotos),
        JSON.stringify(bitacora.Empleados),
      ]
    );
  }
});

// Eliminar bitácoras de SQLite que ya no estén en Firebase
const bitacorasSQLite = existingBitacoras.rows.map(row => row.BitacoraID);
const bitacorasAEliminar = bitacorasSQLite.filter(id => !bitacorasEnFirebase.includes(id));

for (const id of bitacorasAEliminar) {
  await db.runAsync('DELETE FROM EntradaBitacora WHERE BitacoraID = ?', [id]);
}

// Sincronizar FotosBitacora
const fotosBitacoraSnapshot = await firestore().collection('fotosBitacora').get();
const fotosBitacoraEnFirebase = [];

fotosBitacoraSnapshot.forEach(async (doc) => {
  const foto = doc.data();
  fotosBitacoraEnFirebase.push(foto.FotoID);

  const existingFoto = await db.runAsync(
    'SELECT * FROM FotosBitacora WHERE FotoID = ?',
    [foto.FotoID]
  );

  if (existingFoto.rows.length > 0) {
    await db.runAsync(
      'UPDATE FotosBitacora SET BitacoraID = ?, Url = ? WHERE FotoID = ?',
      [
        foto.BitacoraID,
        foto.Url,
        foto.FotoID,
      ]
    );
  } else {
    await db.runAsync(
      'INSERT INTO FotosBitacora (FotoID, BitacoraID, Url) VALUES (?, ?, ?)',
      [
        foto.FotoID,
        foto.BitacoraID,
        foto.Url,
      ]
    );
  }
});

// Eliminar fotos de bitácora de SQLite que ya no estén en Firebase
const fotosBitacoraSQLite = existingFotosBitacora.rows.map(row => row.FotoID);
const fotosBitacoraAEliminar = fotosBitacoraSQLite.filter(id => !fotosBitacoraEnFirebase.includes(id));

for (const id of fotosBitacoraAEliminar) {
  await db.runAsync('DELETE FROM FotosBitacora WHERE FotoID = ?', [id]);
}

// Sincronizar Informe
const informesSnapshot = await firestore().collection('informe').get();
const informesEnFirebase = [];

informesSnapshot.forEach(async (doc) => {
  const informe = doc.data();
  informesEnFirebase.push(informe.InformeID);

  const existingInforme = await db.runAsync(
    'SELECT * FROM Informe WHERE InformeID = ?',
    [informe.InformeID]
  );

  if (existingInforme.rows.length > 0) {
    await db.runAsync(
      'UPDATE Informe SET ProyectoID = ?, Detalles = ? WHERE InformeID = ?',
      [
        informe.ProyectoID,
        informe.Detalles,
        informe.InformeID,
      ]
    );
  } else {
    await db.runAsync(
      'INSERT INTO Informe (InformeID, ProyectoID, Detalles) VALUES (?, ?, ?)',
      [
        informe.InformeID,
        informe.ProyectoID,
        informe.Detalles,
      ]
    );
  }
});

// Eliminar informes de SQLite que ya no estén en Firebase
const informesSQLite = existingInformes.rows.map(row => row.InformeID);
const informesAEliminar = informesSQLite.filter(id => !informesEnFirebase.includes(id));

for (const id of informesAEliminar) {
  await db.runAsync('DELETE FROM Informe WHERE InformeID = ?', [id]);
}

// Sincronizar FotosInforme
const fotosInformeSnapshot = await firestore().collection('fotosInforme').get();
const fotosInformeEnFirebase = [];

fotosInformeSnapshot.forEach(async (doc) => {
  const foto = doc.data();
  fotosInformeEnFirebase.push(foto.FotoID);

  const existingFoto = await db.runAsync(
    'SELECT * FROM FotosInforme WHERE FotoID = ?',
    [foto.FotoID]
  );

  if (existingFoto.rows.length > 0) {
    await db.runAsync(
      'UPDATE FotosInforme SET InformeID = ?, Url = ? WHERE FotoID = ?',
      [
        foto.InformeID,
        foto.Url,
        foto.FotoID,
      ]
    );
  } else {
    await db.runAsync(
      'INSERT INTO FotosInforme (FotoID, InformeID, Url) VALUES (?, ?, ?)',
      [
        foto.FotoID,
        foto.InformeID,
        foto.Url,
      ]
    );
  }
});

// Eliminar fotos de informe de SQLite que ya no estén en Firebase
const fotosInformeSQLite = existingFotosInforme.rows.map(row => row.FotoID);
const fotosInformeAEliminar = fotosInformeSQLite.filter(id => !fotosInformeEnFirebase.includes(id));

for (const id of fotosInformeAEliminar) {
  await db.runAsync('DELETE FROM FotosInforme WHERE FotoID = ?', [id]);
}

// Sincronizar Empleado_Proyecto
const empleadoProyectoSnapshot = await firestore().collection('empleadoProyecto').get();
const empleadoProyectoEnFirebase = [];

empleadoProyectoSnapshot.forEach(async (doc) => {
  const empProy = doc.data();
  empleadoProyectoEnFirebase.push({ EmpleadoID: empProy.EmpleadoID, ProyectoID: empProy.ProyectoID });

  const existingEmpleadoProyecto = await db.runAsync(
    'SELECT * FROM Empleado_Proyecto WHERE EmpleadoID = ? AND ProyectoID = ?',
    [empProy.EmpleadoID, empProy.ProyectoID]
  );

  if (existingEmpleadoProyecto.rows.length > 0) {
    await db.runAsync(
      'UPDATE Empleado_Proyecto SET FechaAsignacion = ? WHERE EmpleadoID = ? AND ProyectoID = ?',
      [
        empProy.FechaAsignacion,
        empProy.EmpleadoID,
        empProy.ProyectoID,
      ]
    );
  } else {
    await db.runAsync(
      'INSERT INTO Empleado_Proyecto (EmpleadoID, ProyectoID, FechaAsignacion) VALUES (?, ?, ?)',
      [
        empProy.EmpleadoID,
        empProy.ProyectoID,
        empProy.FechaAsignacion,
      ]
    );
  }
});

// Eliminar registros de Empleado_Proyecto en SQLite que ya no estén en Firebase
const empleadoProyectoSQLite = existingEmpleadoProyecto.rows.map(row => ({ EmpleadoID: row.EmpleadoID, ProyectoID: row.ProyectoID }));
const empleadoProyectoAEliminar = empleadoProyectoSQLite.filter(
  ep => !empleadoProyectoEnFirebase.some(fb => fb.EmpleadoID === ep.EmpleadoID && fb.ProyectoID === ep.ProyectoID)
);

for (const ep of empleadoProyectoAEliminar) {
  await db.runAsync('DELETE FROM Empleado_Proyecto WHERE EmpleadoID = ? AND ProyectoID = ?', [ep.EmpleadoID, ep.ProyectoID]);
}



    console.log('Datos sincronizados exitosamente desde Firebase a SQLite');
  } catch (error) {
    console.error('Error al sincronizar la base de datos desde Firebase:', error);
  }
};

export { updateSQLiteFromFirebase };
