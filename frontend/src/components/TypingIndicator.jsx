import { Bot } from 'lucide-react';

const TypingIndicator = () => {
  return (
    <div className="flex gap-3 justify-start fade-in">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg animate-pulse">
        <Bot className="w-6 h-6 text-white" />
      </div>
      
      <div className="flex flex-col max-w-[70%]">
        <div className="px-4 py-3 rounded-2xl bg-dark-800 border border-primary-500/20 shadow-lg rounded-bl-sm">
          <div className="flex gap-1.5">
            <div className="w-2 h-2 bg-primary-400 rounded-full typing-dot"></div>
            <div className="w-2 h-2 bg-primary-400 rounded-full typing-dot"></div>
            <div className="w-2 h-2 bg-primary-400 rounded-full typing-dot"></div>
          </div>
        </div>
        
        <span className="text-xs text-gray-500 mt-1 px-1">
          Mengetik...
        </span>
      </div>
    </div>
  );
};

export default TypingIndicator;
