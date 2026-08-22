import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ResidentDashboard from '../screens/resident/ResidentDashboard';
import InviteVisitorScreen from '../screens/resident/InviteVisitorScreen';
import ReportComplaintScreen from '../screens/resident/ReportComplaintScreen';
import ComplaintDetailScreen from '../screens/resident/ComplaintDetailScreen';

export type ResidentHomeStackParamList = {
  Dashboard: undefined;
  InviteVisitor: undefined;
  ReportComplaint: undefined;
  ComplaintDetail: { complaint: any };
};

const Stack = createNativeStackNavigator<ResidentHomeStackParamList>();

export default function ResidentHomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={ResidentDashboard} />
      <Stack.Screen name="InviteVisitor" component={InviteVisitorScreen} />
      <Stack.Screen name="ReportComplaint" component={ReportComplaintScreen} />
      <Stack.Screen name="ComplaintDetail" component={ComplaintDetailScreen} />
    </Stack.Navigator>
  );
}