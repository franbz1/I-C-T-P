import React, { useState } from 'react';
import { View, Text, Pressable, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Collapsible from 'react-native-collapsible';
import * as Animatable from 'react-native-animatable';

export default function ProjectCard({ project, onDelete }) {
    const navigation = useNavigation();
    const [isCollapsed, setIsCollapsed] = useState(true);

    const handleNavigate = () => navigation.navigate('Proyecto', { id: project.id });

    const handleDelete = () => {
        Alert.alert(
            'Eliminar Proyecto',
            `¿Estás seguro de que deseas eliminar el proyecto "${project.Nombre}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Eliminar', style: 'destructive', onPress: () => onDelete(project.id) },
            ]
        );
    };

    const toggleCollapse = () => {
        setIsCollapsed((prev) => !prev)
    };

    return (
        <Animatable.View
            animation="fadeIn"
            duration={600}
            className="w-[48%] bg-neutral-800 m-1 p-4 rounded-lg shadow-lg"
        >
            <Pressable onPress={toggleCollapse}>
                <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-white text-lg font-semibold">{project.Nombre}</Text>
                    <Text className="text-sm text-gray-400">
                        {isCollapsed ? '▼' : '▲'}
                    </Text>
                </View>
            </Pressable>

            <Collapsible collapsed={isCollapsed} duration={400}>
                <Animatable.View animation={!isCollapsed ? 'fadeInDown' : 'fadeOutUp'}>
                    <Image
                        source={{ uri: project.Imagen }}
                        style={{ height: 120, borderRadius: 8 }}
                        resizeMode="cover"
                        className="mb-3"
                    />
                    <Pressable
                        onPress={handleDelete}
                        className="bg-red-500 py-1 px-3 rounded mb-2"
                    >
                        <Text className="text-white text-center">Eliminar Proyecto</Text>
                    </Pressable>
                </Animatable.View>
            </Collapsible>

            <Pressable
                onPress={handleNavigate}
                className="mt-2 bg-blue-500 py-2 px-3 rounded"
            >
                <Text className="text-white text-center">Ver Detalles</Text>
            </Pressable>
        </Animatable.View>
    );
}
