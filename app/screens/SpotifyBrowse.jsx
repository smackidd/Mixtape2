import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState, useLayoutEffect } from 'react'
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native'
import BrowseHeader from '../../components/BrowseHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProfile } from '../../api_calls/Profile';
import { getUserFollowedArtists } from '../../api_calls/Artists';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getUsersSavedAlbums } from '../../api_calls/Album';
import { getBrowseCategories, getCategoryPlaylists, getSingleBrowseCategoryWithId, getUsersPlaylists } from '../../api_calls/Playlists';


const SpotifyBrowse = () => {
  const navigation = useNavigation();
  const [userProfile, setUserProfile] = useState([]);
  const [userFollowedArtists, setUserFollowedArtists] = useState([]);
  const [userSavedAlbums, setUserSavedAlbums] = useState([]);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [browseCategories, setBrowseCategories] = useState([]);
  const [moodPlaylists, setMoodPlaylists] = useState([]);
  const [moreMoodPlaylists, setMoreMoodPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const getToken = async () => {
    const token = await AsyncStorage.getItem('token');
    return token ?? null; // will be null if undefined or missing
  }

  // useLayoutEffect(() => {
  //   console.log("setting button");
  //   navigation.setOptions({
  //     headerLeft: () => (
  //       <TouchableOpacity onPress={() => navigation.navigate("SpotifyLogin")} style={{ marginLeft: 10 }}>
  //         <Ionicons name="log-in-outline" size={24} color="green" />
  //       </TouchableOpacity>
  //     ),
  //   });
  // }, [navigation]);

  const CACHE_KEY = "spotifyBrowseCache";
  const CACHE_TTL = 1000 * 60 * 5; // 5 minutes
  
  const getBrowserData = async () => {
    try {
      // Try cached data first
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        const { timestamp, data } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL) {
          console.log("Using cached browse data");
          setUserProfile(data.profile);
          setUserFollowedArtists(data.followedArtists);
          setUserSavedAlbums(data.savedAlbums);
          setUserPlaylists(data.userPlaylists);
          setBrowseCategories(data.browseCategories);
          setMoodPlaylists(data.moodPlaylists);
          setMoreMoodPlaylists(data.moreMoodPlaylists);
          setLoading(false);
        }
      }

      // Fetch fresh data in background
      const profile = await getProfile(navigation);
      if (!profile) return;

      await AsyncStorage.setItem("country", profile.country);
      const followedArtists = await getUserFollowedArtists("", 20);
      const savedAlbums = await getUsersSavedAlbums();
      const userPlaylists = await getUsersPlaylists();
      const browseCategories = await getBrowseCategories();
      const moodPlaylists = await getCategoryPlaylists("Decades");
      const moreMoodPlaylists = await getSingleBrowseCategoryWithId("mood");

      const newData = {
        profile,
        followedArtists,
        savedAlbums,
        userPlaylists,
        browseCategories,
        moodPlaylists,
        moreMoodPlaylists,
      };

      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: newData }));

      setUserProfile(profile);
      setUserFollowedArtists(followedArtists);
      setUserSavedAlbums(savedAlbums);
      setUserPlaylists(userPlaylists);
      setBrowseCategories(browseCategories);
      setMoodPlaylists(moodPlaylists);
      setMoreMoodPlaylists(moreMoodPlaylists);
      setLoading(false);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getToken();
      console.log('token', token);
      if (token) {
        await getBrowserData();
      }
    };

  fetchToken();
  }, [])

  const artistsNames = (artists) => {
    if (!artists || artists.length === 0) {
      return '';
    }
  
    // Map each artist to their name
    const artistNames = artists.map(artist => artist.name);
  
    // Concatenate the names with a delimiter
    return artistNames.join(' - ');
  }

  const closeScreen = () => {
    navigation.goBack();
  } 

  const handleHorizontalScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY !== 0) {
      setScrollEnabled(false);
    } else {
      setScrollEnabled(true);
    }  
  }

  const getArtists = () => {
    console.log("getting artists")
    navigation.navigate("Artists");
  }

  const getArtist = (id) => {
    navigation.navigate("Artist", {
      id
    });
  }

  const getAlbums = () => {
    navigation.navigate("Albums");
  }

  const getAlbum = (id) => {
    navigation.navigate("Album", {
      id
    });
  }

  const getPlaylists = () => {
    console.log("getting playlists")
    navigation.navigate("Playlists");
  }

  const getPlaylist = (id, name, image) => {
    navigation.navigate("SpotifyPlaylistTracks", {
      id,
      playlistName: name,
      playlistImage: image
    });
  }

  const getMoods = () => {
    console.log("getting Moods");
    console.log("moodPlaylists.name", moreMoodPlaylists)
    navigation.navigate("Category", {
      id: moreMoodPlaylists.id, 
      categoryName: moreMoodPlaylists.name,
      categoryImage: moreMoodPlaylists.icons[0]
    });
  }

  const getCategories = () => {
    console.log("getting Categories")
    navigation.navigate("Categories");
  }

  const getCategory = (id, name, image) => {
    navigation.navigate("Category", {
      id, 
      categoryName: name,
      categoryImage: image
    })
  }

  return (
    <View style={styles.container} closeScreen={closeScreen}>
      {/* <BrowseHeader headerName="Explore" closeScreen={closeScreen} /> */}
      <ScrollView scrollEnabled={scrollEnabled} style={{marginBottom: 50 }}>
        <View style={styles.headersContainer} >
            <Text style={styles.headers}>Artists</Text>
            <TouchableOpacity style={styles.chevron} onPress={getArtists}>
              <Text style={{ color: '#aaa', fontSize: 20 }}>More</Text>
              <MaterialCommunityIcons name="chevron-right" color="#aaa" size={26} />
            </TouchableOpacity>
        </View>
        {loading ? (
          <Text style={{ color: "#fff" }}>Loading...</Text>
        ) : (
          <View>
            <ScrollView horizontal onScroll={handleHorizontalScroll}>
              {userFollowedArtists?.artists?.items
                ?.filter(item => item)
                .map((item, index) => (
                  <View key={index}>
                    <TouchableOpacity  style={{width: 120, alignItems: 'center'}} onPress={() => getArtist(item.id)}>
                      {item.images && item.images.length > 2 && item.images[2].url ? (
                        <>
                          <Image source={{ uri: item.images[item.images.length - 1].url }} style={styles.artistImage} />
                          <Text style={{color: "#fff"}}>{item.name}</Text>
                        </>
                      ) : (
                        <Text style={{ color: '#fff' }}>{item.name}</Text>
                      )}
                    </TouchableOpacity>
                  </View>
              ))}
            </ScrollView>
          </View>
        
          // </ScrollView>
        )}

        {/* Albums */}

        <View style={styles.headersContainer} >
            <Text style={styles.headers}>Albums</Text>
            <TouchableOpacity style={styles.chevron} onPress={getAlbums}>
              <Text style={{ color: '#aaa', fontSize: 20 }}>More</Text>
              <MaterialCommunityIcons name="chevron-right" color="#aaa" size={26} />
            </TouchableOpacity>
        </View>
        {loading ? (
          <Text style={{ color: "#fff" }}>Loading...</Text>
        ) : (
          <View>
            <ScrollView horizontal onScroll={handleHorizontalScroll}>
              {userSavedAlbums?.items
                ?.filter(item => item)
                .map((item, index) => (
                  <View key={index}>
                    <TouchableOpacity style={{width: 120, margin: 5}} onPress={() => getAlbum(item.album.id)}>
                      {item.album.images  ? (
                        <>
                          <Image source={{ uri: item.album.images[0].url }} style={styles.albumImage} />
                          <Text numberOfLines={2} ellipsizeMode="tail" style={{color: "#fff"}}>{item.album.name}</Text>
                          <Text numberOfLines={2} ellipsizeMode="tail" style={{color: "#aaa"}}>{artistsNames(item.album.artists)}</Text>
                        </>
                      ) : (
                        <Text style={{ color: '#fff' }}>{item.album.name}</Text>
                      )}
                    </TouchableOpacity>
                  </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Playlists */}

        <View style={styles.headersContainer} >
            <Text style={styles.headers}>Playlists</Text>
            <TouchableOpacity style={styles.chevron} onPress={getPlaylists}>
              <Text style={{ color: '#aaa', fontSize: 20 }}>More</Text>
              <MaterialCommunityIcons name="chevron-right" color="#aaa" size={26} />
            </TouchableOpacity>
        </View>
        {loading ? (
          <Text style={{ color: "#fff" }}>Loading...</Text>
        ) : (
          <View>
            <ScrollView horizontal onScroll={handleHorizontalScroll}>
              {userPlaylists?.items
                ?.filter(item => item)
                .map((item, index) => (
                  <View key={index}>
                    <TouchableOpacity style={{width: 120, margin: 5}} onPress={() => getPlaylist(item.id, item.name, item.images[0])}>
                      {item.images  ? (
                        <>
                          <Image source={{ uri: item.images[0].url }} style={styles.albumImage} />
                          <Text numberOfLines={2} ellipsizeMode="tail" style={{color: "#fff"}}>{item.name}</Text>
                          <Text numberOfLines={2} ellipsizeMode="tail" style={{color: "#aaa"}}>{item.description}</Text>
                        </>
                      ) : (
                        <Text style={{ color: '#fff' }}>{item.name}</Text>
                      )}
                    </TouchableOpacity>
                  </View>  
              ))}  
            </ScrollView>  
          </View>
          // </ScrollView>
        )}

        {/*Categories*/}


        <View style={styles.headersContainer} >
            <Text style={styles.headers}>Categories</Text>
            <TouchableOpacity style={styles.chevron} onPress={getCategories}>
              <Text style={{ color: '#aaa', fontSize: 20 }}>More</Text>
              <MaterialCommunityIcons name="chevron-right" color="#aaa" size={26} />
            </TouchableOpacity>
        </View>
        {loading ? (
          <Text style={{ color: "#fff" }}>Loading...</Text>
        ) : (
          <View>
            <ScrollView horizontal onScroll={handleHorizontalScroll}>
              {browseCategories?.categories?.items
                ?.filter(item => item)
                .map((item, index) => (
                  <View key={index}>
                    <TouchableOpacity style={{width: 120, margin: 5}} onPress={() => getCategory(item.id, item.name, item.icons[0])}>
                      {item.icons  ? (
                        <>
                          <Image source={{ uri: item.icons[0].url }} style={styles.albumImage} />
                          <Text numberOfLines={2} ellipsizeMode="tail" style={{color: "#fff"}}>{item.name}</Text>
                        </>
                      ) : (
                        <Text style={{ color: '#fff' }}>{item.name}</Text>
                      )}
                    </TouchableOpacity>
                  </View>  
              ))}  
            </ScrollView>  
          </View>
          // </ScrollView>
        )}

        {/*Mood Playlists*/}

        <View style={styles.headersContainer} >
            <Text style={styles.headers}>Mood</Text>
            <TouchableOpacity style={styles.chevron} onPress={getMoods}>
              <Text style={{ color: '#aaa', fontSize: 20 }}>More</Text>
              <MaterialCommunityIcons name="chevron-right" color="#aaa" size={26} />
            </TouchableOpacity>
        </View>
        {loading ? (
          <Text style={{ color: "#fff" }}>Loading...</Text>
        ) : (
          <View>
            <ScrollView horizontal onScroll={handleHorizontalScroll}>
              {moodPlaylists?.playlists?.items
                ?.filter(item => item)
                .map((item, index) => (
                  <View key={index}>
                    <TouchableOpacity style={{width: 120, margin: 5}} onPress={() => getPlaylist(item.id, item.name, item.images[0])}>
                      {item.images  ? (
                        <>
                          <Image source={{ uri: item.images[0].url }} style={styles.albumImage} />
                          <Text numberOfLines={2} ellipsizeMode="tail" style={{color: "#fff"}}>{item.name}</Text>
                          <Text numberOfLines={2} ellipsizeMode="tail" style={{color: "#aaa"}}>{item.description}</Text>
                        </>
                      ) : (
                        <Text style={{ color: '#fff' }}>{item.name}</Text>
                      )}
                    </TouchableOpacity>
                  </View>  
              ))}  
            </ScrollView>  
          </View>
          // </ScrollView>
        )}

      </ScrollView>
      
      
    </View>
  )
}

export default SpotifyBrowse

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: '#111'
  },
  
  
  headers: {
    color: "#fff",
    fontSize: 26,
    margin: 10
  },
  headersContainer: {
   
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  chevron: {
    flexDirection: 'row',
  },
  artistImage: {
    width: 100, // Adjust the width and height as needed
    height: 100,
    margin: 5, // Adjust the margin as needed
    borderRadius: 50,
  },
  albumImage: {
    width: 100,
    height: 100,
    marginBottom: 5
  }

})