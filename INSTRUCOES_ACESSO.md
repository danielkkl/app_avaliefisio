# Beyond Avaliação - Instruções de Acesso (Ambiente Local)

O projeto **Beyond Avaliação** foi configurado com sucesso no servidor interno. Para facilitar o uso e desenvolvimento local, a autenticação original do Replit OIDC foi substituída por um sistema de autenticação local simples.

## 🚀 Como Acessar

1.  **URL de Acesso:** [Clique aqui para abrir o aplicativo](https://5000-ij5x6uhyy2erx1e84zsma-118674c3.us2.manus.computer)
2.  **Login:** Na página inicial, clique no botão **"Acessar Sistema"**.
3.  **Credenciais:** O login é automático para o usuário administrador (`admin@beyond.local`).

## 🛠️ Configurações Realizadas

*   **Banco de Dados:** PostgreSQL local configurado e todas as tabelas criadas (`fichas`, `users`, `sessions`, `user_plans`, `ficha_usage`).
*   **Autenticação:** Removida a dependência do Replit OIDC. Implementado **Passport-Local** com persistência em banco de dados.
*   **Ambiente:** Arquivo `.env` configurado com segredos locais e conexão segura com o banco.
*   **Frontend:** Pequeno ajuste na `LandingPage.tsx` para permitir o login local sem formulário complexo, mantendo a interface original.

## 📁 Estrutura do Projeto no Servidor

*   **Diretório:** `/home/ubuntu/beyond_avaliacao_linux`
*   **Servidor Backend:** Express rodando na porta 5000.
*   **Frontend:** React (Vite) servido pelo Express.

## 📝 Notas Técnicas

O sistema agora armazena todas as sessões e dados de usuário diretamente no banco de dados PostgreSQL local, garantindo que o projeto funcione de forma totalmente independente de serviços externos.
