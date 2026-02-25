# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Instalar dependências de build
COPY package*.json ./
RUN npm install

# Copiar código-fonte
COPY . .

# Build do frontend e backend
RUN npm run build

# Production stage
FROM node:20-slim

WORKDIR /app

# Instalar dependências de produção + drizzle-kit e drizzle-orm para migrações
COPY package*.json ./
RUN npm install --omit=dev && npm install drizzle-kit@0.31.8 drizzle-orm tsx

# Copiar arquivos buildados
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/drizzle.config.ts ./
COPY --from=builder /app/tsconfig.json ./

# Variáveis de ambiente padrão
ENV NODE_ENV=production
ENV PORT=3000

# Expor a porta
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["npm", "start"]
