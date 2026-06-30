import React, { useState } from 'react';
import { Globe, Copy, Check, Loader2, Sparkles, Info } from 'lucide-react';
import { geminiService } from '@/services/gemini';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface ModiHighlight {
  title: string;
  content: string;
  color: 'blue' | 'emerald' | 'amber' | 'purple' | 'rose' | 'cyan';
}

interface CountryData {
  markdownContent: string;
  modiHighlights: ModiHighlight[];
}

const colorMap: Record<string, string> = {
  blue: 'bg-blue-500/10 border-blue-500/30 text-blue-100 shadow-blue-500/10',
  emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-100 shadow-emerald-500/10',
  amber: 'bg-amber-500/10 border-amber-500/30 text-amber-100 shadow-amber-500/10',
  purple: 'bg-purple-500/10 border-purple-500/30 text-purple-100 shadow-purple-500/10',
  rose: 'bg-rose-500/10 border-rose-500/30 text-rose-100 shadow-rose-500/10',
  cyan: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-100 shadow-cyan-500/10',
};

const iconColorMap: Record<string, string> = {
  blue: 'text-blue-400',
  emerald: 'text-emerald-400',
  amber: 'text-amber-400',
  purple: 'text-purple-400',
  rose: 'text-rose-400',
  cyan: 'text-cyan-400',
};

export function CosmicCountryInformerTool() {
  const [country, setCountry] = useState('');
  const [data, setData] = useState<CountryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!country.trim() || isLoading) return;
    
    setIsLoading(true);
    setData(null);
    
    try {
      const fullPrompt = `Provide a comprehensive, detailed, and cosmic-perspective analysis of the country: "${country}". 
      
You MUST return your response as a valid JSON object with exactly this structure:
{
  "markdownContent": "A detailed markdown string containing information about Development, Population, Society, Culture, Military, and Judicial working.",
  "modiHighlights": [
    {
      "title": "Title of the Modi-related detail",
      "content": "Description of Narendra Modi's relationship, visits, policies, or impact regarding this country.",
      "color": "blue" 
    }
  ]
}

Rules for 'modiHighlights':
- If the country is India, provide 3-4 highlights about his domestic policies/impact.
- If it's another country, provide 2-4 highlights about his foreign visits, diplomatic relations, or agreements with this country.
- The 'color' field MUST be exactly one of these strings: "blue", "emerald", "amber", "purple", "rose", "cyan". Use different colors for different highlights.
- If there is absolutely no relation, leave the array empty.
- Ensure the JSON is perfectly valid, with no trailing commas and properly escaped quotes.

Do NOT wrap the JSON in markdown code blocks. Return ONLY the raw JSON string.`;
      
      const result = await geminiService.chat([], fullPrompt);
      
      // Clean up potential markdown formatting from the response
      const cleanedResult = result.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(cleanedResult) as CountryData;
      
      setData(parsedData);
    } catch (error) {
      console.error(error);
      // Fallback in case of parsing error
      setData({
        markdownContent: "An error occurred while analyzing the cosmic archives. Please try again.",
        modiHighlights: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!data) return;
    const textToCopy = data.markdownContent + '\n\n' + data.modiHighlights.map(h => `### ${h.title}\n${h.content}`).join('\n\n');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col gap-6 relative">
      <div className="flex flex-col gap-6 h-full min-h-0 relative z-10 max-w-4xl mx-auto w-full">
        
        {/* Input Area */}
        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 shadow-lg shrink-0">
          <div className="flex items-center gap-2 mb-4 text-zinc-100">
            <Globe className="w-5 h-5 text-cyan-400" />
            <h2 className="font-semibold">GOCOSMIC Country Informer</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
                Enter a Nation to Analyze
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="e.g., Japan, Brazil, Ancient Rome, Wakanda..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-lg text-zinc-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 placeholder:text-zinc-600"
              />
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleGenerate}
                disabled={!country.trim() || isLoading}
                className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-cyan-900/20"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Discover Country
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Output Area */}
        <div className="flex-1 bg-zinc-950/50 border border-white/5 rounded-2xl p-6 min-h-0 flex flex-col relative shadow-lg overflow-hidden">
          <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4 shrink-0">
            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">National Archives</h3>
            {data && (
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
            {data ? (
              <div className="pb-6">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="prose prose-invert prose-cyan prose-sm md:prose-base max-w-none"
                >
                  <ReactMarkdown>{data.markdownContent}</ReactMarkdown>
                </motion.div>

                {data.modiHighlights && data.modiHighlights.length > 0 && (
                  <div className="mt-10 pt-8 border-t border-white/10">
                    <h3 className="text-xl font-semibold text-zinc-100 mb-6 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      Modi Relations & Highlights
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {data.modiHighlights.map((highlight, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className={cn(
                            "p-5 rounded-xl border shadow-lg backdrop-blur-sm",
                            colorMap[highlight.color] || colorMap.blue
                          )}
                        >
                          <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                            <Info className={cn("w-4 h-4 shrink-0", iconColorMap[highlight.color] || iconColorMap.blue)} />
                            {highlight.title}
                          </h4>
                          <p className="text-sm opacity-90 leading-relaxed">
                            {highlight.content}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-3">
                {isLoading ? (
                  <div className="space-y-3 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-cyan-500/50 mx-auto" />
                    <p className="text-sm animate-pulse">Gathering cosmic intelligence...</p>
                  </div>
                ) : (
                  <>
                    <Globe className="w-12 h-12 opacity-20 mb-2" />
                    <p className="text-sm text-center max-w-sm">
                      Enter a country name above to retrieve its complete historical, cultural, and societal records.
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
