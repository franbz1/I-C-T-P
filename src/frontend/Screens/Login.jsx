// Login.js
import React, { useState } from 'react';
import { Alert, Image, Pressable, SafeAreaView, Switch, Text, TextInput, View, ActivityIndicator } from 'react-native';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";

const logo = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-GkqMfAxb66KRlDaOA5VdYBtk6PTLhN.jpg";
const facebook = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder.svg?height=40&width=40";
const linkedin = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder.svg?height=40&width=40";
const tiktok = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder.svg?height=40&width=40";

export default function Login() {
    const [rememberMe, setRememberMe] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Por favor, completa todos los campos.");
            return;
        }

        // Validar formato de correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert("Error", "Ingresa un correo electrónico válido.");
            return;
        }

        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            Alert.alert("¡Inicio de sesión exitoso!", "Bienvenido de nuevo.");
            // Navegar a otra pantalla, por ejemplo:
            // navigation.navigate('Home');
        } catch (error) {
            let errorMessage = "Ocurrió un error al iniciar sesión.";
            if (error.code === 'auth/user-not-found') {
                errorMessage = "No se encontró ningún usuario con este correo.";
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = "Contraseña incorrecta.";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "Correo electrónico inválido.";
            } else if (error.code === 'auth/invalid-credential') {
                errorMessage = "Credenciales inválidas.";
            }
            Alert.alert("Error de Autenticación", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            Alert.alert("Error", "Por favor, ingresa tu correo electrónico para recuperar la contraseña.");
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            Alert.alert("Éxito", "Se ha enviado un correo para restablecer tu contraseña.");
        } catch (error) {
            Alert.alert("Error", "No se pudo enviar el correo de recuperación.");
        }
    };

    return (
        <SafeAreaView className="flex-1 items-center pt-16 bg-black">
            <Image source={{ uri: logo }} className="h-40 w-40" resizeMode='contain' />
            <Text className="text-3xl font-bold uppercase text-center py-10 text-yellow-400">Bienvenido</Text>
            <View className="w-full px-10 space-y-4 mb-1">
                <TextInput
                    className="h-12 px-5 border border-yellow-400 rounded-md bg-white text-black"
                    placeholder='EMAIL'
                    placeholderTextColor="#666"
                    value={email}
                    onChangeText={setEmail}
                    autoCorrect={false}
                    autoCapitalize='none'
                    keyboardType='email-address'
                />
                <TextInput
                    className="h-12 px-5 border border-yellow-400 rounded-md bg-white text-black"
                    placeholder='CONTRASEÑA'
                    placeholderTextColor="#666"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    autoCorrect={false}
                    autoCapitalize='none'
                />
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
            
            <View className="flex-row space-x-4 items-center justify-center mt-2 mb-6">
                <Pressable onPress={() => Alert.alert("Funcionalidad en desarrollo", "Inicio de sesión con Facebook.")}>
                    <Image source={{ uri: facebook }} className="w-10 h-10" />
                </Pressable>
                <Pressable onPress={() => Alert.alert("Funcionalidad en desarrollo", "Inicio de sesión con TikTok.")}>
                    <Image source={{ uri: tiktok }} className="w-10 h-10" />
                </Pressable>
                <Pressable onPress={() => Alert.alert("Funcionalidad en desarrollo", "Inicio de sesión con LinkedIn.")}>
                    <Image source={{ uri: linkedin }} className="w-10 h-10" />
                </Pressable>
            </View>

            <Text className="text-center text-white">
                ¿Problemas?
                <Text className="text-yellow-400 text-sm"> Contáctanos</Text>
            </Text>
        </SafeAreaView>
    );
}
