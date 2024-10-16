import * as SQLite from 'expo-sqlite';
import firestore from '@react-native-firebase/firestore';
import { initializeFirebase } from './firebase.js'; // Importar la función de inicialización

// Inicializar la base de datos SQLite
const openDatabaseAsync = async () => {
  const db = await SQLite.openDatabaseAsync('localData');
  
  // Activar el journal_mode a WAL para mejorar el rendimiento
  await db.execAsync(`PRAGMA journal_mode = WAL;`);

  // Crear tabla Proyecto
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS Proyecto (
      ProyectoID INTEGER PRIMARY KEY NOT NULL,
      Nombre TEXT NOT NULL,
      Contrato TEXT UNIQUE NOT NULL,
      FechaInicio TEXT NOT NULL,
      FechaFin TEXT NOT NULL,
      Imagen TEXT
    );
  `);

  // Crear tabla Empleado
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS Empleado (
      EmpleadoID INTEGER PRIMARY KEY NOT NULL,
      Cedula INTEGER UNIQUE NOT NULL,
      Nombres TEXT NOT NULL,
      Apellidos TEXT NOT NULL,
      Correo TEXT UNIQUE NOT NULL,
      Telefono INTEGER UNIQUE NOT NULL,
      Direccion TEXT NOT NULL,
      SeguroLaboral TEXT NOT NULL,
      EPS TEXT NOT NULL,
      TipoSangineo TEXT NOT NULL,
      Cargo TEXT NOT NULL,
      Foto TEXT
    );
  `);

  // Crear tabla Empleado_Proyecto (relación entre Empleado y Proyecto)
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS Empleado_Proyecto (
      EmpleadoID INTEGER NOT NULL,
      ProyectoID INTEGER NOT NULL,
      FechaAsignacion TEXT NOT NULL,
      PRIMARY KEY (EmpleadoID, ProyectoID),
      FOREIGN KEY (EmpleadoID) REFERENCES Empleado (EmpleadoID),
      FOREIGN KEY (ProyectoID) REFERENCES Proyecto (ProyectoID)
    );
  `);

  // Crear tabla EntradaBitacora
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS EntradaBitacora (
      BitacoraID INTEGER PRIMARY KEY NOT NULL,
      ProyectoID INTEGER NOT NULL,
      Fecha TEXT NOT NULL,
      Detalles TEXT NOT NULL,
      FOREIGN KEY (ProyectoID) REFERENCES Proyecto (ProyectoID)
    );
  `);

  // Crear tabla FotosBitacora
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS FotosBitacora (
      FotoID INTEGER PRIMARY KEY NOT NULL,
      BitacoraID INTEGER NOT NULL,
      Url TEXT NOT NULL,
      FOREIGN KEY (BitacoraID) REFERENCES EntradaBitacora (BitacoraID)
    );
  `);

  // Crear tabla Informe
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS Informe (
      InformeID INTEGER PRIMARY KEY NOT NULL,
      ProyectoID INTEGER NOT NULL,
      Detalles TEXT NOT NULL,
      FOREIGN KEY (ProyectoID) REFERENCES Proyecto (ProyectoID)
    );
  `);

  // Crear tabla FotosInforme
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS FotosInforme (
      FotoID INTEGER PRIMARY KEY NOT NULL,
      InformeID INTEGER NOT NULL,
      Url TEXT NOT NULL,
      FOREIGN KEY (InformeID) REFERENCES Informe (InformeID)
    );
  `);

  // Crear tabla ComentarioContratista
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS ComentarioContratista (
      ComentarioID INTEGER PRIMARY KEY NOT NULL,
      ProyectoID INTEGER NOT NULL,
      Titulo TEXT NOT NULL,
      Detalles TEXT NOT NULL,
      Resuelto INTEGER NOT NULL CHECK (Resuelto IN (0, 1)),
      FechaComentario TEXT NOT NULL,
      FechaResuelto TEXT,
      FOREIGN KEY (ProyectoID) REFERENCES Proyecto (ProyectoID)
    );
  `);

  return db;
};

