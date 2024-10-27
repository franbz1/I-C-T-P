import React, { useState, useContext } from 'react';
import { Alert, Image, Pressable, Switch, Text, TextInput, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../firebase";
import { AuthContext } from '../../Backend/auth/authContext';

const logo = "https://firebasestorage.googleapis.com/v0/b/prueba-1-e983b.appspot.com/o/images%2FLocal%2FWhatsApp_Image_2024-09-30_at_9.06.58_PM-removebg-preview-6cdfcmBb4-transformed.png?alt=media&token=a89a1306-f29f-44cd-b319-1a5776230ad9";

export default function Login() {    
    const [rememberMe, setRememberMe] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { setUser } = useContext(AuthContext);

    const handleLogin = async () => {
        if (!email || !password) return Alert.alert("Error", "Por favor, completa todos los campos.");
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return Alert.alert("Error", "Ingresa un correo electrónico válido.");

        setLoading(true);
        try {
            const { user } = await signInWithEmailAndPassword(auth, email, password);
            setUser(user);
        } catch (error) {
            const errorMessages = {
                'auth/user-not-found': "No se encontró ningún usuario con este correo.",
                'auth/wrong-password': "Contraseña incorrecta.",
                'auth/invalid-email': "Correo electrónico inválido.",
                'auth/invalid-credential': "Credenciales inválidas."
            };
            Alert.alert("Error de Autenticación", errorMessages[error.code] || "Ocurrió un error al iniciar sesión.");
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) return Alert.alert("Error", "Por favor, ingresa tu correo electrónico para recuperar la contraseña.");

        try {
            await sendPasswordResetEmail(auth, email);
            Alert.alert("Éxito", "Se ha enviado un correo para restablecer tu contraseña.");
        } catch {
            Alert.alert("Error", "No se pudo enviar el correo de recuperación.");
        }
    };

    return (
        <SafeAreaView className="flex-1 items-center pt-16 bg-black">
            <Image source={{ uri: logo }} className="h-48 w-48" resizeMode='contain' />
            <Text className="text-3xl font-bold uppercase text-center py-10 text-yellow-400">Bienvenido</Text>
            
            <View className="w-full px-10 space-y-4 mb-1">
                <TextInput
                    className="h-12 px-5 border border-yellow-400 rounded-md bg-white text-black"
                    placeholder="EMAIL"
                    placeholderTextColor="#666"
                    value={email}
                    onChangeText={setEmail}
                    autoCorrect={false}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                <View className="flex-row items-center h-12 border border-yellow-400 rounded-md bg-white">
                    <TextInput
                        className="flex-1 px-5 text-black"
                        placeholder="CONTRASEÑA"
                        placeholderTextColor="#666"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                        autoCorrect={false}
                        autoCapitalize="none"
                    />
                    <Pressable onPress={() => setShowPassword(!showPassword)} className="px-3">
                        <Text className="text-yellow-400">{showPassword ? '🙈' : '👁️'}</Text>
                    </Pressable>
                </View>
            </View>
            
            <View className="w-full px-12 flex-row justify-between items-center mb-2">
                <View className="flex-row items-center space-x-1">
                    <Switch
                        value={rememberMe}
                        onValueChange={setRememberMe}
                        trackColor={{ true: "#FFC107", false: "#333" }}
                        thumbColor={rememberMe ? "#FFD700" : "#f4f3f4"}
                    />
                    <Text className="text-sm text-white">Recordarme</Text>
                </View>
                <Pressable onPress={handleForgotPassword}>
                    <Text className="text-xs text-yellow-400">Recuperar contraseña</Text>
                </Pressable>
            </View>

            <View className="w-full px-12 space-y-2">
                <Pressable
                    className="bg-yellow-400 h-11 border border-yellow-500 rounded-md items-center justify-center"
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#000" />
                    ) : (
                        <Text className="text-black text-lg font-bold">ENTRAR</Text>
                    )}
                </Pressable>
                <Text className="text-center text-white text-sm">INICIAR SESIÓN CON</Text>
            </View>
            

            <Text className="text-center text-white">
                ¿Problemas? 
                <Text className="text-yellow-400 text-sm"> Contáctanos</Text>
            </Text>
        </SafeAreaView>
    );
}
