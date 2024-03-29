# Culture Power API
Este é um projeto de API para um sistema de premiação interna, desenvolvido em Node.js com o framework Express e utilizando MongoDB como banco de dados. O objetivo atual deste projeto é a avaliação final do módulo 3 da Arnia.

## Estrutura do Projeto
Foi estruturado seguindo a arquitetura em camadas (N-Tier), com dependência em cascata das camadas. A estrutura do projeto é organizada da seguinte forma:

```bash
project/
│
├── src/
│   ├── admins/
│   │   ├── admin-controller.ts
│   │   ├── admin-domain.ts
│   │   ├── admin-dto.ts
│   │   ├── admin-repository.ts
│   │   ├── admin-routes.ts
│   │   ├── admin-service.ts
│   │   └── index.ts
│   ├── auth/
│   │   ├── auth-controller.ts
│   │   ├── auth-dto.ts
│   │   ├── auth-routes.ts
│   │   ├── auth-service.ts
│   │   └── index.ts
│   ├── configs/
│   │   ├── database.ts
│   │   └── env.ts
│   ├── products/
│   │   ├── products-controller.ts
│   │   ├── products-domain.ts
│   │   ├── products-dto.ts
│   │   ├── products-repository.ts
│   │   ├── products-routes.ts
│   │   ├── products-service.ts
│   │   └── index.ts
│   ├── shared/
│   │   ├── error/
│   │   │   └── CustomError.ts
│   │   └── middlewares/
│   │       ├── adminMiddleware.ts
│   │       ├── authenticateUserMiddleware.ts
│   │       ├── authMiddleware.ts
│   │       ├── authorizeAdminMiddleware.ts
│   │       ├── logMiddleware.ts
│   │       ├── productMiddleware.ts
│   │       ├── uploadMiddleware.ts
│   │       └── userMiddleware.ts
│   ├── users/
│   │   ├── user-controller.ts
│   │   ├── user-domain.ts
│   │   ├── user-dto.ts
│   │   ├── user-repository.ts
│   │   ├── user-routes.ts
│   │   ├── user-service.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── enums/
│   │   │   ├── errorMessage.ts
│   │   │   ├── fieldMissing.ts
│   │   │   └── statusCode.ts
│   │   └── jwt-utils.ts
│   ├── index.ts
│   └── server.ts
├── test/
│   └── units/
│       └── product/
│           ├── product-fake-repository.ts
│           └── product-service.spec.ts
├── insomnia/
│   └── insomnia.json
├── uploads/
├── .env.example
├── .gitignore
├── package-lock.json
├── package.json
├── tsconfig.json
└── README.md
```

**Controllers**: São os controladores responsáveis por receber as requisições HTTP, chamar os serviços correspondentes e enviar as respostas.  
**Domains**: Define as interfaces e esquemas de dados dos principais domínios da aplicação, como Admin e User.  
**Dtos**: Define os Data Transfer Objects (DTOs) para as operações de criação e atualização de entidades.  
**Middlewares**: São os middlewares utilizados nas rotas para implementar lógica intermediária, como autenticação e autorização e validação.  
**Repositories**: Implementa a camada de acesso a dados, fornecendo métodos para interagir com o banco de dados.  
**Routes**: Define as rotas da API, mapeando endpoints HTTP para os controladores correspondentes.  
**Services**: Implementa a lógica de negócios da aplicação, utilizando os repositórios para acessar e manipular os dados.  
**Shared**: Contém código compartilhado, como mensagens de erro personalizadas.  
**Utils**: Contém utilitários, como enums para códigos de status HTTP e funções para trabalhar com tokens JWT.  
**Index**: Os index instânciam as camadas e disponibilizam o controller para o router.

## Rotas Principais

### Admins

**POST /admin:** Cria um novo administrador.  
**GET /admin/:id:** Obtém os detalhes de um administrador pelo ID.  
**GET /admin:** Obtém todos os administradores.  
**PATCH /admin/:id:** Atualiza os dados de um administrador pelo ID.  
**DELETE /admin/:id:** Remove um administrador pelo ID.  
**PATCH /admin/:userId/update-jewels:** Atualiza as jóias de um usuário específico.  

### Products

**POST /product:** Cria um novo produto.  
**GET /product/:id:** Obtém os detalhes de um produto pelo ID.  
**GET /product:** Obtém todos os produtos disponíveis.  
**PATCH /product/:id:** Atualiza os detalhes de um produto pelo ID.  
**DELETE /product/:id:** Remove um produto pelo ID.  

### Users

**POST /user:** Cria um novo usuário.  
**GET /user/:id:** Obtém os detalhes de um usuário pelo ID.  
**GET /user:** Obtém todos os usuários.  
**PATCH /user/:id:** Atualiza os detalhes de um usuário pelo ID.  
**DELETE /user/:id:** Remove um usuário pelo ID.  
**POST /user/buy-product/:productId:** Permite que um usuário compre um produto.  
**POST /user/add-to-favorites/:productId:** Adiciona um produto aos favoritos de um usuário.  
**DELETE /user/remove-to-favorites/:productId:** Remove um produto dos favoritos de um usuário.  

## Instruções de Instalação e Uso
Para executar o projeto localmente, siga estas etapas:

Clone o repositório para o seu ambiente local.
```bash
git clone https://github.com/marco-duart/CulturePower.git
```
Instale as dependências utilizando o comando npm install.
```bash
npm install
```
Crie um arquivo .env na raiz do projeto para as variáveis de ambiente, como a URL do banco de dados MongoDB e a chave secreta JWT seguindo o exemplo em .env.example.

Execute o comando npm start (ou npm run dev) para iniciar o servidor.
```bash
npm start
```
A API estará disponível em http://localhost:3000.
Acesse as rotas da API usando um cliente HTTP, como Postman ou Insomnia. Lembrando que o export do Insomnia está disponível em insomnia/insomnia.json.
Lembrando que foi feito o deploy do projeto no RailWay, disponível pelo link: culturepower-production.up.railway.app

Parabéns a todos os professores e a monitora!