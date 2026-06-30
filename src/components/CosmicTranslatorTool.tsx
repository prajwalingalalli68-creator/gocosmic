import React, { useState } from 'react';
import { Languages, Copy, Check, Loader2, Sparkles, ChevronDown, ArrowRightLeft } from 'lucide-react';
import { geminiService } from '@/services/gemini';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

const WORLD_LANGUAGES = [
  "Afrikaans", "Albanian", "Amharic", "Arabic", "Armenian", "Azerbaijani", "Basque", "Belarusian", "Bengali", "Bosnian", "Bulgarian", "Catalan", "Cebuano", "Chichewa", "Chinese (Simplified)", "Chinese (Traditional)", "Corsican", "Croatian", "Czech", "Danish", "Dutch", "English", "Esperanto", "Estonian", "Filipino", "Finnish", "French", "Frisian", "Galician", "Georgian", "German", "Greek", "Gujarati", "Haitian Creole", "Hausa", "Hawaiian", "Hebrew", "Hindi", "Hmong", "Hungarian", "Icelandic", "Igbo", "Indonesian", "Irish", "Italian", "Japanese", "Javanese", "Kannada", "Kazakh", "Khmer", "Kinyarwanda", "Korean", "Kurdish (Kurmanji)", "Kyrgyz", "Lao", "Latin", "Latvian", "Lithuanian", "Luxembourgish", "Macedonian", "Malagasy", "Malay", "Malayalam", "Maltese", "Maori", "Marathi", "Mongolian", "Myanmar (Burmese)", "Nepali", "Norwegian", "Odia (Oriya)", "Pashto", "Persian", "Polish", "Portuguese", "Punjabi", "Romanian", "Russian", "Samoan", "Scots Gaelic", "Serbian", "Sesotho", "Shona", "Sindhi", "Sinhala", "Slovak", "Slovenian", "Somali", "Spanish", "Sundanese", "Swahili", "Swedish", "Tajik", "Tamil", "Tatar", "Telugu", "Thai", "Turkish", "Turkmen", "Ukrainian", "Urdu", "Uyghur", "Uzbek", "Vietnamese", "Welsh", "Xhosa", "Yiddish", "Yoruba", "Zulu"
];

const COSMIC_LANGUAGES = [
  "Klingon (Star Trek)", "High Valyrian (Game of Thrones)", "Dothraki (Game of Thrones)", "Sindarin (Elvish)", "Quenya (Elvish)", "Binary Code", "Morse Code", "Mandalorian (Star Wars)", "Na'vi (Avatar)", "Vulcan (Star Trek)", "Minionese", "Groot"
];

