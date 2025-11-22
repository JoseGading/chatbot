import { Bot, User, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

const ChatMessage = ({ message }) => {
  const isUser = message.type === 'user';
  const timestamp = message.timestamp ? new Date(message.timestamp) : new Date();

  // Auto-detect and linkify URLs for user messages
  const linkifyText = (text) => {
    if (!text) return text;
    
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary-400 hover:text-primary-300 underline break-all"
          >
            {part}
            <ExternalLink className="w-3 h-3 inline flex-shrink-0" />
          </a>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  // Convert plain URLs to markdown links for AI messages
  const preprocessMarkdown = (text) => {
    if (!text) return text;
    
    // Regex to find URLs that are NOT already in markdown link format
    const urlRegex = /(?<!\]\()https?:\/\/[^\s<>]+/g;
    
    return text.replace(urlRegex, (url) => {
      // Remove trailing punctuation that shouldn't be part of URL
      const cleanUrl = url.replace(/[.,!?;:]+$/, '');
      const punctuation = url.slice(cleanUrl.length);
      
      return `[${cleanUrl}](${cleanUrl})${punctuation}`;
    });
  };

  return (
    <div className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'} fade-in`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-md">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div className={`flex flex-col max-w-[80%] sm:max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-3 rounded-2xl shadow-md ${
            isUser
              ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-br-md'
              : 'bg-dark-800 text-gray-100 border border-primary-500/20 rounded-bl-md'
          }`}
        >
          {isUser ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {linkifyText(message.content)}
            </p>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown
                children={preprocessMarkdown(message.content)}
                components={{
                  p: ({ children }) => (
                    <p className="text-sm leading-relaxed mb-2 last:mb-0 whitespace-pre-wrap break-words">
                      {children}
                    </p>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-400 hover:text-primary-300 underline inline-flex items-center gap-1"
                    >
                      <span className="break-all">{children}</span>
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-2">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-2">{children}</ol>
                  ),
                  code: ({ children, inline }) =>
                    inline ? (
                      <code className="bg-dark-900 px-1.5 py-0.5 rounded text-primary-400">
                        {children}
                      </code>
                    ) : (
                      <code className="block bg-dark-900 p-2 rounded my-2 overflow-x-auto">
                        {children}
                      </code>
                    ),
                }}
              />
            </div>
          )}
        </div>
        
        <span className="text-xs text-gray-500 mt-1.5 px-1">
          {formatDistanceToNow(timestamp, { 
            addSuffix: true,
            locale: id 
          })}
        </span>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center shadow-md">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
