import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ManagerDashboard from '../screens/manager/ManagerDashboard';
import UserManagementScreen from '../screens/manager/UserManagementScreen';
import AIAssistantScreen from '../screens/manager/AIAssistantScreen';
import CreateNoticeScreen from '../screens/manager/CreateNoticeScreen';
import ComplaintManageScreen from '../screens/manager/ComplaintManageScreen';
import CreateBillScreen from '../screens/manager/CreateBillScreen';
import FacilityBookingsScreen from '../screens/manager/FacilityBookingsScreen';
import VisitorLogScreen from '../screens/manager/VisitorLogScreen';
import ManageFacilitiesScreen from '../screens/manager/ManageFacilitiesScreen';

const Stack = createNativeStackNavigator();

export default function ManagerHomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ManagerDashboard" component={ManagerDashboard} />
      <Stack.Screen name="UserManagement" component={UserManagementScreen} />
      <Stack.Screen name="AIAssistant" component={AIAssistantScreen} />
      <Stack.Screen name="CreateNotice" component={CreateNoticeScreen} />
      <Stack.Screen name="ComplaintManage" component={ComplaintManageScreen} />
      <Stack.Screen name="CreateBill" component={CreateBillScreen} />
      <Stack.Screen name="FacilityBookings" component={FacilityBookingsScreen} />
      <Stack.Screen name="VisitorLog" component={VisitorLogScreen} />
      <Stack.Screen name="ManageFacilities" component={ManageFacilitiesScreen} />
    </Stack.Navigator>
  );
}