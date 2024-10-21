import * as SQLite from 'expo-sqlite';

// Inicializar la base de datos SQLite (preguntar antes de modificar)
const openDatabaseAsync = async () => {
  const db = await SQLite.openDatabaseAsync('localData');
  
  // Activar el journal_mode a WAL para mejorar el rendimiento
  await db.execAsync(`PRAGMA journal_mode = WAL;`);

  // Crear tabla Proyectos
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS Proyectos (
      ProyectoID INTEGER PRIMARY KEY AUTOINCREMENT,
      Contrato VARCHAR(255) NOT NULL,
      Nombre VARCHAR(255) NOT NULL,
      FechaInicio DATE NOT NULL,
      FechaFin DATE NOT NULL,
      Empleados JSON,
      Imagen TEXT
    );
  `);

  // Crear tabla Empleados
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS Empleados (
      EmpleadoID INTEGER PRIMARY KEY AUTOINCREMENT,
      Cedula VARCHAR(20) NOT NULL,
      Nombres VARCHAR(255) NOT NULL,
      Apellidos VARCHAR(255) NOT NULL,
      Correo VARCHAR(255) NOT NULL,
      Telefono VARCHAR(20),
      Direccion TEXT,
      NombresAcudiente VARCHAR(255),
      TelefonoAcudiente VARCHAR(20),
      SeguroLaboral VARCHAR(255),
      EPS VARCHAR(255),
      TipoSangineo VARCHAR(5),
      Cargo VARCHAR(255),
      Proyectos JSON,
      Foto TEXT
    );
  `);

  // Crear tabla ComentarioContratista
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS ComentarioContratista (
      ComentarioID INTEGER PRIMARY KEY AUTOINCREMENT,
      ProyectoID INTEGER NOT NULL,
      Titulo VARCHAR(255) NOT NULL,
      Detalles TEXT NOT NULL,
      Resuelto BOOLEAN DEFAULT FALSE,
      FechaComentario TIMESTAMP NOT NULL,
      FechaResuelto TIMESTAMP,
      FOREIGN KEY (ProyectoID) REFERENCES Proyectos(ProyectoID)
    );
  `);

  // Crear tabla EntradaBitacora
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS EntradaBitacora (
      BitacoraID INTEGER PRIMARY KEY AUTOINCREMENT,
      ProyectoID INTEGER NOT NULL,
      Fecha TIMESTAMP NOT NULL,
      Detalles TEXT NOT NULL,
      Fotos JSON,
      Empleados JSON NOT NULL,
      FOREIGN KEY (ProyectoID) REFERENCES Proyectos(ProyectoID)
    );
  `);

  // Crear tabla FotosBitacora
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS FotosBitacora (
      FotoID INTEGER PRIMARY KEY AUTOINCREMENT,
      BitacoraID INTEGER NOT NULL,
      Url TEXT NOT NULL,
      FOREIGN KEY (BitacoraID) REFERENCES EntradaBitacora(BitacoraID)
    );
  `);

  // Crear tabla Informe
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS Informe (
      InformeID INTEGER PRIMARY KEY AUTOINCREMENT,
      ProyectoID INTEGER NOT NULL,
      Detalles TEXT NOT NULL,
      FOREIGN KEY (ProyectoID) REFERENCES Proyectos(ProyectoID)
    );
  `);

  // Crear tabla FotosInforme
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS FotosInforme (
      FotoID INTEGER PRIMARY KEY AUTOINCREMENT,
      InformeID INTEGER NOT NULL,
      Url TEXT NOT NULL,
      FOREIGN KEY (InformeID) REFERENCES Informe(InformeID)
    );
  `);

  // Crear tabla Empleado_Proyecto
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS Empleado_Proyecto (
      EmpleadoID INTEGER NOT NULL,
      ProyectoID INTEGER NOT NULL,
      FechaAsignacion TEXT NOT NULL,
      PRIMARY KEY (EmpleadoID, ProyectoID),
      FOREIGN KEY (EmpleadoID) REFERENCES Empleados(EmpleadoID),
      FOREIGN KEY (ProyectoID) REFERENCES Proyectos(ProyectoID)
    );
  `);
  
  return db;
};
 
export { openDatabaseAsync };
