import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Bot, BarChart3, Terminal, FileText, Code2, Zap, Star, Users, Globe } from 'lucide-react';

const features = [
  { icon: Bot, title: 'AI-Powered Chatbot', description: 'Visitors can ask questions about your projects and get instant answers.', color: 'from-blue-500 to-cyan-500' },
  { icon: BarChart3, title: 'Analytics Dashboard', description: 'Track views, clicks, and engagement on your portfolio.', color: 'from-purple-500 to-pink-500' },
  { icon: Terminal, title: 'Developer Terminal', description: 'Interactive terminal mode for a unique developer experience.', color: 'from-green-500 to-emerald-500' },
  { icon: FileText, title: 'AI Resume Generator', description: 'Generate professional resumes automatically with AI.', color: 'from-orange-500 to-amber-500' },
  { icon: Code2, title: 'Project Showcase', description: 'Beautiful galleries, videos, and build timelines.', color: 'from-indigo-500 to-violet-500' },
  { icon: Zap, title: 'Career Fit Analyzer', description: 'Match your skills against job descriptions with AI.', color: 'from-red-500 to-rose-500' },
];

const stats = [
  { value: '100%', label: 'Customizable', icon: Star },
  { value: 'AI', label: 'Powered', icon: Bot },
  { value: 'Free', label: 'Forever', icon: Zap },
  { value: '1', label: 'Portfolio', icon: Users },
];

export default function Home() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero */}
      <section className="relative px-4 py-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.5, scale: 1 }}
            transition={{ duration: 1 }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.5, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"
          />
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">AI-Powered Platform</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display font-bold text-5xl md:text-7xl mb-6"
          >
            Build Your{' '}
            <span className="gradient-text">Developer Portfolio</span>
            <br />with AI Superpowers
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto mb-10"
          >
            Create stunning portfolios with AI-powered features, analytics dashboards,
            and beautiful project showcases.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/portfolio" className="btn-primary flex items-center gap-2 text-lg">
              View Portfolio
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/builder" className="btn-secondary flex items-center gap-2 text-lg">
              <Code2 className="w-5 h-5" />
              Edit Portfolio
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="glass-card p-6 text-center"
                >
                  <Icon className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="font-display font-bold text-2xl text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-gray-400">Powerful features for developers to showcase their work.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="glass-card p-6 hover:border-primary/30 transition-all group"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none" />
            <div className="relative">
              <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-4">
                Ready to View Your Portfolio?
              </h2>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                Your AI-powered developer portfolio is ready. Explore your projects,
                chat with the AI assistant, and track your analytics.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/portfolio" className="btn-primary inline-flex items-center gap-2 text-lg">
                  <Globe className="w-5 h-5" />
                  View Portfolio
                </Link>
                <Link to="/analytics" className="btn-secondary inline-flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  View Analytics
                </Link>
              </div>
            </div>
          </motion.div>
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
            Built with React, Vite, Tailwind CSS, Framer Motion, and Supabase.
          </p>
        </div>
      </footer>
    </div>
  );
}
