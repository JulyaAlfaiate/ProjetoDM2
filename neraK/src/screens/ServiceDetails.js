import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, Linking, StatusBar, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import colors from '../../colors'; // Supondo que seu arquivo de cores esteja neste caminho

// Recebemos a 'navigation' para navegar e 'route' para acessar os dados passados.
export default function ServiceDetails({ route, navigation }) {
  // Pegamos o objeto 'service' que foi enviado da tela Home.
  const { service } = route.params;

  if (!service) {
    // Fallback caso algo dê errado e os dados não cheguem.
    return (
      <View style={styles.loadingContainer}>
        <Text>Erro: Serviço não encontrado.</Text>
      </View>
    );
  }

  // Função para o botão de chat
  const handleChatPress = () => {
    // Navega para a tela 'Chat', passando o ID e o nome do prestador.
    // Você precisará criar a tela 'Chat' futuramente.
    navigation.navigate('Chat', { 
      receiverId: service.providerId, 
      receiverName: service.freelancerName 
    });
  };
  
  // Função para o botão de perfil (ainda sem funcionalidade)
  const handleProfilePress = () => {
    Alert.alert(
      "Em Breve",
      "A funcionalidade para visualizar o perfil do prestador será implementada em breve."
    );
   
  };

  // Função para voltar para a tela anterior
  const handleGoBack = () => {
    navigation.goBack();
  };


  return (
    <View style={styles.fullScreenContainer}>
      {/* Botão de voltar fixo no canto superior esquerdo */}
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>

      <ScrollView style={styles.container}>
        {/* 1. IMAGEM AMPLIADA */}
        <Image
          source={{ uri: service.imageUrl || 'https://placehold.co/600x400/E0E0E0/B0B0B0?text=Serviço' }}
          style={styles.image}
          resizeMode="cover"
        />
        
        <View style={styles.content}>
          {/* NOME E CATEGORIA DO SERVIÇO */}
          <Text style={styles.serviceName}>{service.serviceName || "Serviço sem Nome"}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{service.category || "Não categorizado"}</Text>
          </View>

          {/* 2. DESCRIÇÃO CONVINCENTE */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sobre o Serviço</Text>
            <Text style={styles.descriptionText}>{service.description || "Nenhuma descrição disponível."}</Text>
          </View>
          
          {/* INFORMAÇÕES DO PRESTADOR */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Oferecido por</Text>
            <View style={styles.providerBox}>
              <View>
                <Text style={styles.providerName}>{service.freelancerName || "Profissional Desconhecido"}</Text>
                {/* No futuro, você pode adicionar a avaliação do prestador aqui */}
                <Text style={styles.providerRating}>Avaliação: {service.rating ? `${service.rating} ★` : 'Não avaliado'}</Text>
              </View>
              {/* 3. BOTÃO PARA PERFIL DO PRESTADOR (sem funcionalidade por enquanto) */}
              <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
                <Text style={styles.profileButtonText}>Ver Perfil</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

        </View>

        {/* 4. BOTÃO DE CHAT PRIVADO (fixo no rodapé) */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.chatButton} onPress={handleChatPress}>
            <Entypo name="chat" size={20} color="#fff" />
            <Text style={styles.chatButtonText}>Conversar com o Profissional</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300, // Imagem maior e mais destacada
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 50, // Ajusta para a barra de status
    left: 20,
    zIndex: 10, // Garante que o botão esteja acima da imagem
    backgroundColor: 'rgba(0,0,0,0.4)', // Fundo semi-transparente para visibilidade
    borderRadius: 20,
    padding: 8,
  },
  content: {
    padding: 20,
    paddingBottom: 100, // Espaço para o botão de chat fixo no rodapé
  },
  serviceName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: '#e7f3ff',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 15,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  categoryText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  descriptionText: {
    color: '#555',
    fontSize: 15,
    lineHeight: 23,
  },
  providerBox: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  providerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
  },
  providerRating: {
    fontSize: 14,
    color: colors.gray,
    marginTop: 4,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8E8E8',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  profileButtonText: {
    color: colors.primary,
    fontWeight: 'bold',
    marginRight: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  chatButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  chatButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 16,
  },
});
