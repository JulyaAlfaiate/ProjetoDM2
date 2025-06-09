import React, { useEffect, useState, useCallback } from "react";
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
  Dimensions,
  RefreshControl,
  TextInput,
  Platform,
} from "react-native";
// Importe o SafeAreaView da biblioteca correta
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import {
  AntDesign,
  Entypo,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { getServices, toggleFavoriteService } from "../servicess/freelancerApi";
import { auth } from "../servicess/firebase";
import colors from "../../colors";

const { width } = Dimensions.get("window");

export default function Home() {
  const navigation = useNavigation();
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("services");
  const [searchQuery, setSearchQuery] = useState("");

  const serviceCategories = [
    { label: "Todos", icon: "apps-outline" },
    { label: "Desenvolvimento", icon: "code-slash-outline" },
    { label: "Design Gráfico", icon: "brush-outline" },
    { label: "Redação & Tradução", icon: "language-outline" },
    { label: "Marketing Digital", icon: "megaphone-outline" },
    { label: "Consultoria", icon: "people-circle-outline" },
    { label: "Serviços Gerais", icon: "construct-outline" },
    { label: "Aulas Particulares", icon: "book-outline" },
  ];
  const [activeCategory, setActiveCategory] = useState("Todos");

  const fetchAllServices = async () => {
    try {
      setLoading(true);
      const servicesData = await getServices();
      setServices(servicesData || []);
      filterServices(servicesData || [], activeCategory, searchQuery);
    } catch (error) {
      console.error("Error fetching services:", error);
      Alert.alert(
        "Erro",
        "Não foi possível carregar os serviços. Tente novamente mais tarde."
      );
      setServices([]);
      setFilteredServices([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAllServices();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAllServices();
  }, []);

  const handleToggleFavorite = async (serviceId) => {
    try {
      await toggleFavoriteService(serviceId);
      const updatedServices = services.map((s) =>
        s.id === serviceId ? { ...s, favorited: !s.favorited } : s
      );
      setServices(updatedServices);
      filterServices(updatedServices, activeCategory, searchQuery);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      Alert.alert("Erro", "Não foi possível atualizar o favorito.");
    }
  };

  const filterServices = (currentServices, category, query) => {
    let tempServices = Array.isArray(currentServices)
      ? [...currentServices]
      : [];

    if (category !== "Todos") {
      tempServices = tempServices.filter((s) => s.category === category);
    }
    if (query && query.trim() !== "") {
      const lowerQuery = query.toLowerCase();
      tempServices = tempServices.filter(
        (s) =>
          s.name?.toLowerCase().includes(lowerQuery) ||
          s.description?.toLowerCase().includes(lowerQuery) ||
          s.category?.toLowerCase().includes(lowerQuery)
      );
    }
    setFilteredServices(tempServices);
  };

  const handleCategoryFilter = (category) => {
    setActiveCategory(category);
    filterServices(services, category, searchQuery);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    filterServices(services, activeCategory, query);
  };

  const handleContactPlatform = () => {
    Linking.openURL(
      `mailto:contato@nerakfreelancer.com?subject=Contato Plataforma Nerak`
    );
  };

  const renderServiceCard = ({ item }) => (
    <TouchableOpacity
      style={styles.serviceCard}
      onPress={() =>
        navigation.navigate("ServiceDetails", {
          serviceId: item.id,
          service: item,
        })
      }>
      <Image
        source={{
          uri:
            item.imageUrl ||
            "https://placehold.co/600x400/E0E0E0/B0B0B0?text=Serviço",
        }}
        style={styles.serviceImage}
        defaultSource={require("../../assets/default-service.png")}
      />
      <TouchableOpacity
        style={styles.heartIcon}
        onPress={(e) => {
          e.stopPropagation();
          handleToggleFavorite(item.id);
        }}>
        <AntDesign
          name={item.favorited ? "heart" : "hearto"}
          size={22}
          color={item.favorited ? colors.danger : "#a3090e"}
        />
      </TouchableOpacity>
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName} numberOfLines={1}>
          {item.name || item.title || "Serviço Profissional"}
        </Text>
        <Text style={styles.serviceCategoryName} numberOfLines={1}>
          {item.category || "Não categorizado"}
        </Text>
        <View style={styles.serviceLocationDetails}>
          <Ionicons name="location-outline" size={14} color={colors.gray} />
          <Text style={styles.detailsText}>
            {" "}
            {item.location || "Remoto/Não informado"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando serviços...</Text>
      </SafeAreaView>
    );
  }

  // Use SafeAreaView como o container principal da sua tela
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{
            uri:
              auth.currentUser?.photoURL ||
              "https://placehold.co/100x100/E0E0E0/B0B0B0?text=User",
          }}
          style={styles.profileImage}
        />
        <View style={styles.headerTextContainer}>
          <Text style={styles.welcomeText}>Bem-vindo(a) à</Text>
          <Text style={styles.platformName}>Nerak Freelancer</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={styles.menuButton}>
          <Ionicons name="menu" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Restante do seu código permanece igual... */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "services" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("services")}>
          <MaterialCommunityIcons
            name="briefcase-search-outline"
            size={20}
            color={activeTab === "services" ? "#fff" : colors.primary}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "services" && styles.activeTabText,
            ]}>
            Encontrar Serviços
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "platformInfo" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("platformInfo")}>
          <Ionicons
            name="information-circle-outline"
            size={22}
            color={activeTab === "platformInfo" ? "#fff" : colors.primary}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "platformInfo" && styles.activeTabText,
            ]}>
            Sobre a Nerak
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "platformInfo" ? (
        <ScrollView
          contentContainerStyle={styles.platformInfoContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
            />
          }>
          <Image
            source={require("../../assets/freelance-banner.png")}
            style={styles.platformImage}
          />
          <Text style={styles.sectionTitle}>
            Conectando Talentos a Oportunidades
          </Text>
          <Text style={styles.platformDescription}>
            A Nerak Freelancer é a sua plataforma completa para encontrar
            profissionais qualificados para os seus projetos ou para oferecer
            seus serviços e talentos para uma vasta rede de clientes.
            Facilitamos a conexão, negociação e realização de trabalhos
            freelancer.
          </Text>

          <Text style={styles.sectionTitle}>Como Funciona?</Text>
          <View style={styles.featureItem}>
            <Ionicons
              name="search-circle-outline"
              size={28}
              color={colors.primary}
            />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Descubra Talentos</Text>
              <Text style={styles.featureDescription}>
                Navegue por categorias, pesquise por habilidades e encontre o
                profissional ideal.
              </Text>
            </View>
          </View>
          <View style={styles.featureItem}>
            <Ionicons
              name="megaphone-outline"
              size={28}
              color={colors.primary}
            />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Publique Seus Serviços</Text>
              <Text style={styles.featureDescription}>
                Crie um perfil atraente, liste suas especialidades e alcance
                novos clientes.
              </Text>
            </View>
          </View>
          <View style={styles.featureItem}>
            <Ionicons
              name="shield-checkmark-outline"
              size={28}
              color={colors.primary}
            />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Negocie com Segurança</Text>
              <Text style={styles.featureDescription}>
                Utilize nossa plataforma para comunicação e acordos
                transparentes.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.contactButton}
            onPress={handleContactPlatform}>
            <Ionicons name="mail-outline" size={20} color="#fff" />
            <Text style={styles.contactButtonText}>Fale Conosco</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <View style={styles.servicesListingContainer}>
          <View style={styles.searchContainer}>
            <Ionicons
              name="search-outline"
              size={20}
              color={colors.gray}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar serviços, profissionais..."
              value={searchQuery}
              onChangeText={handleSearch}
              placeholderTextColor={colors.gray}
            />
            {searchQuery ? (
              <TouchableOpacity
                onPress={() => handleSearch("")}
                style={styles.clearSearchButton}>
                <Ionicons name="close-circle" size={20} color={colors.gray} />
              </TouchableOpacity>
            ) : null}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
            contentContainerStyle={styles.categoryContainer}>
            {serviceCategories.map((cat) => (
              <TouchableOpacity
                key={cat.label}
                style={[
                  styles.categoryButton,
                  activeCategory === cat.label && styles.activeCategoryButton,
                ]}
                onPress={() => handleCategoryFilter(cat.label)}>
                <Ionicons
                  name={cat.icon}
                  size={18}
                  color={activeCategory === cat.label ? "#fff" : colors.primary}
                />
                <Text
                  style={[
                    styles.categoryText,
                    activeCategory === cat.label && styles.activeCategoryText,
                  ]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {filteredServices.length > 0 ? (
            <FlatList
              data={filteredServices}
              numColumns={2}
              columnWrapperStyle={styles.columnWrapper}
              renderItem={renderServiceCard}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[colors.primary]}
                />
              }
            />
          ) : (
            <View style={styles.emptyListContainer}>
              <MaterialCommunityIcons
                name="briefcase-off-outline"
                size={60}
                color={colors.gray}
              />
              <Text style={styles.emptyListText}>
                Nenhum serviço encontrado para esta categoria ou busca.
              </Text>
              {activeCategory !== "Todos" || searchQuery !== "" ? (
                <TouchableOpacity
                  onPress={() => {
                    setActiveCategory("Todos");
                    setSearchQuery("");
                    filterServices(services, "Todos", "");
                  }}>
                  <Text style={styles.clearFilterText}>Limpar filtros</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          )}
        </View>
      )}

      <TouchableOpacity
        style={[styles.floatingButton, styles.favoritesButton]}
        onPress={() => navigation.navigate("Favoritos")}>
        <Entypo name="heart" size={24} color="#FF0000" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
    // O SafeAreaView cuida da área do topo, não precisamos de paddingTop aqui
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: colors.primary,
    // REMOVIDO: paddingTop: 40, o SafeAreaView já faz isso.
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 2,
    borderColor: "#fff",
  },
  headerTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: "#e0e0e0",
  },
  platformName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  menuButton: {
    padding: 5,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    backgroundColor: "#fff",
  },
  activeTab: {
    backgroundColor: colors.primary,
    borderBottomWidth: 3,
    borderBottomColor: colors.accent || colors.primaryDark,
  },
  tabText: {
    marginLeft: 8,
    fontSize: 13,
    fontWeight: "600",
    color: colors.primary,
  },
  activeTabText: {
    color: "#fff",
  },
  platformInfoContainer: {
    padding: 20,
    paddingBottom: 80,
  },
  platformImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 20,
    resizeMode: "cover",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.dark,
    marginTop: 25,
    marginBottom: 15,
  },
  platformDescription: {
    fontSize: 15,
    color: "#555",
    lineHeight: 23,
    marginBottom: 10,
    textAlign: "justify",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e9e9e9",
  },
  featureTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.dark,
    marginBottom: 3,
  },
  featureDescription: {
    fontSize: 14,
    color: "#666",
  },
  contactButton: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  contactButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 10,
    fontSize: 16,
  },
  servicesListingContainer: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 10,
    paddingHorizontal: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 15,
    color: colors.dark,
  },
  clearSearchButton: {
    padding: 5,
  },
  categoryScroll: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  categoryContainer: {
    paddingBottom: 5,
  },
  
  categoryButton: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 18, 
    borderRadius: 20,
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activeCategoryButton: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    fontSize: 13,
    color: colors.primary,
    marginLeft: 8,
    fontWeight: "500",
  },
  activeCategoryText: {
    color: "#fff",
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 80,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  serviceCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: width * 0.48 - 22.5,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  serviceImage: {
    width: "100%",
    height: 110,
  },
  heartIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    borderRadius: 15,
    padding: 5,
  },
  serviceInfo: {
    padding: 10,
  },
  serviceName: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.dark,
    marginBottom: 3,
  },
  serviceCategoryName: {
    fontSize: 12,
    color: colors.primary,
    marginBottom: 5,
  },
  serviceLocationDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailsText: {
    fontSize: 11,
    color: colors.gray,
    marginLeft: 4,
  },
  floatingButton: {
    position: "absolute",
    bottom: 25,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  favoritesButton: {
    backgroundColor: colors.danger,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f2f5",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.gray,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    minHeight: 200,
  },
  emptyListText: {
    fontSize: 16,
    color: colors.gray,
    textAlign: "center",
    marginTop: 15,
  },
  clearFilterText: {
    color: colors.primary,
    marginTop: 15,
    fontWeight: "bold",
    fontSize: 15,
  },
});