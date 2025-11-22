import { Menu, Moon, Sun, Bot, Sparkles } from 'lucide-react';

const Header = ({ onToggleSidebar, darkMode, onToggleDarkMode }) => {
  return (
    <header className="bg-dark-900/80 backdrop-blur-lg border-b border-primary-500/20 sticky top-0 z-10">
      <div className="px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="p-2 hover:bg-primary-500/10 rounded-lg transition-colors lg:hidden"
            >
              <Menu className="w-6 h-6 text-gray-400" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg animate-glow">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
              
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  ACCSTORAGE AI
                  <span className="text-xs bg-primary-500/20 text-primary-400 px-2 py-0.5 rounded-full border border-primary-500/30">
                    Beta
                  </span>
                </h1>
                <p className="text-xs text-gray-400">Asisten Virtual Toko Online</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 bg-dark-800/50 rounded-lg px-3 py-1.5 border border-primary-500/20">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-400">Online</span>
            </div>
            
            <button
              onClick={onToggleDarkMode}
              className="p-2 hover:bg-primary-500/10 rounded-lg transition-colors hidden md:block"
              title="Toggle Dark Mode"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-gray-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
