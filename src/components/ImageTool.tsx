import React, { useState } from 'react';
import { Image as ImageIcon, Download, Sparkles, Loader2 } from 'lucide-react';
import { geminiService } from '@/services/gemini';
import { motion } from 'motion/react';

export function ImageTool() {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setGeneratedImage(null);
    setError(null);

    try {
      const base64Image = await geminiService.generateImage(prompt);
      setGeneratedImage(base64Image);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col items-center overflow-y-scroll pb-10 relative">
      <div className="w-full max-w-2xl flex flex-col gap-4 mt-6 relative z-10">
        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4 text-zinc-100">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h2 className="font-semibold">Image Generation</h2>
          </div>
          
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the image you want to create..."
                className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 resize-none placeholder:text-zinc-600"
              />
            </div>
            
            <button
              type="submit"
              disabled={!prompt.trim() || isLoading}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-900/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Image
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5 flex flex-col items-center justify-center min-h-[300px] relative">
            {isLoading ? (
              <div className="text-center text-zinc-600 flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-purple-500/50" />
                  </div>
                </div>
                <p className="text-sm">Creating your masterpiece...</p>
              </div>
            ) : error ? (
              error.includes("PREMIUM_MODEL_REQUIRED") ? (
                <div className="text-left flex flex-col gap-4 p-6 bg-amber-500/10 rounded-xl border border-amber-500/20 max-w-md w-full animate-fadeIn">
                  <div className="flex items-center gap-2 text-amber-400">
                    <Sparkles className="w-5 h-5" />
                    <span className="font-semibold text-sm">Paid API Key Required</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Image generation models (like <code className="px-1.5 py-0.5 bg-zinc-950 rounded text-amber-300 font-mono text-[10px]">gemini-3.1-flash-image</code>) require a Paid API Key with active billing.
                  </p>
                  <div className="space-y-2 text-xs text-zinc-400">
                    <p className="font-medium text-zinc-300">How to activate image generation:</p>
                    <ol className="list-decimal pl-4 space-y-1">
                      <li>Open the <span className="text-zinc-200 font-medium">Settings (Gear Icon)</span> in AI Studio.</li>
                      <li>Go to the <span className="text-zinc-200 font-medium">Secrets</span> panel.</li>
                      <li>Enable the <span className="text-zinc-200 font-medium">Paid Model Flow</span> to link your billing account.</li>
                    </ol>
                  </div>
                  <p className="text-[10px] text-zinc-500 italic mt-1">
                    Once billing is set up, AI Studio will automatically configure the required credentials for this workspace.
                  </p>
                </div>
              ) : (
                <div className="text-center text-red-400 flex flex-col items-center gap-4 p-6 bg-red-500/10 rounded-xl border border-red-500/20">
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )
            ) : generatedImage ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group w-full flex justify-center"
              >
                <img 
                  src={generatedImage} 
                  alt="Generated" 
                  className="max-w-full rounded-lg shadow-2xl border border-white/10"
                />
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a 
                    href={generatedImage} 
                    download={`generated-${Date.now()}.png`}
                    className="p-2 bg-black/50 hover:bg-black/70 backdrop-blur-md text-white rounded-lg border border-white/10 flex items-center gap-2 text-xs font-medium transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Save
                  </a>
                </div>
              </motion.div>
            ) : (
              <div className="text-center text-zinc-600 flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 opacity-20" />
                </div>
                <p className="text-sm">Your masterpiece will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
