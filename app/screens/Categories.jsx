import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { getBrowseCategories } from '../../api_calls/Playlists';
import BrowseHeader from '../../components/BrowseHeader';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();
  const previousScreen = () => {
    navigation.goBack();
  };

  const categoriesData = async () => {
    try{
      let newCategories;
      let offset = 0;
      let next = null;
      do {
        const limit = 50;
        newCategories = await getBrowseCategories(limit, offset);
        if (newCategories.categories.items.length > 0){
          const newCategoryItems = newCategories.categories.items;
          setCategories(categories => [...categories, ...newCategoryItems]);
        }
        next = newCategories.next;
        offset = offset + limit;
      } while(next);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    categoriesData();
  }, []);

  const getCategory = (id, name, image) => {
    navigation.navigate("Category", {
      id, 
      categoryName: name,
      categoryImage: image
    })
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <BrowseHeader headerName={"Categories"} closeScreen={previousScreen} />
          <ScrollView >
            <View style={styles.categoriesContainer}>
              {categories.map((category, index) => (
                <View key={index}>
                  <TouchableOpacity onPress={() => getCategory(category.id, category.name, category.icons[0])} sytle={styles.imageContainer}>
                    <Image source={category.icons[0]} style={styles.categoryImage} />
                    <Text style={styles.categoryName} numberOfLines={1} ellipsizeMode="tail">{category.name}</Text>
                  </TouchableOpacity>
                </View>
              ))}

            </View>
          </ScrollView>
        </>
      )}
    </View>
  )
}

export default Categories

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: '#111', 
    padding: 5 
  },
  categoriesContainer: {
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
  categoryImage: {
    height: 100,
    width: 100,
  },
  categoryName: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 20
  },
 
})