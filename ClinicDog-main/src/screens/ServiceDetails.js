import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Linking, ActivityIndicator, Alert } from 'react-native';
import { Ionicons, Entypo, MaterialIcons, FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { getServiceById, getProviderProfile } from '../servicess/freelancerApi'; // Ensure these API functions exist
import colors from '../../colors'; // Assuming colors.js is in parent directory

export default function ServiceDetails({ route, navigation }) {
  const { serviceId, service: initialService } = route.params; // Expecting serviceId or full service object
  
  const [service, setService] = useState(initialService);
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(!initialService); // Load if no initial service

  useEffect(() => {
    const fetchServiceDetails = async () => {
      if (!serviceId && !initialService) {
        Alert.alert("Erro", "Detalhes do serviço não encontrados.");
        navigation.goBack();
        return;
      }

      try {
        let currentService = initialService;
        if (!currentService && serviceId) {
          currentService = await getServiceById(serviceId); // API call to get service by ID
          setService(currentService);
        }

        if (currentService && currentService.providerId) { // Assuming service has providerId
          const providerProfile = await getProviderProfile(currentService.providerId); // API call
          setProvider(providerProfile);
        } else if (currentService && currentService.ownerName) { // Fallback for older structure
             setProvider({
                name: currentService.ownerName,
                email: currentService.ownerEmail,
                phone: currentService.ownerPhone,
                uid: currentService.uid, // Assuming 'uid' was the provider's ID
                photoURL: currentService.ownerPhotoURL // If you stored provider photo on service
             });
        }
      } catch (error) {
        console.error("Error fetching service/provider details:", error);
        Alert.alert("Erro", "Não foi possível carregar os detalhes do serviço ou do profissional.");
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetails();
  }, [serviceId, initialService]);


  const handleContactProvider = (contactMethod) => {
    if (!provider) {
      Alert.alert("Indisponível", "Informações de contato do profissional não disponíveis.");
      return;
    }
    
    let url = '';
    switch (contactMethod) {
      case 'call':
        if (provider.phone) url = `tel:${provider.phone}`;
        else Alert.alert("Indisponível", "Telefone não fornecido pelo profissional.");
        break;
      case 'email':
        if (provider.email) url = `mailto:${provider.email}?subject=Contato sobre o serviço: ${service?.name || service?.title}`;
        else Alert.alert("Indisponível", "Email não fornecido pelo profissional.");
        break;
      case 'chat':
        // Navigate to a chat screen, passing provider's ID
        if (provider.uid) navigation.navigate('Chat', { receiverId: provider.uid, receiverName: provider.name });
        else Alert.alert("Indisponível", "Não é possível iniciar o chat com este profissional.");
        break;
      default:
        return;
    }

    if (url) {
      Linking.canOpenURL(url)
        .then(supported => {
          if (supported) Linking.openURL(url);
          else Alert.alert("Erro", `Não foi possível abrir o aplicativo para ${contactMethod}.`);
        })
        .catch(err => console.error('An error occurred', err));
    }
  };

  const handleRequestQuote = () => {
    // Navigate to a screen for requesting a quote or a more detailed contact form
    // This is more complex than a simple "Adopt" button.
    // For now, it could open a chat or email with a pre-filled message.
    if (provider?.uid) {
        navigation.navigate('RequestQuoteScreen', { serviceId: service.id, providerId: provider.uid, serviceName: service.name || service.title });
    } else if (provider?.email) {
        handleContactProvider('email'); // Fallback to email
        Alert.alert("Solicitar Orçamento", "Você será redirecionado para enviar um email. Detalhe sua necessidade.");
    } else {
        Alert.alert("Indisponível", "Não é possível solicitar um orçamento no momento.");
    }
  };


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text>Carregando detalhes do serviço...</Text>
      </View>
    );
  }

  if (!service) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="alert-circle-outline" size={40} color={colors.danger} />
        <Text style={styles.errorText}>Serviço não encontrado.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  // Placeholder for service rating - implement actual logic
  const serviceRating = service?.rating || 4.5; 
  const reviewCount = service?.reviewCount || 0;

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: service.imageUrl || 'https://placehold.co/600x400/E0E0E0/B0B0B0?text=Serviço' }}
        style={styles.image}
        resizeMode="cover"
        defaultSource={require('../../assets/default-service.png')}
      />

      <View style={styles.content}>
        <View style={styles.headerSection}>
          <Text style={styles.serviceName}>{service.name || service.title || "Serviço Profissional"}</Text>
          <View style={styles.categoryBadge}>
            <MaterialCommunityIcons
              name={service.categoryIcon || "briefcase-outline"} // Provide a default or map categories to icons
              size={16}
              color={colors.primary}
            />
            <Text style={styles.categoryText}>{service.category || 'Não Categorizado'}</Text>
          </View>
        </View>

        <View style={styles.ratingContainer}>
          <FontAwesome name="star" size={18} color="#FFD700" />
          <Text style={styles.ratingText}>{serviceRating.toFixed(1)}</Text>
          <Text style={styles.reviewsText}>({reviewCount} {reviewCount === 1 ? 'avaliação' : 'avaliações'})</Text>
        </View>

        {service.price && (
             <Text style={styles.priceText}>
                {typeof service.price === 'number' ? `R$ ${service.price.toFixed(2)}` : service.price}
                {service.priceType === 'perHour' ? ' /hora' : service.priceType === 'fixed' ? ' (preço fixo)' : ''}
             </Text>
        )}


        {service.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sobre este Serviço</Text>
            <Text style={styles.descriptionText}>{service.description}</Text>
          </View>
        )}

        {/* Basic Service Information */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detalhes Adicionais</Text>
            <View style={styles.infoGrid}>
                {service.location && (
                    <View style={styles.infoItem}>
                        <Ionicons name="location-outline" size={20} color={colors.primary} />
                        <Text style={styles.infoTextLabel}>Localização:</Text>
                        <Text style={styles.infoTextValue}>{service.location}</Text>
                    </View>
                )}
                {service.availability && (
                    <View style={styles.infoItem}>
                        <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                        <Text style={styles.infoTextLabel}>Disponibilidade:</Text>
                        <Text style={styles.infoTextValue}>{service.availability}</Text>
                    </View>
                )}
                 {service.experience && (
                    <View style={styles.infoItem}>
                        <MaterialCommunityIcons name="trophy-award" size={20} color={colors.primary} />
                        <Text style={styles.infoTextLabel}>Experiência:</Text>
                        <Text style={styles.infoTextValue}>{service.experience}</Text>
                    </View>
                )}
                {/* Add more fields as needed, e.g., language, tools used etc. */}
            </View>
        </View>


        {provider && (
          <View style={[styles.section, styles.providerBox]}>
            <Text style={styles.sectionTitle}>Informações do Profissional</Text>
            <View style={styles.providerHeader}>
                <Image 
                    source={{ uri: provider.photoURL || 'https://placehold.co/100x100/E0E0E0/B0B0B0?text=Perfil' }} 
                    style={styles.providerAvatar}
                />
                <Text style={styles.providerName}>{provider.name || 'Nome não disponível'}</Text>
            </View>
            <View style={styles.providerContactInfo}>
              {provider.email && (
                <TouchableOpacity style={styles.providerItem} onPress={() => handleContactProvider('email')}>
                  <MaterialIcons name="email" size={18} color="#555" />
                  <Text style={styles.providerText}>{provider.email}</Text>
                </TouchableOpacity>
              )}
              {provider.phone && (
                <TouchableOpacity style={styles.providerItem} onPress={() => handleContactProvider('call')}>
                  <Feather name="phone" size={18} color="#555" />
                  <Text style={styles.providerText}>{provider.phone}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.requestQuoteButton]}
            onPress={handleRequestQuote} // Implement this function
          >
            <MaterialIcons name="request-quote" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Solicitar Orçamento</Text>
          </TouchableOpacity>

          <View style={styles.contactButtonsRow}>
            {provider?.uid && ( // Only show chat if provider UID is available
                <TouchableOpacity
                style={[styles.actionButton, styles.contactButton, styles.chatButton]}
                onPress={() => handleContactProvider('chat')}
                >
                <Entypo name="chat" size={18} color="#fff" />
                <Text style={styles.actionButtonTextSmall}>Chat</Text>
                </TouchableOpacity>
            )}
            {provider?.phone && (
                <TouchableOpacity
                style={[styles.actionButton, styles.contactButton, styles.callButton]}
                onPress={() => handleContactProvider('call')}
                >
                <Feather name="phone" size={18} color="#fff" />
                <Text style={styles.actionButtonTextSmall}>Ligar</Text>
                </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa' 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: colors.danger,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: 280, // Slightly taller image
    // No border radius here, let the card clip if necessary
  },
  content: {
    padding: 20,
    paddingBottom: 30, // Ensure space for buttons
  },
  headerSection: {
    marginBottom: 10,
  },
  serviceName: {
    fontSize: 26, // Larger service name
    fontWeight: 'bold',
    color: colors.dark, // Darker color for name
    marginBottom: 8,
    lineHeight: 32,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e7f3ff', // Light blue badge
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 15,
    alignSelf: 'flex-start', // Align to start
  },
  categoryText: {
    color: colors.primary, // Theme primary color
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  ratingText: {
    marginLeft: 6,
    marginRight: 8,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#444',
  },
  reviewsText: {
    color: '#666', // Lighter color for review count
    fontSize: 14,
  },
  priceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.success, // Or your theme's price color
    marginBottom: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18, // Consistent section title size
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    paddingLeft: 10,
  },
  descriptionText: {
    color: '#555',
    fontSize: 15,
    lineHeight: 23, // Improved line height for readability
    textAlign: 'justify',
  },
  infoGrid: {
    // Removed flexWrap for a list-like appearance or use 2 columns
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#eee'
  },
  infoTextLabel: {
    marginLeft: 10,
    color: '#333',
    fontSize: 15,
    fontWeight: '500',
  },
  infoTextValue: {
    marginLeft: 5,
    color: '#555',
    fontSize: 15,
    flexShrink: 1, // Allow text to wrap
  },
  providerBox: {
    backgroundColor: '#ffffff', // White background for provider box
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0', // Lighter border
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  providerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  providerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  providerName: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.dark,
  },
  providerContactInfo: {
    marginTop: 5,
  },
  providerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10, // Increased spacing
    paddingVertical: 5,
  },
  providerText: {
    marginLeft: 12,
    color: '#444', // Darker text for better contrast
    fontSize: 15,
  },
  actionsContainer: {
    marginTop: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8, // Rounded corners
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold', // Bolder text
    marginLeft: 10,
    fontSize: 16,
  },
  actionButtonTextSmall: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 14,
  },
  requestQuoteButton: {
    backgroundColor: colors.primary, // Primary color for main action
  },
  contactButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactButton: {
    width: '48%', // Adjust width for two buttons side-by-side
  },
  chatButton: {
    backgroundColor: '#3b82f6', // Blue for chat
  },
  callButton: {
    backgroundColor: '#22c55e', // Green for call
  },
});
