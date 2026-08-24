import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import {
  NavigationContainer,
} from '@react-navigation/native';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import {
  Ionicons,
} from '@expo/vector-icons';

import {
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import LoginScreen from '../screens/auth/LoginScreen';
import ManagerHomeStack from './ManagerHomeStack';
import ResidentHomeStack from './ResidentHomeStack';
import SecurityHomeStack from './SecurityHomeStack';
import VisitorsScreen from '../screens/security/VisitorsScreen';
import VehicleCheckScreen from '../screens/security/VehicleCheckScreen';
import DeliveriesScreen from '../screens/security/DeliveriesScreen';
import MoreScreen from '../screens/security/MoreScreen';

import { useAuth } from '../context/AuthContext';
import { colors } from '../constants/theme';

type TabIconConfig = { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap };
type TabIconMap = { [key: string]: TabIconConfig };

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function PlaceholderScreen({ name }: { name: string }) {
  return (
    <View style={styles.center}>
      <Text style={styles.placeholderText}>
        {name} — coming soon
      </Text>
    </View>
  );
}

const residentTabIcons: TabIconMap = {
  Home: { active: 'home', inactive: 'home-outline' },
  Services: { active: 'grid', inactive: 'grid-outline' },
  Activity: { active: 'time', inactive: 'time-outline' },
  Notifications: { active: 'notifications', inactive: 'notifications-outline' },
  Profile: { active: 'person', inactive: 'person-outline' },
};

const managerTabIcons: TabIconMap = {
  Dashboard: { active: 'grid', inactive: 'grid-outline' },
  Notice: { active: 'megaphone', inactive: 'megaphone-outline' },
  Maintenance: { active: 'construct', inactive: 'construct-outline' },
  Finance: { active: 'card', inactive: 'card-outline' },
  More: { active: 'ellipsis-horizontal', inactive: 'ellipsis-horizontal' },
};

const securityTabIcons: TabIconMap = {
  Home: { active: 'home', inactive: 'home-outline' },
  Visitors: { active: 'people', inactive: 'people-outline' },
  Vehicles: { active: 'car', inactive: 'car-outline' },
  Deliveries: { active: 'cube', inactive: 'cube-outline' },
  More: { active: 'ellipsis-horizontal', inactive: 'ellipsis-horizontal' },
};

function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.tabBar,
        {
          paddingBottom: Math.max(insets.bottom, 6),
          height: 68 + Math.max(insets.bottom, 6),
        },
      ]}
    >
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;
        const { options } = descriptors[route.key];

        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const iconConfig =
          residentTabIcons[route.name] ||
          managerTabIcons[route.name] ||
          securityTabIcons[route.name];

        const iconName = isFocused ? iconConfig.active : iconConfig.inactive;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            activeOpacity={0.75}
            style={styles.tabItem}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name={iconName}
                size={23}
                color={isFocused ? colors.primary : colors.textMuted}
              />

              {route.name === 'Notifications' && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>3</Text>
                </View>
              )}
            </View>

            <Text
              style={[styles.tabLabel, isFocused && styles.tabLabelActive]}
              numberOfLines={1}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const tabScreenOptions = {
  headerShown: false,
  tabBarShowLabel: false,
  tabBarHideOnKeyboard: true,
  tabBarStyle: { display: 'none' as const },
};

function ResidentTabs() {
  return (
    <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />} screenOptions={tabScreenOptions}>
      <Tab.Screen name="Home" component={ResidentHomeStack} />
      <Tab.Screen name="Services">{() => <PlaceholderScreen name="Services" />}</Tab.Screen>
      <Tab.Screen name="Activity">{() => <PlaceholderScreen name="Activity" />}</Tab.Screen>
      <Tab.Screen name="Notifications">{() => <PlaceholderScreen name="Notifications" />}</Tab.Screen>
      <Tab.Screen name="Profile">{() => <PlaceholderScreen name="Profile" />}</Tab.Screen>
    </Tab.Navigator>
  );
}

function ManagerTabs() {
  return (
    <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />} screenOptions={tabScreenOptions}>
      <Tab.Screen name="Dashboard" component={ManagerHomeStack} />
      <Tab.Screen name="Notice">{() => <PlaceholderScreen name="Notice" />}</Tab.Screen>
      <Tab.Screen name="Maintenance">{() => <PlaceholderScreen name="Maintenance" />}</Tab.Screen>
      <Tab.Screen name="Finance">{() => <PlaceholderScreen name="Finance" />}</Tab.Screen>
      <Tab.Screen name="More">{() => <PlaceholderScreen name="More" />}</Tab.Screen>
    </Tab.Navigator>
  );
}

function SecurityTabs() {
  return (
    <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />} screenOptions={tabScreenOptions}>
      <Tab.Screen name="Home" component={SecurityHomeStack} />
      <Tab.Screen name="Visitors" component={VisitorsScreen} />
      <Tab.Screen name="Vehicles" component={VehicleCheckScreen} />
      <Tab.Screen name="Deliveries" component={DeliveriesScreen} />
      <Tab.Screen name="More" component={MoreScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : user.role === 'manager' ? (
          <Stack.Screen name="ManagerTabs" component={ManagerTabs} />
        ) : user.role === 'security' ? (
          <Stack.Screen name="SecurityTabs" component={SecurityTabs} />
        ) : (
          <Stack.Screen name="ResidentTabs" component={ResidentTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  placeholderText: { fontSize: 16, color: colors.textMuted },

  tabBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8EEEE',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },

  tabItem: { flex: 1, height: 64, alignItems: 'center', justifyContent: 'center' },

  iconContainer: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center', position: 'relative' },

  tabLabel: {
    marginTop: 4,
    color: colors.textMuted,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  tabLabelActive: { color: colors.primary, fontWeight: '700' },

  badge: {
    position: 'absolute',
    top: -5,
    right: -8,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: { color: '#FFFFFF', fontSize: 9, lineHeight: 11, fontWeight: '700', textAlign: 'center' },
});