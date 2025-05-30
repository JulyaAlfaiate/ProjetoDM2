# 📱 PetLove - Aplicativo de Adoção e Clínica Veterinária

O **PetLove** é um aplicativo desenvolvido em **React Native com Expo**, que oferece aos usuários a possibilidade de visualizar animais disponíveis para adoção e conhecer os serviços da clínica veterinária. O app permite favoritar pets, visualizar detalhes e acessar informações da clínica.

---

## 🚀 Funcionalidades

- 🐶 **Pets para Adoção** — Visualização dos animais disponíveis, filtragem por categorias (Cachorros, Gatos, Aves, Outros) e favoritos.
- 🏥 **Nossa Clínica** — Informações sobre serviços veterinários, agendamento de consultas e localização.
- ❤️ **Favoritos** — Permite que o usuário salve seus pets favoritos.
- 🔍 **Busca por Categoria** — Filtragem rápida e intuitiva dos pets.
- ☁️ **Integração com Firebase** — Backend utilizando Firestore, Authentication.
- ⚡ **Animações Lottie** — Tela de carregamento animada para uma melhor experiência do usuário.

---

## 🛠️ Tecnologias Utilizadas

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [Firebase](https://firebase.google.com/) (Auth, Firestore, Storage)
- [Lottie React Native](https://github.com/lottie-react-native/lottie-react-native) (Animações)
- [React Navigation](https://reactnavigation.org/)
- Expo Vector Icons (Ionicons, FontAwesome, AntDesign e outros)

---

## 📦 Instalação e Execução do Projeto

### 1️⃣ Clone o repositório

```bash
git clone https://github.com/GuilhermeSegattoo/ClinicDog.git
cd seu-repositorio
```

### 2️⃣ Instale as dependências

npm install

### 3️⃣ Configure o Firebase

Crie um projeto no Firebase Console.

Ative os serviços:

Authentication (modo Email/Senha ou outro de sua escolha)

Firestore Database

Storage (opcional, para armazenar imagens dos pets)

Localize o arquivo:
```bash
./src/services/firebase.js
```
Atualize com suas credenciais do Firebase:
```
export const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};
```
### 4️⃣ Execute o app

npx expo start

### 🗂️ Estrutura de Pastas

```
├── assets/                # Imagens, animações e ícones
├── src/
│   ├── components/        # Componentes reutilizáveis
│   ├── navigation/        # Configuração das rotas
│   ├── screens/           # Telas do aplicativo
│   ├── services/          # Configuração do Firebase e API de pets
│   └── hooks/             # Hooks customizados (se aplicável)
├── App.js                 # Arquivo principal
├── package.json           # Dependências e scripts
```

### 🧠 Observações Importantes

Este projeto foi desenvolvido como trabalho acadêmico, MVP ou uso pessoal.

As imagens dos pets são armazenadas no scr/services/petsData.json direto da web, todos os pets são fictícios.

O app pode ser expandido para incluir funcionalidades como chat, cadastro de pets, e etc...

Desenvolvido por Guilherme Segatto.









