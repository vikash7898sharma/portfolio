import { useEffect, useState } from 'react';
import { Eye, Github, ExternalLink, MessageSquare, FileText, BarChart3, Clock } from 'lucide-react';
import { getAnalytics } from '../services/analytics';
import { useAuth } from '../context/AuthContext';
import { getMyPortfolio } from '../services/portfolio';

export default function Analytics() {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const portfolioRes = await getMyPortfolio();
      setPortfolio(portfolioRes.data);
      if (portfolioRes.data) {
        const analyticsRes = await getAnalytics();
        setData(analyticsRes.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card p-12">
            <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="font-display font-bold text-2xl text-white mb-4">Analytics Dashboard</h2>
            <p className="text-gray-400">Create a portfolio first to view analytics.</p>
          </div>
        </div>
      </div>
    );
  }

  const stats = data?.stats || {
    totalViews: 0, githubClicks: 0, liveClicks: 0, youtubeClicks: 0, aiChats: 0, resumeDownloads: 0
  };

  const statCards = [
    { label: 'Total Views', value: stats.totalViews, icon: Eye, color: 'from-blue-500 to-cyan-500' },
    { label: 'GitHub Clicks', value: stats.githubClicks, icon: Github, color: 'from-purple-500 to-pink-500' },
    { label: 'Live Demo Clicks', value: stats.liveClicks, icon: ExternalLink, color: 'from-emerald-500 to-teal-500' },
    { label: 'AI Conversations', value: stats.aiChats, icon: MessageSquare, color: 'from-orange-500 to-amber-500' },
  ];

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-white mb-2">Analytics Dashboard</h1>
          <p className="text-gray-400">Track your portfolio's performance</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="glass-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-20`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-display font-bold text-white mb-1">{stat.value.toLocaleString()}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Top Projects */}
          <div className="glass-card p-6">
            <h3 className="font-display font-semibold text-lg text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" /> Top Projects
            </h3>
            {data?.topProjects?.length > 0 ? (
              <div className="space-y-3">
                {data.topProjects.map((project, index) => (
                  <div key={project._id} className="flex items-center justify-between p-3 rounded-lg bg-dark-400/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{project.title}</div>
                        <div className="text-xs text-gray-400">{project.views} views</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No project data yet</p>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="glass-card p-6">
            <h3 className="font-display font-semibold text-lg text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> Recent Activity
            </h3>
            {data?.events?.length > 0 ? (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {data.events.slice(0, 10).map((event) => {
                  const eventIcons = {
                    view: Eye, click_github: Github, click_live: ExternalLink,
                    click_youtube: () => import('lucide-react').then(m => m.Youtube),
                    ai_chat: MessageSquare, resume_download: FileText,
                  };
                  const Icon = eventIcons[event.event] || Eye;
                  return (
                    <div key={event._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                      <div className="p-2 rounded-lg bg-dark-400">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-white">
                          {event.event.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(event.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </div>

        {/* Total Stats */}
        <div className="mt-8 glass-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-display font-bold text-white">{portfolio.views?.toLocaleString() || 0}</div>
                <div className="text-sm text-gray-400">Total Portfolio Views</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
