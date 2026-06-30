import React, { useState } from 'react';
import { Newspaper, Copy, Check, Loader2, Sparkles, Radio, Activity, Landmark, ShieldAlert, Scale, HeartHandshake, Coins, Trophy } from 'lucide-react';
import { geminiService } from '@/services/gemini';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

const NEWS_CATEGORIES = [
  { id: 'sports', label: 'Sports & Athletics', icon: Trophy, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  { id: 'heritage', label: 'Heritage & Culture', icon: Landmark, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { id: 'welfare', label: 'Social Welfare', icon: HeartHandshake, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
  { id: 'financial', label: 'Financial & Economy', icon: Coins, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { id: 'robbery', label: 'Crime & Robbery', icon: ShieldAlert, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  { id: 'judicial', label: 'Judicial & Law', icon: Scale, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { id: 'tech', label: 'Technology & Science', icon: Activity, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  { id: 'world', label: 'Global Events', icon: Radio, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
];

export function CosmicNewsInformerTool() {
  const [selectedCategory, setSelectedCategory] = useState<string>('world');
  const [customTopic, setCustomTopic] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setContent('');
    
    const categoryLabel = NEWS_CATEGORIES.find(c => c.id === selectedCategory)?.label || selectedCategory;
    const topicFocus = customTopic.trim() 
      ? `CRITICAL INSTRUCTION: You MUST strictly and exclusively focus on news directly related to "${customTopic}". Ensure all 3-4 stories are about "${customTopic}".` 
      : '';
    
    try {
      const fullPrompt = `Act as the "GOCOSMIC News Informer", a premier, highly-detailed news anchor AI. 
Provide a comprehensive news bulletin for the category: "${categoryLabel}". 
${topicFocus}

Format the response beautifully using Markdown. Include:
- A catchy main headline
- 3-4 detailed news stories or reports related to the given topic/category (use realistic, historically significant, or highly plausible current events)
- Use subheadings for each story
- Include a "GOCOSMIC Perspective" or "Global Impact" summary at the end.

Maintain a professional, engaging, and slightly futuristic journalistic tone.`;
      
      const result = await geminiService.chat([], fullPrompt);
      setContent(result || '');
    } catch (error) {
      console.error(error);
      setContent("We're experiencing static on the cosmic frequency. Unable to fetch the news at this moment.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col gap-6 relative">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
          display: flex;
          width: max-content;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* News Ticker / Cross Bar */}
      <div className="w-full bg-emerald-950/40 border-y border-emerald-500/20 py-2.5 overflow-hidden flex items-center relative shrink-0">
        <div className="absolute left-0 top-0 bottom-0 bg-zinc-950 px-4 flex items-center gap-2 font-bold text-emerald-400 text-xs uppercase tracking-widest z-10 border-r border-emerald-500/20 shadow-[10px_0_20px_rgba(0,0,0,0.8)]">
          <Radio className="w-4 h-4 animate-pulse" />
          GOCOSMIC Updates
        </div>
        <div className="animate-marquee pl-[180px]">
          <div className="flex items-center whitespace-nowrap">
            <span className="text-emerald-100/80 text-sm mx-6">BREAKING: Mars colony reports record harvest...</span>
            <span className="text-emerald-500/50 text-sm mx-2">•</span>
            <span className="text-emerald-100/80 text-sm mx-6">SPORTS: Orion Nebula team wins the cosmic cup...</span>
            <span className="text-emerald-500/50 text-sm mx-2">•</span>
            <span className="text-emerald-100/80 text-sm mx-6">ECONOMY: Asteroid mining yields drop by 4%...</span>
            <span className="text-emerald-500/50 text-sm mx-2">•</span>
            <span className="text-emerald-100/80 text-sm mx-6">HERITAGE: Ancient ruins discovered on exoplanet Kepler-186f...</span>
            <span className="text-emerald-500/50 text-sm mx-2">•</span>
            <span className="text-emerald-100/80 text-sm mx-6">TECH: New faster-than-light drive prototype successfully tested...</span>
            <span className="text-emerald-500/50 text-sm mx-2">•</span>
            <span className="text-emerald-100/80 text-sm mx-6">JUDICIAL: Intergalactic court rules on asteroid property rights...</span>
            <span className="text-emerald-500/50 text-sm mx-2">•</span>
            {/* Duplicate for seamless loop */}
            <span className="text-emerald-100/80 text-sm mx-6">BREAKING: Mars colony reports record harvest...</span>
            <span className="text-emerald-500/50 text-sm mx-2">•</span>
            <span className="text-emerald-100/80 text-sm mx-6">SPORTS: Orion Nebula team wins the cosmic cup...</span>
            <span className="text-emerald-500/50 text-sm mx-2">•</span>
            <span className="text-emerald-100/80 text-sm mx-6">ECONOMY: Asteroid mining yields drop by 4%...</span>
            <span className="text-emerald-500/50 text-sm mx-2">•</span>
            <span className="text-emerald-100/80 text-sm mx-6">HERITAGE: Ancient ruins discovered on exoplanet Kepler-186f...</span>
            <span className="text-emerald-500/50 text-sm mx-2">•</span>
            <span className="text-emerald-100/80 text-sm mx-6">TECH: New faster-than-light drive prototype successfully tested...</span>
            <span className="text-emerald-500/50 text-sm mx-2">•</span>
            <span className="text-emerald-100/80 text-sm mx-6">JUDICIAL: Intergalactic court rules on asteroid property rights...</span>
            <span className="text-emerald-500/50 text-sm mx-2">•</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 h-full min-h-0 relative z-10 max-w-5xl mx-auto w-full px-4 md:px-0">
        
        {/* Input Area */}
        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 shadow-lg shrink-0">
          <div className="flex items-center gap-2 mb-6 text-zinc-100">
            <Newspaper className="w-5 h-5 text-emerald-400" />
            <h2 className="font-semibold">GOCOSMIC News Informer</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-3 uppercase tracking-wider">
                Select News Category
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {NEWS_CATEGORIES.map((category) => {
                  const Icon = category.icon;
                  const isSelected = selectedCategory === category.id;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={cn(
                        "flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all duration-200",
                        isSelected 
                          ? `${category.bg} ${category.border} shadow-lg scale-[1.02]` 
                          : "bg-zinc-950/50 border-white/5 hover:bg-zinc-800/50 hover:border-white/10 text-zinc-400"
                      )}
                    >
                      <Icon className={cn("w-6 h-6", isSelected ? category.color : "opacity-70")} />
                      <span className={cn("text-xs font-medium text-center", isSelected ? "text-zinc-100" : "")}>
                        {category.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Specific Topic (Optional)
                </label>
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                  placeholder="e.g., Olympics, Supreme Court, Stock Market..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 placeholder:text-zinc-600"
                />
              </div>
              
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full md:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Fetching News...
                  </>
                ) : (
                  <>
                    <Radio className="w-5 h-5" />
                    Broadcast News
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Output Area */}
        <div className="flex-1 bg-zinc-950/50 border border-white/5 rounded-2xl p-6 min-h-0 flex flex-col relative shadow-lg overflow-hidden">
          <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4 shrink-0">
            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" />
              Live Broadcast
            </h3>
            {content && (
              <button
                onClick={copyToClipboard}
                className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-scroll custom-scrollbar pr-2">
            {content ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="prose prose-invert prose-emerald prose-sm md:prose-base max-w-none pb-6"
              >
                <ReactMarkdown>{content}</ReactMarkdown>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-3">
                {isLoading ? (
                  <div className="space-y-4 text-center">
                    <div className="relative w-16 h-16 mx-auto">
                      <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
                      <Radio className="absolute inset-0 m-auto w-6 h-6 text-emerald-500 animate-pulse" />
                    </div>
                    <p className="text-sm animate-pulse text-emerald-400/70 font-medium tracking-widest uppercase">Tuning into frequencies...</p>
                  </div>
                ) : (
                  <>
                    <Newspaper className="w-16 h-16 opacity-10 mb-4" />
                    <p className="text-sm text-center max-w-sm">
                      Select a category above and click "Broadcast News" to receive the latest updates from the GOCOSMIC News Informer.
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
