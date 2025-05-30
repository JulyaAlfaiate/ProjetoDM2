import React, { useContext } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, TouchableOpacity, Text, Alert } from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { AuthenticatedUserContext } from "../../App";
import Home from "../screens/Home";
import Profile from "../screens/Profile";
import Favorites from "../screens/Favorites";

const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({ navigation }) => {
  const { setUser } = useContext(AuthenticatedUserContext);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null); // Isso fará o RootNavigator redirecionar para a tela de Login
    } catch (error) {
      Alert.alert("Erro", "Não foi possível fazer logout");
    }
  };

  return (
    <View style={{ padding: 20, flex: 1 }}>
      {/* Itens do menu */}
      <TouchableOpacity 
        style={{ paddingVertical: 15, flexDirection: 'row', alignItems: 'center' }}
        onPress={() => navigation.navigate("Início")}
      >
        <Ionicons name="home-outline" size={24} color="#f97316" />
        <Text style={{ marginLeft: 10, fontSize: 16 }}>Início</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={{ paddingVertical: 15, flexDirection: 'row', alignItems: 'center' }}
        onPress={() => navigation.navigate("Favoritos")}
      >
        <AntDesign name="hearto" size={24} color="#f97316" />
        <Text style={{ marginLeft: 10, fontSize: 16 }}>Favoritos</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={{ paddingVertical: 15, flexDirection: 'row', alignItems: 'center' }}
        onPress={() => navigation.navigate("Perfil")}
      >
        <Ionicons name="person-outline" size={24} color="#f97316" />
        <Text style={{ marginLeft: 10, fontSize: 16 }}>Perfil</Text>
      </TouchableOpacity>

      {/* Botão de Logout */}
      <TouchableOpacity 
        style={{ paddingVertical: 15, flexDirection: 'row', alignItems: 'center', marginTop: 20 }}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={24} color="#f97316" />
        <Text style={{ marginLeft: 10, fontSize: 16 }}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        drawerActiveTintColor: "#f97316",
        drawerLabelStyle: { fontSize: 16 },
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Início"
        component={Home}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Favoritos"
        component={Favorites}
        options={{
          drawerIcon: ({ color, size }) => (
            <AntDesign name="hearto" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Perfil"
        component={Profile}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}