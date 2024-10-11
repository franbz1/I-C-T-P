import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { useColorScheme } from 'nativewind';

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledTouchableOpacity = styled(TouchableOpacity)
const StyledScrollView = styled(ScrollView)
const StyledSafeAreaView = styled(SafeAreaView)

export default function ProjectManagement({ userRole = 'employee' }) {
    const { colorScheme, toggleColorScheme } = useColorScheme();
    const [projects, setProjects] = useState([
    { id: 1, name: 'Project A', progress: 75 },
    { id: 2, name: 'Project B', progress: 30 },
    { id: 3, name: 'Project C', progress: 50 },
    ]);

    const isDarkMode = colorScheme === 'dark';

    return (
    <StyledSafeAreaView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <StyledView className="flex-row justify-between items-center p-4 border-b border-gray-300 dark:border-gray-700">
        <StyledText className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
            ICTP INGENIERIA
        </StyledText>
        <Switch value={isDarkMode} onValueChange={toggleColorScheme} />
        </StyledView>
        <StyledScrollView className="flex-1 p-4">
        {projects.map((project) => (
            <StyledTouchableOpacity
            key={project.id}
            className={`mb-4 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}
            >
            <StyledText className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                {project.name}
            </StyledText>
            <StyledView className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
                <StyledView
                style={{ width: `${project.progress}%` }}
                className="h-full bg-yellow-400"
                />
            </StyledView>
            <StyledText className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Progress: {project.progress}%
            </StyledText>
            </StyledTouchableOpacity>
        ))}
        </StyledScrollView>
        
        {userRole === 'employer' && (
        <StyledTouchableOpacity
            className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-yellow-400 items-center justify-center shadow-lg"
        >
            <StyledText className="text-black text-3xl">+</StyledText>
        </StyledTouchableOpacity>
        )}
    </StyledSafeAreaView>
    );
}