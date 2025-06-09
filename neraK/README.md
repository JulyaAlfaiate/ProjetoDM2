
# 💻 NeraK - Plataforma de Conexão Freelancer

**O ****NeraK** é um aplicativo móvel desenvolvido em  **React Native com Expo** **, projetado para conectar freelancers a clientes em busca de serviços. A plataforma facilita a publicação de projetos, a busca por profissionais qualificados e a gestão de propostas, tornando o processo de contratação e execução de trabalhos mais eficiente.**

## 🚀 Funcionalidades

* **Perfis de Usuário** — Permite que freelancers criem perfis detalhados com portfólio e habilidades, e clientes gerenciem suas necessidades e projetos.
* **Publicação de Projetos** — Clientes podem publicar projetos com descrições detalhadas, requisitos e orçamentos.
* **Busca e Filtragem de Freelancers/Projetos** — Ferramentas intuitivas para freelancers encontrarem projetos adequados e clientes localizarem profissionais ideais.
* **Envio e Gestão de Propostas** — Freelancers podem enviar propostas para projetos, e clientes podem revisar e aceitar a melhor oferta.
* **Comunicação Integrada** — Possibilita a comunicação direta entre clientes e freelancers dentro do aplicativo.
* **Sistema de Avaliações** — Permite que clientes avaliem o trabalho de freelancers, e vice-versa, construindo uma reputação na plataforma.
* **Integração com Firebase** — Backend robusto utilizando Firestore para dados, Authentication para gerenciamento de usuários.
* **Animações Lottie** — Animações para melhorar a experiência do usuário, como telas de carregamento.

## 🛠️ Tecnologias Utilizadas

* [React Native](https://reactnative.dev/ "null")
* [Expo](https://expo.dev/ "null")
* [Firebase](https://firebase.google.com/ "null") (Auth, Firestore, Storage)
* [Lottie React Native](https://github.com/lottie-react-native/lottie-react-native "null") (Animações)
* [React Navigation](https://reactnavigation.org/ "null")
* **Expo Vector Icons (Ionicons, FontAwesome, AntDesign e outros)**

## 📦 Instalação e Execução do Projeto

**Para configurar e executar o NeraK em seu ambiente de desenvolvimento, siga os passos abaixo:**

### 1️⃣ Clone o repositório

```
git clone https://github.com/JulyaAlfaiate/ProjetoDM2.git
cd ProjetoDM2

```

### 2️⃣ Instale as dependências

```
npm install

```

### 3️⃣ Configure o Firebase

**Este projeto utiliza Firebase para autenticação e armazenamento de dados.**

* **Crie um novo projeto no **[Firebase Console](https://console.firebase.google.com/ "null").
* **Ative os seguintes serviços:**
  * **Authentication** (escolha o método de "Email/Senha" ou outro de sua preferência).
  * **Firestore Database** **.**
  * **Storage** (opcional, para armazenamento de imagens de perfil ou portfólio).
* **Localize o arquivo de configuração do Firebase no projeto:**
  ```
  ./src/servicess/firebase.js

  ```
* **Atualize as credenciais **`<span class="selected">firebaseConfig</span>` com as informações do seu projeto Firebase:

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

### 4️⃣ Execute o aplicativo

```
npx expo start

```

### 🗂️ Estrutura de Pastas

```
├── assets/                # Imagens, animações e ícones
├── src/
│   ├── components/        # Componentes reutilizáveis da UI
│   ├── navigation/        # Configuração das rotas do aplicativo
│   ├── screens/           # Telas principais do aplicativo (e.g., Login, Home, Perfil)
│   ├── servicess/          # Configuração do Firebase e outras APIs de serviço
│   └── hooks/             # Hooks customizados (se aplicável)
├── App.js                 # Arquivo principal de inicialização
├── package.json           # Dependências do projeto e scripts

```

### 🧠 Observações Importantes

* **Este projeto foi desenvolvido com foco em um trabalho acadêmico, MVP (Minimum Viable Product) ou para uso pessoal.**
* **Dados de usuários e projetos podem ser fictícios ou mockados para fins de desenvolvimento inicial.**
* **O aplicativo pode ser expandido para incluir funcionalidades como gateways de pagamento, sistema de notificações push, chat em tempo real mais robusto, etc.**

**Desenvolvido por Julya Alfaiate.**