// Sincronizar Firebase con SQLite (Empleado, Proyecto, EntradaBitacora, Informe, etc.)
const syncFirebaseToSQLite = async (db) => {
  // Sincronizar empleados
  const empleadosSnapshot = await firestore().collection('empleado').get();
  empleadosSnapshot.forEach(async (doc) => {
    const empleado = doc.data();
    await db.runAsync(
      'INSERT OR IGNORE INTO Empleado (Cedula, Nombres, Apellidos, Correo, Telefono, Direccion, SeguroLaboral, EPS, TipoSangineo, Cargo, Foto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      empleado.Cedula, empleado.Nombres, empleado.Apellidos, empleado.Correo, empleado.Telefono, empleado.Direccion, empleado.SeguroLaboral, empleado.EPS, empleado.TipoSangineo, empleado.Cargo, empleado.Foto
    );
  });

  // Sincronizar proyectos
  const proyectosSnapshot = await firestore().collection('proyecto').get();
  proyectosSnapshot.forEach(async (doc) => {
    const proyecto = doc.data();
    await db.runAsync(
      'INSERT OR IGNORE INTO Proyecto (Nombre, Contrato, FechaInicio, FechaFin, Imagen) VALUES (?, ?, ?, ?, ?)',
      proyecto.Nombre, proyecto.Contrato, proyecto.FechaInicio, proyecto.FechaFin, proyecto.Imagen
    );
  });

  // Sincronizar más tablas según sea necesario (Empleado_Proyecto, EntradaBitacora, etc.)
  // ...
};

// Insertar empleado en Firebase y SQLite
const insertarEmpleado = async (db, cedula, nombres, apellidos, correo, telefono, direccion, seguroLaboral, eps, tipoSangineo, cargo, foto) => {
  const result = await db.runAsync(
    'INSERT INTO Empleado (Cedula, Nombres, Apellidos, Correo, Telefono, Direccion, SeguroLaboral, EPS, TipoSangineo, Cargo, Foto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    cedula, nombres, apellidos, correo, telefono, direccion, seguroLaboral, eps, tipoSangineo, cargo, foto
  );

  await firestore().collection('empleado').add({
    Cedula: cedula,
    Nombres: nombres,
    Apellidos: apellidos,
    Correo: correo,
    Telefono: telefono,
    Direccion: direccion,
    SeguroLaboral: seguroLaboral,
    EPS: eps,
    TipoSangineo: tipoSangineo,
    Cargo: cargo,
    Foto: foto,
  });

  return result.lastInsertRowId;
};

// Obtener empleado por correo y contraseña desde SQLite
const obtenerEmpleadoPorCorreoYContraseña = async (db, correo, contraseña) => {
  const empleado = await db.getFirstAsync('SELECT * FROM Empleado WHERE Correo = ? AND contraseña = ?', correo, contraseña);
  return empleado;
};

// Obtener bitácora por empleado ID
const obtenerBitacoraPorEmpleadoId = async (db, empleadoId) => {
  const bitacora = await db.allAsync('SELECT * FROM EntradaBitacora WHERE ProyectoID = ?', empleadoId);
  return bitacora;
};

// Obtener informe por proyecto ID
const obtenerInformePorProyectoId = async (db, proyectoId) => {
  const informe = await db.allAsync('SELECT * FROM Informe WHERE ProyectoID = ?', proyectoId);
  return informe;
};

// Obtener proyecto por ID
const obtenerProyectoPorId = async (db, proyectoId) => {
  const proyecto = await db.getFirstAsync('SELECT * FROM Proyecto WHERE ProyectoID = ?', proyectoId);
  return proyecto;
};

// Inicializar Firebase y la base de datos SQLite, luego sincronizar con Firebase
const setupDatabase = async () => {
  initializeFirebase();
  const db = await openDatabaseAsync();
  await syncFirebaseToSQLite(db);
  return db;
};

export {
  openDatabaseAsync,
  syncFirebaseToSQLite,
  insertarEmpleado,
  obtenerEmpleadoPorCorreoYContraseña,
  obtenerBitacoraPorEmpleadoId,
  obtenerInformePorProyectoId,
  obtenerProyectoPorId,
  setupDatabase
};
