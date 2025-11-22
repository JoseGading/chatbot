import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getChatHistory } from '../firebase';
import {
  LogOut,
  MessageSquare,
  Users,
  TrendingUp,
  Download,
  Trash2,
  Search,
  Calendar,
  BarChart3,
  Home
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [chatLogs, setChatLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('all');
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadChatLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [searchTerm, selectedDate, chatLogs]);

  const loadChatLogs = async () => {
    setLoading(true);
    const logs = await getChatHistory(500);
    setChatLogs(logs);
    setFilteredLogs(logs);
    setLoading(false);
  };

  const filterLogs = () => {
    let filtered = [...chatLogs];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.reply.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date
    if (selectedDate !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (selectedDate) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }

      filtered = filtered.filter(log => {
        const logDate = log.createdAt?.toDate ? log.createdAt.toDate() : new Date(log.timestamp);
        return logDate >= filterDate;
      });
    }

    setFilteredLogs(filtered);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const exportToCSV = () => {
    const headers = ['Timestamp', 'Session ID', 'Message', 'Reply'];
    const rows = filteredLogs.map(log => [
      log.timestamp,
      log.sessionId,
      `"${log.message.replace(/"/g, '""')}"`,
      `"${log.reply.replace(/"/g, '""')}"`
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat_logs_${format(new Date(), 'yyyy-MM-dd_HHmmss')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Statistics
  const totalChats = chatLogs.length;
  const uniqueSessions = new Set(chatLogs.map(log => log.sessionId)).size;
  const avgMessagesPerSession = totalChats > 0 ? (totalChats / uniqueSessions).toFixed(1) : 0;

  // Chart data - Messages per day
  const getChartData = () => {
    const last7Days = {};
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = format(date, 'dd/MM');
      last7Days[dateStr] = 0;
    }

    chatLogs.forEach(log => {
      const logDate = log.createdAt?.toDate ? log.createdAt.toDate() : new Date(log.timestamp);
      const dateStr = format(logDate, 'dd/MM');
      if (last7Days[dateStr] !== undefined) {
        last7Days[dateStr]++;
      }
    });

    return Object.entries(last7Days).map(([date, count]) => ({
      date,
      messages: count
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900">
      {/* Header */}
      <header className="bg-dark-900/80 backdrop-blur-lg border-b border-primary-500/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-primary-400" />
              <div>
                <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-xs text-gray-400">ACCSTORAGE AI Chat Management</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-primary-500/10 rounded-lg transition-colors"
                title="Ke Halaman Chat"
              >
                <Home className="w-5 h-5 text-gray-400" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 
                         rounded-lg hover:bg-red-500/20 border border-red-500/30 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-dark-800/50 backdrop-blur-lg rounded-xl p-6 border border-primary-500/20">
            <div className="flex items-center justify-between mb-2">
              <MessageSquare className="w-8 h-8 text-primary-400" />
              <span className="text-xs text-gray-400">Total</span>
            </div>
            <p className="text-3xl font-bold text-white">{totalChats}</p>
            <p className="text-sm text-gray-400 mt-1">Total Messages</p>
          </div>

          <div className="bg-dark-800/50 backdrop-blur-lg rounded-xl p-6 border border-primary-500/20">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-green-400" />
              <span className="text-xs text-gray-400">Sessions</span>
            </div>
            <p className="text-3xl font-bold text-white">{uniqueSessions}</p>
            <p className="text-sm text-gray-400 mt-1">Unique Sessions</p>
          </div>

          <div className="bg-dark-800/50 backdrop-blur-lg rounded-xl p-6 border border-primary-500/20">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-yellow-400" />
              <span className="text-xs text-gray-400">Average</span>
            </div>
            <p className="text-3xl font-bold text-white">{avgMessagesPerSession}</p>
            <p className="text-sm text-gray-400 mt-1">Messages/Session</p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-dark-800/50 backdrop-blur-lg rounded-xl p-6 border border-primary-500/20 mb-6">
          <h2 className="text-lg font-bold text-white mb-4">Messages Activity (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #0066e6',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="messages" fill="#0066e6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Filters */}
        <div className="bg-dark-800/50 backdrop-blur-lg rounded-xl p-4 border border-primary-500/20 mb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-dark-900 text-white rounded-lg pl-10 pr-4 py-2.5
                         border border-primary-500/30 focus:border-primary-500
                         focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              />
            </div>

            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-dark-900 text-white rounded-lg px-4 py-2.5
                       border border-primary-500/30 focus:border-primary-500
                       focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>

            <button
              onClick={exportToCSV}
              disabled={filteredLogs.length === 0}
              className="px-4 py-2.5 bg-primary-500/10 text-primary-400 rounded-lg
                       hover:bg-primary-500/20 border border-primary-500/30
                       disabled:opacity-30 disabled:cursor-not-allowed
                       transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="mt-3 text-sm text-gray-400">
            Showing {filteredLogs.length} of {totalChats} messages
          </div>
        </div>

        {/* Chat Logs Table */}
        <div className="bg-dark-800/50 backdrop-blur-lg rounded-xl border border-primary-500/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-900/50 border-b border-primary-500/20">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Session
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Reply
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-500/10">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-8 text-center text-gray-400">
                      Loading...
                    </td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-8 text-center text-gray-400">
                      No chat logs found
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log, index) => {
                    const logDate = log.createdAt?.toDate ? log.createdAt.toDate() : new Date(log.timestamp);
                    return (
                      <tr key={log.id || index} className="hover:bg-dark-900/30 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-300 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span>{format(logDate, 'dd/MM/yyyy')}</span>
                            <span className="text-xs text-gray-500">{format(logDate, 'HH:mm:ss')}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-400 font-mono">
                          {log.sessionId.split('_')[1]?.substring(0, 8)}...
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-300 max-w-xs">
                          <div className="line-clamp-2">{log.message}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-300 max-w-xs">
                          <div className="line-clamp-2">{log.reply}</div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
