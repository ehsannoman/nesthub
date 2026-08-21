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
import ResidentDashboard from '../screens/resident/ResidentDashboard';
import ManagerDashboard from '../screens/manager/ManagerDashboard';

import { useAuth } from '../context/AuthContext';
import { colors } from '../constants/theme';


/* =========================================================
   NAVIGATORS
========================================================= */

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


/* =========================================================
   PLACEHOLDER SCREEN
========================================================= */

function PlaceholderScreen({ name }: { name: string }) {
  return (
    <View style={styles.center}>
      <Text style={styles.placeholderText}>
        {name} — coming soon
      </Text>
    </View>
  );
}


/* =========================================================
   TAB ICONS
========================================================= */

const residentTabIcons: Record<
  string,
  {
    active: keyof typeof Ionicons.glyphMap;
    inactive: keyof typeof Ionicons.glyphMap;
  }
> = {
  Home: {
    active: 'home',
    inactive: 'home-outline',
  },

  Services: {
    active: 'grid',
    inactive: 'grid-outline',
  },

  Activity: {
    active: 'time',
    inactive: 'time-outline',
  },

  Notifications: {
    active: 'notifications',
    inactive: 'notifications-outline',
  },

  Profile: {
    active: 'person',
    inactive: 'person-outline',
  },
};


const managerTabIcons: Record<
  string,
  {
    active: keyof typeof Ionicons.glyphMap;
    inactive: keyof typeof Ionicons.glyphMap;
  }
> = {
  Dashboard: {
    active: 'grid',
    inactive: 'grid-outline',
  },

  Notice: {
    active: 'megaphone',
    inactive: 'megaphone-outline',
  },

  Maintenance: {
    active: 'construct',
    inactive: 'construct-outline',
  },

  Finance: {
    active: 'card',
    inactive: 'card-outline',
  },

  More: {
    active: 'ellipsis-horizontal',
    inactive: 'ellipsis-horizontal',
  },
};


/* =========================================================
   CUSTOM TAB BAR
========================================================= */

function CustomTabBar({
  state,
  descriptors,
  navigation,
}: any) {
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
          route.name === 'Home' ||
          route.name === 'Services' ||
          route.name === 'Activity' ||
          route.name === 'Notifications' ||
          route.name === 'Profile'
            ? residentTabIcons[route.name]
            : managerTabIcons[route.name];

        const iconName = isFocused
          ? iconConfig.active
          : iconConfig.inactive;

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
            accessibilityState={
              isFocused
                ? { selected: true }
                : {}
            }
            accessibilityLabel={
              options.tabBarAccessibilityLabel
            }
            onPress={onPress}
            onLongPress={onLongPress}
            activeOpacity={0.75}
            style={styles.tabItem}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name={iconName}
                size={23}
                color={
                  isFocused
                    ? colors.primary
                    : colors.textMuted
                }
              />

              {/* Notification Badge */}
              {route.name === 'Notifications' && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    3
                  </Text>
                </View>
              )}
            </View>

            <Text
              style={[
                styles.tabLabel,
                isFocused && styles.tabLabelActive,
              ]}
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


/* =========================================================
   COMMON TAB OPTIONS
========================================================= */

const tabScreenOptions = {
  headerShown: false,

  tabBarShowLabel: false,

  tabBarHideOnKeyboard: true,

  tabBarStyle: {
    display: 'none' as const,
  },
};


/* =========================================================
   RESIDENT TABS
========================================================= */

function ResidentTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => (
        <CustomTabBar {...props} />
      )}
      screenOptions={tabScreenOptions}
    >
      <Tab.Screen
        name="Home"
        component={ResidentDashboard}
      />

      <Tab.Screen name="Services">
        {() => (
          <PlaceholderScreen name="Services" />
        )}
      </Tab.Screen>

      <Tab.Screen name="Activity">
        {() => (
          <PlaceholderScreen name="Activity" />
        )}
      </Tab.Screen>

      <Tab.Screen name="Notifications">
        {() => (
          <PlaceholderScreen name="Notifications" />
        )}
      </Tab.Screen>

      <Tab.Screen name="Profile">
        {() => (
          <PlaceholderScreen name="Profile" />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}


/* =========================================================
   MANAGER TABS
========================================================= */

function ManagerTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => (
        <CustomTabBar {...props} />
      )}
      screenOptions={tabScreenOptions}
    >
      <Tab.Screen
        name="Dashboard"
        component={ManagerDashboard}
      />

      <Tab.Screen name="Notice">
        {() => (
          <PlaceholderScreen name="Notice" />
        )}
      </Tab.Screen>

      <Tab.Screen name="Maintenance">
        {() => (
          <PlaceholderScreen name="Maintenance" />
        )}
      </Tab.Screen>

      <Tab.Screen name="Finance">
        {() => (
          <PlaceholderScreen name="Finance" />
        )}
      </Tab.Screen>

      <Tab.Screen name="More">
        {() => (
          <PlaceholderScreen name="More" />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}


/* =========================================================
   ROOT NAVIGATOR
========================================================= */

export default function RootNavigator() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!user ? (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
          />
        ) : user.role === 'manager' ? (
          <Stack.Screen
            name="ManagerTabs"
            component={ManagerTabs}
          />
        ) : (
          <Stack.Screen
            name="ResidentTabs"
            component={ResidentTabs}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}


/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({

  /* =======================================================
     PLACEHOLDER
  ======================================================= */

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },

  placeholderText: {
    fontSize: 16,
    color: colors.textMuted,
  },


  /* =======================================================
     BOTTOM TAB BAR
  ======================================================= */

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
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },


  /* =======================================================
     TAB ITEM
  ======================================================= */

  tabItem: {
    flex: 1,

    height: 64,

    alignItems: 'center',
    justifyContent: 'center',
  },


  /* =======================================================
     ICON
  ======================================================= */

  iconContainer: {
    width: 28,
    height: 28,

    alignItems: 'center',
    justifyContent: 'center',

    position: 'relative',
  },


  /* =======================================================
     LABEL
  ======================================================= */

  tabLabel: {
    marginTop: 4,

    color: colors.textMuted,

    fontSize: 10,
    lineHeight: 13,

    fontWeight: '500',

    textAlign: 'center',
  },

  tabLabelActive: {
    color: colors.primary,

    fontWeight: '700',
  },


  /* =======================================================
     NOTIFICATION BADGE
  ======================================================= */

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

  badgeText: {
    color: '#FFFFFF',

    fontSize: 9,
    lineHeight: 11,

    fontWeight: '700',

    textAlign: 'center',
  },
});