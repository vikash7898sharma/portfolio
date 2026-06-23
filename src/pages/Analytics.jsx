import { motion } from 'framer-motion';
import { Eye, Github, ExternalLink, MessageSquare, FileText, BarChart3, Clock, TrendingUp, Users } from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';
import { usePortfolio } from '../hooks/usePortfolio';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell,
} from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

export default function Analytics() {
  const { portfolio } = usePortfolio();
  const { events, projects, stats, loading, refetch } = useAnalytics();

  const statCards = [
    { label: 'Total Views', value: stats.totalViews || 0, icon: Eye, color: 'from-blue-500 to-cyan-500' },
    { label: 'GitHub Clicks', value: stats.totalGithubClicks || 0, icon: Github, color: 'from-purple-500 to-pink-500' },
    { label: 'Live Demo Clicks', value: stats.totalLiveClicks || 0, icon: ExternalLink, color: 'from-emerald-500 to-teal-500' },
    { label: 'AI Conversations', value: stats.totalAiChats || 0, icon: MessageSquare, color: 'from-orange-500 to-amber-500' },
  ];

  // Process events for chart data
  const getEventsByDate = () => {
    const dateCount = {};
    events.forEach(event => {
      const date = new Date(event.created_at).toLocaleDateString();
      dateCount[date] = (dateCount[date] || 0) + 1;
    });
    return Object.entries(dateCount)
      .slice(-14)
      .map(([date, count]) => ({ date, count }));
  };

  const getEventsByType = () => {
    const typeCount = {};
    events.forEach(event => {
      typeCount[event.event] = (typeCount[event.event] || 0) + 1;
    });
    return Object.entries(typeCount).map(([name, value]) => ({ name, value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full"
        />
      </div>
    );
  }

  const chartData = getEventsByDate();
  const pieData = getEventsByType();

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display font-bold text-3xl text-white mb-2">Analytics Dashboard</h1>
          <p className="text-gray-400">Track your portfolio's performance</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <motion.div
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="text-3xl font-display font-bold text-white mb-1"
                >
                  {stat.value.toLocaleString()}
                </motion.div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Activity Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <h3 className="font-display font-semibold text-lg text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" /> Activity Over Time
            </h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip
                    contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={{ fill: '#6366f1', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#8b5cf6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-gray-500">
                No activity data yet
              </div>
            )}
          </motion.div>

          {/* Event Types Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <h3 className="font-display font-semibold text-lg text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" /> Event Distribution
            </h3>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name }) => name}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-gray-500">
                No event data yet
              </div>
            )}
          </motion.div>
        </div>

        {/* Bottom Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Top Projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <h3 className="font-display font-semibold text-lg text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> Top Projects
            </h3>
            {projects?.length > 0 ? (
              <div className="space-y-3">
                {projects.slice(0, 5).map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-dark-400/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{project.title}</div>
                        <div className="text-xs text-gray-400">{project.views || 0} views</div>
                      </div>
                    </div>
                    <div className="flex gap-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Github className="w-3 h-3" /> {project.clicks_github || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" /> {project.clicks_live || 0}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No project data yet</p>
              </div>
            )}
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <h3 className="font-display font-semibold text-lg text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> Recent Activity
            </h3>
            {events?.length > 0 ? (
              <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-thin">
                {events.slice(0, 10).map((event, index) => {
                  const eventIcons = {
                    view: Eye,
                    click_github: Github,
                    click_live: ExternalLink,
                    ai_chat: MessageSquare,
                    resume_download: FileText,
                  };
                  const Icon = eventIcons[event.event] || Eye;
                  return (
                    <motion.div
                      key={event.id || index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <div className="p-2 rounded-lg bg-dark-400">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-white capitalize">
                          {event.event.replace(/_/g, ' ')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(event.created_at).toLocaleString()}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No recent activity</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 glass-card p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-display font-bold text-white">
                  {portfolio?.views?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-gray-400">Total Portfolio Views</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-display font-bold text-white">
                  {stats.totalResumeDownloads || 0}
                </div>
                <div className="text-sm text-gray-400">Resume Downloads</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
