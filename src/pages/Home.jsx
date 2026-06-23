import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Bot, BarChart3, Terminal, FileText, Code2, Shield, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: Bot, title: 'AI-Powered Chatbot', description: 'Visitors can ask questions about your projects.', color: 'from-blue-500 to-cyan-500' },
  { icon: BarChart3, title: 'Analytics Dashboard', description: 'Track views, clicks, and engagement.', color: 'from-purple-500 to-pink-500' },
  { icon: Terminal, title: 'Developer Terminal', description: 'Interactive terminal mode for developers.', color: 'from-green-500 to-emerald-500' },
  { icon: FileText, title: 'AI Resume Generator', description: 'Generate professional resumes automatically.', color: 'from-orange-500 to-amber-500' },
  { icon: Code2, title: 'Project Showcase', description: 'Beautiful galleries, videos, and timelines.', color: 'from-indigo-500 to-violet-500' },
  { icon: Shield, title: 'Secure & Private', description: 'JWT authentication and secure data handling.', color: 'from-red-500 to-rose-500' },
];

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/builder', { replace: true });
  }, [user, navigate]);

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero */}
      <section className="relative px-4 py-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl opacity-50" />
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">AI-Powered Platform</span>
          </div>

          <h1 className="font-display font-bold text-5xl md:text-7xl mb-6">
            Build Your{' '}
            <span className="gradient-text">Developer Portfolio</span>
            <br />with AI Superpowers
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Create stunning portfolios with AI-powered features, analytics dashboards,
            and beautiful project showcases.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="btn-primary flex items-center gap-2 text-lg">
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#features" className="btn-secondary flex items-center gap-2 text-lg">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-gray-400">Powerful features for developers to showcase their work.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="glass-card p-6 hover:border-primary/30 transition-all group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto glass-card p-12 text-center">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-4">
            Ready to Build Your Portfolio?
          </h2>
          <p className="text-gray-400 mb-8">
            Join developers who have already created stunning AI-powered portfolios.
          </p>
          <Link to="/register" className="btn-primary inline-flex items-center gap-2 text-lg">
            <Zap className="w-5 h-5" />
            Start Building Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-dark-400">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-white">AI Portfolio Pro</span>
          </div>
          <p className="text-sm text-gray-500">
            Built with React, Node.js, Express, and MongoDB.
          </p>
        </div>
      </footer>
    </div>
  );
}
