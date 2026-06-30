import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  MessageSquare, 
  Image as ImageIcon, 
  Eye, 
  PenTool, 
  LayoutGrid,
  Sun,
  Moon,
  Palette,
  Home as HomeIcon,
  Table,
  MonitorPlay,
  Terminal,
  Users,
  X,
  FileText,
  LayoutTemplate,
  BookOpen,
  Languages,
  Globe,
  Newspaper,
  BookA,
  Proportions
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type ToolId = 'chat' | 'image' | 'vision' | 'writer' | 'excel' | 'presentation' | 'presentator' | 'python' | 'word' | 'cosmic_oxford' | 'cosmic_translator' | 'cosmic_country' | 'cosmic_news' | 'grammar' | 'banner_creator';
export type Theme = 'dark' | 'light' | 'colourful';

interface SidebarProps {
  activeTool: ToolId;
  onSelectTool: (tool: ToolId) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onGoHome: () => void;
  onShowFounders: () => void;
}

export function Sidebar({ activeTool, onSelectTool, theme, setTheme, isOpen, setIsOpen, onGoHome, onShowFounders }: SidebarProps) {
  const tools = [
    { id: 'chat', label: 'GOCOSMIC Assistant', icon: MessageSquare, desc: 'General purpose chat' },
    { id: 'image', label: 'GOCOSMIC Image Studio', icon: ImageIcon, desc: 'Generate images' },
    { id: 'banner_creator', label: 'GOCOSMIC Banner Creator', icon: Proportions, desc: 'Generate banners & posters' },
    { id: 'vision', label: 'GOCOSMIC Vision Lab', icon: Eye, desc: 'Analyze images' },
    { id: 'writer', label: 'GOCOSMIC Content Writer', icon: PenTool, desc: 'Blog & Copywriting' },
    { id: 'grammar', label: 'GOCOSMIC Grammar & Writing', icon: BookA, desc: 'Learn rules & creative writing' },
    { id: 'word', label: 'GOCOSMIC Word', icon: FileText, desc: 'Rich Text Editor' },
    { id: 'cosmic_oxford', label: 'GOCOSMIC Oxford', icon: BookOpen, desc: 'Stylish Dictionary' },
    { id: 'cosmic_translator', label: 'GOCOSMIC Translator', icon: Languages, desc: 'Universal Translation' },
    { id: 'cosmic_country', label: 'GOCOSMIC Country Informer', icon: Globe, desc: 'National Archives & Data' },
    { id: 'cosmic_news', label: 'GOCOSMIC News Informer', icon: Newspaper, desc: 'Global News Broadcast' },
    { id: 'excel', label: 'GOCOSMIC Excel', icon: Table, desc: 'Spreadsheet & Data' },
    { id: 'presentation', label: 'GOCOSMIC PowerPoint', icon: MonitorPlay, desc: 'Create presentations' },
    { id: 'presentator', label: 'GOCOSMIC Presentator', icon: LayoutTemplate, desc: 'AI Presentation Generator' },
    { id: 'python', label: 'GOCOSMIC Python', icon: Terminal, desc: 'Python IDE & Runner' },
  ];

  return (
    <motion.div 
      initial={false}
      animate={{ width: isOpen ? 256 : 80 }}
      transition={{ type: "spring", bounce: 0, duration: 0.4 }}
      className="bg-zinc-900 border-r border-zinc-800 flex flex-col h-full text-zinc-100 shrink-0 overflow-hidden"
    >
      <div className={cn("p-6 flex items-center", isOpen ? "gap-3" : "justify-center")}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-8 h-8 bg-indigo-500 hover:bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 transition-colors shrink-0"
        >
          <LayoutGrid className="w-5 h-5 text-white" />
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.span 
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="font-bold text-lg tracking-tight truncate"
            >
              GOCOSMIC
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 px-3 py-4 space-y-2 overflow-y-scroll overflow-x-hidden">
        <button
          onClick={onGoHome}
          className={cn(
            "w-full flex items-center rounded-xl transition-all duration-200 group text-left mb-2 relative overflow-hidden",
            isOpen ? "px-3 py-3 gap-3" : "p-3 justify-center",
            "text-zinc-400 hover:text-zinc-100"
          )}
          title={!isOpen ? "Home" : undefined}
        >
          {/* Subtle hover effect for open state */}
          {isOpen && (
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          )}
          <HomeIcon className="w-5 h-5 shrink-0 text-zinc-500 group-hover:text-zinc-400 relative z-10" />
          <AnimatePresence>
            {isOpen && (
              <motion.div 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="truncate relative z-10"
              >
                <div className="font-medium text-sm">Home</div>
                <div className="text-[10px] opacity-60 font-normal truncate">Return to start</div>
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        <button
          onClick={onShowFounders}
          className={cn(
            "w-full flex items-center rounded-xl transition-all duration-200 group text-left mb-6 relative overflow-hidden",
            isOpen ? "px-3 py-3 gap-3" : "p-3 justify-center",
            "text-zinc-400 hover:text-zinc-100"
          )}
          title={!isOpen ? "Founders" : undefined}
        >
          {isOpen && (
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          )}
          <Users className="w-5 h-5 shrink-0 text-zinc-500 group-hover:text-zinc-400 relative z-10" />
          <AnimatePresence>
            {isOpen && (
              <motion.div 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="truncate relative z-10"
              >
                <div className="font-medium text-sm">Founders</div>
                <div className="text-[10px] opacity-60 font-normal truncate">Meet the team</div>
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 8 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="px-3 text-xs font-medium text-zinc-500 uppercase tracking-wider overflow-hidden"
            >
              Tools
            </motion.div>
          )}
        </AnimatePresence>
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => onSelectTool(tool.id as ToolId)}
              className={cn(
                "w-full flex items-center rounded-xl transition-all duration-200 group text-left relative overflow-hidden",
                isOpen ? "px-3 py-3 gap-3" : "p-3 justify-center",
                isActive 
                  ? "bg-indigo-600/10 text-indigo-500 border border-indigo-500/20" 
                  : "text-zinc-400 hover:text-zinc-100"
              )}
              title={!isOpen ? tool.label : undefined}
            >
              {/* Subtle hover effect for open state */}
              {isOpen && !isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
              <Icon className={cn("w-5 h-5 shrink-0 relative z-10", isActive ? "text-indigo-500" : "text-zinc-500 group-hover:text-zinc-400")} />
              <AnimatePresence>
                {isOpen && (
                  <motion.div 
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="truncate relative z-10"
                  >
                    <div className="font-medium text-sm">{tool.label}</div>
                    <div className="text-[10px] opacity-60 font-normal truncate">{tool.desc}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-zinc-800">
        <div className={cn(
          "flex items-center bg-zinc-950/50 rounded-xl p-1 border border-zinc-800 transition-all duration-300",
          isOpen ? "justify-between flex-row" : "flex-col gap-2"
        )}>
          <button 
            onClick={() => setTheme('light')} 
            className={cn("p-2 rounded-lg transition-all flex justify-center", isOpen ? "flex-1" : "w-full", theme === 'light' ? "bg-zinc-800 text-zinc-100 shadow-sm" : "text-zinc-500 hover:text-zinc-400")}
            title="Light Mode"
          >
            <Sun className="w-4 h-4 shrink-0" />
          </button>
          <button 
            onClick={() => setTheme('dark')} 
            className={cn("p-2 rounded-lg transition-all flex justify-center", isOpen ? "flex-1" : "w-full", theme === 'dark' ? "bg-zinc-800 text-zinc-100 shadow-sm" : "text-zinc-500 hover:text-zinc-400")}
            title="Dark Mode"
          >
            <Moon className="w-4 h-4 shrink-0" />
          </button>
          <button 
            onClick={() => setTheme('colourful')} 
            className={cn("p-2 rounded-lg transition-all flex justify-center", isOpen ? "flex-1" : "w-full", theme === 'colourful' ? "bg-zinc-800 text-zinc-100 shadow-sm" : "text-zinc-500 hover:text-zinc-400")}
            title="Colourful Mode"
          >
            <Palette className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
