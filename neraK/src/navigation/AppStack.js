import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import DrawerNavigator from "./DrawerNavigator";
// CORREÇÃO: Importando ServiceDetails no lugar de PetDetails.
import ServiceDetails from "../screens/ServiceDetails";
import EditProfile from "../screens/EditProfile";

const Stack = createStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeDrawer" component={DrawerNavigator} />
      {/* CORREÇÃO: Registrando a tela com o nome "ServiceDetails".
        Este nome DEVE ser o mesmo usado na função `navigation.navigate` da tela Home.
      */}
      <Stack.Screen name="ServiceDetails" component={ServiceDetails} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      {/* Quando criar a tela de Chat, você a registrará aqui.
        <Stack.Screen name="Chat" component={ChatScreen} /> 
      */}
    </Stack.Navigator>
  );
}
