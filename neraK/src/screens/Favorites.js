import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getFavoriteServices } from '../servicess/freelancerApi'; // Assuming you have this function
import { Ionicons } from '@expo/vector-icons'; // For icons
import colors from '../../colors'; // Assuming colors.js exists in parent directory

export default function Favorites() {
  const [favoriteServices, setFavoriteServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  // Function to load favorite services
  const loadFavoriteServices = async () => {
    try {
      // Here, you'd typically fetch services marked as favorite by the current user.
      // This might involve checking a 'favorites' subcollection in Firestore for the user,
      // or filtering services based on a 'favoritedBy' array field.
      // For now, I'm assuming `getFavoriteServices` fetches services already filtered by some criteria.
      const services = await getFavoriteServices(); // This function needs to be implemented in your freelancerApi.js
      setFavoriteServices(services);
    } catch (error) {
      console.error("Não foi possível carregar os serviços favoritos:", error);
      // Alert.alert("Erro", "Não foi possível carregar os serviços favoritos.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load favorites when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadFavoriteServices();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadFavoriteServices();
  }, []);

  // Renders each favorite service item
  const renderServiceItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ServiceDetails', { serviceId: item.id, service: item })} // Pass service object or just ID
    >
      <Image
        source={{ uri: item.imageUrl || 'https://placehold.co/600x400/E0E0E0/B0B0B0?text=Serviço' }}
        style={styles.image}
        defaultSource={require('../../assets/default-service.png')} // Provide a default service image
      />
      <View style={styles.infoContainer}>
        <Text style={styles.serviceName}>{item.name || item.title || "Serviço sem nome"}</Text>
        <Text style={styles.serviceCategory}>{item.category || "Categoria não definida"}</Text>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={14} color={colors.gray} />
          <Text style={styles.serviceLocation}>{item.location || "Localização não informada"}</Text>
        </View>
        {/* You can add more details like price, rating, etc. */}
        {/* <Text style={styles.servicePrice}>{item.price ? `R$ ${item.price}` : "Preço a combinar"}</Text> */}
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando seus favoritos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {favoriteServices.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-dislike-outline" size={60} color={colors.gray} />
          <Text style={styles.emptyText}>Você ainda não favoritou nenhum serviço.</Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => navigation.navigate('Início')} // Navigate to Home/Service listing screen
          >
            <Text style={styles.browseButtonText}>Explorar Serviços</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favoriteServices}
          keyExtractor={item => item.id.toString()}
          renderItem={renderServiceItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Light background color
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.gray,
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff', // White card background
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
    overflow: 'hidden', // Ensures image corners are rounded
  },
  image: {
    width: '100%',
    height: 180,
    // borderRadius: 10, // Already handled by card overflow hidden if image is first element
  },
  infoContainer: {
    padding: 15,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 5,
  },
  serviceCategory: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  serviceLocation: {
    fontSize: 13,
    color: colors.gray,
    marginLeft: 5,
  },
  servicePrice: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.success, // Or your theme's price color
    marginTop: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 17,
    color: colors.gray,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  browseButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
