import { StyleSheet, Text, View } from 'react-native'
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import theme from './styles/theme.style.js';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Tapes from './app/screens/Tapes.jsx';
import Account from './app/screens/Account.jsx';
import Create from './app/screens/Create.jsx';
import SpotifyLogin from './app/screens/SpotifyLogin.jsx';
import SpotifyBrowse from './app/screens/SpotifyBrowse';

const Tab = createBottomTabNavigator();


const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#6200ee',   // your theme.primary maybe
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Tapes') {
            iconName = 'music';
          } else if (route.name === 'Create') {
            iconName = 'plus-box';
          } else if (route.name === 'Account') {
            iconName = 'account';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      
      <Tab.Screen name="Tapes" component={Tapes} />
      <Tab.Screen name="Create" component={Create} />
      <Tab.Screen name="Account" component={Account} />
      
    </Tab.Navigator>
  )
}

export default BottomTabNavigator

const styles = StyleSheet.create({})