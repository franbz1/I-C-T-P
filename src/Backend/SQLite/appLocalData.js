import * as SQLite from 'expo-sqlite';
import firestore from '@react-native-firebase/firestore';
import { initializeFirebase } from './firebase.js'; // Importar la función de inicialización

// Inicializar la base de datos SQLite
const openDatabaseAsync = async () => {
  const db = await SQLite.openDatabaseAsync('localData');
  
  // Crear tabla empleados (como nomina)
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS nomina (
      id INTEGER PRIMARY KEY NOT NULL,
      nombres TEXT NOT NULL,
      apellidos TEXT NOT NULL,
      correo TEXT NOT NULL UNIQUE,
      telefono TEXT NOT NULL,
      direccion TEXT NOT NULL,
      eps TEXT DEFAULT 'N/A',
      contraseña TEXT NOT NULL,
      cargo TEXT NOT NULL
    );
  `);

  // Crear tabla bitacora
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS bitacora (
      id INTEGER PRIMARY KEY NOT NULL,
      empleadoId INTEGER,
      fecha TEXT NOT NULL,
      detalles TEXT NOT NULL,
      FOREIGN KEY (empleadoId) REFERENCES nomina (id)
    );
  `);

  // Crear tabla informe
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS informe (
      id INTEGER PRIMARY KEY NOT NULL,
      empleadoId INTEGER,
      fecha TEXT NOT NULL,
      detalles TEXT NOT NULL,
      FOREIGN KEY (empleadoId) REFERENCES nomina (id)
    );
  `);

  // Crear tabla proyectos
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS proyectos (
      id INTEGER PRIMARY KEY NOT NULL,
      nombreProyecto TEXT NOT NULL,
      contractNumber TEXT NOT NULL,
      startDate TEXT NOT NULL,
      endDate TEXT NOT NULL
    );
  `);

  return db;
};

// Sincronizar Firebase con SQLite (Nómina, Bitácora, Informe, Proyectos)
const syncFirebaseToSQLite = async (db) => {
  // Sincronizar nomina (empleados)
  const nominaSnapshot = await firestore().collection('nomina').get();
  nominaSnapshot.forEach(async (doc) => {
    const empleado = doc.data();
    await db.runAsync(
      'INSERT OR IGNORE INTO nomina (nombres, apellidos, correo, telefono, direccion, eps, contraseña, cargo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      empleado.nombres, empleado.apellidos, empleado.correo, empleado.telefono, empleado.direccion, empleado.eps, empleado.contraseña, empleado.cargo
    );
  });

  // Sincronizar bitácora
  const bitacoraSnapshot = await firestore().collection('bitacora').get();
  bitacoraSnapshot.forEach(async (doc) => {
    const bitacora = doc.data();
    await db.runAsync(
      'INSERT OR IGNORE INTO bitacora (empleadoId, fecha, detalles) VALUES (?, ?, ?)',
      bitacora.empleadoId, bitacora.fecha, bitacora.detalles
    );
  });

  // Sincronizar informe
  const informeSnapshot = await firestore().collection('informe').get();
  informeSnapshot.forEach(async (doc) => {
    const informe = doc.data();
    await db.runAsync(
      'INSERT OR IGNORE INTO informe (empleadoId, fecha, detalles) VALUES (?, ?, ?)',
      informe.empleadoId, informe.fecha, informe.detalles
    );
  });

  // Sincronizar proyectos
  const proyectosSnapshot = await firestore().collection('proyectos').get();
  proyectosSnapshot.forEach(async (doc) => {
    const proyecto = doc.data();
    await db.runAsync(
      'INSERT OR IGNORE INTO proyectos (nombreProyecto, contractNumber, startDate, endDate) VALUES (?, ?, ?, ?)',
      proyecto.nombreProyecto, proyecto.contractNumber, proyecto.startDate, proyecto.endDate
    );
  });
};

// Insertar empleado en Firebase (nómina) y SQLite
const insertarEmpleado = async (db, nombres, apellidos, correo, telefono, direccion, eps, contraseña, cargo) => {
  const result = await db.runAsync(
    'INSERT INTO nomina (nombres, apellidos, correo, telefono, direccion, eps, contraseña, cargo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    nombres, apellidos, correo, telefono, direccion, eps, contraseña, cargo
  );

  await firestore().collection('nomina').add({
    nombres,
    apellidos,
    correo,
    telefono,
    direccion,
    eps,
    contraseña,
    cargo,
  });

  return result.lastInsertRowId;
};

// Obtener empleado desde SQLite
const obtenerEmpleadoPorCorreoYContraseña = async (db, correo, contraseña) => {
  const empleado = await db.getFirstAsync('SELECT * FROM nomina WHERE correo = ? AND contraseña = ?', correo, contraseña);
  return empleado;
};

// Obtener bitácora por empleado ID
const obtenerBitacoraPorEmpleadoId = async (db, empleadoId) => {
  const bitacora = await db.allAsync('SELECT * FROM bitacora WHERE empleadoId = ?', empleadoId);
  return bitacora;
};

// Obtener informe por empleado ID
const obtenerInformePorEmpleadoId = async (db, empleadoId) => {
  const informe = await db.allAsync('SELECT * FROM informe WHERE empleadoId = ?', empleadoId);
  return informe;
};

// Obtener proyecto por ID
const obtenerProyectoPorId = async (db, proyectoId) => {
  const proyecto = await db.getFirstAsync('SELECT * FROM proyectos WHERE id = ?', proyectoId);
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
  obtenerInformePorEmpleadoId,
  obtenerProyectoPorId,
  setupDatabase
};
