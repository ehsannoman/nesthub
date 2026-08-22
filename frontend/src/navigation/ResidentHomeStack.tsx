import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ResidentDashboard from '../screens/resident/ResidentDashboard';
import InviteVisitorScreen from '../screens/resident/InviteVisitorScreen';

export type ResidentHomeStackParamList = {
  Dashboard: undefined;
  InviteVisitor: undefined;
};

const Stack = createNativeStackNavigator<ResidentHomeStackParamList>();

export default function ResidentHomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={ResidentDashboard} />
      <Stack.Screen name="InviteVisitor" component={InviteVisitorScreen} />
    </Stack.Navigator>
  );
}