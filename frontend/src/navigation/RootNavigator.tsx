import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

function PlaceholderHome() {
  const { user, logout } = useAuth();
  return (
    <View style={styles.center}>
      <Text style={styles.text}>Welcome, {user?.name}!</Text>
      <Text style={styles.role}>Role: {user?.role}</Text>
      <Text style={styles.logout} onPress={logout}>Logout</Text>
    </View>
  );
}

export default function RootNavigator() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Home" component={PlaceholderHome} />
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