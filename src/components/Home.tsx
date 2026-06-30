import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp, MessageSquare, Image as ImageIcon, Eye, PenTool, ArrowLeft, Table, MonitorPlay, Terminal, Users, FileText, LayoutTemplate, BookOpen, Languages, Globe, Newspaper, BookA, Proportions } from 'lucide-react';
import { ToolId } from './Sidebar';

interface HomeProps {
  onEnter: (tool: ToolId) => void;
  onShowFounders: () => void;
}

export function Home({ onEnter, onShowFounders }: HomeProps) {
  const [time, setTime] = useState(new Date());
  const [touchStartY, setTouchStartY] = useState(0);
  const [showSections, setShowSections] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    if (touchStartY - touchEndY > 50 && !showSections) {
      setShowSections(true);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 0 && !showSections) {
      setShowSections(true);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: true, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const sections = [
    {
      id: 'chat' as ToolId,
      name: 'GOCOSMIC Assistant',
      icon: MessageSquare,
      gradient: 'from-indigo-500 via-purple-500 to-fuchsia-500',
      shadow: 'shadow-indigo-500/50',
      desc: 'Seek wisdom from the AI entity'
    },
    {
      id: 'image' as ToolId,
      name: 'GOCOSMIC Image Studio',
      icon: ImageIcon,
      gradient: 'from-fuchsia-500 via-pink-500 to-rose-500',
      shadow: 'shadow-pink-500/50',
      desc: 'Manifest visual realities'
    },
    {
      id: 'banner_creator' as ToolId,
      name: 'GOCOSMIC Banner Creator',
      icon: Proportions,
      gradient: 'from-fuchsia-400 via-purple-500 to-violet-500',
      shadow: 'shadow-purple-500/50',
      desc: 'Generate banners & posters'
    },
    {
      id: 'vision' as ToolId,
      name: 'GOCOSMIC Vision Lab',
      icon: Eye,
      gradient: 'from-emerald-400 via-teal-500 to-cyan-500',
      shadow: 'shadow-emerald-500/50',
      desc: 'Analyze the visual spectrum'
    },
    {
      id: 'writer' as ToolId,
      name: 'GOCOSMIC Content Writer',
      icon: PenTool,
      gradient: 'from-orange-400 via-amber-500 to-yellow-500',
      shadow: 'shadow-orange-500/50',
      desc: 'Transcribe thoughts into matter'
    },
    {
      id: 'grammar' as ToolId,
      name: 'GOCOSMIC Grammar & Writing',
      icon: BookA,
      gradient: 'from-rose-400 via-red-500 to-orange-500',
      shadow: 'shadow-rose-500/50',
      desc: 'Learn rules & creative writing'
    },
    {
      id: 'word' as ToolId,
      name: 'GOCOSMIC Word',
      icon: FileText,
      gradient: 'from-sky-400 via-blue-500 to-indigo-500',
      shadow: 'shadow-sky-500/50',
      desc: 'Format documents'
    },
    {
      id: 'cosmic_oxford' as ToolId,
      name: 'GOCOSMIC Oxford',
      icon: BookOpen,
      gradient: 'from-violet-400 via-purple-500 to-fuchsia-500',
      shadow: 'shadow-violet-500/50',
      desc: 'Discover stylish meanings'
    },
    {
      id: 'cosmic_translator' as ToolId,
      name: 'GOCOSMIC Translator',
      icon: Languages,
      gradient: 'from-amber-400 via-orange-500 to-red-500',
      shadow: 'shadow-amber-500/50',
      desc: 'Universal Translator'
    },
    {
      id: 'cosmic_country' as ToolId,
      name: 'GOCOSMIC Country Informer',
      icon: Globe,
      gradient: 'from-cyan-400 via-blue-500 to-indigo-500',
      shadow: 'shadow-cyan-500/50',
      desc: 'Explore national archives'
    },
    {
      id: 'cosmic_news' as ToolId,
      name: 'GOCOSMIC News Informer',
      icon: Newspaper,
      gradient: 'from-emerald-400 via-teal-500 to-cyan-500',
      shadow: 'shadow-emerald-500/50',
      desc: 'Global news broadcast'
    },
    {
      id: 'excel' as ToolId,
      name: 'GOCOSMIC Excel',
      icon: Table,
      gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
      shadow: 'shadow-teal-500/50',
      desc: 'Calculate data'
    },
    {
      id: 'presentation' as ToolId,
      name: 'GOCOSMIC PowerPoint',
      icon: MonitorPlay,
      gradient: 'from-orange-500 via-red-500 to-rose-600',
      shadow: 'shadow-red-500/50',
      desc: 'Design presentations'
    },
    {
      id: 'presentator' as ToolId,
      name: 'GOCOSMIC Presentator',
      icon: LayoutTemplate,
      gradient: 'from-pink-500 via-rose-500 to-red-500',
      shadow: 'shadow-pink-500/50',
      desc: 'AI Presentation Generator'
    },
    {
      id: 'python' as ToolId,
      name: 'GOCOSMIC Python',
      icon: Terminal,
      gradient: 'from-blue-500 via-indigo-500 to-violet-600',
      shadow: 'shadow-blue-500/50',
      desc: 'Code in Python'
    }
  ];

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-between overflow-hidden text-white bg-black"
      initial={{ y: 0 }}
      exit={{ y: '-100%', opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      {/* Multiverse Background */}
      <div className="absolute inset-0 z-[-1]">
        <img 
          src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2048&auto=format&fit=crop" 
          alt="Multiverse"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen"
        />
        
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-fuchsia-600/30 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-cyan-600/30 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-[600px] h-[600px] bg-violet-600/30 rounded-full blur-[150px] animate-blob animation-delay-4000"></div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80"></div>
      </div>

      <AnimatePresence mode="wait">
        {!showSections ? (
          <motion.div 
            key="clock"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex flex-col items-center justify-center mt-20 w-full px-4"
          >
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={onShowFounders}
              className="absolute top-6 left-6 md:top-12 md:left-12 flex items-center gap-2 text-white/60 hover:text-white transition-colors z-20"
            >
              <Users className="w-6 h-6" />
              <span className="text-sm font-medium uppercase tracking-wider hidden sm:inline">Founders</span>
            </motion.button>
            <div className="text-center backdrop-blur-sm bg-black/10 p-8 rounded-3xl border border-white/5 shadow-2xl flex flex-col items-center">
              <h2 className="text-3xl md:text-5xl font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-violet-400 animate-gradient-x mb-6 uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                GOCOSMIC
              </h2>
              <h1 className="text-7xl md:text-9xl font-bold tracking-tighter font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-violet-400 animate-gradient-x drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] pb-2">
                {formatTime(time)}
              </h1>
              <p className="text-xl md:text-3xl mt-6 font-medium tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-violet-400 animate-gradient-x drop-shadow-lg">
                {formatDate(time)}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="sections"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
            className="flex-1 w-full max-w-6xl px-6 py-12 overflow-y-scroll custom-scrollbar flex flex-col items-center relative"
          >
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={() => setShowSections(false)}
              className="absolute top-6 left-6 md:top-12 md:left-12 flex items-center gap-2 text-white/60 hover:text-white transition-colors z-20"
            >
              <ArrowLeft className="w-6 h-6" />
              <span className="text-sm font-medium uppercase tracking-wider hidden sm:inline">Return to Home Page</span>
            </motion.button>

            <div className="my-auto w-full flex flex-col items-center pt-16 md:pt-0">
              <motion.h2 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-5xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 mb-12 uppercase text-center"
              >
                Choose Your Path
              </motion.h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {sections.map((section, idx) => {
                  const Icon = section.icon;
                  return (
                    <motion.button
                      key={section.id}
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => onEnter(section.id)}
                      className={`group relative overflow-hidden rounded-3xl p-8 text-left transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl ${section.shadow}`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${section.gradient} opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                      <div className="absolute inset-0 border border-white/10 rounded-3xl group-hover:border-white/30 transition-colors" />
                      
                      <div className="relative z-10 flex items-start gap-6">
                        <div className={`p-4 rounded-2xl bg-gradient-to-br ${section.gradient} shadow-lg shrink-0`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-2 tracking-wide">{section.name}</h3>
                          <p className="text-white/60 font-medium">{section.desc}</p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Swipe Up Button */}
      <AnimatePresence>
        {!showSections && (
          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, -15, 0] }}
            exit={{ opacity: 0, y: 50 }}
            onClick={() => setShowSections(true)}
            className="mb-12 flex flex-col items-center gap-3 text-zinc-300 hover:text-white transition-colors group cursor-pointer z-10"
            transition={{ y: { repeat: Infinity, duration: 2, ease: "easeInOut" } }}
          >
            <div className="p-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10 group-hover:bg-white/10 group-hover:scale-110 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              <ChevronUp className="w-8 h-8" />
            </div>
            <span className="text-sm font-medium tracking-[0.3em] uppercase opacity-80 group-hover:opacity-100 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-violet-400 animate-gradient-x">
              Swipe up to enter
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
