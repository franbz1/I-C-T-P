// components/AddProjectCard.js
import React from 'react';
import { Text, Pressable } from 'react-native';

export default function AddProjectCard({ onAdd }) {
    return (
        <Pressable 
            onPress={onAdd}
            className="w-[48%] bg-neutral-800 m-1 p-4 rounded justify-center items-center"
        >
            <Text className="text-yellow-400 text-4xl">+</Text>
            <Text className="text-white mt-2">Añadir Proyecto</Text>
        </Pressable>
    );
}
