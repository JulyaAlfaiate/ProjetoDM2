import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { freelancerApi } from '../services/freelancerApi'; 

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    async function loadFavs() {
  
      const pets = await getPets(); 
      setFavorites(pets.filter(p => p.favorited));
    }
    loadFavs();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.details}>{item.age} • {item.location}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favoritos</Text> 
      <FlatList
        data={favorites}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Cor Branca
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000000', // Texto Preto em fundo branco
  },
  list: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#e5e4fb', // Cor Secundária
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  details: {
    color: '#333333', 
  },
});