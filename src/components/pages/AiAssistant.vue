<!-- src/components/pages/AiAssistant.vue -->
<template>
  <BaseLayout>
    <!-- Hero Section -->
    <section class="ai-hero">
      <h1 class="ai-hero__title">AI Game Assistant</h1>
    </section>

    <div class="ai-assistant-container">
      <div class="chat-container">
        <!-- Conversation history -->
        <div class="message-list" ref="messageList">
          <div
            v-for="(msg, index) in messages"
            :key="index"
            :class="['message', msg.role]"
          >
            <!-- avatar icon -->
            <img
              :src="msg.role === 'user' ? userIcon : aiIcon"
              class="message-avatar"
              alt=""
            />
            <div v-html="toHtml(msg.content)" class="message-content"></div>
          </div>
          <div v-if="isLoading" class="loading-dots">
            <span>.</span><span>.</span><span>.</span>
          </div>
        </div>

        <!-- Input area -->
        <div class="input-container">
          <input
            v-model="userInput"
            @keyup.enter="sendMessage"
            placeholder="Ask me about games..."
            class="form-control chat-input"
          />
          <button @click="sendMessage" class="btn send-btn">
            <i class="bi bi-send-fill"></i>
          </button>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>

<script>
import BaseLayout from './BaseLayout.vue';
import api from '@/api';
import { marked } from 'marked';
import userIcon from '@/assets/user-icon.png';
import aiIcon from '@/assets/ai-icon.png';

export default {
  name: 'AiAssistant',
  components: { BaseLayout },
  data() {
    return {
      userInput: '',
      messages: [
        {
          role: 'assistant',
          content: `Hello! I'm **PixelBot**. Ask me anything about games, creators, or recommendations!`
        }
      ],
      isLoading: false,
      userIcon,
      aiIcon
    };
  },
  methods: {
    toHtml(md) {
      return marked.parse(md);
    },
    async sendMessage() {
      if (!this.userInput.trim()) return;
      this.messages.push({ role: 'user', content: this.userInput });
      this.isLoading = true;
      try {
        const res = await api.askAI(this.userInput);
        const choice = res.data.choices?.[0]?.message?.content || '…';
        this.messages.push({ role: 'assistant', content: choice });
      } catch (err) {
        console.error('AI Error:', err);
        this.messages.push({
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again shortly.'
        });
      } finally {
        this.isLoading = false;
        this.userInput = '';
        this.$nextTick(() => {
          const list = this.$refs.messageList;
          list.scrollTop = list.scrollHeight;
        });
      }
    }
  }
};
</script>

<style scoped>
/* Hero Section */
.ai-hero {
  background: url('@/assets/hero-bg.jpg') center/cover no-repeat;
  padding: 4rem 1rem;
  text-align: center;
}
.ai-hero__title {
  font-family: 'Press Start 2P', cursive;
  font-size: 3rem;
  color: #ffd700;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7);
  margin: 0;
}

/* Chat container poziționat peste hero */
.ai-assistant-container {
  max-width: 800px;
  margin: -3rem auto 2rem;
  padding: 0 1rem;
}

/* Fundalul chat-ului */
.chat-container {
  background: rgba(30, 30, 30, 0.85);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
}

/* Lista de mesaje */
.message-list {
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: rgba(20, 20, 20, 0.7);
  border-radius: 8px;
}

/* Mesajele individuale */
.message {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  font-family: 'Roboto Mono', monospace;
}
/* AI messages: stânga */
.message.assistant {
  background: rgba(255, 215, 0, 0.2);
  border-left: 4px solid #ffd700;
  flex-direction: row;
}
/* User messages: dreapta */
.message.user {
  background: rgba(229, 57, 53, 0.2);
  border-right: 4px solid #e53935;
  flex-direction: row-reverse;
}

/* Avatar-ul */
.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 0.25rem;
}

/* Conținut Markdown */
.message-content {
  flex: 1;
  line-height: 1.5;
}
/* aliniez textul user la dreapta */
.message.user .message-content {
  text-align: right;
}
/* markdown styling */
.message-content strong {
  display: inline-block;
  margin-bottom: 0.25rem;
}
.message-content h1,
.message-content h2,
.message-content h3 {
  margin-top: 1rem;
  color: #ffd700;
}
.message-content p {
  margin: 0.5rem 0;
}
.message-content ul {
  padding-left: 1.25rem;
}
.message-content li {
  margin: 0.25rem 0;
}

/* Punctele de încărcare */
.loading-dots {
  display: flex;
  gap: 0.25rem;
  justify-content: flex-end;
  padding-right: 0.5rem;
}
.loading-dots span {
  animation: blink 1.2s infinite;
  opacity: 0;
}
.loading-dots span:nth-child(2) { animation-delay: 0.2s; }
.loading-dots span:nth-child(3) { animation-delay: 0.4s; }
@keyframes blink {
  0%,100%{opacity:0;}50%{opacity:1;}
}

/* Zona de input */
.input-container {
  display: flex;
  gap: 0.5rem;
}
.chat-input {
  flex-grow: 1;
  background: rgba(255,255,255,0.05);
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1rem;
  color: #fff;
}
.chat-input::placeholder {
  color: rgba(255,255,255,0.6);
}
.chat-input:focus {
  outline: none;
  background: rgba(255,255,255,0.1);
  box-shadow: 0 0 0 2px rgba(227,115,85,0.5);
}

/* Butonul de trimis */
.send-btn {
  background: linear-gradient(45deg,#e53935,#ffd700);
  color:#fff;
  border:none;
  border-radius:6px;
  padding:0 1rem;
  display:flex;
  align-items:center;
  justify-content:center;
}
.send-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(229,57,53,0.6);
}
</style>
