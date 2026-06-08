import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { jobService } from '../services/jobService';
import useAuth from '../hooks/useAuth';
import { 
  ArrowRight, Search, Briefcase, Building2, Users, Star, 
  MapPin, DollarSign, BrainCircuit, Sparkles 
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobs = await jobService.getAllJobs();
        // Take up to 3 for featured section
        setFeaturedJobs(jobs.slice(0, 3));
      } catch (err) {
        console.error("Failed to load featured jobs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const stats = [
    { label: 'Active Job Openings', value: '1,420+', icon: Briefcase, color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40' },
    { label: 'Top-Tier Companies', value: '480+', icon: Building2, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40' },
    { label: 'Registered Candidates', value: '12,500+', icon: Users, color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40' }
  ];

  const testimonials = [
    {
      name: 'Sarah Jenkins',
      role: 'Staff React Developer',
      company: 'Vercel',
      content: 'TalentAI matched me with a role at Vercel within 10 days of uploading my resume. The AI matching algorithm was surprisingly accurate!',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Product Lead',
      company: 'Linear',
      content: 'We hired three engineers via TalentAI. The candidate resume analysis scores saved us dozens of hours of manual scanning.',
      rating: 5
    }
  ];

  return (
    <div className="relative overflow-hidden">
      
      {/* Background blobs for premium glassmorphism feel */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-200/40 dark:bg-indigo-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-200/40 dark:bg-slate-900/20 blur-[130px] pointer-events-none" />

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center space-x-2 rounded-full border border-indigo-200 bg-indigo-50/50 px-4 py-1.5 text-xs font-semibold text-indigo-700 dark:border-indigo-900/45 dark:bg-indigo-950/30 dark:text-indigo-400 mb-8"
        >
          <Sparkles className="h-4 w-4 text-indigo-500 animate-pulse" />
          <span>Next Generation AI Job Platform</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl"
        >
          Find Your <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-400 bg-clip-text text-transparent">Dream Job</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-gray-500 dark:text-gray-400"
        >
          Connect with top-tier product-driven companies. Use AI to scan profiles, auto-match requirements, and fast-track hiring pipelines.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex justify-center space-x-4"
        >
          <Link
            to="/jobs"
            className="flex items-center space-x-2 rounded-2xl bg-indigo-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-150 hover:bg-indigo-500 hover:shadow-indigo-250 transition-all dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:shadow-none"
          >
            <span>Browse Jobs</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
          {!isAuthenticated && (
            <Link
              to="/register"
              className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur px-6 py-4 text-base font-semibold text-gray-700 hover:bg-gray-50 transition dark:border-slate-800 dark:bg-slate-900 dark:text-gray-300 dark:hover:bg-slate-800"
            >
              Get Started
            </Link>
          )}
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex items-center space-x-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-900 dark:bg-slate-900"
              >
                <div className={`p-4 rounded-2xl ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">{stat.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Featured Openings</h2>
            <p className="text-sm text-gray-500 mt-1">Direct applications with transparent feedback.</p>
          </div>
          <Link to="/jobs" className="flex items-center space-x-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            <span>View All</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-48 animate-pulse rounded-2xl bg-gray-100 dark:bg-slate-900" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {featuredJobs.map((job) => (
              <motion.div
                key={job.id}
                whileHover={{ y: -5 }}
                className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition duration-300 dark:border-slate-900 dark:bg-slate-900"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full dark:bg-indigo-950/40 dark:text-indigo-400">
                      {job.companyName}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{job.location}</span>
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-4 line-clamp-1">{job.title}</h3>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-3 leading-relaxed">{job.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400">Salary Package</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{job.salary || 'Competitive'}</span>
                  </div>
                  <Link
                    to={`/jobs/${job.id}`}
                    className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-3 py-2 rounded-xl hover:bg-indigo-100 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700 transition"
                  >
                    View details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Success Stories / Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-gray-100 dark:border-slate-900 relative z-10">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center mb-12">
          Hiring Success Stories
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {testimonials.map((t, idx) => (
            <div key={idx} className="rounded-2xl bg-white p-8 shadow-sm border border-gray-200/60 dark:bg-slate-900 dark:border-slate-800/50">
              <div className="flex items-center space-x-1 text-amber-500 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-sm italic leading-relaxed text-gray-500 dark:text-gray-400 mb-6">
                "{t.content}"
              </p>
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-indigo-150 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 flex items-center justify-center font-bold">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">{t.name}</h4>
                  <p className="text-xs text-gray-400 font-medium">{t.role} &middot; <span className="text-indigo-500">{t.company}</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
    </div>
  );
};

export default Home;
