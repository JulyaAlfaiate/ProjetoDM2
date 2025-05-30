import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { Ionicons, Entypo, MaterialIcons, FontAwesome, Feather } from '@expo/vector-icons';

export default function PetDetails({ route, navigation }) {
  const { pet } = route.params;

  const owner = {
    name: pet.ownerName || 'Nome não disponível',
    email: pet.ownerEmail || 'Email não disponível',
    phone: pet.ownerPhone || 'Telefone não disponível',
    uid: pet.uid
  };

  const handleScheduleAppointment = () => {
    // Aqui você pode implementar a navegação para uma tela de agendamento
    // ou abrir um link externo para WhatsApp/email da clínica
    navigation.navigate('ScheduleAppointment', { pet, owner });
    
    // Alternativa para abrir WhatsApp:
    // const phoneNumber = '5511999999999'; // Número da clínica
    // Linking.openURL(`https://wa.me/${phoneNumber}?text=Olá, gostaria de agendar uma consulta para o pet ${pet.name}`);
  };

  const handleCallOwner = () => {
    if (owner.phone) {
      Linking.openURL(`tel:${owner.phone}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image 
        source={{ uri: pet.imageUrl }} 
        style={styles.image} 
        resizeMode="cover"
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{pet.name}</Text>
          <View style={styles.petTypeContainer}>
            <Ionicons 
              name={pet.type === 'Cachorro' ? 'md-paw' : 'md-paw-outline'} 
              size={18} 
              color="#fff" 
            />
            <Text style={styles.petType}>{pet.type || 'Animal'}</Text>
          </View>
        </View>

        <View style={styles.ratingContainer}>
          <FontAwesome name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>4.8</Text>
          <Text style={styles.reviews}>(12 avaliações)</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Informações Básicas</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Feather name="calendar" size={20} color="#3b82f6" />
              <Text style={styles.infoText}>Idade: {pet.age || 'Não informada'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="transgender" size={20} color="#3b82f6" />
              <Text style={styles.infoText}>Sexo: {pet.gender || 'Não informado'}</Text>
            </View>
            <View style={styles.infoItem}>
              <MaterialIcons name="pets" size={20} color="#3b82f6" />
              <Text style={styles.infoText}>Porte: {pet.size || 'Não informado'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Entypo name="location-pin" size={20} color="#3b82f6" />
              <Text style={styles.infoText}>{pet.location || 'Local não informado'}</Text>
            </View>
          </View>
        </View>

        {pet.description && (
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Sobre {pet.name}</Text>
            <Text style={styles.descriptionText}>{pet.description}</Text>
          </View>
        )}

        <View style={styles.ownerBox}>
          <Text style={styles.sectionTitle}>Informações do Dono</Text>
          <View style={styles.ownerInfo}>
            <View style={styles.ownerItem}>
              <Ionicons name="person" size={18} color="#555" />
              <Text style={styles.ownerText}>{owner.name}</Text>
            </View>
            <View style={styles.ownerItem}>
              <MaterialIcons name="email" size={18} color="#555" />
              <Text style={styles.ownerText}>{owner.email}</Text>
            </View>
            <View style={styles.ownerItem}>
              <Feather name="phone" size={18} color="#555" />
              <Text style={styles.ownerText}>{owner.phone}</Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.scheduleButton]}
            onPress={handleScheduleAppointment}
          >
            <MaterialIcons name="event-available" size={20} color="#fff" />
            <Text style={styles.buttonText}>Agendar Consulta</Text>
          </TouchableOpacity>

          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.button, styles.adoptButton]}
              onPress={() => navigation.navigate('AdoptionForm', { pet })}
            >
              <Ionicons name="paw" size={18} color="#fff" />
              <Text style={styles.buttonText}>Adotar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.chatButton]}
              onPress={() => navigation.navigate('Chat', { receiverId: owner.uid })}
            >
              <Entypo name="chat" size={18} color="#fff" />
              <Text style={styles.buttonText}>Chat</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.callButton]}
              onPress={handleCallOwner}
            >
              <Feather name="phone" size={18} color="#fff" />
              <Text style={styles.buttonText}>Ligar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  image: {
    width: '100%',
    height: 300,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  content: {
    padding: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    flexShrink: 1,
  },
  petTypeContainer: {
    backgroundColor: '#3b82f6',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  petType: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  ratingText: {
    marginLeft: 5,
    marginRight: 10,
    fontWeight: 'bold',
    color: '#555',
  },
  reviews: {
    color: '#777',
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  infoSection: {
    marginBottom: 20,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 8,
    color: '#555',
  },
  descriptionSection: {
    marginBottom: 20,
  },
  descriptionText: {
    color: '#555',
    lineHeight: 22,
  },
  ownerBox: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  ownerInfo: {
    marginTop: 5,
  },
  ownerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ownerText: {
    marginLeft: 10,
    color: '#555',
  },
  buttonsContainer: {
    marginTop: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  scheduleButton: {
    backgroundColor: '#10b981',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  adoptButton: {
    backgroundColor: '#f97316',
    width: '32%',
  },
  chatButton: {
    backgroundColor: '#3b82f6',
    width: '32%',
  },
  callButton: {
    backgroundColor: '#22c55e',
    width: '32%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
});