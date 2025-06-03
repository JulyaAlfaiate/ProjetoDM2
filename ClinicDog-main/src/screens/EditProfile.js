import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { auth } from "../services/firebase";
import {
  getUserProfile,
  updateUserProfile,
  uploadImageAsync,
} from "../services/freelancerApi";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";


export default function EditProfile({ navigation }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [photoURL, setPhotoURL] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const uid = auth.currentUser?.uid;
      if (uid) {
        const profile = await getUserProfile(uid);
        if (profile) {
          setName(profile.name || "");
          setPhone(profile.phone || "");
          setPhotoURL(profile.photoURL || "");
        }
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    const uid = auth.currentUser?.uid;
    try {
      await updateUserProfile(uid, { name, phone, photoURL });
      Alert.alert("Perfil atualizado com sucesso!");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Erro ao atualizar perfil:", err.message);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      const uid = auth.currentUser?.uid;
      const uploadUrl = await uploadImageAsync(result.assets[0].uri, uid);
      setPhotoURL(uploadUrl);
    }
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color="#4169e1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Perfil</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={{ uri: photoURL || "https://i.pravatar.cc/300" }}
            style={styles.avatar}
          />
          <Text
            style={{ textAlign: "center", color: "#333333", marginBottom: 20 }} // Texto preto em fundo branco
          >
            Toque para alterar a imagem
          </Text>
        </TouchableOpacity>
        <TextInput
          placeholder="Nome"
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholderTextColor="#555"
        />
        <TextInput
          placeholder="Telefone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          style={styles.input}
          placeholderTextColor="#555"
        />
      
        <TouchableOpacity onPress={handleSave} style={styles.button}>
          <Text style={styles.buttonText}>Salvar alterações</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff", // Cor Branca
  },
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff", // Cor Branca
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4169e1", // Cor Principal
  },
  content: {
    padding: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    marginBottom: 10, // Ajustado para dar espaço ao texto abaixo
    borderWidth: 2,
    borderColor: "#4169e1", // Cor Principal
  },
  input: {
    borderWidth: 1,
    borderColor: "#cccccc", // Cinza para borda
    backgroundColor: "#e5e4fb", // Cor Secundária para fundo do input
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 20,
    color: "#000000", // Texto preto
  },
  button: {
    backgroundColor: "#4169e1", // Cor Principal
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#ffffff", // Cor Branca (texto sobre fundo principal)
    fontWeight: "bold",
    fontSize: 16,
  },
});