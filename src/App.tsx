import React, { useState } from 'react';
import { Sidebar, ToolId, Theme } from '@/components/Sidebar';
import { ChatTool } from '@/components/ChatTool';
import { ImageTool } from '@/components/ImageTool';
import { VisionTool } from '@/components/VisionTool';
import { WriterTool } from '@/components/WriterTool';
import { ExcelTool } from '@/components/ExcelTool';
import { PresentationTool } from '@/components/PresentationTool';
import { PresentatorTool } from '@/components/PresentatorTool';
import { PythonTool } from '@/components/PythonTool';
import { WordTool } from '@/components/WordTool';
import { CosmicOxfordTool } from '@/components/CosmicOxfordTool';
import { CosmicTranslatorTool } from '@/components/CosmicTranslatorTool';
import { CosmicCountryInformerTool } from '@/components/CosmicCountryInformerTool';
import { CosmicNewsInformerTool } from '@/components/CosmicNewsInformerTool';
import { BannerCreatorTool } from '@/components/BannerCreatorTool';
import { GrammarTool } from '@/components/GrammarTool';
import { Home } from '@/components/Home';
import { FoundersModal } from '@/components/FoundersModal';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

export default function App() {
  const [activeTool, setActiveTool] = useState<ToolId>('chat');
  const [hasEntered, setHasEntered] = useState(false);
  const [theme, setTheme] = useState<Theme>('dark');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showFounders, setShowFounders] = useState(false);

  const renderTool = () => {
    switch (activeTool) {
      case 'chat': return <ChatTool />;
      case 'image': return <ImageTool />;
      case 'vision': return <VisionTool />;
      case 'writer': return <WriterTool />;
      case 'excel': return <ExcelTool />;
      case 'presentation': return <PresentationTool />;
      case 'presentator': return <PresentatorTool />;
      case 'python': return <PythonTool />;
      case 'word': return <WordTool />;
      case 'cosmic_oxford': return <CosmicOxfordTool />;
      case 'cosmic_translator': return <CosmicTranslatorTool />;
      case 'cosmic_country': return <CosmicCountryInformerTool />;
      case 'cosmic_news': return <CosmicNewsInformerTool />;
      case 'grammar': return <GrammarTool />;
      case 'banner_creator': return <BannerCreatorTool />;
      default: return <ChatTool />;
    }
  };

  const getToolGradient = () => {
    switch (activeTool) {
      case 'chat': return 'from-indigo-900/30 via-transparent to-transparent bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))]';
      case 'image': return 'from-purple-900/30 via-transparent to-transparent bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]';
      case 'vision': return 'from-emerald-900/30 via-transparent to-transparent bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))]';
      case 'writer': return 'from-orange-900/30 via-transparent to-transparent bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))]';
      case 'excel': return 'from-teal-900/30 via-transparent to-transparent bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))]';
      case 'presentation': return 'from-red-900/30 via-transparent to-transparent bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))]';
      case 'presentator': return 'from-pink-900/30 via-transparent to-transparent bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]';
      case 'python': return 'from-blue-900/30 via-transparent to-transparent bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))]';
      case 'word': return 'from-sky-900/30 via-transparent to-transparent bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]';
      case 'cosmic_oxford': return 'from-violet-900/30 via-transparent to-transparent bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]';
      case 'cosmic_translator': return 'from-amber-900/30 via-transparent to-transparent bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))]';
      case 'cosmic_country': return 'from-cyan-900/30 via-transparent to-transparent bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))]';
      case 'cosmic_news': return 'from-emerald-900/30 via-transparent to-transparent bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))]';
      case 'grammar': return 'from-rose-900/30 via-transparent to-transparent bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]';
      case 'banner_creator': return 'from-fuchsia-900/30 via-transparent to-transparent bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))]';
      default: return '';
    }
  };

  return (
    <div className={cn(
      "flex h-screen overflow-hidden font-sans transition-colors duration-500 relative",
      theme === 'dark' ? "bg-[#09090b] text-zinc-100 selection:bg-indigo-500/30 selection:text-indigo-200 theme-dark" : "",
      theme === 'light' ? "bg-[#f4f4f5] text-zinc-900 selection:bg-indigo-500/30 selection:text-indigo-900 theme-light" : "",
      theme === 'colourful' ? "bg-gradient-to-br from-indigo-900 via-purple-900 to-fuchsia-900 text-white selection:bg-white/30 selection:text-white theme-colourful" : ""
    )}>
      <AnimatePresence>
        {!hasEntered && <Home key="home" onEnter={(tool) => {
          setActiveTool(tool);
          setHasEntered(true);
        }} onShowFounders={() => setShowFounders(true)} />}
      </AnimatePresence>

      <Sidebar 
        activeTool={activeTool} 
        onSelectTool={setActiveTool} 
        theme={theme} 
        setTheme={setTheme} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        onGoHome={() => setHasEntered(false)}
        onShowFounders={() => setShowFounders(true)}
      />
      
      <main className="flex-1 flex flex-col min-w-0 relative">
        <div className={cn("absolute inset-0 transition-all duration-700 pointer-events-none", getToolGradient())} />
        <div className="flex-1 p-6 overflow-hidden relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTool}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderTool()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <FoundersModal 
        isOpen={showFounders} 
        onClose={() => setShowFounders(false)} 
      />
    </div>
  );
}
