//De APP.JS.OLD actualizar para appLocalData.js

import React, { useState, useEffect } from 'react';
import { Text, View, Button, TextInput, StyleSheet, Alert } from 'react-native';
import { initializeFirebase } from './app/TestApis/firebaseConfig'; // Importar la función de inicialización
import * as SQLite from 'expo-sqlite';
import firestore from '@react-native-firebase/firestore';

// Inicializar la base de datos SQLite
const openDatabaseAsync = async () => {
  const db = await SQLite.openDatabaseAsync('usuariosDB');
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS usuarios (
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
  return db;
};

// Sincronizar Firebase con SQLite
const syncFirebaseToSQLite = async (db) => {
  const usuariosSnapshot = await firestore().collection('usuarios').get();
  usuariosSnapshot.forEach(async (doc) => {
    const usuario = doc.data();
    await db.runAsync(
      'INSERT OR IGNORE INTO usuarios (nombres, apellidos, correo, telefono, direccion, eps, contraseña, cargo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      usuario.nombres, usuario.apellidos, usuario.correo, usuario.telefono, usuario.direccion, usuario.eps, usuario.contraseña, usuario.cargo
    );
  });
};

// Insertar usuario en Firebase y SQLite
const insertarUsuario = async (db, nombres, apellidos, correo, telefono, direccion, eps, contraseña, cargo) => {
  const result = await db.runAsync(
    'INSERT INTO usuarios (nombres, apellidos, correo, telefono, direccion, eps, contraseña, cargo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    nombres, apellidos, correo, telefono, direccion, eps, contraseña, cargo
  );

  await firestore().collection('usuarios').add({
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

// Obtener usuario desde SQLite
const obtenerUsuarioPorCorreoYContraseña = async (db, correo, contraseña) => {
  const usuario = await db.getFirstAsync('SELECT * FROM usuarios WHERE correo = ? AND contraseña = ?', correo, contraseña);
  return usuario;
};

export default function App() {
  const [db, setDb] = useState(null);
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState('');

  useEffect(() => {
    // Inicializar Firebase
    initializeFirebase();

    // Inicializar la base de datos SQLite y sincronizar Firebase
    const setupDatabase = async () => {
      const database = await openDatabaseAsync();
      setDb(database);
      await syncFirebaseToSQLite(database);
    };

    setupDatabase();
  }, []);

  const handleLogin = async () => {
    if (correo === '' || contraseña === '') {
      Alert.alert('Error', 'Por favor, ingrese su correo y contraseña.');
      return;
    }

    if (db) {
      const usuario = await obtenerUsuarioPorCorreoYContraseña(db, correo, contraseña);

      if (usuario) {
        setIsLoggedIn(true);
        setNombreUsuario(`${usuario.nombres} ${usuario.apellidos}`);
      } else {
        Alert.alert('Error', 'Correo o contraseña incorrectos.');
      }
    }
  };

  const handleRegistro = async () => {
    if (db) {
      const result = await insertarUsuario(db, 'Nuevo', 'Usuario', correo, '1234567890', 'Calle Falsa 123', 'N/A', contraseña, 'Desarrollador');
      if (result) {
        Alert.alert('Éxito', 'Usuario registrado correctamente');
      }
    }
  };

  if (isLoggedIn) {
    return (
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Bienvenido, {nombreUsuario}!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Correo"
        value={correo}
        onChangeText={setCorreo}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={contraseña}
        onChangeText={setContraseña}
        secureTextEntry
      />
      <Button title="Iniciar Sesión" onPress={handleLogin} />
      <Text style={styles.orText}>o</Text>
      <Button title="Registrar Usuario" onPress={handleRegistro} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '80%',
  },
  orText: {
    marginVertical: 10,
    fontSize: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
