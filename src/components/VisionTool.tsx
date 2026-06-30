import React, { useState, useRef } from 'react';
import { Eye, Upload, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { geminiService } from '@/services/gemini';
import ReactMarkdown from 'react-markdown';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export function VisionTool() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('Describe this image in detail.');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage || !prompt || isLoading) return;

    setIsLoading(true);
    try {
      const result = await geminiService.analyzeImage(selectedImage, prompt);
      setAnalysis(result);
    } catch (error) {
      console.error(error);
      setAnalysis("Error analyzing image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-6 relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-0 relative z-10">
        
        {/* Left Column: Input */}
        <div className="flex flex-col gap-4 min-h-0">
          <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 flex-1 flex flex-col min-h-0 shadow-lg">
            <div className="flex items-center gap-2 mb-6 text-zinc-100">
              <Eye className="w-5 h-5 text-emerald-400" />
              <h2 className="font-semibold">Vision Analysis</h2>
            </div>

            {/* Image Upload Area */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-4 transition-all cursor-pointer relative overflow-hidden group min-h-[200px]",
                selectedImage 
                  ? "border-emerald-500/30 bg-zinc-950" 
                  : "border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/30"
              )}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
              />
              
              {selectedImage ? (
                <img 
                  src={selectedImage} 
                  alt="Preview" 
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              ) : (
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6 text-zinc-500 group-hover:text-zinc-300" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-zinc-300">Click to upload image</p>
                    <p className="text-xs text-zinc-500">JPG, PNG, WEBP up to 10MB</p>
                  </div>
                </div>
              )}

              {selectedImage && (
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <p className="text-white font-medium text-sm flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Change Image
                  </p>
                </div>
              )}
            </div>

            {/* Prompt Input */}
            <div className="mt-6 space-y-3">
              <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider">Question / Prompt</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
                  placeholder="What's in this image?"
                />
                <button
                  onClick={handleAnalyze}
                  disabled={!selectedImage || !prompt || isLoading}
                  className="px-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                  Analyze
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="bg-zinc-950/50 border border-white/5 rounded-2xl p-6 flex flex-col min-h-0 overflow-hidden shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Analysis Result</h3>
            {analysis && (
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Complete
              </span>
            )}
          </div>
          
          <div className="flex-1 overflow-y-scroll custom-scrollbar bg-zinc-900/30 rounded-xl p-4 border border-white/5">
            {analysis ? (
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{analysis}</ReactMarkdown>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-3">
                {isLoading ? (
                  <>
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-500/50" />
                    <p className="text-sm animate-pulse">Analyzing visual data...</p>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-8 h-8 opacity-20" />
                    <p className="text-sm">Upload an image and click Analyze to see results</p>
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
