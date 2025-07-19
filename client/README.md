# 🎮 Gemini 3D Game

Um jogo 2D com movimento em 3D, desenvolvido com **PhaserJS**, **React**, **TypeScript** e **Socket.IO**.

## 🚀 Features Implementadas

### ✅ **Versão 1.0 (Atual)**
- Menu principal com navegação
- Seleção de 2 personagens (Guerreiro e Arqueiro)
- Sistema de habilidades (Q, W, E, R)
- Modo PvE com ondas de inimigos
- Sistema básico de progressão (level up)
- Interface reativa com React
- Performance otimizada com Vite

### 🔄 **Em Desenvolvimento**
- Modo PvP multiplayer
- Sistema de upgrade avançado
- Networking com Socket.IO
- Assets visuais customizados

## 🏗️ Arquitetura

### **Frontend (Client)**
```
client/
├── src/
│   ├── components/     # Componentes React (UI)
│   ├── game/          # Engine Phaser
│   │   ├── scenes/    # Cenas do jogo
│   │   ├── entities/  # Player, Enemy, etc.
│   │   ├── systems/   # Sistemas de jogo
│   │   └── utils/     # Utilitários
│   └── types/         # TypeScript types
```

### **Backend (Server)**
```
server/
├── src/
│   ├── game/          # Lógica do servidor
│   ├── networking/    # Socket.IO handlers
│   └── utils/         # Utilitários do servidor
```

## 🛠️ Instalação e Execução

### **Pré-requisitos**
- Node.js 18+ 
- npm ou yarn

### **1. Clone o repositório**
```bash
git clone <repository-url>
cd gemini-3d-game
```

### **2. Instalar dependências**

**Cliente:**
```bash
cd client
npm install
```

**Servidor:**
```bash
cd server
npm install
```

### **3. Executar em modo desenvolvimento**

**Terminal 1 - Cliente:**
```bash
cd client
npm run dev
```

**Terminal 2 - Servidor:**
```bash
cd server
npm start
```

### **4. Acessar o jogo**
- Abra o navegador em: `http://localhost:3000`

## 🎮 Controles

### **Movimentação**
- `W A S D` ou `↑ ← ↓ →` - Mover personagem

### **Habilidades**
- `Q` - Habilidade 1
- `W` - Habilidade 2  
- `E` - Habilidade 3
- `R` - Habilidade Ultimate

### **Interface**
- `ESC` - Menu de pausa
- `Mouse` - Interação com menus

## 🎯 Personagens

### ⚔️ **Guerreiro (Melee)**
- **Vida:** 120 HP
- **Energia:** 80 EN
- **Especialidade:** Combate corpo a corpo

**Habilidades:**
- **Q - Investida:** Dash com dano
- **W - Golpe Giratório:** Ataque em área
- **E - Fúria:** Buff de velocidade/dano
- **R - Salto Devastador:** Ultimate com alto dano

### 🏹 **Arqueiro (Ranged)**
- **Vida:** 80 HP
- **Energia:** 120 EN
- **Especialidade:** Ataques à distância

**Habilidades:**
- **Q - Tiro Perfurante:** Projétil rápido
- **W - Chuva de Flechas:** Área de dano
- **E - Tiro Explosivo:** Projétil explosivo
- **R - Rajada Mortal:** Múltiplos projéteis

## 🗺️ Modos de Jogo

### 🧟 **PvE - Hordas**
- Ondas infinitas de inimigos
- Sistema de progressão por level
- Dificuldade crescente
- Sobrevivência e pontuação

### ⚔️ **PvP - Arena** *(Em desenvolvimento)*
- Batalha 1v1 em arena fechada
- Matchmaking automático
- Sistema de ranking
- Tempo real multiplayer

## 📊 Sistema de Progressão

- **Experiência:** Ganhe XP ao derrotar inimigos
- **Level Up:** Aumente vida, energia e stats
- **Upgrades:** Melhore habilidades (futuro)
- **Conquistas:** Sistema de achievements (futuro)

## 🔧 Configurações Técnicas

### **Performance**
- **60 FPS** target
- **Object pooling** para projéteis
- **Frustum culling** para otimização
- **Chunk loading** para mapas grandes

### **Networking**
- **Socket.IO** para multiplayer
- **Client prediction** para responsividade
- **Server reconciliation** para precisão
- **Lag compensation** para fairness

## 🐛 Debug e Desenvolvimento

### **Comandos úteis**
```bash
# Build de produção
npm run build

# Preview da build
npm run preview

# Análise do bundle
npm run analyze
```

### **Debug do Phaser**
- Altere `debug: false` para `true` em `PvEHordeScene.ts`
- Ative Physics debug para ver hitboxes
- Use `console.log` para debug de estados

## 🎨 Assets e Arte

### **Sprites Atuais**
- Sprites procedurais (placeholder)
- Formas geométricas coloridas
- Sistema de cores consistente

### **Assets Futuros**
- Sprites customizados para personagens
- Animações de habilidades
- Efeitos visuais avançados
- Mapas desenhados

## 📈 Roadmap

### **v1.1** - Melhorias de Gameplay
- [ ] Balanceamento de habilidades
- [ ] Mais tipos de inimigos
- [ ] Sistema de upgrade básico
- [ ] Efeitos sonoros

### **v1.2** - Visual e Polish  
- [ ] Sprites customizados
- [ ] Animações suaves
- [ ] Particles systems
- [ ] UI/UX melhorada

### **v2.0** - Multiplayer
- [ ] PvP funcional
- [ ] Servidor dedicado
- [ ] Sistema de matchmaking
- [ ] Anti-cheat básico

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Commit: `git commit -m 'Adiciona nova feature'`
4. Push: `git push origin feature/nova-feature`
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Para bugs e sugestões:
- Abra uma **Issue** no GitHub
- Descreva o problema detalhadamente
- Inclua screenshots se possível

---

**Desenvolvido com ❤️ usando PhaserJS + React + TypeScript** 