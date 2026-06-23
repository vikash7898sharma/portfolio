import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Code, Link2, Image, Check, ChevronRight, ChevronLeft, Save, Sparkles, Plus, X, Trash2, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { usePortfolio } from '../hooks/usePortfolio';
import { upsertPortfolio, uploadFile } from '../services/api';

const steps = [
  { id: 1, title: 'Personal Info', icon: User, description: 'Basic information about you' },
  { id: 2, title: 'Skills', icon: Code, description: 'Your technical abilities' },
  { id: 3, title: 'Social Links', icon: Link2, description: 'Your online presence' },
  { id: 4, title: 'Profile Image', icon: Image, description: 'Your profile photo' },
];

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

export default function Builder() {
  const navigate = useNavigate();
  const { portfolio, loading: portfolioLoading, refetch } = usePortfolio();
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [uploading, setUploading] = useState(false);

  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState([]);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState(70);
  const [socialLinks, setSocialLinks] = useState({ github: '', linkedin: '', twitter: '', website: '' });
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    if (portfolio) {
      setName(portfolio.name || '');
      setTitle(portfolio.title || '');
      setBio(portfolio.bio || '');
      setSkills(portfolio.skills || []);
      setSocialLinks({
        github: portfolio.github_url || '',
        linkedin: portfolio.linkedin_url || '',
        twitter: portfolio.twitter_url || '',
        website: portfolio.website_url || '',
      });
      setProfileImage(portfolio.profile_image);
    }
  }, [portfolio]);

  const addSkill = () => {
    if (!newSkillName.trim()) {
      toast.error('Enter a skill name');
      return;
    }
    if (skills.some(s => (s.name || s).toLowerCase() === newSkillName.toLowerCase())) {
      toast.error('Skill already exists');
      return;
    }
    setSkills([...skills, { name: newSkillName.trim(), level: newSkillLevel }]);
    setNewSkillName('');
    setNewSkillLevel(70);
    toast.success('Skill added');
  };

  const removeSkill = (nameToRemove) => {
    setSkills(skills.filter(s => (s.name || s) !== nameToRemove));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadFile(file, 'uploads', 'profile');
      setProfileImage(url);
      toast.success('Image uploaded');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const saveProgress = async () => {
    setSaving(true);
    try {
      await upsertPortfolio({
        name,
        title,
        bio,
        skills,
        github_url: socialLinks.github,
        linkedin_url: socialLinks.linkedin,
        twitter_url: socialLinks.twitter,
        website_url: socialLinks.website,
        profile_image: profileImage,
      });
      toast.success('Progress saved');
      refetch();
    } catch (error) {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const nextStep = async () => {
    if (currentStep === 1 && !name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    await saveProgress();
    setDirection(1);
    setCurrentStep(s => Math.min(s + 1, steps.length));
  };

  const prevStep = () => {
    setDirection(-1);
    setCurrentStep(s => Math.max(s - 1, 1));
  };

  const publish = async () => {
    await saveProgress();
    toast.success('Portfolio saved!');
    navigate('/portfolio');
  };

  if (portfolioLoading) {
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

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-display font-bold text-3xl text-white mb-2">Portfolio Builder</h1>
          <p className="text-gray-400">Customize your developer portfolio</p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              return (
                <motion.button
                  key={step.id}
                  onClick={() => {
                    setDirection(step.id > currentStep ? 1 : -1);
                    setCurrentStep(step.id);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center relative z-10"
                >
                  <motion.div
                    animate={{
                      scale: isActive ? 1.1 : 1,
                      boxShadow: isActive ? '0 0 20px rgba(99, 102, 241, 0.5)' : 'none',
                    }}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      isActive
                        ? 'bg-primary text-white'
                        : isCompleted
                        ? 'bg-primary/20 text-primary'
                        : 'bg-dark-400 text-gray-500'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </motion.div>
                  <span
                    className={`mt-2 text-xs font-medium hidden sm:block ${
                      isActive ? 'text-primary' : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </span>
                </motion.button>
              );
            })}
          </div>
          {/* Progress Bar */}
          <div className="relative h-1 bg-dark-400 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / steps.length) * 100}%` }}
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-secondary rounded-full"
            />
          </div>
        </motion.div>

        {/* Form Content */}
        <div className="relative overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="glass-card p-8 mb-6"
            >
              {/* Step 1: Personal Info */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-display font-semibold text-lg text-white">Personal Info</h2>
                      <p className="text-sm text-gray-400">Tell visitors who you are</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="input-dark"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Professional Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Full Stack Developer"
                      className="input-dark"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell visitors about yourself..."
                      rows={4}
                      className="input-dark resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Skills */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Code className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-display font-semibold text-lg text-white">Skills</h2>
                      <p className="text-sm text-gray-400">Showcase your technical abilities</p>
                    </div>
                  </div>

                  <div className="glass-card p-4 bg-dark-100">
                    <h3 className="font-medium text-white mb-4 flex items-center gap-2">
                      <Plus className="w-4 h-4 text-primary" /> Add New Skill
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <input
                        type="text"
                        value={newSkillName}
                        onChange={(e) => setNewSkillName(e.target.value)}
                        placeholder="e.g., React, Node.js"
                        className="input-dark flex-1"
                      />
                      <div className="flex items-center gap-4">
                        <div className="flex-1 sm:w-48">
                          <div className="flex items-center justify-between text-sm text-gray-400 mb-1">
                            <span>Proficiency</span>
                            <span className="text-primary font-medium">{newSkillLevel}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={newSkillLevel}
                            onChange={(e) => setNewSkillLevel(Number(e.target.value))}
                            className="w-full accent-primary"
                          />
                        </div>
                        <button
                          onClick={addSkill}
                          className="px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/80 transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>

                  {skills.length > 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-wrap gap-3"
                    >
                      {skills.map((skill, index) => (
                        <motion.div
                          key={skill.name || skill}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-400 group"
                        >
                          <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                            {index + 1}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">
                              {skill.name || skill}
                            </div>
                            <div className="text-xs text-gray-400">{skill.level}%</div>
                          </div>
                          <button
                            onClick={() => removeSkill(skill.name || skill)}
                            className="ml-2 p-1 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <Code className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No skills added yet.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Social Links */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Link2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-display font-semibold text-lg text-white">Social Links</h2>
                      <p className="text-sm text-gray-400">Connect your online presence</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">GitHub</label>
                    <input
                      type="text"
                      value={socialLinks.github}
                      onChange={(e) =>
                        setSocialLinks({ ...socialLinks, github: e.target.value })
                      }
                      placeholder="https://github.com/username"
                      className="input-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">LinkedIn</label>
                    <input
                      type="text"
                      value={socialLinks.linkedin}
                      onChange={(e) =>
                        setSocialLinks({ ...socialLinks, linkedin: e.target.value })
                      }
                      placeholder="https://linkedin.com/in/username"
                      className="input-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Twitter</label>
                    <input
                      type="text"
                      value={socialLinks.twitter}
                      onChange={(e) =>
                        setSocialLinks({ ...socialLinks, twitter: e.target.value })
                      }
                      placeholder="https://x.com/username"
                      className="input-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
                    <input
                      type="text"
                      value={socialLinks.website}
                      onChange={(e) =>
                        setSocialLinks({ ...socialLinks, website: e.target.value })
                      }
                      placeholder="https://yourwebsite.com"
                      className="input-dark"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Profile Image */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Image className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-display font-semibold text-lg text-white">Profile Image</h2>
                      <p className="text-sm text-gray-400">Add a professional photo</p>
                    </div>
                  </div>

                  <div className="text-center">
                    {profileImage ? (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative inline-block"
                      >
                        <img
                          src={profileImage}
                          alt="Profile"
                          className="w-40 h-40 rounded-2xl object-cover ring-4 ring-primary/20"
                        />
                        <button
                          onClick={() => setProfileImage(null)}
                          className="absolute -top-2 -right-2 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ) : (
                      <label className="cursor-pointer">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="w-40 h-40 rounded-2xl bg-dark-400 border-2 border-dashed border-dark-300 hover:border-primary/50 flex flex-col items-center justify-center mx-auto transition-colors"
                        >
                          {uploading ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
                            />
                          ) : (
                            <>
                              <Upload className="w-12 h-12 text-gray-500 mb-2" />
                              <span className="text-sm text-gray-400">Click to upload</span>
                            </>
                          )}
                        </motion.div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploading}
                          className="hidden"
                        />
                      </label>
                    )}
                    <p className="text-sm text-gray-400 mt-4">
                      A professional photo helps visitors connect with you.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between gap-4"
        >
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          <button
            onClick={saveProgress}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Progress'}
          </button>
          {currentStep < steps.length ? (
            <motion.button
              onClick={nextStep}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 btn-primary"
            >
              Next <ChevronRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <motion.button
              onClick={publish}
              disabled={saving}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 btn-primary"
            >
              <Check className="w-4 h-4" /> {saving ? 'Saving...' : 'Finish'}
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
