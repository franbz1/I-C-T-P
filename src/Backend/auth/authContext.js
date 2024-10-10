// context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase"; // Asegúrate de que la ruta sea correcta
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (usr) => {
            if (usr) {
                // Guardar el usuario en AsyncStorage para persistencia
                await AsyncStorage.setItem('user', JSON.stringify(usr));
                setUser(usr);
            } else {
                await AsyncStorage.removeItem('user');
                setUser(null);
            }
            if (initializing) setInitializing(false);
        });

        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};
