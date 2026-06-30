import React, { useState } from 'react';
import { Loader2, Sparkles, Image as ImageIcon, Search, Download, Check } from 'lucide-react';
import { geminiService } from '@/services/gemini';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export function BannerCreatorTool() {
  const [topic, setTopic] = useState('');
  const [bannerStyle, setBannerStyle] = useState('modern poster');
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [searchInfo, setSearchInfo] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState(false);

  const STYLES = [
    'Modern Poster',
    'Cinematic Movie Poster',
    'Tech Startup Banner',
    'Vintage Advertisement',
    'Minimalist Art',
    'Neon Cyberpunk'
  ];

  const handleGenerate = async () => {
    if (!topic.trim() || isGenerating) return;
    
    setIsGenerating(true);
    setSearchInfo(null);
    setGeneratedImage(null);
    setDownloaded(false);

    try {
      // Step 1: Search the web for core information
      setStatusText('Searching Google for information...');
      const searchPrompt = `Provide a very short, punchy 1-sentence tagline or fact about "${topic}" that would look great on an advertising poster. Do not use quotation marks. Focus on impactful truth and current information.`;
      
      const searchResult = await geminiService.generateContentWithSearch(searchPrompt);
      const tagline = searchResult || topic;
      setSearchInfo(tagline);
      
      // Step 2: Generate Image
      setStatusText('Designing the visual banner...');
      const imagePrompt = `A high quality, professional ${bannerStyle.toLowerCase()} featuring the subject "${topic}". The design should cleanly integrate bold typography displaying the text: "${tagline}". Visually stunning, high resolution, perfect lighting, typography poster layout.`;
      
      const imageResult = await geminiService.generateImage(imagePrompt);
      setGeneratedImage(imageResult);
      
    } catch (error) {
      console.error(error);
      alert('Failed to generate banner. Please try again.');
    } finally {
      setIsGenerating(false);
      setStatusText('');
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    const a = document.createElement('a');
    a.href = generatedImage;
    a.download = `gocosmic-banner-${topic.replace(/\s+/g, '-').toLowerCase()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className="h-full flex flex-col gap-6 relative max-w-5xl mx-auto w-full">
      {/* Control Panel */}
      <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 shadow-lg shrink-0">
        <div className="flex items-center gap-2 mb-6 text-zinc-100">
          <ImageIcon className="w-5 h-5 text-indigo-400" />
          <h2 className="font-semibold">GOCOSMIC Banner Creator</h2>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
             <div className="flex-1">
              <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">
                Topic or Brand Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                  placeholder="e.g., Space Exploration Tech, Supernova Events, Quantum Computers..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-11 pr-4 py-3.5 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-zinc-600"
                />
                <Search className="w-5 h-5 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="w-full md:w-64">
              <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">
                Visual Style
              </label>
              <select
                value={bannerStyle}
                onChange={(e) => setBannerStyle(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                {STYLES.map(style => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-white/5">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !topic.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3.5 text-white rounded-xl font-medium transition-colors flex items-center gap-2 shadow-lg shadow-indigo-900/20"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Create Banner
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Output Panel */}
      <div className="flex-1 bg-zinc-950/50 border border-white/5 rounded-2xl p-6 shadow-lg overflow-y-scroll custom-scrollbar flex flex-col relative min-h-0">
         <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4 shrink-0">
          <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-indigo-400" />
            Generated Output
          </h3>
          {generatedImage && (
            <button
              onClick={downloadImage}
              className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-emerald-400 transition-colors"
            >
              {downloaded ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
              {downloaded ? 'Saved!' : 'Download'}
            </button>
          )}
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center text-zinc-400 space-y-4"
              >
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                  <Sparkles className="w-6 h-6 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <p className="font-medium text-indigo-300 animate-pulse">{statusText}</p>
                {searchInfo && (
                  <p className="text-sm text-zinc-500 max-w-sm text-center italic">
                    "Found: {searchInfo}"
                  </p>
                )}
              </motion.div>
            ) : generatedImage ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full flex-1 flex flex-col items-center gap-4"
              >
                <div className="flex-1 w-full bg-black/40 rounded-xl overflow-hidden border border-white/10 flex items-center justify-center p-4">
                  <img 
                    src={generatedImage} 
                    alt="Generated Banner" 
                    className="max-w-full max-h-[500px] object-contain rounded-lg shadow-2xl"
                  />
                </div>
                {searchInfo && (
                  <div className="text-center space-y-1 bg-indigo-500/10 py-3 px-6 rounded-xl border border-indigo-500/20 max-w-2xl">
                    <p className="text-xs text-indigo-400 font-medium uppercase tracking-wider">Searched Grounding Fact</p>
                    <p className="text-sm text-indigo-200">"{searchInfo}"</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center text-zinc-600 gap-4"
              >
                <ImageIcon className="w-16 h-16 opacity-10" />
                <div className="text-center max-w-sm">
                  <p className="text-sm text-zinc-400 mb-2">
                    Enter a topic to build a custom banner.
                  </p>
                  <p className="text-xs text-zinc-500">
                    The AI will search Google for core facts and automatically generate a polished typographic poster.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
