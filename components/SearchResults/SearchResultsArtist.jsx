import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React from 'react'

const SearchResultsArtist = (props) => {
	const {searchResults, getArtist} = props;

  return (
    <View>
			{searchResults?.artists?.items
					?.filter(item => item)
					.map((item, index) => (
					<View key={index}>
						<TouchableOpacity   onPress={() => getArtist(item.id)}>
							{item.images && item.images.length > 2 && item.images[0].url ? (
								<View style={styles.artistContainer}>
									<View >
										<Image source={{ uri: item.images[item.images.length - 1].url }} style={styles.artistRowImage} />
									</View>
									<View style={styles.artistRowContainer}>
										<Text style={{color: "#fff", fontSize: 20}}>{item.name}</Text>
										
										<Text style={styles.artistRowType}>Artist</Text>
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

export default SearchResultsArtist

const styles = StyleSheet.create({
	artistContainer: {
    flex: 1,
    flexDirection: 'row',
   
    marginBottom: 5,
    marginLeft: 5   
  },
  artistRowImage: {
    height: 60,
    width: 60,
    margin: 5,
    marginHorizontal: 5,
		borderRadius: 50
  },
  artistRowContainer: {
    justifyContent: 'center',
    width: '85%',
   
  },
  artistRowType: {
    fontSize: 12,
    color: "#aaa",
    width: '90%'
  }	
})