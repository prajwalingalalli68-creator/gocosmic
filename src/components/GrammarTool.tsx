import React, { useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { BookA, Copy, Check, Loader2, Sparkles, PenTool, BookOpen, ScrollText, FileText } from 'lucide-react';
import { geminiService } from '@/services/gemini';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

const LANGUAGES = [
  { id: 'English', label: 'English' },
  { id: 'Hindi', label: 'Hindi (हिन्दी)' },
  { id: 'Kannada', label: 'Kannada (ಕನ್ನಡ)' },
  { id: 'Sanskrit', label: 'Sanskrit (संस्कृतम्)' },
  { id: 'French', label: 'French (Français)' },
  { id: 'Spanish', label: 'Spanish (Español)' },
];

const GRAMMAR_TOPICS = [
  'Parts of Speech (Nouns, Verbs, etc.)',
  'Tenses & Conjugation',
  'Sentence Structure & Syntax',
  'Punctuation & Rules',
  'Idioms & Phrases',
  'Common Mistakes & Corrections'
];

const WRITING_TOPICS = [
  'Short Story / Narrative',
  'Essay & Article Writing',
  'Poetry / Verse',
  'Formal/Informal Letter',
  'Dialogue / Script'
];

export function GrammarTool() {
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [mode, setMode] = useState<'grammar' | 'writing'>('grammar');
  const [selectedTopic, setSelectedTopic] = useState(GRAMMAR_TOPICS[0]);
  const [customPrompt, setCustomPrompt] = useState('');
  
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Auto-switch topic when mode changes
  const handleModeChange = (newMode: 'grammar' | 'writing') => {
    setMode(newMode);
    setSelectedTopic(newMode === 'grammar' ? GRAMMAR_TOPICS[0] : WRITING_TOPICS[0]);
  };

  const handleGenerate = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setContent('');
    
    const specificRequest = customPrompt.trim() ? `Specifically focus on: ${customPrompt}` : '';
    
    try {
      let fullPrompt = '';

      if (mode === 'grammar') {
        fullPrompt = `Act as an expert language teacher and linguist. 
Provide a comprehensive, easy-to-understand lesson on "${selectedTopic}" for the ${selectedLanguage} language.
${specificRequest}

Format your response in Markdown with:
- A clear introduction to the topic
- Detailed rules and explanations
- At least 3-5 illustrative examples (with translations if the language is not English)
- Common pitfalls or exceptions to the rules
Make it structured, educational, and engaging.`;
      } else {
        fullPrompt = `Act as an expert creative writer and poet. 
Write a high-quality piece of creative writing in the ${selectedLanguage} language.
Category: "${selectedTopic}".
${specificRequest}

If the writing is not in English, provide the original text first, followed by a beautiful English translation below it.
Format your response beautifully in Markdown. Ensure the tone and vocabulary are rich and expressive.`;
      }
      
      const result = await geminiService.chat([], fullPrompt);
      setContent(result || '');
    } catch (error) {
      console.error(error);
      setContent("An error occurred while consulting the language archives. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPDF = () => {
    if (!content || !contentRef.current) return;
    
    // Create a print-friendly element to format markdown visually
    const printElement = document.createElement('div');
    printElement.innerHTML = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2 style="color: ${mode === 'grammar' ? '#4f46e5' : '#e11d48'}; margin-bottom: 20px;">
          GOCOSMIC ${mode === 'grammar' ? 'Grammar Lesson: ' : 'Creative Writing: '}${selectedTopic}
        </h2>
        <div style="color: #333; line-height: 1.6;">
          ${contentRef.current.innerHTML}
        </div>
      </div>
    `;
    
    const opt = {
      margin:       0.5,
      filename:     `gocosmic-${mode}-${selectedLanguage.toLowerCase()}.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' as const }
    };
    
    html2pdf().set(opt).from(printElement).save();
  };

  return (
    <div className="h-full flex flex-col gap-6 relative">
      <div className="flex flex-col gap-6 h-full min-h-0 relative z-10 max-w-5xl mx-auto w-full">
        
        {/* Input Area */}
        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 shadow-lg shrink-0">
          <div className="flex items-center gap-2 mb-6 text-zinc-100">
            <BookA className="w-5 h-5 text-indigo-400" />
            <h2 className="font-semibold">GOCOSMIC Grammar & Writing</h2>
          </div>
          
          <div className="space-y-6">
            
            {/* Top row: Language & Mode */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">
                  Target Language
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                >
                  {LANGUAGES.map(lang => (
                    <option key={lang.id} value={lang.id}>{lang.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">
                  Mode
                </label>
                <div className="flex bg-zinc-950 rounded-xl p-1 border border-zinc-800">
                  <button
                    onClick={() => handleModeChange('grammar')}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all",
                      mode === 'grammar' 
                        ? "bg-indigo-500/20 text-indigo-300 shadow-sm" 
                        : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50"
                    )}
                  >
                    <BookOpen className="w-4 h-4" />
                    Grammar Rules
                  </button>
                  <button
                    onClick={() => handleModeChange('writing')}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all",
                      mode === 'writing' 
                        ? "bg-rose-500/20 text-rose-300 shadow-sm" 
                        : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50"
                    )}
                  >
                    <PenTool className="w-4 h-4" />
                    Creative Writing
                  </button>
                </div>
              </div>
            </div>

            {/* Topics */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-3 uppercase tracking-wider">
                {mode === 'grammar' ? 'Grammar Category' : 'Writing Category'}
              </label>
              <div className="flex flex-wrap gap-2">
                {(mode === 'grammar' ? GRAMMAR_TOPICS : WRITING_TOPICS).map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setSelectedTopic(topic)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-sm transition-all border",
                      selectedTopic === topic
                        ? mode === 'grammar'
                          ? "bg-indigo-500/20 border-indigo-500/30 text-indigo-200"
                          : "bg-rose-500/20 border-rose-500/30 text-rose-200"
                        : "bg-zinc-950/50 border-white/5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                    )}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Prompt & Action */}
            <div className="flex flex-col md:flex-row gap-4 items-end pt-2 border-t border-white/5">
              <div className="flex-1 w-full">
                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Specific Request (Optional)
                </label>
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                  placeholder={mode === 'grammar' ? "e.g., Difference between past perfect and past simple..." : "e.g., A poem about a rainy night in Bangalore..."}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-zinc-600"
                />
              </div>
              
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className={cn(
                  "w-full md:w-auto px-8 py-4 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg",
                  mode === 'grammar' 
                    ? "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-900/20" 
                    : "bg-rose-600 hover:bg-rose-500 shadow-rose-900/20"
                )}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    {mode === 'grammar' ? 'Learn Grammar' : 'Generate Writing'}
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
              <ScrollText className="w-4 h-4 text-indigo-400" />
              {mode === 'grammar' ? 'Grammar Lesson Document' : 'Creative Composition'}
            </h3>
            <div className="flex gap-2">
              {content && (
                <>
                  <button
                    onClick={copyToClipboard}
                    className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                  <button
                    onClick={handleExportPDF}
                    className={cn(
                      "text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white transition-colors shadow-lg",
                      mode === 'grammar' ? "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-900/20" : "bg-rose-600 hover:bg-rose-500 shadow-rose-900/20"
                    )}
                  >
                    <FileText className="w-3 h-3" />
                    PDF
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-scroll custom-scrollbar pr-2">
            {content ? (
              <motion.div 
                ref={contentRef}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "prose prose-invert prose-sm md:prose-base max-w-none pb-6",
                  mode === 'grammar' ? "prose-indigo" : "prose-rose"
                )}
              >
                <ReactMarkdown>{content}</ReactMarkdown>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-3">
                {isLoading ? (
                  <div className="space-y-4 text-center">
                    <Loader2 className={cn(
                      "w-8 h-8 animate-spin mx-auto",
                      mode === 'grammar' ? "text-indigo-500/50" : "text-rose-500/50"
                    )} />
                    <p className="text-sm animate-pulse">Drafting content...</p>
                  </div>
                ) : (
                  <>
                    <BookA className="w-16 h-16 opacity-10 mb-4" />
                    <p className="text-sm text-center max-w-sm">
                      Select a language, choose your mode (Grammar or Creative Writing), and generate detailed content.
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
