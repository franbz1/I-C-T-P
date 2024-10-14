// screens/Proyecto.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { getProjectById } from '../../Backend/services/ProjectoService'; // Importa la función de obtener proyecto

export default function Proyecto() {
    const route = useRoute();
    const { id } = route.params; // El ID del proyecto que pasamos en la navegación
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const fetchedProject = await getProjectById(id);
                setProject(fetchedProject);
            } catch (error) {
                Alert.alert("Error", "No se pudo cargar el proyecto.");
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#FFD700" />
            </View>
        );
    }

    if (!project) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text className="text-white">Proyecto no encontrado</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 p-4 bg-black">
            <View className="mb-4">
                <Text className="text-yellow-400 text-2xl font-bold">{project.name}</Text>
                <Text className="text-white mt-2">Número de Contrato: {project.contractNumber}</Text>
            </View>
            <Image 
                source={{ uri: project.image || 'https://via.placeholder.com/150' }} 
                style={{ height: 200, borderRadius: 8 }} 
                resizeMode="cover" 
                className="mb-4"
            />
            <View className="mb-4">
                <Text className="text-white">Fecha de Inicio: {project.startDate}</Text>
                <Text className="text-white">Fecha de Finalización: {project.endDate}</Text>
            </View>
        </View>
    );
}
