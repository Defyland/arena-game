# 🚀 Instalação Rápida - Gemini 3D Game

## Comandos para Executar:

### Windows (PowerShell):
```powershell
# Instalar dependências do cliente
cd client
npm install

# Instalar dependências do servidor  
cd ../server
npm install

# Voltar para raiz
cd ..

# Executar cliente (Terminal 1)
cd client && npm run dev

# Executar servidor (Terminal 2 - abrir novo terminal)
cd server && npm start
```

### Linux/Mac:
```bash
# Instalar dependências
cd client && npm install
cd ../server && npm install

# Executar ambos (em terminais separados)
# Terminal 1:
cd client && npm run dev

# Terminal 2: 
cd server && npm start
```

## Acessar o Jogo:
- **URL:** http://localhost:3000
- **Servidor:** http://localhost:3001

## Primeiro Teste:
1. Acesse http://localhost:3000
2. Clique em "🎮 Jogar"
3. Escolha um personagem
4. Selecione "🧟 PvE (Hordas)"
5. Clique "Iniciar Batalha"
6. Use WASD para mover
7. Use Q, W, E, R para habilidades

## Problemas Comuns:
- **Porta ocupada:** Mude a porta no vite.config.ts
- **Dependências:** Delete node_modules e reinstale
- **Performance:** Feche outras abas do navegador

## Status do Projeto:
✅ **Funcionando:** Menu, Seleção, PvE básico  
🔄 **Em desenvolvimento:** PvP multiplayer  
⏳ **Futuro:** Assets customizados, sistemas avançados 