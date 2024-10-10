import React from 'react';
import { View, ActivityIndicator } from 'react-native';

const Loading = () => (
    <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" color="#FFD700" />
    </View>
);

export default Loading;
