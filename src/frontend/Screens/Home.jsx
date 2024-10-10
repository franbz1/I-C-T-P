import React, { useContext } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { AuthContext } from '../../Backend/auth/authContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebase';

export default function Home() {
    const { user } = useContext(AuthContext);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            Alert.alert("Éxito", "Has cerrado sesión.");
            // La navegación será manejada automáticamente por AppNavigator
        } catch (error) {
            Alert.alert("Error", "No se pudo cerrar sesión.");
        }
    };

    return (
        <View className="flex-1 bg-black items-center justify-center">
            <Text className="text-yellow-400 text-2xl mb-5">Bienvenido, {user.email}!</Text>
            <Pressable 
                className="bg-yellow-400 py-2 px-5 rounded"
                onPress={handleLogout}
            >
                <Text className="text-black text-lg font-bold">Cerrar Sesión</Text>
            </Pressable>
        </View>
    );
}
