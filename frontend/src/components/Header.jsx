import { Menu, Moon, Sun, Bot, Sparkles } from 'lucide-react';

const Header = ({ onToggleSidebar, darkMode, onToggleDarkMode }) => {
  return (
    <header className="bg-dark-900/80 backdrop-blur-lg border-b border-primary-500/20 sticky top-0 z-10">
      <div className="px-3 sm:px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onToggleSidebar}
              className="p-2 hover:bg-primary-500/10 rounded-lg transition-colors lg:hidden"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
            </button>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 animate-pulse" />
              </div>
              
              <div>
                <h1 className="text-base sm:text-xl font-bold text-white flex items-center gap-1.5 sm:gap-2">
                  <span className="hidden xs:inline">ACCSTORAGE AI</span>
                  <span className="xs:hidden">ACC AI</span>
                  <span className="text-xs bg-primary-500/20 text-primary-400 px-1.5 sm:px-2 py-0.5 rounded-full border border-primary-500/30">
                    Beta
                  </span>
                </h1>
                <p className="text-xs text-gray-400 hidden sm:block">Asisten Virtual Toko Online</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="hidden md:flex items-center gap-2 bg-dark-800/50 rounded-lg px-2 sm:px-3 py-1.5 border border-primary-500/20">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-400">Online</span>
            </div>
            
            <button
              onClick={onToggleDarkMode}
              className="p-2 hover:bg-primary-500/10 rounded-lg transition-colors hidden md:block"
              title="Toggle Dark Mode"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