export function CosmicTranslatorTool() {
  const [text, setText] = useState('');
  
  const [sourceLanguage, setSourceLanguage] = useState('Auto Detect');
  const [customSourceLanguage, setCustomSourceLanguage] = useState('');
  
  const [targetLanguage, setTargetLanguage] = useState('');
  const [customTargetLanguage, setCustomTargetLanguage] = useState('');
  
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const finalSource = sourceLanguage === 'custom' ? customSourceLanguage : sourceLanguage;
  const finalTarget = targetLanguage === 'custom' ? customTargetLanguage : targetLanguage;

  const handleGenerate = async () => {
    if (!text.trim() || !finalTarget.trim() || isLoading) return;
    
    setIsLoading(true);
    setContent('');
    
    try {
      const fullPrompt = `Translate the following text from ${finalSource} to ${finalTarget}. 
Note: The languages can be any language in the universe, including real human languages, fictional languages (like Klingon, Elvish, Dothraki), or conceptual cosmic languages. 
Provide the translation, a pronunciation guide (if applicable), and a brief interesting fact about the language or the translation itself. Format the response beautifully using Markdown.

Text to translate:
"${text}"`;
      
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

  const swapLanguages = () => {
    if (sourceLanguage !== 'Auto Detect') {
      const tempSource = sourceLanguage;
      const tempCustomSource = customSourceLanguage;
      
      setSourceLanguage(targetLanguage || 'Auto Detect');
      setCustomSourceLanguage(customTargetLanguage);
      
      setTargetLanguage(tempSource);
      setCustomTargetLanguage(tempCustomSource);
    }
  };

  return (
    <div className="h-full flex flex-col gap-6 relative">
      <div className="flex flex-col gap-6 h-full min-h-0 relative z-10 max-w-4xl mx-auto w-full">
        
        {/* Input Area */}
        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-6 text-zinc-100">
            <Languages className="w-5 h-5 text-amber-400" />
            <h2 className="font-semibold">GOCOSMIC Translator</h2>
          </div>
          
          <div className="space-y-6">
            {/* Language Selection Row */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              {/* Translate From */}
              <div className="flex-1 w-full space-y-3">
                <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Translate From
                </label>
                <div className="relative">
                  <select
                    value={sourceLanguage}
                    onChange={(e) => setSourceLanguage(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 pr-12 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 appearance-none cursor-pointer"
                  >
                    <option value="Auto Detect">✨ Auto Detect</option>
                    <optgroup label="GOCOSMIC & Fictional">
                      {COSMIC_LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                    </optgroup>
                    <optgroup label="World Languages">
                      {WORLD_LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                    </optgroup>
                    <option value="custom">Other (Specify custom language...)</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </div>
                
                {sourceLanguage === 'custom' && (
                  <motion.input
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    type="text"
                    value={customSourceLanguage}
                    onChange={(e) => setCustomSourceLanguage(e.target.value)}
                    placeholder="Enter source language..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 placeholder:text-zinc-600"
                  />
                )}
              </div>

              {/* Swap Button */}
              <div className="hidden md:flex pt-6 justify-center">
                <button 
                  onClick={swapLanguages}
                  disabled={sourceLanguage === 'Auto Detect'}
                  className="p-3 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Swap languages"
                >
                  <ArrowRightLeft className="w-5 h-5" />
                </button>
              </div>

              {/* Translate To */}
              <div className="flex-1 w-full space-y-3">
                <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Translate To
                </label>
                <div className="relative">
                  <select
                    value={targetLanguage}
                    onChange={(e) => setTargetLanguage(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 pr-12 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select a language...</option>
                    <optgroup label="GOCOSMIC & Fictional">
                      {COSMIC_LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                    </optgroup>
                    <optgroup label="World Languages">
                      {WORLD_LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                    </optgroup>
                    <option value="custom">Other (Specify custom language...)</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </div>
                
                {targetLanguage === 'custom' && (
                  <motion.input
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    type="text"
                    value={customTargetLanguage}
                    onChange={(e) => setCustomTargetLanguage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    placeholder="Enter target language..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 placeholder:text-zinc-600"
                  />
                )}
              </div>
            </div>

            {/* Text Area */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
                Text to Translate
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g., Hello, how are you doing today?"
                className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 resize-none placeholder:text-zinc-600"
              />
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleGenerate}
                disabled={!text.trim() || !finalTarget.trim() || isLoading}
                className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-amber-900/20"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Translating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Translate
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Output Area */}
        <div className="flex-1 bg-zinc-950/50 border border-white/5 rounded-2xl p-6 min-h-0 flex flex-col relative shadow-lg overflow-hidden">
          <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Translation Result</h3>
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
                className="prose prose-invert prose-amber prose-sm md:prose-base max-w-none"
              >
                <ReactMarkdown>{content}</ReactMarkdown>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-3">
                {isLoading ? (
                  <div className="space-y-3 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-amber-500/50 mx-auto" />
                    <p className="text-sm animate-pulse">Bridging cosmic languages...</p>
                  </div>
                ) : (
                  <>
                    <Languages className="w-12 h-12 opacity-20 mb-2" />
                    <p className="text-sm text-center max-w-sm">
                      Select your languages, enter text, and translate across the universe.
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
