import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ManagerDashboard from '../screens/manager/ManagerDashboard';
import UserManagementScreen from '../screens/manager/UserManagementScreen';
import AIAssistantScreen from '../screens/manager/AIAssistantScreen';

const Stack = createNativeStackNavigator();

export default function ManagerHomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ManagerDashboard" component={ManagerDashboard} />
      <Stack.Screen name="UserManagement" component={UserManagementScreen} />
      <Stack.Screen name="AIAssistant" component={AIAssistantScreen} />
    </Stack.Navigator>
  );
}