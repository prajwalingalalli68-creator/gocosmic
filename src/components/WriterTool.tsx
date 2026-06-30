import React, { useState } from 'react';
import { PenTool, Copy, Check, Loader2, FileText, Mail, Code, List } from 'lucide-react';
import { geminiService } from '@/services/gemini';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

type TemplateId = 'blog' | 'email' | 'code' | 'summary';

const TEMPLATES = [
  { id: 'blog', label: 'Blog Post', icon: FileText, prompt: 'Write a comprehensive blog post about: ' },
  { id: 'email', label: 'Professional Email', icon: Mail, prompt: 'Write a professional email about: ' },
  { id: 'code', label: 'Code Snippet', icon: Code, prompt: 'Write code for: ' },
  { id: 'summary', label: 'Summarize', icon: List, prompt: 'Summarize the following text: ' },
];

export function WriterTool() {
  const [activeTemplate, setActiveTemplate] = useState<TemplateId>('blog');
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim() || isLoading) return;
    
    setIsLoading(true);
    setContent('');
    
    try {
      const template = TEMPLATES.find(t => t.id === activeTemplate);
      const fullPrompt = `${template?.prompt} ${topic}`;
      const result = await geminiService.chat([], fullPrompt); // Stateless call
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-0 relative z-10">
        
        {/* Sidebar / Template Selector */}
        <div className="lg:col-span-3 flex flex-col gap-2">
          <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-4 h-full">
            <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-4 px-2">Templates</h3>
            <div className="space-y-1">
              {TEMPLATES.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTemplate(t.id as TemplateId)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-sm font-medium",
                      activeTemplate === t.id
                        ? "bg-orange-600/10 text-orange-400 border border-orange-500/20"
                        : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9 flex flex-col gap-4 min-h-0">
          {/* Input Area */}
          <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4 text-zinc-100">
              <PenTool className="w-5 h-5 text-orange-400" />
              <h2 className="font-semibold">Content Generator</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
                  {activeTemplate === 'summary' ? 'Text to Summarize' : 'Topic / Description'}
                </label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={activeTemplate === 'summary' ? "Paste text here..." : "e.g., The future of AI in healthcare..."}
                  className="w-full h-24 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 resize-none placeholder:text-zinc-600"
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleGenerate}
                  disabled={!topic.trim() || isLoading}
                  className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-orange-900/20"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Writing...
                    </>
                  ) : (
                    <>
                      <PenTool className="w-4 h-4" />
                      Generate Content
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Output Area */}
          <div className="flex-1 bg-zinc-950/50 border border-white/5 rounded-2xl p-6 min-h-0 flex flex-col relative shadow-lg overflow-hidden">
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
              <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Generated Output</h3>
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
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-3">
                  {isLoading ? (
                    <div className="space-y-3 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-orange-500/50 mx-auto" />
                      <p className="text-sm animate-pulse">Crafting your content...</p>
                    </div>
                  ) : (
                    <>
                      <FileText className="w-8 h-8 opacity-20" />
                      <p className="text-sm">Content will appear here</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
