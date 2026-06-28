# AgroLite

Aplicação mobile para gestão de rebanhos, com controle de animais, tipos de manejo, agendamentos e indicadores estatísticos. Desenvolvida com **React Native (Expo)** no frontend e **FastAPI + PostgreSQL** no backend.

---

## Índice

- [Como Rodar o Projeto](#como-rodar-o-projeto)
  - [Pré-requisitos](#pré-requisitos)
  - [Backend](#backend)
  - [Expondo a API com ngrok](#expondo-a-api-com-ngrok)
  - [Frontend](#frontend)
- [Decisões Técnicas](#decisões-técnicas)
- [Próximos Passos](#próximos-passos)

---

## Como Rodar o Projeto

### Pré-requisitos

- Python 3.14.6+
- Node.js e npm
- PostgreSQL instalado e rodando localmente
- [ngrok](https://ngrok.com/download) instalado e autenticado

---

### Backend

**1. Crie e ative o ambiente virtual**

```bash
python -m venv .venv

# Linux/macOS
source .venv/bin/activate

# Windows
.venv\Scripts\activate
```

**2. Instale as dependências**

```bash
pip install -r requirements.txt
```

**3. Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do backend com o seguinte conteúdo, ajustando usuário e senha conforme sua instalação do PostgreSQL:

```dotenv
BASE_URL=postgresql://postgres:1234@localhost:5432/postgres
DATABASE_NAME=agrolite_management
RAW_DATABASE_URL=postgresql://postgres:1234@localhost:5432/agrolite_management
DATABASE_URL=postgresql+asyncpg://postgres:1234@localhost:5432/agrolite_management
```

> **Observação:** o driver `asyncpg` é utilizado para garantir compatibilidade com máquinas Windows.

**4. Inicialize o banco de dados**

```bash
python -m scripts.init_db
```

**5. Inicie o servidor**

```bash
python -m uvicorn app:app --reload
```

O servidor estará disponível em `http://localhost:8000`.

---

### Expondo a API com ngrok

Como o app mobile precisa acessar a API durante o desenvolvimento, é necessário torná-la publicamente acessível via **ngrok**.

**1. Instale o ngrok**

Acesse [https://ngrok.com/download](https://ngrok.com/download) e siga as instruções para o seu sistema operacional. Ou via terminal:

```bash
# macOS (Homebrew)
brew install ngrok

# Linux (snap)
snap install ngrok
```

**2. Autentique-se com seu token**

Crie uma conta em [ngrok.com](https://ngrok.com), copie seu authtoken e rode:

```bash
ngrok config add-authtoken <SEU_TOKEN>
```

**3. Exponha a porta do backend**

```bash
ngrok http 8000
```

O ngrok exibirá uma URL pública no formato `https://xxxx-xxxx.ngrok-free.app`. Guarde essa URL — ela será usada no passo de configuração do frontend.

---

### Frontend

**1. Configure a URL da API**

Abra o arquivo `frontend/app.json` e substitua o valor de `apiUrl` pela URL gerada pelo ngrok:

```json
"expo": {
  "name": "test-agrolite",
  "slug": "test-agrolite",
  "version": "1.0.0",
  "orientation": "portrait",
  "icon": "./assets/images/icon.png",
  "scheme": "testagrolite",
  "userInterfaceStyle": "automatic",
  "newArchEnabled": true,
  "extra": {
    "apiUrl": "https://SUA-URL-AQUI.ngrok-free.app"
  }
}
```

**2. Instale as dependências**

```bash
cd frontend
npm install
```

**3. Inicie o app**

```bash
npx expo start
```

Escaneie o QR code com o aplicativo **Expo Go** (disponível na App Store e Google Play) ou rode em um emulador.

---

## Decisões Técnicas

### Backend

- **PostgreSQL** foi escolhido como banco de dados relacional por conta do forte relacionamento entre as entidades do domínio (animais, manejos, tipos de manejo), garantindo integridade referencial e seguindo os princípios **ACID**.
- **SQLAlchemy** foi utilizado como ORM, combinado com **FastAPI** e funções assíncronas, seguindo boas práticas de desenvolvimento backend em Python com esse stack.
- **asyncpg** foi adotado como driver de conexão para evitar problemas de compatibilidade em máquinas Windows com operações assíncronas.
- Foi implementado um **CRUD completo para todas as entidades**, visando facilitar futuras evoluções da aplicação, como a edição e exclusão de animais do rebanho.

### Frontend

- O app conta com **4 telas principais**: cadastros(animal,tipo de manejo e manejo) animais(que ao clicar vai para o histórico), agenda, dados.
- Os formulários utilizam **react-hook-form** com validação via **Zod**, garantindo uma experiência de preenchimento robusta e com feedback em tempo real.
- A tela de animais exibe os manejos associados e, ao clicar em um animal, apresenta datas, tipos e descrições dos manejos realizados.
- Na **tela de agenda**, foi utilizado `react-native-calendar` com lógica de dependências e datas previstas, onde:
  - **Verde** — manejo já realizado
  - **Amarelo** — criado, mas com pendência
  - **Vermelho** — pendente e atrasado
  - **Azul** — data futura agendada
- Um animal é considerado **pendente** se pelo menos um dos seus tipos de manejo estiver atrasado; caso contrário, é classificado como **em dia**.
- Como diferencial, foram implementadas **telas de dados e estatísticas**, tornando as informações mais visuais e transparentes, e que podem futuramente apoiar a **tomada de decisão** do produtor em relação ao seu rebanho.

---

## Próximos Passos

Com mais tempo de desenvolvimento, as seguintes melhorias seriam priorizadas:

- **Tela de cadastro de usuário** com autenticação, para suportar múltiplos produtores na mesma plataforma.
- **Camadas adicionais de segurança no backend**, como proteção de rotas via UUID e autenticação JWT.
- **Melhoria de design no frontend**, com uma interface mais moderna, intuitiva e responsiva a diferentes tamanhos de tela.
- **CI/CD e deploy em produção**, eliminando a dependência do ngrok para o ambiente de desenvolvimento.
