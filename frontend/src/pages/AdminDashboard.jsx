import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getChatHistory, subscribeToChatUpdates } from '../firebase';
import {
  LogOut, MessageSquare, Users, TrendingUp, Download,
  Search, BarChart3, Home, ChevronDown, ChevronUp,
  User as UserIcon, Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [chatLogs, setChatLogs] = useState([]);
  const [groupedUsers, setGroupedUsers] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('all');
  const [expandedUsers, setExpandedUsers] = useState(new Set());
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadChatLogs();
    
    // Subscribe to real-time updates
    const unsubscribe = subscribeToChatUpdates((logs) => {
      setChatLogs(logs);
      setLoading(false);
    }, 500);
    
    // Cleanup on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    groupChatsByUser();
  }, [chatLogs, searchTerm, selectedDate]);

  const loadChatLogs = async () => {
    setLoading(true);
    const logs = await getChatHistory(null, 500);
    setChatLogs(logs);
    setLoading(false);
  };

  const groupChatsByUser = () => {
    if (!Array.isArray(chatLogs)) {
      setGroupedUsers({});
      return;
    }
    
    let filtered = [...chatLogs];
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log?.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log?.reply?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log?.userId && log.userId.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    if (selectedDate !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      switch (selectedDate) {
        case 'today': filterDate.setHours(0, 0, 0, 0); break;
        case 'week': filterDate.setDate(now.getDate() - 7); break;
        case 'month': filterDate.setMonth(now.getMonth() - 1); break;
      }
      filtered = filtered.filter(log => {
        const logDate = log.createdAt?.toDate ? log.createdAt.toDate() : new Date(log.timestamp);
        return logDate >= filterDate;
      });
    }
    const grouped = {};
    filtered.forEach(log => {
      const userId = log?.userId || 'anonymous';
      if (!grouped[userId]) grouped[userId] = [];
      grouped[userId].push(log);
    });
    setGroupedUsers(grouped);
  };

  const toggleUser = (userId) => {
    const newExpanded = new Set(expandedUsers);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedUsers(newExpanded);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const exportToCSV = () => {
    if (!Array.isArray(chatLogs) || chatLogs.length === 0) return;
    
    const headers = ['Timestamp', 'User ID', 'Session ID', 'Message', 'Reply'];
    const rows = chatLogs.map(log => [
      log?.timestamp || '', 
      log?.userId || 'N/A', 
      log?.sessionId || '',
      `"${(log?.message || '').replace(/"/g, '""')}"`, 
      `"${(log?.reply || '').replace(/"/g, '""')}"`
    ]);
    const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat_logs_${format(new Date(), 'yyyy-MM-dd_HHmmss')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalChats = chatLogs.length;
  const uniqueUsers = Object.keys(groupedUsers).length;
  const avgMessagesPerUser = totalChats > 0 && uniqueUsers > 0 ? (totalChats / uniqueUsers).toFixed(1) : 0;

  const getChartData = () => {
    const last7Days = {};
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last7Days[format(date, 'dd/MM')] = 0;
    }
    if (Array.isArray(chatLogs)) {
      chatLogs.forEach(log => {
        if (log && (log.createdAt || log.timestamp)) {
          const logDate = log.createdAt?.toDate ? log.createdAt.toDate() : new Date(log.timestamp);
          const dateStr = format(logDate, 'dd/MM');
          if (last7Days[dateStr] !== undefined) last7Days[dateStr]++;
        }
      });
    }
    return Object.entries(last7Days).map(([date, count]) => ({ date, messages: count }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900">
      <header className="bg-dark-900/80 backdrop-blur-lg border-b border-primary-500/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-primary-400" />
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-xs text-gray-400 hidden sm:block">ACCSTORAGE AI Chat Management</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => navigate('/')} className="p-2 hover:bg-primary-500/10 rounded-lg transition-colors" title="Ke Halaman Chat">
                <Home className="w-5 h-5 text-gray-400" />
              </button>
              <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 border border-red-500/30 transition-all text-sm">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-dark-800/50 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-primary-500/20">
            <div className="flex items-center justify-between mb-2">
              <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-primary-400" />
              <span className="text-xs text-gray-400">Total</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white">{totalChats}</p>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">Total Messages</p>
          </div>
          <div className="bg-dark-800/50 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-primary-500/20">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
              <span className="text-xs text-gray-400">Users</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white">{uniqueUsers}</p>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">Unique Users</p>
          </div>
          <div className="bg-dark-800/50 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-primary-500/20">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
              <span className="text-xs text-gray-400">Average</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white">{avgMessagesPerUser}</p>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">Messages/User</p>
          </div>
        </div>

        <div className="bg-dark-800/50 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-primary-500/20 mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">Messages Activity (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: '12px' }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #0066e6', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="messages" fill="#0066e6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-dark-800/50 backdrop-blur-lg rounded-xl p-3 sm:p-4 border border-primary-500/20 mb-3 sm:mb-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input type="text" placeholder="Search messages or user ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-dark-900 text-white rounded-lg pl-9 sm:pl-10 pr-4 py-2 text-sm border border-primary-500/30 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
            </div>
            <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-dark-900 text-white rounded-lg px-3 sm:px-4 py-2 text-sm border border-primary-500/30 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50">
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
            <button onClick={exportToCSV} disabled={chatLogs.length === 0}
              className="px-3 sm:px-4 py-2 bg-primary-500/10 text-primary-400 rounded-lg text-sm hover:bg-primary-500/20 border border-primary-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 whitespace-nowrap">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export CSV</span>
              <span className="sm:hidden">Export</span>
            </button>
          </div>
          <div className="mt-2 text-xs sm:text-sm text-gray-400">Showing {uniqueUsers} users with {totalChats} total messages</div>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="bg-dark-800/50 backdrop-blur-lg rounded-xl p-6 sm:p-8 border border-primary-500/20 text-center text-gray-400">Loading...</div>
          ) : Object.keys(groupedUsers).length === 0 ? (
            <div className="bg-dark-800/50 backdrop-blur-lg rounded-xl p-6 sm:p-8 border border-primary-500/20 text-center text-gray-400">No chat logs found</div>
          ) : (
            Object.entries(groupedUsers).map(([userId, userChats]) => {
              const isExpanded = expandedUsers.has(userId);
              const userIdShort = userId !== 'anonymous' ? userId.split('_')[1]?.substring(0, 10) : 'Anonymous';
              const lastMessage = userChats[userChats.length - 1];
              const lastMessageDate = lastMessage.createdAt?.toDate ? lastMessage.createdAt.toDate() : new Date(lastMessage.timestamp);
              return (
                <div key={userId} className="bg-dark-800/50 backdrop-blur-lg rounded-xl border border-primary-500/20 overflow-hidden">
                  <button onClick={() => toggleUser(userId)} className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between hover:bg-dark-900/30 transition-all group">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                        <UserIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm sm:text-base font-semibold text-white truncate">User: {userIdShort}</h3>
                          <span className="flex-shrink-0 text-xs bg-primary-500/20 text-primary-400 px-2 py-0.5 rounded-full border border-primary-500/30">{userChats.length} chats</span>
                        </div>
                        <p className="text-xs text-gray-400 truncate">Last activity: {format(lastMessageDate, 'dd/MM/yyyy HH:mm')}</p>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-primary-400 transition-colors" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-primary-400 transition-colors" />
                      )}
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="border-t border-primary-500/10 px-4 sm:px-6 py-3 sm:py-4 bg-dark-900/20">
                      <div className="space-y-2 sm:space-y-3 max-h-96 overflow-y-auto">
                        {userChats.map((log, index) => {
                          const logDate = log.createdAt?.toDate ? log.createdAt.toDate() : new Date(log.timestamp);
                          return (
                            <div key={log.id || index} className="bg-dark-800/50 rounded-lg p-3 sm:p-4 space-y-2">
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                {format(logDate, 'dd/MM/yyyy HH:mm:ss')}
                              </div>
                              <div className="space-y-2">
                                <div className="flex gap-2">
                                  <span className="flex-shrink-0 text-xs font-semibold text-primary-400 bg-primary-500/10 px-2 py-1 rounded">User:</span>
                                  <p className="text-xs sm:text-sm text-gray-300 flex-1">{log.message}</p>
                                </div>
                                <div className="flex gap-2">
                                  <span className="flex-shrink-0 text-xs font-semibold text-green-400 bg-green-500/10 px-2 py-1 rounded">AI:</span>
                                  <p className="text-xs sm:text-sm text-gray-300 flex-1">{log.reply}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;