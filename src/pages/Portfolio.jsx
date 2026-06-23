import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Globe, Eye, ExternalLink, Download, FileText, Sparkles } from 'lucide-react';
import { getPortfolio, getProjects, getExperiences, generateResume } from '../services/api';
import { usePortfolio } from '../hooks/usePortfolio';
import ProjectCard from '../components/ProjectCard';
import SkillBadge from '../components/SkillBadge';
import ExperienceTimeline from '../components/ExperienceTimeline';
import toast from 'react-hot-toast';

export default function Portfolio() {
  const { portfolio, loading: portfolioLoading } = usePortfolio();
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingResume, setGeneratingResume] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [projectsData, experiencesData] = await Promise.all([
        getProjects(),
        getExperiences(),
      ]);
      setProjects(projectsData || []);
      setExperiences(experiencesData || []);
    } catch (error) {
      console.error('Failed to load portfolio data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadResume = async () => {
    setGeneratingResume(true);
    try {
      const result = await generateResume();
      if (result.url) {
        window.open(result.url, '_blank');
        toast.success('Resume generated successfully!');
      } else if (result.content) {
        const blob = new Blob([result.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'resume.txt';
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Resume generated!');
      }
    } catch (error) {
      toast.error('Failed to generate resume');
    } finally {
      setGeneratingResume(false);
    }
  };

  if (portfolioLoading || loading) {
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

  if (!portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center glass-card p-12">
          <h1 className="text-4xl font-display font-bold text-white mb-4">No Portfolio Yet</h1>
          <p className="text-gray-400 mb-8">Create your portfolio to get started.</p>
          <Link to="/builder" className="btn-primary">Create Portfolio</Link>
        </div>
      </div>
    );
  }

  const featuredProjects = projects.filter(p => p.featured);
  const otherProjects = projects.filter(p => !p.featured);

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card p-8 md:p-12"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {portfolio.profile_image ? (
                <img
                  src={portfolio.profile_image}
                  alt={portfolio.name}
                  className="w-32 h-32 rounded-2xl object-cover ring-4 ring-primary/20"
                />
              ) : (
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center ring-4 ring-primary/20">
                  <span className="text-4xl font-display font-bold text-white">
                    {(portfolio.name || 'D')[0].toUpperCase()}
                  </span>
                </div>
              )}
            </motion.div>

            <div className="flex-1">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="font-display font-bold text-3xl md:text-4xl text-white mb-2"
              >
                {portfolio.name || 'Developer'}
              </motion.h1>
              {portfolio.title && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-xl text-primary mb-4"
                >
                  {portfolio.title}
                </motion.p>
              )}
              {portfolio.bio && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="text-gray-400 max-w-2xl mb-6"
                >
                  {portfolio.bio}
                </motion.p>
              )}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex flex-wrap gap-3"
              >
                {portfolio.github_url && (
                  <a
                    href={portfolio.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-400 text-gray-300 hover:text-white hover:bg-dark-300 transition-colors"
                  >
                    <Github className="w-4 h-4" /> GitHub
                  </a>
                )}
                {portfolio.linkedin_url && (
                  <a
                    href={portfolio.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-400 text-gray-300 hover:text-white hover:bg-dark-300 transition-colors"
                  >
                    <Linkedin className="w-4 h-4" /> LinkedIn
                  </a>
                )}
                {portfolio.twitter_url && (
                  <a
                    href={portfolio.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-400 text-gray-300 hover:text-white hover:bg-dark-300 transition-colors"
                  >
                    <Twitter className="w-4 h-4" /> Twitter
                  </a>
                )}
                {portfolio.website_url && (
                  <a
                    href={portfolio.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-400 text-gray-300 hover:text-white hover:bg-dark-300 transition-colors"
                  >
                    <Globe className="w-4 h-4" /> Website
                  </a>
                )}
                <button
                  onClick={handleDownloadResume}
                  disabled={generatingResume}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors disabled:opacity-50"
                >
                  {generatingResume ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
                    />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  {generatingResume ? 'Generating...' : 'AI Resume'}
                </button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex flex-col items-end gap-2"
            >
              <div className="flex items-center gap-2 text-gray-400">
                <Eye className="w-4 h-4" />
                <span>{portfolio.views?.toLocaleString() || 0} views</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Sparkles className="w-4 h-4" />
                <span>{projects.length} projects</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Skills */}
      {portfolio.skills?.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-6"
          >
            <h2 className="font-display font-semibold text-xl text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" /> Skills
            </h2>
            <div className="flex flex-wrap gap-3">
              {portfolio.skills.map((skill, index) => (
                <SkillBadge
                  key={skill.name || skill}
                  name={skill.name || skill}
                  level={skill.level}
                  index={index}
                  size="lg"
                />
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* Experience Timeline */}
      {experiences.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="font-display font-semibold text-2xl text-white">Experience</h2>
            <p className="text-gray-400 mt-1">My professional journey</p>
          </motion.div>
          <ExperienceTimeline experiences={experiences} />
        </section>
      )}

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="font-display font-semibold text-2xl text-white">Featured Projects</h2>
            <p className="text-gray-400 mt-1">Top picks from my work</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {featuredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </section>
      )}

      {/* All Projects */}
      {otherProjects.length > 0 && (
        <section className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="font-display font-semibold text-2xl text-white">All Projects</h2>
            <p className="text-gray-400 mt-1">Everything I've built</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {projects.length === 0 && (
        <section className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-12 text-center"
          >
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-display font-semibold text-white mb-2">No Projects Yet</h3>
            <p className="text-gray-400 mb-6">Start adding projects to showcase your work.</p>
            <Link to="/builder" className="btn-primary inline-flex items-center gap-2">
              <ExternalLink className="w-4 h-4" /> Add Projects
            </Link>
          </motion.div>
        </section>
      )}
    </div>
  );
}
