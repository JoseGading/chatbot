import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Send, 
  Trash2, 
  Download, 
  Moon, 
  Sun, 
  MessageSquare,
  Bot,
  User,
  Sparkles,
  History,
  Settings
} from 'lucide-react';
import { saveChatMessage, getChatHistory } from './firebase';
import ChatMessage from './components/ChatMessage';
import TypingIndicator from './components/TypingIndicator';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // N8N Webhook URL - Langsung terintegrasi dengan workflow Anda
  const webhookUrl = 'https://desssdev.app.n8n.cloud/webhook/chat-blogger';

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async () => {
    const history = await getChatHistory(50);
    if (history.length > 0) {
      const formattedMessages = history.flatMap(item => [
        { type: 'user', content: item.message, timestamp: item.timestamp },
        { type: 'ai', content: item.reply, timestamp: item.timestamp }
      ]);
      setMessages(formattedMessages);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      type: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(webhookUrl, {
        message: input
      });

      const aiMessage = {
        type: 'ai',
        content: response.data.reply || 'Maaf, tidak ada respons dari server.',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Save to Firebase
      await saveChatMessage(input, response.data.reply, sessionId);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        type: 'ai',
        content: 'Maaf, terjadi kesalahan. Silakan coba lagi.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    if (window.confirm('Hapus semua percakapan?')) {
      setMessages([]);
    }
  };

  const exportChat = () => {
    const chatText = messages.map(msg => 
      `[${new Date(msg.timestamp).toLocaleString()}] ${msg.type === 'user' ? 'Anda' : 'AI'}: ${msg.content}`
    ).join('\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`${darkMode ? 'dark' : ''} h-screen`}>
      <div className="flex h-full bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          messages={messages}
          onClearChat={clearChat}
          onExportChat={exportChat}
        />

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <Header 
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            darkMode={darkMode}
            onToggleDarkMode={() => setDarkMode(!darkMode)}
          />

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
            <div className="max-w-4xl mx-auto">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-20">
                  <div className="bg-primary-500/10 p-8 rounded-full mb-6 animate-pulse-slow">
                    <Bot className="w-20 h-20 text-primary-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-3">
                    Selamat datang di ACCSTORAGE AI
                  </h2>
                  <p className="text-gray-400 text-lg mb-8 max-w-md">
                    Asisten virtual untuk membantu Anda dengan produk dan layanan kami
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
                    <div className="bg-dark-800/50 border border-primary-500/20 p-4 rounded-lg hover:border-primary-500/50 transition-all cursor-pointer">
                      <MessageSquare className="w-6 h-6 text-primary-400 mb-2" />
                      <p className="text-white font-medium">Tanya Produk</p>
                      <p className="text-gray-400 text-sm">Informasi lengkap produk kami</p>
                    </div>
                    <div className="bg-dark-800/50 border border-primary-500/20 p-4 rounded-lg hover:border-primary-500/50 transition-all cursor-pointer">
                      <Sparkles className="w-6 h-6 text-primary-400 mb-2" />
                      <p className="text-white font-medium">Cek Harga</p>
                      <p className="text-gray-400 text-sm">Dapatkan info harga terbaru</p>
                    </div>
                    <div className="bg-dark-800/50 border border-primary-500/20 p-4 rounded-lg hover:border-primary-500/50 transition-all cursor-pointer">
                      <History className="w-6 h-6 text-primary-400 mb-2" />
                      <p className="text-white font-medium">Status Order</p>
                      <p className="text-gray-400 text-sm">Lacak pesanan Anda</p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message, index) => (
                    <ChatMessage key={index} message={message} />
                  ))}
                  {loading && <TypingIndicator />}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-primary-500/20 bg-dark-900/80 backdrop-blur-lg">
            <div className="max-w-4xl mx-auto p-4">
              <div className="flex items-end gap-3">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ketik pesan Anda..."
                    disabled={loading}
                    rows={1}
                    className="w-full bg-dark-800 text-white rounded-xl px-4 py-3 pr-12 
                             border border-primary-500/30 focus:border-primary-500 
                             focus:outline-none focus:ring-2 focus:ring-primary-500/50
                             disabled:opacity-50 disabled:cursor-not-allowed
                             resize-none min-h-[50px] max-h-[150px]
                             transition-all duration-200"
                    style={{ 
                      height: 'auto',
                      minHeight: '50px'
                    }}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                    className="absolute right-2 bottom-2 p-2 bg-primary-500 text-white 
                             rounded-lg hover:bg-primary-600 disabled:opacity-50 
                             disabled:cursor-not-allowed transition-all duration-200
                             hover:scale-105 active:scale-95"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                
                <button
                  onClick={clearChat}
                  disabled={messages.length === 0}
                  className="p-3 bg-red-500/10 text-red-400 rounded-xl 
                           hover:bg-red-500/20 border border-red-500/30
                           disabled:opacity-30 disabled:cursor-not-allowed
                           transition-all duration-200 hover:scale-105 active:scale-95"
                  title="Hapus Chat"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                
                <button
                  onClick={exportChat}
                  disabled={messages.length === 0}
                  className="p-3 bg-primary-500/10 text-primary-400 rounded-xl 
                           hover:bg-primary-500/20 border border-primary-500/30
                           disabled:opacity-30 disabled:cursor-not-allowed
                           transition-all duration-200 hover:scale-105 active:scale-95"
                  title="Export Chat"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mt-2 text-center text-xs text-gray-500">
                Powered by ACCSTORAGE AI • Press Enter to send
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

