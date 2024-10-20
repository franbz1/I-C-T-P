// BarraOpciones.js
import React, { useState, useContext } from "react";
import { View, Pressable, Text, Modal, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AuthContext } from "../../Backend/auth/authContext";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase";
import { useNavigation } from '@react-navigation/native';

export default function BarraOpciones() {
  const { user } = useContext(AuthContext);
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const navigation = useNavigation();

  const toggleUserModal = () => {
    setIsUserModalVisible(!isUserModalVisible);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("Éxito", "Has cerrado sesión.");
    } catch (error) {
      Alert.alert("Error", "No se pudo cerrar sesión.");
    }
  };

  const handleNomina = async () => {
    navigation.navigate('Nomina')
    toggleUserModal()
  }

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <>
      <View className="flex-row justify-between mb-2 px-4 pt-4">
        <Pressable onPress={handleGoBack}>
          <Feather name="chevron-left" size={32} color="#FFD700" />
        </Pressable>
        <Pressable onPress={toggleUserModal}>
          <Feather name="more-vertical" size={28} color="#FFD700" />
        </Pressable>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isUserModalVisible}
        onRequestClose={toggleUserModal}
      >
        <View className="flex-1 bg-black bg-opacity-50 justify-center items-center">
          <View className="w-4/5 bg-neutral-800 rounded-lg p-5 items-center">
            <Text className="text-lg font-bold text-yellow-400 mb-2">
              Opciones
            </Text>
            <Text className="text-base text-white mb-5">
              Nombre: {user.displayName || "Usuario"}
            </Text>
            <Pressable
              className="bg-gray-500 py-2 px-5 rounded-md mb-2"
              onPress={toggleUserModal}
            >
              <Text className="text-white">Cerrar</Text>
            </Pressable>
            <Pressable
              className="bg-gray-500 py-2 px-5 rounded-md mb-2"
              onPress={handleNomina}
            >
              <Text className="text-white">Nomina empresa</Text>
            </Pressable>
            <Pressable
              className="bg-yellow-400 py-2 px-5 rounded-md mb-2"
              onPress={handleLogout}
            >
              <Text className="text-black font-bold">Cerrar Sesión</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}
