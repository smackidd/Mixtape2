import AsyncStorage from '@react-native-async-storage/async-storage';


const getProfile = async (navigation) => {
    const accessToken = await AsyncStorage.getItem('token');
    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer  ${accessToken}`
        }
      })

      if (response.status === 401) {
        console.log("token expired")
        await navigation.navigate("SpotifyLogin");
        return null;
      }
      

      const data = await response.json();
      console.log("me", data);
      return data;
    } catch (err) {
      console.log(err.message);
    }
}

export {getProfile};