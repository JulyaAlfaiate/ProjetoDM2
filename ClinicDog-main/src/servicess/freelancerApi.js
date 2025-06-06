import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import initialServicesData from './servicesData.json'; // Dados iniciais mockados
import { database } from "./firebase"; // Sua configuração do Firebase

// Simula um delay da API para operações assíncronas
const simulateApiDelay = (duration = 600) => new Promise(resolve => setTimeout(resolve, duration));

// --- Funções de Serviço (Service/Listing) ---

/**
 * Busca todos os serviços.
 * No mundo real, isso buscaria do Firestore. Aqui, usa dados mockados.
 * Mapeia 'serviceName' para 'name' para consistência com o frontend.
 */
export const getServices = async () => {
  await simulateApiDelay();
  // Mapeia serviceName para name e garante que cada serviço tenha um ID de provedor.
  return initialServicesData.map(service => ({
    ...service,
    name: service.serviceName || "Serviço Sem Nome", // Garante que 'name' exista
    id: service.id.toString(), // Garante que o ID seja uma string
    // Adiciona um providerId se não existir (para dados mockados)
    providerId: service.providerId || `provider_${service.id % 3 + 1}` 
  }));
};

/**
 * Busca um serviço específico pelo ID.
 */
export const getServiceById = async (serviceId) => {
  await simulateApiDelay();
  const services = await getServices(); // Obtém a lista mapeada
  const service = services.find(s => s.id === serviceId);
  if (!service) {
    console.warn(`Serviço com ID ${serviceId} não encontrado.`);
    return null;
  }
  return service;
};

/**
 * Alterna o estado de favorito de um serviço.
 * Em um app real, isso atualizaria o perfil do usuário no Firestore.
 * Esta é uma simulação que modifica os dados mockados em memória.
 */
export const toggleFavoriteService = async (serviceId, userId) => {
  await simulateApiDelay();
  // Lógica para um backend real:
  // const userRef = doc(database, "users", userId);
  // const userProfile = await getUserProfile(userId);
  // if (userProfile) {
  //   const isFavorited = userProfile.favoriteServices?.includes(serviceId);
  //   await updateDoc(userRef, {
  //     favoriteServices: isFavorited ? arrayRemove(serviceId) : arrayUnion(serviceId),
  //   });
  //   return { ...userProfile, favoriteServices: isFavorited ? userProfile.favoriteServices.filter(id => id !== serviceId) : [...(userProfile.favoriteServices || []), serviceId] };
  // }
  // return null;

  // Simulação para dados mockados (afeta initialServicesData diretamente, o que não é ideal para estado persistente)
  const serviceIndex = initialServicesData.findIndex(s => s.id.toString() === serviceId);
  if (serviceIndex !== -1) {
    initialServicesData[serviceIndex].favorited = !initialServicesData[serviceIndex].favorited;
    // Retorna uma cópia para simular imutabilidade onde possível
    return { ...initialServicesData[serviceIndex] }; 
  }
  console.warn(`Toggle favorite: Serviço com ID ${serviceId} não encontrado nos dados mockados.`);
  return null;
};


/**
 * Busca os serviços favoritados por um usuário.
 * Em um app real, isso leria a lista de IDs de `favoriteServices` do perfil do usuário
 * e depois buscaria cada serviço.
 */
export const getFavoriteServices = async (userId) => {
  await simulateApiDelay();
  // Lógica para um backend real:
  // const userProfile = await getUserProfile(userId);
  // if (userProfile && userProfile.favoriteServices && userProfile.favoriteServices.length > 0) {
  //   const allServices = await getServices();
  //   return allServices.filter(service => userProfile.favoriteServices.includes(service.id));
  // }
  // return [];

  // Simulação para dados mockados:
  const allServices = await getServices();
  return allServices.filter(s => s.favorited);
};


/**
 * Busca serviços publicados por um provedor específico (usuário logado).
 */
export const getServicesByProvider = async (providerId) => {
  await simulateApiDelay();
  const allServices = await getServices(); // Obtém a lista mapeada
  // No mock, o providerId pode não estar diretamente nos dados JSON originais.
  // A função getServices() adiciona um mock providerId.
  return allServices.filter(s => s.providerId === providerId);
};

/**
 * Deleta um serviço.
 * Em um app real, isso removeria o documento do serviço do Firestore.
 */
export const deleteService = async (serviceId) => {
  await simulateApiDelay();
  // Lógica para um backend real:
  // await deleteDoc(doc(database, "services", serviceId));
  // console.log(`Serviço ${serviceId} deletado do Firestore.`);
  
  // Simulação para dados mockados (remove do array em memória)
  const index = initialServicesData.findIndex(s => s.id.toString() === serviceId);
  if (index !== -1) {
    initialServicesData.splice(index, 1);
    console.log(`Mock: Serviço ${serviceId} deletado.`);
    return true;
  }
  console.warn(`Delete service: Serviço com ID ${serviceId} não encontrado nos dados mockados.`);
  return false;
};

