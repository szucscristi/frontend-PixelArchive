<template>
    <BaseLayout>
      <div class="ai-assistant-container">
        <h1 class="gradient-text mb-4">AI Game Assistant</h1>
        <div class="chat-container">
          <!-- Conversation history -->
          <div class="message-list">
            <div 
              v-for="(msg, index) in messages" 
              :key="index" 
              :class="['message', msg.role]"
            >
              <div class="message-content">
                <strong v-if="msg.role === 'user'">You:</strong>
                <strong v-else class="ai-name">PixelBot:</strong>
                {{ msg.content }}
              </div>
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
            <button @click="sendMessage" class="btn btn-gradient send-btn">
              <i class="bi bi-send-fill"></i>
            </button>
          </div>
        </div>
      </div>
    </BaseLayout>
  </template>
  
  <script>
  import api from '@/api';
import BaseLayout from './BaseLayout.vue';
  
  export default {
    name: 'AiAssistant',
    components: {BaseLayout},
    data() {
      return {
        userInput: '',
        messages: [
          { 
            role: 'assistant', 
            content: `Hello! I'm PixelBot. Ask me anything about games, creators, or recommendations!` 
          }
        ],
        isLoading: false
      };
    },
    methods: {
      async sendMessage() {
        if (!this.userInput.trim()) return;
  
        this.messages.push({ role: 'user', content: this.userInput });
        this.isLoading = true;
  
        try {
          const response = await api.askAI(this.userInput);
          // DeepSeek returns a JSON string—no need to JSON.parse if Spring returns raw JSON
          const choice = response.data.choices?.[0]?.message?.content;
          this.messages.push({ role: 'assistant', content: choice || '—' });
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
            const ml = this.$el.querySelector('.message-list');
            ml.scrollTop = ml.scrollHeight;
          });
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* Container & title */
  .ai-assistant-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
    color: #fff;
  }
  .gradient-text {
    font-family: 'Press Start 2P', cursive;
    background: linear-gradient(45deg, #e53935, #ffd700);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-align: center;
  }
  
  /* Chat box */
  .chat-container {
    background: rgba(30, 30, 30, 0.85);
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.6);
  }
  
  /* Message list */
  .message-list {
    max-height: 400px;
    overflow-y: auto;
    margin-bottom: 1rem;
    padding: 0.75rem;
    background: rgba(20, 20, 20, 0.7);
    border-radius: 8px;
    scrollbar-width: thin;
    scrollbar-color: #555 transparent;
  }
  .message-list::-webkit-scrollbar {
    width: 6px;
  }
  .message-list::-webkit-scrollbar-track {
    background: transparent;
  }
  .message-list::-webkit-scrollbar-thumb {
    background-color: #555;
    border-radius: 3px;
  }
  
  /* Individual messages */
  .message {
    margin-bottom: 0.75rem;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    line-height: 1.4;
  }
  .message.user {
    background: rgba(229, 57, 53, 0.2);
    border-left: 4px solid #e53935;
  }
  .message.assistant {
    background: rgba(255, 215, 0, 0.2);
    border-left: 4px solid #ffd700;
  }
  .ai-name {
    color: #ffd700;
  }
  
  /* Loading dots */
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
    0%, 100% { opacity: 0; }
    50%      { opacity: 1; }
  }
  
  /* Input & send button */
  .input-container {
    display: flex;
    gap: 0.5rem;
  }
  .chat-input {
    flex-grow: 1;
    background: rgba(255, 255, 255, 0.05);
    border: none;
    border-radius: 6px;
    padding: 0.75rem 1rem;
    color: #fff;
    transition: background 0.2s, box-shadow 0.2s;
  }
  .chat-input::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  .chat-input:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 0 2px rgba(227, 115, 85, 0.5);
  }
  .send-btn {
    background: linear-gradient(45deg, #e53935, #ffd700);
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 0 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .send-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(229, 57, 53, 0.6);
  }
  </style>
  