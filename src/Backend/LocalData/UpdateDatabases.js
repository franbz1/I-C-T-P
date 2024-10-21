import { openDatabaseAsync } from './SQLiteDatabase';
import { syncFirebaseToSQLite } from './FirebaseSync';
import { updateSQLiteFromFirebase } from './SQLiteUpdate';
import { getLastUpdateDate, updateLastUpdateDate, createMetadataTable } from './SQLiteCommands';
import firestore from '../../../firebase';

const updateDatabases = async () => {
  const db = await openDatabaseAsync();

  // Crear la tabla Metadata si no existe
  await createMetadataTable(db);

  // Consultar la última fecha de actualización de Firebase
  const firebaseFecha = await firestore().collection('metadata').doc('lastUpdate').get();
  const firebaseUltimaFecha = firebaseFecha.exists ? firebaseFecha.data().fecha : null;

  // Obtener la última fecha de actualización de SQLite
  const sqliteUltimaFecha = await getLastUpdateDate(db);

  // Si Firebase tiene datos más recientes, sincronizar con SQLite
  if (firebaseUltimaFecha > sqliteUltimaFecha) {
    await syncFirebaseToSQLite(db);

    // Actualizar la fecha en SQLite después de la sincronización
    await updateLastUpdateDate(db, firebaseUltimaFecha);
  } else {
    // Si SQLite tiene datos más recientes, sincronizar SQLite con Firebase
    await updateSQLiteFromFirebase(db);
  }
};

export { updateDatabases };