// --- Funções de Perfil de Usuário (User/Provider Profile) ---

/**
 * Cria um perfil para um novo usuário no Firestore.
 */
export const createUserProfile = async (uid, userData) => {
  const userRef = doc(database, "users", uid);
  const profileData = {
    uid: uid,
    name: userData.name || "",
    email: userData.email,
    photoURL: userData.photoURL || "",
    phone: userData.phone || "",
    bio: userData.bio || "", // Biografia do profissional
    skills: userData.skills || [], // Array de habilidades
    createdAt: new Date().toISOString(),
    favoriteServices: [] // Lista de IDs de serviços favoritados
  };
  await setDoc(userRef, profileData, { merge: true });
  return profileData;
};

/**
 * Atualiza o perfil de um usuário existente no Firestore.
 */
export const updateUserProfile = async (uid, dataToUpdate) => {
  const userRef = doc(database, "users", uid);
  await setDoc(userRef, dataToUpdate, { merge: true }); // setDoc com merge:true age como update
  console.log(`Perfil do usuário ${uid} atualizado.`);
};

/**
 * Busca o perfil de um usuário/provedor pelo UID.
 */
export const getUserProfile = async (uid) => {
  if (!uid) {
    console.error("UID do usuário não fornecido para getUserProfile.");
    return null;
  }
  const userDocRef = doc(database, "users", uid);
  const userDocSnap = await getDoc(userDocRef);
  if (userDocSnap.exists()) {
    return userDocSnap.data();
  } else {
    console.warn(`Perfil para UID ${uid} não encontrado no Firestore.`);
    return null;
  }
};

/**
 * Busca o perfil de um provedor de serviço.
 * Atualmente, um alias para getUserProfile, já que provedores são usuários.
 */
export const getProviderProfile = async (providerId) => {
    return getUserProfile(providerId);
};


// --- Funções de Upload de Imagem (Exemplo com Firebase Storage) ---

/**
 * Faz upload de uma imagem para o Firebase Storage e retorna a URL de download.
 * @param {string} uri - O URI local do arquivo da imagem.
 * @param {string} storagePath - O caminho no Storage onde a imagem será salva (ex: 'profile_pictures/userId.jpg').
 */
export const uploadImageAsync = async (uri, storagePath) => {
  if (!uri.startsWith('file://')) {
    // Se for uma URL web (como do ImagePicker na web), não precisa de upload, apenas retorna.
    // Ou se for uma string base64, precisa de tratamento diferente.
    // Para este exemplo, assumimos que URIs não-file já são URLs válidas ou não são para upload.
    console.log("URI não é um arquivo local, retornando URI original:", uri);
    if(uri.startsWith('http')) return uri; // Já é uma URL
    // Se for um placeholder, também retorna.
    if(uri.includes('placehold.co')) return uri;
  }

  try {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.error("Erro no XHR para criar blob:", e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const storage = getStorage();
    const imageRef = ref(storage, storagePath);
    
    await uploadBytes(imageRef, blob);
    blob.close(); // Libera o blob

    const downloadURL = await getDownloadURL(imageRef);
    console.log("Upload bem-sucedido, URL:", downloadURL);
    return downloadURL;

  } catch (error) {
    console.error("Erro durante o upload da imagem:", error);
    Alert.alert("Erro de Upload", "Não foi possível carregar a imagem: " + error.message);
    // Retorna uma URL de placeholder em caso de falha para não quebrar a UI
    return "https://placehold.co/300x300/E0E0E0/B0B0B0?text=ErroUpload"; 
  }
};


// --- Categorias de Serviço ---

/**
 * Retorna uma lista de categorias de serviço.
 * No futuro, isso pode vir de uma coleção no Firestore.
 */
export const getCategories = () => {
  // Estes devem corresponder às categorias usadas nos seus dados de serviço
  return [
    { label: "Todos", icon: "apps-outline" }, // Ionicons
    { label: "Desenvolvimento", icon: "code-slash-outline" }, // Ionicons
    { label: "Design Gráfico", icon: "brush-outline" }, // Ionicons
    { label: "Redação & Tradução", icon: "language-outline" }, // Ionicons
    { label: "Marketing Digital", icon: "megaphone-outline" }, // Ionicons
    { label: "Consultoria", icon: "people-circle-outline" }, // Ionicons
    { label: "Serviços Gerais", icon: "construct-outline" }, // Ionicons
    { label: "Aulas Particulares", icon: "book-outline" }, // Ionicons
    // Adicione mais categorias conforme necessário, ex:
    { label: "Bombeiro Hidráulico", icon: "water-outline" }, // Ionicons
    { label: "Limpador de Vidros", icon: "sparkles-outline"}, // Ionicons - ícone alternativo
    { label: "Borracheiro Móvel", icon: "car-sport-outline"}, // Ionicons
    { label: "Cabeleireiro", icon: "cut-outline"}, // Ionicons
  ];
};
