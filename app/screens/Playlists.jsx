import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { getNextUsersPlaylists, getUsersPlaylists } from '../../api_calls/Playlists';
import BrowseHeader from '../../components/BrowseHeader';
import SpotifyPlaylist from '../../components/SpotifyPlaylist';

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();
  const previousScreen = () => {
    navigation.goBack();
  }

  const playlistData = async () => {
    try {
      //console.log("here");
      let newPlaylists;
      let offset = 0;
      let next = null;
      do {
        const limit = 50;
        newPlaylists = await getUsersPlaylists(limit, offset);
        if (newPlaylists.items.length > 0) {
          const newPlaylistsItems = newPlaylists.items;
          setPlaylists(playlists => [...playlists, ...newPlaylistsItems]);
        }
        next = newPlaylists.next;
        console.log("newPlaylists count ", newPlaylists.items.length);
        console.log("next ", next);
        offset = offset + limit;
      } while(next);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    } 
  }

  useEffect(() => {
    playlistData();
  }, []);

  const getPlaylist = (id, name, image) => {
    navigation.navigate("SpotifyPlaylistTracks", {
      id,
      playlistName: name,
      playlistImage: image
    });
  }

  

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <BrowseHeader headerName={"Playlists"} closeScreen={previousScreen} />
          <ScrollView>
            <View style={styles.playlistsContainer}>
              {playlists.map((playlist, index) => (
                <View key={index}>
                  {playlist.images && playlist.images.length > 0 && (
                    <TouchableOpacity  onPress={() => getPlaylist(playlist.id, playlist.name, playlist.images[0])} style={styles.imageContainer}>
                    
                      <Image source={playlist.images[0]} style={styles.playlistImage} />
                      <Text style={styles.playlistName} numberOfLines={3} ellipsizeMode="tail">{playlist.name}</Text>
                      <Text style={styles.playlistDescription} numberOfLines={2} ellipsizeMode="tail">{playlist.description}</Text>
                    
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          </ScrollView>
        </>
      )
      }
    </View>
  )
}

export default Playlists

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: '#111', 
    padding: 5 
  },
  playlistsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 15,  
  },
  imageContainer: {
    
    width: 100,
    
    marginRight: 15,
    marginBottom: 15
  },   
  playlistImage: {
    height: 100,
    width: 100,
  },
  playlistName: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4
  },
  playlistDescription: {
    color: '#aaa',
    fontSize: 9,
  }
})