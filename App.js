import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import Login from './app/screens/Login';
import List from './app/screens/List';
import Details from './app/screens/Details';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useCallback, useEffect, useState } from 'react';
import { FIREBASE_AUTH } from './FirebaseConfig';
import BottomTabNavigator from './BottomTabNavigator';
import * as SplashScreen from 'expo-splash-screen';
import AppLoading from 'expo-app-loading';
import {useFonts} from 'expo-font'
import LoadFonts from './hooks/useFonts';
import SpotifyLogin from './app/screens/SpotifyLogin';
import SpotifyBrowse from './app/screens/SpotifyBrowse';
import Artists from './app/screens/Artists';
import Artist from './app/screens/Artist';
import Album from './app/screens/Album';
import SpotifyArtistAlbums from './app/screens/SpotifyArtistAlbums';
import SpotifyPlaylistTracks from './app/screens/SpotifyPlaylistTracks';
import Albums from './app/screens/Albums';
import Playlists from './app/screens/Playlists';
import Moods from './app/screens/Moods';
import Categories from './app/screens/Categories';
import Category from './app/screens/Category';


const Stack = createNativeStackNavigator();

//const InsideStack = createNativeStackNavigator();




function SpotifySearchLayout() {
  const SpotifyStack = createNativeStackNavigator();

  return (
    <SpotifyStack.Navigator screenOptions={{ headerShown: true }}>
      <SpotifyStack.Screen name="Explore" component={SpotifyBrowse} 
        options={({ navigation }) => ({
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("SpotifyLogin")}
              style={{ marginLeft: 10 }}
            >
              <Ionicons name="log-in-outline" size={24} color="green" />
            </TouchableOpacity>
          ),
        })}
      />
      <SpotifyStack.Screen name="Artists" component={Artists} />
      <SpotifyStack.Screen name="Artist" component={Artist} />
      <SpotifyStack.Screen name="Album" component={Album} />
      <SpotifyStack.Screen name="Albums" component={Albums} />
      <SpotifyStack.Screen name="Playlists" component={Playlists} />
      <SpotifyStack.Screen name="Categories" component={Categories} />
      <SpotifyStack.Screen name="Category" component={Category} />
      <SpotifyStack.Screen name="Moods" component={Moods} />
      <SpotifyStack.Screen name="SpotifyArtistAlbums" component={SpotifyArtistAlbums} />
      <SpotifyStack.Screen name="SpotifyPlaylistTracks" component={SpotifyPlaylistTracks} />
    </SpotifyStack.Navigator>
  )
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
  );
}

// function AppStack() {


//   return (
    
//   );
// }


export default function App() {
  const [user, setUser] = useState(null);
  
  
  

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('user', user); 
      setUser(user); 
    });
  }, [])

  

  return ( 
    
    
    <NavigationContainer>
      {user ? 
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Group>
            <Stack.Screen name="Mixtape" component={BottomTabNavigator} />
          </Stack.Group>
          <Stack.Group screenOptions={{ presentation: 'modal' }}>
            <Stack.Screen name="SpotifyLogin" component={SpotifyLogin} />
            <Stack.Screen 
              name="SpotifyBrowse" 
              component={SpotifySearchLayout} 
            />
          </Stack.Group>
        </Stack.Navigator>
      : <AuthStack />}
    </NavigationContainer>
  );
  
}

const fonts = StyleSheet.create({
  
});

 
