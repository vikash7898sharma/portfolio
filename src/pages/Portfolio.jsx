import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Globe, Calendar, Eye, ExternalLink } from 'lucide-react';
import { getPortfolioBySlug, getPortfolioProjects } from '../services/portfolio';
import { trackEvent } from '../services/analytics';
import ProjectCard from '../components/ProjectCard';
import SkillBadge from '../components/SkillBadge';

export default function Portfolio() {
  const { slug } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) loadPortfolio();
  }, [slug]);

  const loadPortfolio = async () => {
    try {
      const res = await getPortfolioBySlug(slug);
      setPortfolio(res.data);
      if (res.data?._id) {
        trackEvent(res.data._id, 'view');
        const projectsRes = await getPortfolioProjects(res.data._id);
        setProjects(projectsRes.data || []);
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
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-display font-bold text-white mb-4">Portfolio Not Found</h1>
          <p className="text-gray-400 mb-8">The portfolio doesn't exist or is private.</p>
          <Link to="/" className="btn-primary">Go Home</Link>
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
        <div className="glass-card p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div>
              {portfolio.profileImage ? (
                <img src={portfolio.profileImage} alt={portfolio.name} className="w-32 h-32 rounded-2xl object-cover ring-4 ring-primary/20" />
              ) : (
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center ring-4 ring-primary/20">
                  <span className="text-4xl font-display font-bold text-white">
                    {(portfolio.name || 'D')[0].toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1">
              <h1 className="font-display font-bold text-3xl md:text-4xl text-white mb-2">
                {portfolio.name || 'Anonymous'}
              </h1>
              {portfolio.title && <p className="text-xl text-primary mb-4">{portfolio.title}</p>}
              {portfolio.bio && <p className="text-gray-400 max-w-2xl mb-6">{portfolio.bio}</p>}

              <div className="flex flex-wrap gap-3">
                {portfolio.socialLinks?.github && (
                  <a href={portfolio.socialLinks.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-400 text-gray-300 hover:text-white hover:bg-dark-300 transition-colors">
                    <Github className="w-4 h-4" /> GitHub
                  </a>
                )}
                {portfolio.socialLinks?.linkedin && (
                  <a href={portfolio.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-400 text-gray-300 hover:text-white hover:bg-dark-300 transition-colors">
                    <Linkedin className="w-4 h-4" /> LinkedIn
                  </a>
                )}
                {portfolio.socialLinks?.twitter && (
                  <a href={portfolio.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-400 text-gray-300 hover:text-white hover:bg-dark-300 transition-colors">
                    <Twitter className="w-4 h-4" /> Twitter
                  </a>
                )}
                {portfolio.socialLinks?.website && (
                  <a href={portfolio.socialLinks.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-400 text-gray-300 hover:text-white hover:bg-dark-300 transition-colors">
                    <Globe className="w-4 h-4" /> Website
                  </a>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2 text-gray-400">
                <Eye className="w-4 h-4" />
                <span>{portfolio.views?.toLocaleString() || 0} views</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{projects.length} projects</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      {portfolio.skills?.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 mb-16">
          <div className="glass-card p-6">
            <h2 className="font-display font-semibold text-xl text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" /> Skills
            </h2>
            <div className="flex flex-wrap gap-3">
              {portfolio.skills.map((skill, index) => (
                <SkillBadge key={skill.name} name={skill.name} level={skill.level} size="lg" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 mb-16">
          <div className="mb-8">
            <h2 className="font-display font-semibold text-2xl text-white">Featured Projects</h2>
            <p className="text-gray-400 mt-1">Top picks from my work</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {featuredProjects.map((project, index) => (
              <ProjectCard key={project._id} project={project} portfolioSlug={slug} index={index} />
            ))}
          </div>
        </section>
      )}

      {/* All Projects */}
      {otherProjects.length > 0 && (
        <section className="max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <h2 className="font-display font-semibold text-2xl text-white">All Projects</h2>
            <p className="text-gray-400 mt-1">Everything I've built</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherProjects.map((project, index) => (
              <ProjectCard key={project._id} project={project} portfolioSlug={slug} index={index} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
