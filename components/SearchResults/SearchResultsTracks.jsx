import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import SpotifySong from '../../components/SpotifySong';

const SearchResultsTracks = (props) => {
	const navigation = useNavigation();
	const {searchResults} = props;

  return (
    <View style={styles.songList}>
			{searchResults?.tracks?.items
				?.filter(item => item)
				.map((item, index) => (
					<TouchableOpacity key={index} onPress={() => {
							navigation.getParent()?.goBack();
							navigation.navigate({
									name: "Mixtape",
									params: {
										screen: "Create",
										params: { selectedSong: item },
									},
									merge: true, // 🔑 merge with the existing screen instead of pushing
								});
								//navigation.getParent()?.goBack(); // close Album modal
							}
					}>
						<SpotifySong song={item} type={"Song"}/>  
					</TouchableOpacity>  
				))}
		</View>
  )
}

export default SearchResultsTracks

const styles = StyleSheet.create({
	songList: {
    padding: 10
  },
})