import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React from 'react'

const SearchResultsPlaylist = (props) => {
	const {searchResults, getPlaylist} = props;

  return (
    <View>
			{searchResults?.playlists?.items
				?.filter(item => item)
				.map((item, index) => (
					<View key={index}>
						<TouchableOpacity  onPress={() => getPlaylist(item.id, item.name, item.images[0])}>
							{item.images  ? (
								<View style={styles.playlistContainer}>
									<View>
										<Image source={{ uri: item.images[0].url }} style={styles.playlistRowImage} />
									</View>
									<View style={styles.playlistRowContainer}>
										<Text numberOfLines={2} ellipsizeMode="tail" style={{color: "#fff", fontSize: 20}}>{item.name}</Text>
										<Text numberOfLines={2} ellipsizeMode="tail" style={styles.playlistRowType}>Playlist - {item.description}</Text>
									</View>
								</View>
							) : (
								<Text style={{ color: '#fff' }}>{item.name}</Text>
							)}
						</TouchableOpacity>
					</View>  
			))}  
		</View>
  )
}

export default SearchResultsPlaylist

const styles = StyleSheet.create({
	playlistContainer: {
    flex: 1,
    flexDirection: 'row',
   
    marginBottom: 5,
    marginLeft: 5   
  },
  playlistRowImage: {
    height: 60,
    width: 60,
    margin: 5,
    marginHorizontal: 5

  },
  playlistRowContainer: {
    justifyContent: 'center',
    width: '85%',
  },
  playlistRowType: {
    fontSize: 12,
    color: "#aaa",
    
  }	
})