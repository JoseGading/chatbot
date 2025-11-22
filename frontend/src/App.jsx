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
import { getUserId, getSessionId } from './utils/userSession';
import ChatMessage from './components/ChatMessage';
import TypingIndicator from './components/TypingIndicator';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId] = useState(() => getUserId());
  const [sessionId, setSessionId] = useState(() => getSessionId());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [allHistory, setAllHistory] = useState([]); // All user chat history
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // N8N Webhook URL - Langsung terintegrasi dengan workflow Anda
  const webhookUrl = 'https://galer.app.n8n.cloud/webhook/chat-blogger';

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async (targetSessionId = null) => {
    try {
      const history = await getChatHistory(userId, 100);
      
      // Simpan semua history untuk sidebar (pastikan array)
      setAllHistory(Array.isArray(history) ? history : []);
      
      if (Array.isArray(history) && history.length > 0) {
        // Filter hanya chat dari session saat ini untuk main chat
        const currentSession = targetSessionId || sessionId;
        const sessionHistory = history.filter(item => item?.sessionId === currentSession);
        if (sessionHistory.length > 0) {
          const formattedMessages = sessionHistory.flatMap(item => [
            { type: 'user', content: item.message, timestamp: item.timestamp },
            { type: 'ai', content: item.reply, timestamp: item.timestamp }
          ]);
          setMessages(formattedMessages);
        }
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      setAllHistory([]);
      setMessages([]);
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
      
      // Save to Firebase with userId
      await saveChatMessage(input, response.data.reply, sessionId, userId);
      
      // Reload all history to update sidebar
      setTimeout(() => loadChatHistory(), 500);
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

  const switchToSession = async (targetSessionId) => {
    // Switch to selected session
    sessionStorage.setItem('accstorage_session_id', targetSessionId);
    setSessionId(targetSessionId);
    // Load that session's messages
    await loadChatHistory(targetSessionId);
    setInput('');
  };

  const startNewSession = async () => {
    if (messages.length > 0) {
      if (window.confirm('Mulai sesi chat baru? Chat saat ini akan tersimpan.')) {
        // Clear current messages
        setMessages([]);
        // Generate new session ID
        const newSessionId = `session_${Date.now()}`;
        sessionStorage.setItem('accstorage_session_id', newSessionId);
        setSessionId(newSessionId);
        // Clear input
        setInput('');
        // Reload all history to include the old session
        await loadChatHistory(newSessionId);
      }
    } else {
      // If no messages yet, just generate new session ID
      const newSessionId = `session_${Date.now()}`;
      sessionStorage.setItem('accstorage_session_id', newSessionId);
      setSessionId(newSessionId);
      setMessages([]);
      setInput('');
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
          allHistory={allHistory}
          currentSessionId={sessionId}
          onSwitchSession={switchToSession}
          onNewSession={startNewSession}
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
          <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-3 sm:space-y-4">
            <div className="max-w-4xl mx-auto">
              {(!messages || messages.length === 0) ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-10 sm:py-20 px-4">
                  <div className="bg-primary-500/10 p-6 sm:p-8 rounded-full mb-4 sm:mb-6 animate-pulse-slow">
                    <Bot className="w-16 h-16 sm:w-20 sm:h-20 text-primary-400" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3">
                    Selamat datang di ACCSTORAGE AI
                  </h2>
                  <p className="text-gray-400 text-sm sm:text-lg mb-6 sm:mb-8 max-w-md">
                    Asisten virtual untuk membantu Anda dengan produk dan layanan kami
                  </p>
                  
                  {/* Suggested Questions */}
                  <div className="w-full max-w-2xl mb-6 sm:mb-8">
                    <p className="text-sm text-gray-400 mb-3 text-left">💡 Coba tanyakan:</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          setInput('Beli akun Instagram');
                          inputRef.current?.focus();
                        }}
                        className="px-4 py-2 bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/30 
                                 text-primary-300 rounded-full text-sm transition-all hover:scale-105"
                      >
                        Beli akun Instagram
                      </button>
                      <button
                        onClick={() => {
                          setInput('Beli akun Facebook');
                          inputRef.current?.focus();
                        }}
                        className="px-4 py-2 bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/30 
                                 text-primary-300 rounded-full text-sm transition-all hover:scale-105"
                      >
                        Beli akun Facebook
                      </button>
                      <button
                        onClick={() => {
                          setInput('Beli akun Gmail');
                          inputRef.current?.focus();
                        }}
                        className="px-4 py-2 bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/30 
                                 text-primary-300 rounded-full text-sm transition-all hover:scale-105"
                      >
                        Beli akun Gmail
                      </button>
                      <button
                        onClick={() => {
                          setInput('Beli akun Twitter');
                          inputRef.current?.focus();
                        }}
                        className="px-4 py-2 bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/30 
                                 text-primary-300 rounded-full text-sm transition-all hover:scale-105"
                      >
                        Beli akun Twitter
                      </button>
                      <button
                        onClick={() => {
                          setInput('Info harga dan paket');
                          inputRef.current?.focus();
                        }}
                        className="px-4 py-2 bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/30 
                                 text-primary-300 rounded-full text-sm transition-all hover:scale-105"
                      >
                        Info harga & paket
                      </button>
                      <button
                        onClick={() => {
                          setInput('Cara pemesanan');
                          inputRef.current?.focus();
                        }}
                        className="px-4 py-2 bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/30 
                                 text-primary-300 rounded-full text-sm transition-all hover:scale-105"
                      >
                        Cara pemesanan
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 w-full max-w-3xl">
                    <div className="bg-dark-800/50 border border-primary-500/20 p-3 sm:p-4 rounded-lg hover:border-primary-500/50 transition-all cursor-pointer">
                      <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-primary-400 mb-2" />
                      <p className="text-white font-medium text-sm sm:text-base">Tanya Produk</p>
                      <p className="text-gray-400 text-xs sm:text-sm">Informasi lengkap produk kami</p>
                    </div>
                    <div className="bg-dark-800/50 border border-primary-500/20 p-3 sm:p-4 rounded-lg hover:border-primary-500/50 transition-all cursor-pointer">
                      <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary-400 mb-2" />
                      <p className="text-white font-medium text-sm sm:text-base">Cek Harga</p>
                      <p className="text-gray-400 text-xs sm:text-sm">Dapatkan info harga terbaru</p>
                    </div>
                    <div className="bg-dark-800/50 border border-primary-500/20 p-3 sm:p-4 rounded-lg hover:border-primary-500/50 transition-all cursor-pointer">
                      <History className="w-5 h-5 sm:w-6 sm:h-6 text-primary-400 mb-2" />
                      <p className="text-white font-medium text-sm sm:text-base">Status Order</p>
                      <p className="text-gray-400 text-xs sm:text-sm">Lacak pesanan Anda</p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {Array.isArray(messages) && messages.map((message, index) => (
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
            <div className="max-w-4xl mx-auto p-3 sm:p-4">
              <div className="flex items-end gap-2 sm:gap-3">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ketik pesan Anda..."
                    disabled={loading}
                    rows={1}
                    className="w-full bg-dark-800 text-white rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 text-sm sm:text-base
                             border border-primary-500/30 focus:border-primary-500 
                             focus:outline-none focus:ring-2 focus:ring-primary-500/50
                             disabled:opacity-50 disabled:cursor-not-allowed
                             resize-none min-h-[44px] sm:min-h-[50px] max-h-[150px]
                             transition-all duration-200"
                    style={{ 
                      height: 'auto',
                      minHeight: '50px'
                    }}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                    className="absolute right-1.5 sm:right-2 bottom-1.5 sm:bottom-2 p-2 sm:p-2.5 bg-primary-500 text-white 
                             rounded-lg hover:bg-primary-600 disabled:opacity-50 
                             disabled:cursor-not-allowed transition-all duration-200
                             hover:scale-105 active:scale-95"
                  >
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
                
                <button
                  onClick={startNewSession}
                  disabled={messages.length === 0}
                  className="p-2.5 sm:p-3 bg-green-500/10 text-green-400 rounded-xl 
                           hover:bg-green-500/20 border border-green-500/30
                           disabled:opacity-30 disabled:cursor-not-allowed
                           transition-all duration-200 hover:scale-105 active:scale-95"
                  title="New Chat Session"
                >
                  <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                
                <button
                  onClick={exportChat}
                  disabled={messages.length === 0}
                  className="p-2.5 sm:p-3 bg-primary-500/10 text-primary-400 rounded-xl 
                           hover:bg-primary-500/20 border border-primary-500/30
                           disabled:opacity-30 disabled:cursor-not-allowed
                           transition-all duration-200 hover:scale-105 active:scale-95"
                  title="Export Chat"
                >
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
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
asd
