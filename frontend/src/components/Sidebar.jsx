import { useState } from 'react';
import { X, Trash2, Download, MessageSquare, Clock, TrendingUp, Info, ChevronDown, ChevronUp } from 'lucide-react';

const Sidebar = ({ isOpen, onClose, messages, onClearChat, onExportChat }) => {
  const [recentMessagesOpen, setRecentMessagesOpen] = useState(true);
  
  const messageCount = messages.length;
  const userMessages = messages.filter(m => m.type === 'user').length;
  const aiMessages = messages.filter(m => m.type === 'ai').length;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-80 bg-dark-900/95 backdrop-blur-lg border-r border-primary-500/20
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-primary-500/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary-400" />
              Chat History
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-primary-500/10 rounded-lg transition-colors lg:hidden"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-dark-800/50 rounded-lg p-3 border border-primary-500/10">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-primary-400" />
                <span className="text-xs text-gray-400">Total</span>
              </div>
              <p className="text-xl font-bold text-white">{messageCount}</p>
            </div>
            <div className="bg-dark-800/50 rounded-lg p-3 border border-primary-500/10">
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className="w-4 h-4 text-green-400" />
                <span className="text-xs text-gray-400">User</span>
              </div>
              <p className="text-xl font-bold text-white">{userMessages}</p>
            </div>
          </div>
        </div>

        {/* Chat Sessions / Info */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-primary-500/10 to-primary-700/10 rounded-lg p-4 border border-primary-500/20">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">Tentang ACCSTORAGE AI</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Asisten virtual untuk membantu Anda dengan informasi produk, harga, 
                    dan layanan toko online kami. Tersedia 24/7 untuk menjawab pertanyaan Anda.
                  </p>
                </div>
              </div>
            </div>

            {messages.length > 0 && (
              <div className="space-y-2">
                {/* Collapsible Header */}
                <button
                  onClick={() => setRecentMessagesOpen(!recentMessagesOpen)}
                  className="w-full flex items-center justify-between p-3 rounded-lg
                           bg-dark-800/30 hover:bg-dark-800/50 border border-primary-500/10
                           transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary-400" />
                    <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Recent Messages
                    </h3>
                    <span className="text-xs text-gray-500 bg-dark-900/50 px-2 py-0.5 rounded-full">
                      {messages.slice(-5).length}
                    </span>
                  </div>
                  {recentMessagesOpen ? (
                    <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-primary-400 transition-colors" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-primary-400 transition-colors" />
                  )}
                </button>

                {/* Collapsible Content */}
                {recentMessagesOpen && (
                  <div className="space-y-2 animate-fadeIn">
                    {messages.slice(-5).reverse().map((msg, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg text-sm transition-all hover:scale-[1.02] ${
                          msg.type === 'user'
                            ? 'bg-primary-500/10 border border-primary-500/20 hover:bg-primary-500/15'
                            : 'bg-dark-800/50 border border-primary-500/10 hover:bg-dark-800/70'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <Clock className="w-3 h-3 text-gray-500 flex-shrink-0" />
                          <span className="text-xs text-gray-500">
                            {new Date(msg.timestamp).toLocaleTimeString('id-ID', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          <span className={`text-xs px-1.5 py-0.5 rounded ${
                            msg.type === 'user'
                              ? 'bg-primary-500/20 text-primary-300'
                              : 'bg-green-500/20 text-green-300'
                          }`}>
                            {msg.type === 'user' ? 'You' : 'AI'}
                          </span>
                        </div>
                        <p className="text-gray-300 line-clamp-2 text-xs leading-relaxed">
                          {msg.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="bg-dark-800/50 rounded-lg p-4 border border-primary-500/10">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Quick Tips
              </h3>
              <ul className="space-y-2 text-xs text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-primary-400 mt-0.5">•</span>
                  <span>Tanya tentang produk yang Anda cari</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-400 mt-0.5">•</span>
                  <span>Cek harga dan ketersediaan stok</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-400 mt-0.5">•</span>
                  <span>Dapatkan rekomendasi produk</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-400 mt-0.5">•</span>
                  <span>Lacak status pesanan Anda</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-primary-500/20 space-y-2">
          <button
            onClick={onExportChat}
            disabled={messages.length === 0}
            className="w-full px-4 py-2.5 bg-primary-500/10 text-primary-400 rounded-lg 
                     hover:bg-primary-500/20 border border-primary-500/30
                     disabled:opacity-30 disabled:cursor-not-allowed
                     transition-all duration-200 flex items-center justify-center gap-2
                     text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            Export Chat
          </button>
          
          <button
            onClick={onClearChat}
            disabled={messages.length === 0}
            className="w-full px-4 py-2.5 bg-red-500/10 text-red-400 rounded-lg 
                     hover:bg-red-500/20 border border-red-500/30
                     disabled:opacity-30 disabled:cursor-not-allowed
                     transition-all duration-200 flex items-center justify-center gap-2
                     text-sm font-medium"
          >
            <Trash2 className="w-4 h-4" />
            Clear Chat
          </button>

          <div className="text-xs text-gray-500 text-center pt-2">
            v1.0.0 • Made with ❤️
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
