import React, { useState, useRef, useEffect } from 'react';
import { 
  MonitorPlay, 
  Plus, 
  Type, 
  Square, 
  Circle, 
  Image as ImageIcon, 
  Download, 
  Settings2,
  Trash2,
  Copy,
  Wand2,
  Loader2,
  LayoutTemplate,
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Type as GenAIType } from '@google/genai';

type TransitionType = 'none' | 'fade' | 'slide-left' | 'slide-right';

interface SlideElement {
  id: string;
  type: 'text' | 'shape' | 'image';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  fontSize?: number;
  textAlign?: 'left' | 'center' | 'right';
}

interface Slide {
  id: string;
  elements: SlideElement[];
  background: string;
}

interface SlideOutline {
  id: string;
  title: string;
  description: string;
  imageKeyword: string;
}

export function PresentatorTool() {
  const [step, setStep] = useState<'topic' | 'outline' | 'presentation'>('topic');
  const [topic, setTopic] = useState('');
  const [slideCount, setSlideCount] = useState(5);
  const [outline, setOutline] = useState<SlideOutline[]>([]);
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [isGeneratingPresentation, setIsGeneratingPresentation] = useState(false);

  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isEditingText, setIsEditingText] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transitionType, setTransitionType] = useState<TransitionType>('fade');

  const slideRef = useRef<HTMLDivElement>(null);
  const currentSlide = slides[currentSlideIndex];

  const generateOutline = async () => {
    if (!topic.trim()) return;
    
    setIsGeneratingOutline(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Create a ${slideCount}-slide presentation outline about: ${topic}. Return a JSON array of exactly ${slideCount} slides. Each slide should have a 'title', a 'description' (bullet points or short paragraph of what the slide will cover), and an 'imageKeyword' (a single word to search for an image related to the slide).`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: GenAIType.ARRAY,
            items: {
              type: GenAIType.OBJECT,
              properties: {
                title: { type: GenAIType.STRING },
                description: { type: GenAIType.STRING },
                imageKeyword: { type: GenAIType.STRING }
              },
              required: ['title', 'description', 'imageKeyword']
            }
          }
        }
      });

      const jsonText = response.text;
      if (jsonText) {
        const generatedOutline = JSON.parse(jsonText);
        setOutline(generatedOutline.map((item: any) => ({
          ...item,
          id: Date.now().toString() + Math.random()
        })));
        setStep('outline');
      }
    } catch (error) {
      console.error('Failed to generate outline:', error);
      alert('Failed to generate outline. Please try again.');
    } finally {
      setIsGeneratingOutline(false);
    }
  };

  const generatePresentationFromOutline = async () => {
    setIsGeneratingPresentation(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Create a detailed presentation based on this outline: ${JSON.stringify(outline)}. 
        Return a JSON array of slides. Each slide should have a background color (hex code), and an array of elements. 
        Elements can be text (title, subtitle, body) or images. 
        For images, use type: 'image' and set content to 'https://picsum.photos/seed/[imageKeyword]/400/300' where [imageKeyword] is the keyword from the outline.
        Provide appropriate x, y, width, height, fontSize, color, and textAlign for each element to make it look like a professional presentation. The canvas size is 800x450.
        Make sure to include the image element if the outline has an imageKeyword.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: GenAIType.ARRAY,
            items: {
              type: GenAIType.OBJECT,
              properties: {
                background: { type: GenAIType.STRING },
                elements: {
                  type: GenAIType.ARRAY,
                  items: {
                    type: GenAIType.OBJECT,
                    properties: {
                      type: { type: GenAIType.STRING },
                      content: { type: GenAIType.STRING },
                      x: { type: GenAIType.NUMBER },
                      y: { type: GenAIType.NUMBER },
                      width: { type: GenAIType.NUMBER },
                      height: { type: GenAIType.NUMBER },
                      color: { type: GenAIType.STRING },
                      fontSize: { type: GenAIType.NUMBER },
                      textAlign: { type: GenAIType.STRING }
                    },
                    required: ['type', 'content', 'x', 'y', 'width', 'height']
                  }
                }
              },
              required: ['background', 'elements']
            }
          }
        }
      });

      const jsonText = response.text;
      if (jsonText) {
        const generatedSlides = JSON.parse(jsonText);
        const newSlides: Slide[] = generatedSlides.map((slide: any) => ({
          id: Date.now().toString() + Math.random(),
          background: slide.background || '#ffffff',
          elements: slide.elements.map((el: any) => ({
            id: Date.now().toString() + Math.random(),
            type: el.type === 'shape' || el.type === 'image' ? el.type : 'text',
            content: el.content,
            x: el.x,
            y: el.y,
            width: el.width,
            height: el.height,
            color: el.color || '#000000',
            fontSize: el.fontSize || 24,
            textAlign: el.textAlign || 'left'
          }))
        }));
        
        setSlides(newSlides);
        setCurrentSlideIndex(0);
        setStep('presentation');
      }
    } catch (error) {
      console.error('Failed to generate presentation:', error);
      alert('Failed to generate presentation. Please try again.');
    } finally {
      setIsGeneratingPresentation(false);
    }
  };

  const updateOutlineSlide = (id: string, updates: Partial<SlideOutline>) => {
    setOutline(outline.map(slide => slide.id === id ? { ...slide, ...updates } : slide));
  };

  const deleteOutlineSlide = (id: string) => {
    setOutline(outline.filter(slide => slide.id !== id));
  };

  const addOutlineSlide = () => {
    setOutline([...outline, {
      id: Date.now().toString(),
      title: 'New Slide',
      description: 'Description of the new slide',
      imageKeyword: 'abstract'
    }]);
  };

  const addSlide = () => {
    const newSlide: Slide = {
      id: Date.now().toString(),
      background: '#ffffff',
      elements: []
    };
    setSlides([...slides, newSlide]);
    setCurrentSlideIndex(slides.length);
  };

  const deleteSlide = (index: number) => {
    if (slides.length <= 1) return;
    const newSlides = slides.filter((_, i) => i !== index);
    setSlides(newSlides);
    if (currentSlideIndex >= newSlides.length) {
      setCurrentSlideIndex(newSlides.length - 1);
    }
  };

  const duplicateSlide = (index: number) => {
    const slideToCopy = slides[index];
    const newSlide: Slide = {
      ...slideToCopy,
      id: Date.now().toString(),
      elements: slideToCopy.elements.map(el => ({ ...el, id: Date.now().toString() + Math.random() }))
    };
    const newSlides = [...slides];
    newSlides.splice(index + 1, 0, newSlide);
    setSlides(newSlides);
    setCurrentSlideIndex(index + 1);
  };

  const addTextElement = () => {
    const newElement: SlideElement = {
      id: Date.now().toString(),
      type: 'text',
      content: 'New Text',
      x: 50,
      y: 50,
      width: 300,
      height: 50,
      fontSize: 24,
      color: '#000000',
      textAlign: 'left'
    };
    updateCurrentSlide([...currentSlide.elements, newElement]);
    setSelectedElementId(newElement.id);
  };

  const addShapeElement = (shapeType: 'square' | 'circle') => {
    const newElement: SlideElement = {
      id: Date.now().toString(),
      type: 'shape',
      content: shapeType,
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      color: '#3b82f6'
    };
    updateCurrentSlide([...currentSlide.elements, newElement]);
    setSelectedElementId(newElement.id);
  };

  const updateCurrentSlide = (newElements: SlideElement[]) => {
    const newSlides = [...slides];
    newSlides[currentSlideIndex] = {
      ...currentSlide,
      elements: newElements
    };
    setSlides(newSlides);
  };

  const updateElement = (id: string, updates: Partial<SlideElement>) => {
    const newElements = currentSlide.elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    );
    updateCurrentSlide(newElements);
  };

  const deleteSelectedElement = () => {
    if (!selectedElementId) return;
    const newElements = currentSlide.elements.filter(el => el.id !== selectedElementId);
    updateCurrentSlide(newElements);
    setSelectedElementId(null);
  };

  // Basic drag implementation
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent, id: string) => {
    if (isEditingText) return;
    e.stopPropagation();
    setSelectedElementId(id);
    setIsDragging(true);
    
    const el = currentSlide.elements.find(e => e.id === id);
    if (el && slideRef.current) {
      const rect = slideRef.current.getBoundingClientRect();
      const scaleX = rect.width / 800;
      const scaleY = rect.height / 450;
      
      setDragOffset({
        x: (e.clientX - rect.left) / scaleX - el.x,
        y: (e.clientY - rect.top) / scaleY - el.y
      });
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !selectedElementId || !slideRef.current) return;
    
    const rect = slideRef.current.getBoundingClientRect();
    const scaleX = rect.width / 800;
    const scaleY = rect.height / 450;

    const newX = (e.clientX - rect.left) / scaleX - dragOffset.x;
    const newY = (e.clientY - rect.top) / scaleY - dragOffset.y;

    updateElement(selectedElementId, { x: newX, y: newY });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElementId && !isEditingText) {
          deleteSelectedElement();
        }
      }
      if (e.key === 'Escape') {
        if (isPlaying) setIsPlaying(false);
        setSelectedElementId(null);
        setIsEditingText(false);
      }
      if (isPlaying) {
        if (e.key === 'ArrowRight' || e.key === 'Space') {
          setCurrentSlideIndex(i => Math.min(slides.length - 1, i + 1));
        } else if (e.key === 'ArrowLeft') {
          setCurrentSlideIndex(i => Math.max(0, i - 1));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, isEditingText, isPlaying, slides.length]);

  const getTransitionVariants = () => {
    switch (transitionType) {
      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 }
        };
      case 'slide-left':
        return {
          initial: { x: '100%' },
          animate: { x: 0 },
          exit: { x: '-100%' }
        };
      case 'slide-right':
        return {
          initial: { x: '-100%' },
          animate: { x: 0 },
          exit: { x: '100%' }
        };
      case 'none':
      default:
        return {
          initial: { opacity: 1 },
          animate: { opacity: 1 },
          exit: { opacity: 1 }
        };
    }
  };

  if (step === 'topic') {
    return (
      <div className="flex flex-col items-center h-full p-8 bg-zinc-950/50 rounded-2xl border border-white/5 relative overflow-y-scroll custom-scrollbar">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-900/20 via-rose-900/10 to-transparent pointer-events-none" />
        <div className="z-10 w-full max-w-2xl flex flex-col items-center my-auto py-8">
          <div className="w-16 h-16 bg-pink-500/20 rounded-2xl flex items-center justify-center mb-6 border border-pink-500/30 shadow-lg shadow-pink-500/20">
            <LayoutTemplate className="w-8 h-8 text-pink-400" />
          </div>
          <h1 className="text-4xl font-bold mb-2 text-white text-center">GOCOSMIC Presentator</h1>
          <p className="text-zinc-400 mb-10 text-center">Generate beautiful presentations with the power of AI.</p>
          
          <div className="w-full bg-zinc-900/80 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-2xl">
            <label className="block text-lg font-medium mb-4 text-zinc-200">Enter the topic</label>
            <input 
              type="text" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-black/50 border border-white/20 rounded-xl p-4 text-white text-lg mb-6 focus:border-pink-500 outline-none transition-colors"
              placeholder="e.g., The Future of Artificial Intelligence"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && topic.trim() && !isGeneratingOutline) {
                  generateOutline();
                }
              }}
            />

            <div className="mb-6">
              <label className="block text-sm font-medium text-zinc-300 mb-3">Number of slides</label>
              <div className="relative">
                <select 
                  value={slideCount}
                  onChange={(e) => setSlideCount(parseInt(e.target.value))}
                  className="w-full bg-black/50 border border-white/20 rounded-xl p-4 text-white text-lg focus:border-pink-500 outline-none transition-colors appearance-none cursor-pointer"
                >
                  {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num} className="bg-zinc-900 text-white">
                      {num} {num === 1 ? 'Slide' : 'Slides'}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <ChevronDown className="w-5 h-5 text-zinc-400" />
                </div>
              </div>
            </div>

            <div className="mb-8">
              <p className="text-sm text-zinc-400 mb-3">Suggested topics:</p>
              <div className="flex flex-wrap gap-2">
                {['Space Exploration', 'Sustainable Energy', 'History of Rome', 'Quantum Computing'].map(suggestion => (
                  <button 
                    key={suggestion}
                    onClick={() => setTopic(suggestion)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-lg text-sm text-zinc-300 transition-all"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <button 
                onClick={generateOutline}
                disabled={!topic.trim() || isGeneratingOutline || isGeneratingPresentation}
                className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:hover:bg-zinc-800 rounded-xl font-bold text-lg text-white transition-colors flex items-center justify-center gap-2 border border-white/10"
              >
                {isGeneratingOutline ? <Loader2 className="animate-spin w-5 h-5" /> : <Wand2 className="w-5 h-5" />}
                {isGeneratingOutline ? 'Generating...' : 'Generate Outline'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'outline') {
    return (
      <div className="flex flex-col h-full bg-zinc-950/50 rounded-2xl border border-white/5 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-900/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="p-6 border-b border-white/5 bg-zinc-900/80 backdrop-blur-sm flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-white">Presentation Outline</h2>
            <p className="text-zinc-400 text-sm mt-1">Review and edit your presentation outline before generating the slides.</p>
          </div>
          <button 
            onClick={() => setStep('topic')}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>

        <div className="flex-1 overflow-y-scroll p-6 custom-scrollbar z-10">
          <div className="max-w-4xl mx-auto space-y-4">
            {outline.map((slide, index) => (
              <div key={slide.id} className="bg-zinc-900/80 backdrop-blur-sm p-6 rounded-xl border border-white/10 relative group shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-pink-400">Slide {index + 1}</h3>
                  <button 
                    onClick={() => deleteOutlineSlide(slide.id)}
                    className="text-zinc-500 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-white/5"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">Title</label>
                    <input 
                      value={slide.title}
                      onChange={(e) => updateOutlineSlide(slide.id, { title: e.target.value })}
                      className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-pink-500 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">Content Description</label>
                    <textarea 
                      value={slide.description}
                      onChange={(e) => updateOutlineSlide(slide.id, { description: e.target.value })}
                      className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-pink-500 outline-none resize-none h-24 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">Image Keyword</label>
                    <input 
                      value={slide.imageKeyword}
                      onChange={(e) => updateOutlineSlide(slide.id, { imageKeyword: e.target.value })}
                      className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-pink-500 outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <button 
              onClick={addOutlineSlide}
              className="w-full py-6 border-2 border-dashed border-white/20 hover:border-pink-500/50 hover:bg-pink-500/5 rounded-xl text-zinc-400 hover:text-pink-400 transition-all flex items-center justify-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" /> Add Slide
            </button>
          </div>
        </div>
        
        <div className="p-6 border-t border-white/5 bg-zinc-900/80 backdrop-blur-sm flex justify-end z-10">
          <button 
            onClick={generatePresentationFromOutline}
            disabled={isGeneratingPresentation || outline.length === 0}
            className="px-8 py-3 bg-pink-600 hover:bg-pink-500 disabled:opacity-50 disabled:hover:bg-pink-600 rounded-xl font-bold text-white transition-colors flex items-center gap-2 shadow-lg shadow-pink-500/20"
          >
            {isGeneratingPresentation ? <Loader2 className="animate-spin w-5 h-5" /> : <MonitorPlay className="w-5 h-5" />}
            {isGeneratingPresentation ? 'Generating Presentation...' : 'Generate Presentation'}
          </button>
        </div>
      </div>
    );
  }

  if (isPlaying) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden">
        <div className="relative flex items-center justify-center" style={{ width: '100vw', height: '56.25vw', maxHeight: '100vh', maxWidth: '177.78vh' }}>
          <AnimatePresence>
            <motion.div 
              key={currentSlide.id}
              variants={getTransitionVariants()}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0 bg-white overflow-hidden"
              style={{ backgroundColor: currentSlide.background }}
            >
              {currentSlide.elements.map(el => (
                <div
                  key={el.id}
                  style={{
                    position: 'absolute',
                    left: `${(el.x / 800) * 100}%`,
                    top: `${(el.y / 450) * 100}%`,
                    width: `${(el.width / 800) * 100}%`,
                    height: `${(el.height / 450) * 100}%`,
                    color: el.color,
                    fontSize: `${(el.fontSize || 24) / 800 * 100}vw`,
                    display: 'flex',
                    alignItems: el.type === 'text' ? 'flex-start' : 'center',
                    justifyContent: el.type === 'text' ? (el.textAlign === 'center' ? 'center' : el.textAlign === 'right' ? 'flex-end' : 'flex-start') : 'center',
                    backgroundColor: el.type === 'shape' ? el.color : 'transparent',
                    borderRadius: el.content === 'circle' ? '50%' : '0',
                    textAlign: el.textAlign || 'left'
                  }}
                >
                  {el.type === 'text' && el.content}
                  {el.type === 'image' && <img src={el.content} alt="" className="w-full h-full object-cover rounded-lg" referrerPolicy="no-referrer" />}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
        <button 
          onClick={() => setIsPlaying(false)}
          className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-lg hover:bg-black/80 transition-colors z-[110]"
        >
          Exit Presentation
        </button>

        {/* Navigation Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/50 backdrop-blur-md p-2 rounded-2xl z-[110] opacity-0 hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
            disabled={currentSlideIndex === 0}
            className="p-3 text-white hover:bg-white/10 rounded-xl disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="text-white font-medium min-w-[4rem] text-center">
            {currentSlideIndex + 1} / {slides.length}
          </div>
          <button
            onClick={() => setCurrentSlideIndex(Math.min(slides.length - 1, currentSlideIndex + 1))}
            disabled={currentSlideIndex === slides.length - 1}
            className="p-3 text-white hover:bg-white/10 rounded-xl disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-zinc-950/50 rounded-2xl border border-white/5 overflow-hidden shadow-xl shadow-black/20 relative">
      {/* Header / Ribbon */}
      <div className="p-3 border-b border-white/5 bg-zinc-900/80 backdrop-blur-sm flex items-center justify-between relative z-10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-pink-400 bg-pink-400/10 px-3 py-1.5 rounded-lg border border-pink-400/20 cursor-pointer hover:bg-pink-400/20 transition-colors" onClick={() => setStep('topic')}>
            <LayoutTemplate className="w-5 h-5" />
            <span className="font-semibold tracking-wide">GOCOSMIC Presentator</span>
          </div>
          
          <div className="h-6 w-px bg-white/10 mx-2" />
          
          <div className="flex gap-1">
            <button onClick={addSlide} className="flex items-center gap-1 px-2 py-1.5 text-zinc-300 hover:text-white hover:bg-white/5 rounded transition-colors text-sm">
              <Plus className="w-4 h-4" /> New Slide
            </button>
            <div className="h-4 w-px bg-white/10 mx-1 self-center" />
            <button onClick={addTextElement} className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-white/5 rounded transition-colors" title="Add Text">
              <Type className="w-4 h-4" />
            </button>
            <button onClick={() => addShapeElement('square')} className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-white/5 rounded transition-colors" title="Add Rectangle">
              <Square className="w-4 h-4" />
            </button>
            <button onClick={() => addShapeElement('circle')} className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-white/5 rounded transition-colors" title="Add Circle">
              <Circle className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <select 
            value={transitionType}
            onChange={(e) => setTransitionType(e.target.value as TransitionType)}
            className="bg-black/20 border border-white/10 rounded px-2 py-1.5 text-sm text-white focus:border-pink-500 outline-none"
          >
            <option value="none">No Transition</option>
            <option value="fade">Fade</option>
            <option value="slide-left">Slide Left</option>
            <option value="slide-right">Slide Right</option>
          </select>
          <button 
            onClick={() => setIsPlaying(true)}
            className="flex items-center gap-2 px-4 py-1.5 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors text-sm font-medium shadow-lg shadow-pink-500/20"
          >
            <MonitorPlay className="w-4 h-4" />
            Present
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Thumbnails Sidebar */}
        <div className="w-48 border-r border-white/5 bg-zinc-900/50 overflow-y-scroll custom-scrollbar p-2 flex flex-col gap-2">
          {slides.map((slide, idx) => (
            <div 
              key={slide.id}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-colors ${currentSlideIndex === idx ? 'border-pink-500' : 'border-transparent hover:border-white/20'}`}
            >
              <div className="aspect-video bg-white w-full relative pointer-events-none" style={{ backgroundColor: slide.background }}>
                {/* Mini preview of elements */}
                {slide.elements.map(el => (
                  <div
                    key={el.id}
                    style={{
                      position: 'absolute',
                      left: `${(el.x / 800) * 100}%`,
                      top: `${(el.y / 450) * 100}%`,
                      width: `${(el.width / 800) * 100}%`,
                      height: `${(el.height / 450) * 100}%`,
                      backgroundColor: el.type === 'shape' ? el.color : 'transparent',
                      borderRadius: el.content === 'circle' ? '50%' : '0',
                      border: el.type === 'text' ? '1px solid rgba(0,0,0,0.1)' : 'none',
                      backgroundImage: el.type === 'image' ? `url(${el.content})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                ))}
              </div>
              <div className="absolute top-1 left-1 bg-black/50 text-white text-[10px] px-1.5 rounded backdrop-blur-sm">
                {idx + 1}
              </div>
              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 flex flex-col gap-1 transition-opacity">
                <button 
                  onClick={(e) => { e.stopPropagation(); duplicateSlide(idx); }}
                  className="p-1 bg-black/70 text-white rounded hover:bg-pink-500 transition-colors"
                  title="Duplicate"
                >
                  <Copy className="w-3 h-3" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteSlide(idx); }}
                  className="p-1 bg-black/70 text-white rounded hover:bg-red-500 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Main Editor Area */}
        <div 
          className="flex-1 bg-zinc-950 overflow-scroll custom-scrollbar flex items-center justify-center p-8 relative"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onClick={() => {
            if (!isDragging) {
              setSelectedElementId(null);
              setIsEditingText(false);
            }
          }}
        >
          {/* Slide Canvas (fixed 16:9 aspect ratio, 800x450 logical size) */}
          <div 
            ref={slideRef}
            className="bg-white shadow-2xl relative overflow-hidden shrink-0"
            style={{ 
              width: 800, 
              height: 450,
              backgroundColor: currentSlide?.background || '#ffffff',
              transform: 'scale(min(1, calc((100vw - 300px) / 800)))',
              transformOrigin: 'center center'
            }}
          >
            {currentSlide?.elements.map(el => {
              const isSelected = selectedElementId === el.id;
              
              return (
                <div
                  key={el.id}
                  onPointerDown={(e) => handlePointerDown(e, el.id)}
                  onDoubleClick={(e) => {
                    if (el.type === 'text') {
                      e.stopPropagation();
                      setIsEditingText(true);
                      setSelectedElementId(el.id);
                    }
                  }}
                  className={`absolute ${isSelected ? 'ring-2 ring-pink-500 ring-offset-1' : ''} ${isDragging && isSelected ? 'cursor-grabbing' : 'cursor-grab'}`}
                  style={{
                    left: el.x,
                    top: el.y,
                    width: el.width,
                    height: el.height,
                    color: el.color,
                    fontSize: el.fontSize,
                    backgroundColor: el.type === 'shape' ? el.color : 'transparent',
                    borderRadius: el.content === 'circle' ? '50%' : '0',
                    display: 'flex',
                    alignItems: el.type === 'text' ? 'flex-start' : 'center',
                    justifyContent: el.type === 'text' ? (el.textAlign === 'center' ? 'center' : el.textAlign === 'right' ? 'flex-end' : 'flex-start') : 'center',
                    userSelect: 'none',
                    textAlign: el.textAlign || 'left'
                  }}
                >
                  {el.type === 'text' && (
                    isEditingText && isSelected ? (
                      <textarea
                        autoFocus
                        value={el.content}
                        onChange={(e) => updateElement(el.id, { content: e.target.value })}
                        onBlur={() => setIsEditingText(false)}
                        className="w-full h-full bg-transparent outline-none resize-none"
                        style={{ color: el.color, fontSize: el.fontSize, fontFamily: 'inherit', textAlign: el.textAlign || 'left' }}
                      />
                    ) : (
                      <div className="w-full h-full whitespace-pre-wrap break-words pointer-events-none" style={{ textAlign: el.textAlign || 'left' }}>
                        {el.content}
                      </div>
                    )
                  )}
                  
                  {el.type === 'image' && (
                    <img src={el.content} alt="" className="w-full h-full object-cover rounded-lg pointer-events-none" referrerPolicy="no-referrer" />
                  )}
                  
                  {/* Resize handles (simplified, just bottom-right for now) */}
                  {isSelected && !isEditingText && (
                    <div 
                      className="absolute -right-1.5 -bottom-1.5 w-3 h-3 bg-white border-2 border-pink-500 rounded-full cursor-se-resize"
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        // Basic resize logic would go here
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Properties Sidebar (Right) */}
        {selectedElementId && (
          <div className="w-64 border-l border-white/5 bg-zinc-900/50 p-4 flex flex-col gap-4 overflow-y-scroll custom-scrollbar">
            <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-2">Properties</h3>
            
            {currentSlide?.elements.find(e => e.id === selectedElementId)?.type === 'text' && (
              <>
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500">Font Size</label>
                  <input 
                    type="number" 
                    value={currentSlide.elements.find(e => e.id === selectedElementId)?.fontSize || 24}
                    onChange={(e) => updateElement(selectedElementId, { fontSize: parseInt(e.target.value) || 24 })}
                    className="w-full bg-black/20 border border-white/10 rounded px-2 py-1 text-sm text-white focus:border-pink-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500">Text Align</label>
                  <select 
                    value={currentSlide.elements.find(e => e.id === selectedElementId)?.textAlign || 'left'}
                    onChange={(e) => updateElement(selectedElementId, { textAlign: e.target.value as any })}
                    className="w-full bg-black/20 border border-white/10 rounded px-2 py-1 text-sm text-white focus:border-pink-500 outline-none"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <label className="text-xs text-zinc-500">Color</label>
              <div className="flex gap-2">
                <input 
                  type="color" 
                  value={currentSlide?.elements.find(e => e.id === selectedElementId)?.color || '#000000'}
                  onChange={(e) => updateElement(selectedElementId, { color: e.target.value })}
                  className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                />
                <input 
                  type="text" 
                  value={currentSlide?.elements.find(e => e.id === selectedElementId)?.color || '#000000'}
                  onChange={(e) => updateElement(selectedElementId, { color: e.target.value })}
                  className="flex-1 bg-black/20 border border-white/10 rounded px-2 py-1 text-sm text-white focus:border-pink-500 outline-none font-mono uppercase"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs text-zinc-500">Dimensions</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-zinc-600 absolute ml-2 mt-1.5">W</span>
                  <input 
                    type="number" 
                    value={Math.round(currentSlide?.elements.find(e => e.id === selectedElementId)?.width || 0)}
                    onChange={(e) => updateElement(selectedElementId, { width: parseInt(e.target.value) || 100 })}
                    className="w-full bg-black/20 border border-white/10 rounded pl-6 pr-2 py-1 text-sm text-white focus:border-pink-500 outline-none"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-600 absolute ml-2 mt-1.5">H</span>
                  <input 
                    type="number" 
                    value={Math.round(currentSlide?.elements.find(e => e.id === selectedElementId)?.height || 0)}
                    onChange={(e) => updateElement(selectedElementId, { height: parseInt(e.target.value) || 100 })}
                    className="w-full bg-black/20 border border-white/10 rounded pl-6 pr-2 py-1 text-sm text-white focus:border-pink-500 outline-none"
                  />
                </div>
              </div>
            </div>
            
            <button 
              onClick={deleteSelectedElement}
              className="mt-4 flex items-center justify-center gap-2 w-full py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors text-sm font-medium border border-red-500/20"
            >
              <Trash2 className="w-4 h-4" />
              Delete Element
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
