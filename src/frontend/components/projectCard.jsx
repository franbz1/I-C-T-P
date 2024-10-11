// components/ProjectCard.js
import React from 'react';
import { View, Text, Pressable, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ProjectCard({ project, onDelete }) {
    const navigation = useNavigation();

    const handleNavigate = () => {
        navigation.navigate('ProjectDetails', { id: project.id });
    };

    const handleDelete = () => {
        Alert.alert(
            "Eliminar Proyecto",
            `¿Seguro que deseas eliminar el proyecto "${project.name}"?`,
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Eliminar", style: "destructive", onPress: () => onDelete(project.id) }
            ]
        );
    };

    return (
        <Pressable 
            onPress={handleNavigate}
            className="w-[48%] bg-gray-800 m-1 p-4 rounded"
        >
            <View className="mb-2">
                <Text className="text-white text-lg font-bold">{project.name}</Text>
            </View>
            <Image 
                source={{ uri: project.image }} 
                style={{ height: 120, borderRadius: 8 }} 
                className="mb-2"
                resizeMode="cover"
            />
            <Pressable 
                onPress={handleDelete}
                className="bg-red-500 py-1 px-3 rounded"
            >
                <Text className="text-white text-center">Eliminar Proyecto</Text>
            </Pressable>
        </Pressable>
    );
}
