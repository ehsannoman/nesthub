import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ResidentDashboard from '../screens/resident/ResidentDashboard';
import InviteVisitorScreen from '../screens/resident/InviteVisitorScreen';
import ReportComplaintScreen from '../screens/resident/ReportComplaintScreen';
import ComplaintDetailScreen from '../screens/resident/ComplaintDetailScreen';
import BookFacilityScreen from '../screens/resident/BookFacilityScreen';
import FacilityCalendarScreen from '../screens/resident/FacilityCalendarScreen';
import BookingConfirmationScreen from '../screens/resident/BookingConfirmationScreen';
import BillsScreen from '../screens/resident/BillsScreen';
import BillDetailScreen from '../screens/resident/BillDetailScreen';

const Stack = createNativeStackNavigator();

export default function ResidentHomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={ResidentDashboard} />
      <Stack.Screen name="InviteVisitor" component={InviteVisitorScreen} />
      <Stack.Screen name="ReportComplaint" component={ReportComplaintScreen} />
      <Stack.Screen name="ComplaintDetail" component={ComplaintDetailScreen} />
      <Stack.Screen name="BookFacility" component={BookFacilityScreen} />
      <Stack.Screen name="FacilityCalendar" component={FacilityCalendarScreen} />
      <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
      <Stack.Screen name="Bills" component={BillsScreen} />
      <Stack.Screen name="BillDetail" component={BillDetailScreen} />
    </Stack.Navigator>
  );
}