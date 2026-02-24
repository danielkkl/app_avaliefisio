# 🏥 Beyond Avaliação - Guia de Implantação em Produção

Este guia contém todas as informações necessárias para rodar o sistema **Beyond Avaliação** em seu próprio servidor de produção de forma profissional e segura.

## 📋 Pré-requisitos

Para uma instalação rápida e estável, recomendamos o uso do **Docker**.

*   **Docker** (v20.10+)
*   **Docker Compose** (v2.0+)
*   **Node.js** (v20+) - *Apenas se não usar Docker*
*   **PostgreSQL** (v14+) - *Apenas se não usar Docker*

---

## 🚀 Método 1: Instalação via Docker (Recomendado)

O Docker garante que todas as dependências (Node, PostgreSQL, Bibliotecas) estejam configuradas corretamente de forma isolada.

1.  **Extraia o arquivo ZIP** em seu servidor.
2.  **Execute o script de instalação automática:**
    ```bash
    ./install_production.sh
    ```
3.  **Acesse o sistema:** Abra seu navegador em `http://seu-ip:3000`.

### Comandos úteis do Docker:
*   **Ver logs:** `docker-compose -f docker-compose.production.yml logs -f`
*   **Parar o sistema:** `docker-compose -f docker-compose.production.yml down`
*   **Reiniciar:** `docker-compose -f docker-compose.production.yml restart`

---

## 🛠️ Método 2: Instalação Manual (Node.js)

Se preferir rodar diretamente no sistema operacional:

1.  **Configure o Banco de Dados:** Crie um banco PostgreSQL chamado `beyond_avaliacao`.
2.  **Instale as dependências:**
    ```bash
    npm install --omit=dev
    ```
3.  **Configure o arquivo `.env`:**
    Crie um arquivo `.env` na raiz com:
    ```env
    DATABASE_URL=postgresql://usuario:senha@localhost:5432/beyond_avaliacao
    SESSION_SECRET=sua_chave_secreta_aqui
    NODE_ENV=production
    PORT=3000
    ```
4.  **Execute o Build:**
    ```bash
    npm run build
    ```
5.  **Inicie o Servidor:**
    ```bash
    npm start
    ```

---

## 🔐 Segurança e Autenticação

O sistema foi ajustado para usar **Autenticação Local** armazenada no banco de dados, eliminando a dependência do Replit OIDC.

*   **Login Admin:** Na Landing Page, clique em "Acessar Sistema".
*   **Dados:** Todos os dados de pacientes, avaliações e usuários são persistidos no volume `postgres_data` (Docker) ou no seu banco local.

## 📁 Estrutura de Pastas
*   `/client`: Frontend React/Vite
*   `/server`: Backend Express/Node.js
*   `/shared`: Esquemas de banco e rotas compartilhadas
*   `/dist`: Arquivos compilados para produção

---
*Desenvolvido com suporte de Manus AI.*
