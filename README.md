# 🎉 EventPro API

![Node.js](https://img.shields.io/badge/Node.js-Typescript-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)

<p align="center">
  <img src="https://img.icons8.com/fluency/240/conference-call.png" alt="EventPro Logo" width="120"/>
</p>

## 📝 Sobre o Projeto

O **EventPro** é uma plataforma inovadora para a **gestão de eventos presenciais**, focada em oferecer uma experiência moderna e automatizada para organizadores e participantes. Esta API é responsável pelo gerenciamento de dados, autenticação e todas as funcionalidades essenciais da aplicação.

> "Eventos mais simples, tecnologia mais inteligente."

A API segue arquitetura RESTful e é desenvolvida em **Node.js com TypeScript**, garantindo **escalabilidade**, **segurança** e **performance**.

## 🚀 Funcionalidades da API

✨ Autenticação de usuários e controle de acesso  
📅 Criação e gerenciamento de eventos  
📲 Controle de participação via QR Code e NFC  
🔐 Registro de entrada e saída dos participantes  
📄 Geração e envio automático de certificados  
📤 Envio de notificações e conteúdos pós-evento  
📚 Histórico de eventos e documentos do usuário  
📊 Dashboard para organizadores  
📶 Suporte a modo offline (armazenamento local de QR Code)  
📝 Logs para auditoria e rastreabilidade  

## 🧱 Arquitetura

A aplicação está dividida em três camadas principais:

- 🎨 **Front-end**: Desenvolvido em Flutter
- 🗃️ **Banco de Dados**: MongoDB (NoSQL, escalável)
- 🛠️ **API (este repositório)**: Node.js + TypeScript (RESTful)

## 🛠️ Tecnologias Utilizadas

- ✅ [Node.js](https://nodejs.org/)
- ✅ [TypeScript](https://www.typescriptlang.org/)
- ✅ [Express](https://expressjs.com/)
- ✅ [MongoDB](https://www.mongodb.com/)
- ✅ [Mongoose](https://mongoosejs.com/)
- ✅ [JWT](https://jwt.io/) - Autenticação
- ✅ [Nodemailer](https://nodemailer.com/) - Envio de emails
- ✅ [Swagger](https://swagger.io/) - (em breve) documentação da API

## 📂 Estrutura de Pastas

```bash
src/
├── controllers/
├── routes/
├── models/
├── services/
├── middlewares/
├── utils/
└── config/
```

## 👥 Equipe

| 👤 Nome | 🧰 Função |
|--------|----------|
| Antô nio Augusto do Prado Lino | Líder de Projeto |
| Guilherme Albuquerque Zaparolli | Gerente de Projeto |
| Enzo Vinícius Tanabe | Desenvolvedor Back-End |
| Murilo Neres Neuba de Oliveira | Desenvolvedor Mobile |
| Alec Kenzo Ueda | Apoio/Documentação |

## ▶️ Como Executar

1. 🔁 Clone este repositório
2. 📦 Instale as dependências:
   ```bash
   npm install
   ```
3. ⚙️ Configure as variáveis de ambiente em um arquivo `.env`
4. 🚀 Inicie o servidor:
   ```bash
   npm run dev
   ```

## 🗓️ Cronograma (Resumo das Etapas)

- 📌 Estruturação da API: abril/2025
- 🔗 Integração com front: maio/2025
- 🔍 Testes e refinamentos: maio/2025
- 🧪 Apresentação final: 07/06/2025

## 📄 Licença

Projeto acadêmico desenvolvido para o curso de Análise e Desenvolvimento de Sistemas da **Universidade de Sorocaba**. Sem fins comerciais.

---

<p align="center">
  Desenvolvido com 💡 por estudantes apaixonados por tecnologia e inovação.
</p>

