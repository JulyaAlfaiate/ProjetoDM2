import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import { auth } from "../servicess/firebase"; // Assuming firebase config is correct
import {
  getUserProfile,
  updateUserProfile,
  uploadImageAsync,
} from "../servicess/freelancerApi"; // Assuming freelancerApi is correctly set up
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
// import { AuthenticatedUserContext } from '../../App'; // If used for user context

export default function EditProfile({ navigation }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [bio, setBio] = useState(""); // Added for professional bio/description
  const [skills, setSkills] = useState(""); // Added for skills (comma-separated)
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // const { user } = useContext(AuthenticatedUserContext); // If using context for user UID

  useEffect(() => {
    // Request permission for image library
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permissão Necessária', 'Desculpe, precisamos da permissão da galeria para fazer upload de imagens.');
        }
      }
    })();

    const fetchProfile = async () => {
      setLoading(true);
      const uid = auth.currentUser?.uid; // or user?.uid if using context
      if (uid) {
        try {
          const profile = await getUserProfile(uid);
          if (profile) {
            setName(profile.name || "");
            setPhone(profile.phone || "");
            setPhotoURL(profile.photoURL || "");
            setBio(profile.bio || "");
            setSkills(profile.skills ? profile.skills.join(", ") : ""); // Assuming skills are stored as an array
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          Alert.alert("Erro", "Não foi possível carregar o perfil.");
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, []); // Add 'user' to dependency array if using context

  const handleSave = async () => {
    const uid = auth.currentUser?.uid; // or user?.uid
    if (!name.trim()) {
      Alert.alert("Campo Obrigatório", "Por favor, insira seu nome.");
      return;
    }
    setLoading(true);
    try {
      const skillsArray = skills.split(",").map(skill => skill.trim()).filter(skill => skill);
      await updateUserProfile(uid, { name, phone, photoURL, bio, skills: skillsArray });
      Alert.alert("Sucesso!", "Perfil atualizado com sucesso!");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Erro", `Erro ao atualizar perfil: ${err.message}`);
      console.error("Profile update error:", err);
    }
    setLoading(false);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square aspect ratio for profile pictures
      quality: 0.7, // Compress image slightly
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setUploading(true);
      const uid = auth.currentUser?.uid; // or user?.uid
      try {
        const uploadUrl = await uploadImageAsync(result.assets[0].uri, `profile_pictures/${uid}`);
        setPhotoURL(uploadUrl);
      } catch (error) {
        Alert.alert("Erro de Upload", "Não foi possível carregar a imagem.");
        console.error("Image upload error:", error);
      }
      setUploading(false);
    }
  };

  if (loading && !uploading) { 
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4169e1" />
        <Text>Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color="#4169e1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Perfil Profissional</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity onPress={pickImage} style={styles.avatarContainer} disabled={uploading}>
          <Image
            source={{ uri: photoURL || "https://placehold.co/300x300/E0E0E0/B0B0B0?text=Foto" }}
            style={styles.avatar}
          />
          {uploading ? (
            <ActivityIndicator style={styles.uploadIndicator} size="small" color="#fff" />
          ) : (
            <View style={styles.cameraIconContainer}>
              <Ionicons name="camera" size={24} color="#fff" />
            </View>
          )}
        </TouchableOpacity>
        <Text style={styles.avatarHelpText}>
          Toque na imagem para alterar
        </Text>

        <Text style={styles.label}>Nome Completo *</Text>
        <TextInput
          placeholder="Ex: João Silva"
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholderTextColor="#777"
        />

        <Text style={styles.label}>Telefone (Opcional)</Text>
        <TextInput
          placeholder="Ex: (61) 99999-8888"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          style={styles.input}
          placeholderTextColor="#777"
        />

        <Text style={styles.label}>Sobre Você (Opcional)</Text>
        <TextInput
          placeholder="Descreva sua experiência, paixões, etc."
          value={bio}
          onChangeText={setBio}
          style={[styles.input, styles.textArea]}
          multiline
          numberOfLines={4}
          placeholderTextColor="#777"
        />

        <Text style={styles.label}>Principais Habilidades (separadas por vírgula)</Text>
        <TextInput
          placeholder="Ex: Desenvolvimento Web, Design Gráfico, Redação"
          value={skills}
          onChangeText={setSkills}
          style={styles.input}
          placeholderTextColor="#777"
        />
      
        <TouchableOpacity onPress={handleSave} style={styles.button} disabled={loading || uploading}>
          {loading || uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Salvar Alterações</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa", 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 50, // Adjust for status bar
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff", 
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 12,
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333", 
  },
  content: {
    padding: 20,
  },
  avatarContainer: {
    alignSelf: "center",
    marginBottom: 5,
    position: 'relative',
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: "#4169e1", 
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#4169e1',
    padding: 8,
    borderRadius: 20,
  },
  uploadIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    padding:5
  },
  avatarHelpText: {
    textAlign: "center",
    color: "#555",
    marginBottom: 25,
    fontSize: 13,
  },
  label: {
    fontSize: 15,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd", 
    backgroundColor: "#fff", 
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
    color: "#333", 
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top', // For Android
  },
  button: {
    backgroundColor: "#4169e1", 
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#ffffff", 
    fontWeight: "bold",
    fontSize: 16,
  },
});
