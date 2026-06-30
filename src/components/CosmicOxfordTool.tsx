import React, { useState } from 'react';
import { BookOpen, Copy, Check, Loader2, Sparkles } from 'lucide-react';
import { geminiService } from '@/services/gemini';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

export function CosmicOxfordTool() {
  const [word, setWord] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!word.trim() || isLoading) return;
    
    setIsLoading(true);
    setContent('');
    
    try {
      const fullPrompt = `Define the word '${word}' in a stylish, elegant, and slightly cosmic or profound manner. Include its part of speech, origin (if interesting), and a poetic or stylish example sentence. Format using Markdown.`;
      const result = await geminiService.chat([], fullPrompt);
      setContent(result || '');
    } catch (error) {
      console.error(error);
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
      <div className="flex flex-col gap-6 h-full min-h-0 relative z-10 max-w-4xl mx-auto w-full">
        
        {/* Input Area */}
        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4 text-zinc-100">
            <BookOpen className="w-5 h-5 text-violet-400" />
            <h2 className="font-semibold">GOCOSMIC Oxford Dictionary</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
                Enter a word to discover its cosmic meaning
              </label>
              <input
                type="text"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="e.g., Serendipity, Ephemeral, Luminous..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-lg text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 placeholder:text-zinc-600"
              />
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleGenerate}
                disabled={!word.trim() || isLoading}
                className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-violet-900/20"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Discovering...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Discover Meaning
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Output Area */}
        <div className="flex-1 bg-zinc-950/50 border border-white/5 rounded-2xl p-6 min-h-0 flex flex-col relative shadow-lg overflow-hidden">
          <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">GOCOSMIC Definition</h3>
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

          <div className="flex-1 overflow-y-scroll custom-scrollbar">
            {content ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="prose prose-invert prose-violet prose-sm md:prose-base max-w-none"
              >
                <ReactMarkdown>{content}</ReactMarkdown>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-3">
                {isLoading ? (
                  <div className="space-y-3 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-violet-500/50 mx-auto" />
                    <p className="text-sm animate-pulse">Consulting the cosmic archives...</p>
                  </div>
                ) : (
                  <>
                    <BookOpen className="w-12 h-12 opacity-20 mb-2" />
                    <p className="text-sm text-center max-w-sm">
                      Enter a word above to reveal its elegant and profound meaning across the cosmos.
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
