import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Code, Link2, Image, Check, ChevronRight, ChevronLeft, Save, Sparkles, Plus, X, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getMyPortfolio, createPortfolio, updatePortfolio } from '../services/portfolio';

const steps = [
  { id: 1, title: 'Personal Info', icon: User },
  { id: 2, title: 'Skills', icon: Code },
  { id: 3, title: 'Social Links', icon: Link2 },
  { id: 4, title: 'Profile Image', icon: Image },
];

export default function Builder() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState([]);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState(50);
  const [socialLinks, setSocialLinks] = useState({ github: '', linkedin: '', twitter: '', website: '' });
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    if (user) loadPortfolio();
  }, [user]);

  const loadPortfolio = async () => {
    try {
      const res = await getMyPortfolio();
      if (res.data) {
        setPortfolio(res.data);
        setName(res.data.name || '');
        setTitle(res.data.title || '');
        setBio(res.data.bio || '');
        setSkills(res.data.skills || []);
        setSocialLinks(res.data.socialLinks || {});
        setProfileImage(res.data.profileImage);
      }
    } catch (error) {
      // No portfolio yet
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (!newSkillName.trim()) {
      toast.error('Enter a skill name');
      return;
    }
    if (skills.some(s => s.name.toLowerCase() === newSkillName.toLowerCase())) {
      toast.error('Skill already exists');
      return;
    }
    setSkills([...skills, { name: newSkillName.trim(), level: newSkillLevel }]);
    setNewSkillName('');
    setNewSkillLevel(50);
    toast.success('Skill added');
  };

  const removeSkill = (name) => setSkills(skills.filter(s => s.name !== name));

  const saveStep = async () => {
    if (!portfolio) return false;
    setSaving(true);
    try {
      const data = {};
      if (currentStep === 1) Object.assign(data, { name, title, bio });
      if (currentStep === 2) data.skills = skills;
      if (currentStep === 3) data.socialLinks = socialLinks;
      if (currentStep === 4) data.profileImage = profileImage;

      await updatePortfolio(portfolio._id, data);
      toast.success('Progress saved');
      return true;
    } catch (error) {
      toast.error('Failed to save');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const createNewPortfolio = async () => {
    setSaving(true);
    try {
      const res = await createPortfolio({
        name: user?.email?.split('@')[0] || 'Developer',
        title: 'Software Developer',
        bio: 'Building amazing things with code.',
      });
      setPortfolio(res.data);
      setName(res.data.name);
      setTitle(res.data.title);
      setBio(res.data.bio);
      toast.success('Portfolio created');
    } catch (error) {
      toast.error('Failed to create portfolio');
    } finally {
      setSaving(false);
    }
  };

  const nextStep = async () => {
    if (currentStep === 1 && !name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    await saveStep();
    setCurrentStep(s => Math.min(s + 1, steps.length));
  };

  const prevStep = () => setCurrentStep(s => Math.max(s - 1, 1));

  const publish = async () => {
    await saveStep();
    toast.success('Portfolio saved!');
    navigate(`/portfolio/${portfolio?.slug}`);
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
        <div className="max-w-xl mx-auto glass-card p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-display font-bold text-2xl text-white mb-4">Create Your Portfolio</h2>
          <p className="text-gray-400 mb-8">Let's build your AI-powered developer portfolio.</p>
          <button
            onClick={createNewPortfolio}
            disabled={saving}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            {saving ? 'Creating...' : 'Start Building'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex flex-col items-center ${isActive || isCompleted ? 'text-primary' : 'text-gray-500'}`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isActive ? 'bg-primary text-white shadow-glow' :
                    isCompleted ? 'bg-primary/20 text-primary' : 'bg-dark-400'
                  }`}>
                    {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className="mt-2 text-xs font-medium hidden sm:block">{step.title}</span>
                </button>
              );
            })}
          </div>
          <div className="text-center">
            <h2 className="font-display font-bold text-xl text-white">{steps[currentStep - 1]?.title}</h2>
          </div>
        </div>

        {/* Form */}
        <div className="glass-card p-8 mb-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Professional Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Full Stack Developer" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell visitors about yourself..." rows={4} className="input-field resize-none" />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="glass-card p-4 bg-dark-100">
                <h3 className="font-medium text-white mb-4 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-primary" /> Add New Skill
                </h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input type="text" value={newSkillName} onChange={(e) => setNewSkillName(e.target.value)} placeholder="e.g., React, Node.js" className="input-field flex-1" />
                  <div className="flex items-center gap-4">
                    <div className="flex-1 sm:w-48">
                      <div className="flex items-center justify-between text-sm text-gray-400 mb-1">
                        <span>Proficiency</span>
                        <span className="text-primary font-medium">{newSkillLevel}%</span>
                      </div>
                      <input type="range" min="0" max="100" value={newSkillLevel} onChange={(e) => setNewSkillLevel(Number(e.target.value))} className="w-full accent-primary" />
                    </div>
                    <button onClick={addSkill} className="px-4 py-2 rounded-lg bg-primary text-white font-medium">Add</button>
                  </div>
                </div>
              </div>
              {skills.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill, index) => (
                    <div key={skill.name} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-400 group">
                      <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">{index + 1}</div>
                      <div>
                        <div className="text-sm font-medium text-white">{skill.name}</div>
                        <div className="text-xs text-gray-400">{skill.level}%</div>
                      </div>
                      <button onClick={() => removeSkill(skill.name)} className="ml-2 p-1 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Code className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No skills added yet.</p>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">GitHub</label>
                <input type="text" value={socialLinks.github} onChange={(e) => setSocialLinks({ ...socialLinks, github: e.target.value })} placeholder="https://github.com/username" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">LinkedIn</label>
                <input type="text" value={socialLinks.linkedin} onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })} placeholder="https://linkedin.com/in/username" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Twitter</label>
                <input type="text" value={socialLinks.twitter} onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })} placeholder="https://x.com/username" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
                <input type="text" value={socialLinks.website} onChange={(e) => setSocialLinks({ ...socialLinks, website: e.target.value })} placeholder="https://yourwebsite.com" className="input-field" />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6 text-center">
              {profileImage ? (
                <div className="relative inline-block">
                  <img src={profileImage} alt="Profile" className="w-40 h-40 rounded-2xl object-cover ring-4 ring-primary/20" />
                  <button onClick={() => setProfileImage(null)} className="absolute -top-2 -right-2 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="w-40 h-40 rounded-2xl bg-dark-400 border-2 border-dashed border-dark-300 hover:border-primary/50 flex flex-col items-center justify-center mx-auto cursor-pointer transition-colors">
                  <Image className="w-12 h-12 text-gray-500 mb-2" />
                  <span className="text-sm text-gray-400">Click to upload</span>
                </div>
              )}
              <p className="text-sm text-gray-400">A professional photo helps visitors connect with you.</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <button onClick={prevStep} disabled={currentStep === 1} className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          <button onClick={saveStep} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Progress'}
          </button>
          {currentStep < steps.length ? (
            <button onClick={nextStep} className="flex items-center gap-2 btn-primary">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={publish} disabled={saving} className="flex items-center gap-2 btn-primary">
              <Check className="w-4 h-4" /> {saving ? 'Saving...' : 'Finish'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
