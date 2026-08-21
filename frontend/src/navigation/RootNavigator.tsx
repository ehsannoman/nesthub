import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import { useAuth } from '../context/AuthContext';
import ResidentDashboard from '../screens/resident/ResidentDashboard';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Home" component={ResidentDashboard} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, fontWeight: '600' },
  role: { fontSize: 16, color: '#666', marginTop: 8 },
  logout: { marginTop: 24, color: 'red', fontSize: 16 },
});