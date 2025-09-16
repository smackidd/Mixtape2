import AsyncStorage from '@react-native-async-storage/async-storage';

const searchSpotify = async (query, type="track,artist,album") => {
    const accessToken = await AsyncStorage.getItem('token');
    try {
      const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=${type}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      const data = await response.json();
      console.log("search ", data.tracks.items);
      return data;
    } catch (err) {
        console.log(err.message);
    }
  }

  export {searchSpotify}