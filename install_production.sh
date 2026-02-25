#!/bin/bash

# Script de instalação automatizada para Beyond Avaliação (Produção)
# Desenvolvido para Manus AI

echo "🚀 Iniciando instalação do Beyond Avaliação em Produção..."

# 1. Verificar dependências
echo "📦 Verificando dependências..."
if ! command -v docker &> /dev/null; then
    echo "❌ Erro: Docker não encontrado. Por favor, instale o Docker antes de continuar."
    exit 1
fi

if ! command -v docker compose &> /dev/null; then
    echo "❌ Erro: Docker Compose não encontrado. Por favor, instale o Docker Compose antes de continuar."
    exit 1
fi

# 2. Configurar variáveis de ambiente
echo "🔑 Configurando ambiente..."
if [ ! -f .env.production ]; then
    echo "📄 Criando .env.production padrão..."
    cat > .env.production << 'EOF'
# Configurações de Produção - Beyond Avaliação
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://beyond_user:beyond_pass123@db:5432/beyond_avaliacao
SESSION_SECRET=X820Q/natOLz+UQAz5wZUO5sbaE43L9HWWd91ia3CJk=
EOF
fi

# 3. Limpar containers antigos (para evitar o erro KeyError: 'ContainerConfig')
echo "🧹 Limpando containers antigos..."
docker compose -f docker-compose.production.yml down --remove-orphans > /dev/null 2>&1

# 4. Iniciar containers
echo "🏗️ Construindo e iniciando containers via Docker Compose..."
docker compose -f docker-compose.production.yml up -d --build

# 5. Aguardar banco de dados estar pronto
echo "⏳ Aguardando banco de dados estar pronto..."
MAX_RETRIES=30
COUNT=0
while ! docker exec beyond_db_prod pg_isready -U beyond_user -d beyond_avaliacao > /dev/null 2>&1; do
    sleep 2
    COUNT=$((COUNT + 1))
    if [ $COUNT -ge $MAX_RETRIES ]; then
        echo "❌ Erro: Banco de dados não ficou pronto a tempo."
        exit 1
    fi
done

# 6. Executar migrações do banco
echo "💾 Executando migrações do banco de dados..."
docker exec beyond_app_prod npx drizzle-kit push --config drizzle.config.ts

echo "✅ Instalação concluída com sucesso!"
echo "🌐 Acesse o aplicativo em: http://localhost:3000"
echo "🔐 Login administrador automático disponível na Landing Page."
