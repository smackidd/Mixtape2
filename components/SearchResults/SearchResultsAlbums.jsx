import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React from 'react'

const SearchResultsAlbums = (props) => {
	const {searchResults, getAlbum} = props;

	const artistsNames = (artists) => {
    if (!artists || artists.length === 0) {
      return '';
    }
  
    // Map each artist to their name
    const artistNames = artists.map(artist => artist.name);
  
    // Concatenate the names with a delimiter
    return artistNames.join(' - ');
  }

  return (
    <View>
			{searchResults?.albums?.items
				?.filter(item => item)
				.map((item, index) => (
				<View key={index}>
					<TouchableOpacity  onPress={() => getAlbum(item.id)}>
						{item.images  ? (
							<View style={styles.albumContainer}>
								<View>
									<Image source={{ uri: item.images[0].url }} style={styles.albumRowImage} />
								</View>
								<View style={styles.albumRowContainer}>
									<Text numberOfLines={2} ellipsizeMode="tail" style={{color: "#fff", fontSize: 20}}>{item.name}</Text>
									<Text numberOfLines={2} ellipsizeMode="tail" style={styles.albumRowType}>Album - {artistsNames(item.artists)}</Text>
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

export default SearchResultsAlbums

const styles = StyleSheet.create({
	albumContainer: {
    flex: 1,
    flexDirection: 'row',
   
    marginBottom: 5,
    marginLeft: 5   
  },
  albumRowImage: {
    height: 60,
    width: 60,
    margin: 5,
    marginHorizontal: 5

  },
  albumRowContainer: {
    justifyContent: 'center',
    width: '85%',
  },
  albumRowType: {
    fontSize: 12,
    color: "#aaa",
    
  }	
})