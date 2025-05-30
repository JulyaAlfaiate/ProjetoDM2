import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
  ActivityIndicator,
  Alert,
  Dimensions
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, Entypo, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { getPets, toggleFavorite } from '../services/petsApi';
import colors from "../../colors";



const { width } = Dimensions.get('window');

export default function Home() {
  const navigation = useNavigation();
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('clinica'); // 'clinica' ou 'pets'

  const categories = [
    { label: "Todos", icon: "paw" },
    { label: "Cachorros", icon: "dog" },
    { label: "Gatos", icon: "cat" },
    { label: "Aves", icon: "crow" },
    { label: "Outros", icon: "kiwi-bird" }
  ];

  const [activeCategory, setActiveCategory] = useState("Todos");

  const fetchPets = async () => {
    try {
      setLoading(true);
      const petsData = await getPets();
      setPets(petsData);
      setFilteredPets(petsData);
    } catch (error) {
      console.error("Error fetching pets:", error);
      Alert.alert("Erro", "Não foi possível carregar os pets. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const handleToggleFavorite = async (id) => {
    try {
      const updatedPets = await toggleFavorite(id);
      setPets(updatedPets);
      setFilteredPets(
        activeCategory === "Todos"
          ? updatedPets
          : updatedPets.filter((p) => p.category === activeCategory)
      );
    } catch (error) {
      console.error("Error escalando favorito:", error);
    }
  };

  const filterByCategory = (category) => {
    setActiveCategory(category);
    if (category === "Todos") return setFilteredPets(pets);
    const filtered = pets.filter((p) => p.category === category);
    setFilteredPets(filtered);
  };

  const handleCallButton = () => {
    Linking.openURL(`tel:${'SEU_NUMERO_DE_TELEFONE'}`);
  };

  const renderPet = ({ item }) => (
    <TouchableOpacity
      style={styles.petCard}
      onPress={() => navigation.navigate("PetDetails", { pet: item })}
    >
      <Image 
        source={{ uri: item.imageUrl }} 
        style={styles.image}
        defaultSource={require('../../assets/default-pet.png')}
      />
      <TouchableOpacity
        style={styles.heartIcon}
        onPress={(e) => {
          e.stopPropagation();
          handleToggleFavorite(item.id);
        }}
      >
        <AntDesign
          name={item.favorited ? "heart" : "hearto"}
          size={24}
          color={item.favorited ? "#ff4444" : "#fff"}
        />
      </TouchableOpacity>
      <View style={styles.petInfo}>
        <Text style={styles.petName}>{item.name}</Text>
        <Text style={styles.petBreed}>{item.breed || "Raça não especificada"}</Text>
        <View style={styles.petDetails}>
          <Ionicons name="location-outline" size={14} color={colors.gray} />
          <Text style={styles.details}> {item.location || "Local não informado"}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
if (loading) {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loadingText}>Carregando dados...</Text>
    </View>
  );
}
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: "https://i.pravatar.cc/300" }}
          style={styles.profileImage}
        />
        <View style={styles.headerTextContainer}>
          <Text style={styles.welcomeText}>Bem-vindo à</Text>
          <Text style={styles.clinicName}>Clínica Veterinária PetLove</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'clinica' && styles.activeTab]}
          onPress={() => setActiveTab('clinica')}
        >
          <FontAwesome5 name="clinic-medical" size={20} color={activeTab === 'clinica' ? '#fff' : colors.primary} />
          <Text style={[styles.tabText, activeTab === 'clinica' && styles.activeTabText]}>Nossa Clínica</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'pets' && styles.activeTab]}
          onPress={() => setActiveTab('pets')}
        >
          <FontAwesome5 name="paw" size={20} color={activeTab === 'pets' ? '#fff' : colors.primary} />
          <Text style={[styles.tabText, activeTab === 'pets' && styles.activeTabText]}>Pets para Adoção</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'clinica' ? (
        <ScrollView contentContainerStyle={styles.clinicContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee' }}
            style={styles.clinicImage}
          />
          <Text style={styles.sectionTitle}>Sobre Nossa Clínica</Text>
          <Text style={styles.clinicDescription}>
            A Clínica Veterinária PetLove oferece os melhores cuidados para seu pet, 
            com profissionais especializados e equipamentos de última geração.
          </Text>
          
          <Text style={styles.sectionTitle}>Nossos Serviços</Text>
          <View style={styles.serviceItem}>
            <Ionicons name="medkit-outline" size={24} color={colors.primary} />
            <Text style={styles.serviceText}>Consultas e Exames</Text>
          </View>
          <View style={styles.serviceItem}>
            <Ionicons name="cut-outline" size={24} color={colors.primary} />
            <Text style={styles.serviceText}>Banho e Tosa</Text>
          </View>
          <View style={styles.serviceItem}>
            <Ionicons name="medal-outline" size={24} color={colors.primary} />
            <Text style={styles.serviceText}>Vacinação</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.scheduleButton}
            onPress={handleCallButton}
          >
            <FontAwesome5 name="calendar-alt" size={16} color="#fff" />
            <Text style={styles.scheduleButtonText}>Agendar Consulta</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <View style={styles.petsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
            contentContainerStyle={styles.categoryContainer}
          >
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.label}
                style={[
                  styles.categoryButton,
                  activeCategory === cat.label && styles.activeCategory,
                ]}
                onPress={() => filterByCategory(cat.label)}
              >
                <FontAwesome5
                  name={cat.icon}
                  size={16}
                  color={activeCategory === cat.label ? "#fff" : colors.gray}
                />
                <Text
                  style={[
                    styles.categoryText,
                    activeCategory === cat.label && styles.activeCategoryText,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {filteredPets.length > 0 ? (
            <FlatList
              data={filteredPets}
              numColumns={2}
              columnWrapperStyle={styles.columnWrapper}
              renderItem={renderPet}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="paw-outline" size={48} color={colors.gray} />
              <Text style={styles.emptyText}>Nenhum pet encontrado</Text>
            </View>
          )}
        </View>
      )}

      {/* Botão Flutuante */}
      <TouchableOpacity
        style={[styles.floatingButton, styles.favoritesButton]}
        onPress={() => navigation.navigate("Favoritos")}
      >
        <Entypo name="heart" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: colors.primary,
    paddingTop: 50,
  },
  headerTextContainer: {
    marginLeft: 15,
  },
  welcomeText: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.8,
  },
  clinicName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 5,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#fff",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  activeTabText: {
    color: '#fff',
  },
  clinicContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  clinicImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.dark,
    marginTop: 20,
    marginBottom: 10,
  },
  clinicDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 10,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  serviceText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#444',
  },
  petsContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  scheduleButton: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 30,
  },
  scheduleButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 10,
    fontSize: 16,
  },
  categoryScroll: {
    marginVertical: 15,
  },
  categoryContainer: {
    paddingBottom: 5,
  },
  categoryButton: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activeCategory: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    color: colors.gray,
    marginLeft: 5,
  },
  activeCategoryText: {
    color: "#fff",
  },
  list: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 15,
  },
  petCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: width * 0.45,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 15,
  },
  image: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  heartIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 20,
    padding: 6,
  },
  petInfo: {
    padding: 12,
  },
  petName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.dark,
    marginBottom: 4,
  },
  petBreed: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 8,
  },
  petDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  details: {
    fontSize: 12,
    color: colors.gray,
    marginLeft: 5,
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  favoritesButton: {
    backgroundColor: "#ff4444",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: colors.gray,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  emptyText: {
    fontSize: 16,
    color: colors.gray,
    marginTop: 16,
  },
});