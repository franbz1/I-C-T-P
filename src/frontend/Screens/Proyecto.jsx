import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledTouchableOpacity = styled(TouchableOpacity)
const StyledScrollView = styled(ScrollView)
const StyledSafeAreaView = styled(SafeAreaView)

export default function ProjectManagement({ userRole = 'employee' }) {
    const [projects, setProjects] = useState([
        { id: 1, name: 'Project A', progress: 75 },
        { id: 2, name: 'Project B', progress: 30 },
        { id: 3, name: 'Project C', progress: 50 },
    ]);

    return (
        <StyledSafeAreaView className="flex-1 bg-black">
            <StyledView className="flex-row justify-between items-center p-4 border-b border-gray-700">
                <StyledText className="text-2xl font-bold text-white">
                    ICTP INGENIERIA
                </StyledText>
            </StyledView>
            <StyledScrollView className="flex-1 p-4">
                {projects.map((project) => (
                    <StyledTouchableOpacity
                        key={project.id}
                        className="mb-4 p-4 rounded-lg bg-neutral-800 shadow-md"
                    >
                        <StyledText className="text-lg font-semibold mb-2 text-white">
                            {project.name}
                        </StyledText>
                        <StyledView className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                            <StyledView
                                style={{ width: `${project.progress}%` }}
                                className="h-full bg-yellow-400"
                            />
                        </StyledView>
                        <StyledText className="mt-2 text-gray-300">
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
