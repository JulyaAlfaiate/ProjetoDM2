import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  Animated
} from "react-native";
import { auth } from "../servicess/firebase";
import { getUserProfile, getServicesByUser, deleteService } from "../servicess/freelancerApi";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));
  const navigation = useNavigation();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    const fetchData = async () => {
      const user = auth.currentUser;
      if (user) {
        const [profileData, userServices] = await Promise.all([
          getUserProfile(user.uid),
          getServicesByUser(user.uid)
        ]);
        setProfile(profileData);
        setServices(userServices);
      }
    };

    fetchData();

    return () => clearTimeout(timer);
  }, []);

  const handleDelete = (id) => {
    Alert.alert(
      "Excluir Serviço",
      "Tem certeza que deseja excluir esta publicação de serviço?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            await deleteService(id);
            setServices(services.filter((service) => service.id !== id));
          },
        },
      ]
    );
  };

  const renderService = ({ item }) => (
    <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.row}>
        <Text style={styles.name}>{item.title}</Text>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Ionicons name="trash-outline" size={22} color="5250F2" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("EditService", { service: item })}
        >
          <Ionicons name="create-outline" size={22} color="#3b82f6" />
        </TouchableOpacity>
      </View>
      <Text style={styles.info}>Categoria: {item.category}</Text>
      <Text style={styles.info}>Preço: {item.price}</Text>
    </Animated.View>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#5250F2" />
        <Text style={styles.loadingText}>Carregando seu perfil...</Text>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Image
        source={{ uri: profile?.photoURL || "https://i.pravatar.cc/300" }}
        style={styles.avatar}
      />
      <Text style={styles.name}>{profile?.name}</Text>
      <Text style={styles.email}>{profile?.email}</Text>
      <Text style={styles.phone}>{profile?.phone}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("EditProfile")}
      >
        <Text style={styles.buttonText}>Editar Perfil</Text>
      </TouchableOpacity>
      
     
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: "#5250F2",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 80,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#5250F2",
    alignSelf: "center",
  },
  name: { 
    fontSize: 24, 
    fontWeight: "bold",
    textAlign: "center",
  },
  email: { 
    fontSize: 16, 
    color: "#666", 
    marginTop: 4,
    textAlign: "center",
  },
  phone: { 
    fontSize: 16, 
    color: "#666", 
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#5250F2",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  info: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  listContent: {
    paddingBottom: 20,
  },
});