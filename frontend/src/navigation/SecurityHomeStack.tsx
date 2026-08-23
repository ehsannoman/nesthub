import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SecurityDashboard from '../screens/security/SecurityDashboard';
import QRScannerScreen from '../screens/security/QRScannerScreen';
import VisitorEntryResultScreen from '../screens/security/VisitorEntryResultScreen';
import AddVisitorScreen from '../screens/security/AddVisitorScreen';
import AddPackageScreen from '../screens/security/AddPackageScreen';
import VehicleCheckScreen from '../screens/security/VehicleCheckScreen';
import ReportIncidentScreen from '../screens/security/ReportIncidentScreen';
import EmergencyAlertScreen from '../screens/security/EmergencyAlertScreen';

const Stack = createNativeStackNavigator();

export default function SecurityHomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SecurityDashboard" component={SecurityDashboard} />
      <Stack.Screen name="QRScanner" component={QRScannerScreen} />
      <Stack.Screen name="VisitorEntryResult" component={VisitorEntryResultScreen} />
      <Stack.Screen name="AddVisitor" component={AddVisitorScreen} />
      <Stack.Screen name="AddPackage" component={AddPackageScreen} />
      <Stack.Screen name="VehicleCheck" component={VehicleCheckScreen} />
      <Stack.Screen name="ReportIncident" component={ReportIncidentScreen} />
      <Stack.Screen name="EmergencyAlert" component={EmergencyAlertScreen} />
    </Stack.Navigator>
  );
}