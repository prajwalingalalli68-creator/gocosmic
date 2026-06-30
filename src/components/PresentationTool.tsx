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
  Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
}

interface Slide {
  id: string;
  elements: SlideElement[];
  background: string;
}

export function PresentationTool() {
  const [slides, setSlides] = useState<Slide[]>([
    {
      id: '1',
      background: '#ffffff',
      elements: [
        {
          id: 'title-1',
          type: 'text',
          content: 'GOCOSMIC Presentation',
          x: 100,
          y: 200,
          width: 600,
          height: 100,
          fontSize: 48,
          color: '#000000'
        },
        {
          id: 'subtitle-1',
          type: 'text',
          content: 'Double click to edit',
          x: 100,
          y: 300,
          width: 600,
          height: 50,
          fontSize: 24,
          color: '#666666'
        }
      ]
    }
  ]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isEditingText, setIsEditingText] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transitionType, setTransitionType] = useState<TransitionType>('fade');

  const slideRef = useRef<HTMLDivElement>(null);

  const currentSlide = slides[currentSlideIndex];

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
      width: 200,
      height: 50,
      fontSize: 24,
      color: '#000000'
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
      // Calculate scale if slide is scaled down
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
                    justifyContent: el.type === 'text' ? 'flex-start' : 'center',
                    backgroundColor: el.type === 'shape' ? el.color : 'transparent',
                    borderRadius: el.content === 'circle' ? '50%' : '0'
                  }}
                >
                  {el.type === 'text' && el.content}
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
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-zinc-950/50 rounded-2xl border border-white/5 overflow-hidden shadow-xl shadow-black/20 relative">
      {/* Header / Ribbon */}
      <div className="p-3 border-b border-white/5 bg-zinc-900/80 backdrop-blur-sm flex items-center justify-between relative z-10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-orange-400 bg-orange-400/10 px-3 py-1.5 rounded-lg border border-orange-400/20">
            <MonitorPlay className="w-5 h-5" />
            <span className="font-semibold tracking-wide">GOCOSMIC PowerPoint</span>
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
            className="bg-black/20 border border-white/10 rounded px-2 py-1.5 text-sm text-white focus:border-orange-500 outline-none"
          >
            <option value="none">No Transition</option>
            <option value="fade">Fade</option>
            <option value="slide-left">Slide Left</option>
            <option value="slide-right">Slide Right</option>
          </select>
          <button 
            onClick={() => setIsPlaying(true)}
            className="flex items-center gap-2 px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm font-medium shadow-lg shadow-orange-500/20"
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
              className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-colors ${currentSlideIndex === idx ? 'border-orange-500' : 'border-transparent hover:border-white/20'}`}
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
                      border: el.type === 'text' ? '1px solid rgba(0,0,0,0.1)' : 'none'
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
                  className="p-1 bg-black/70 text-white rounded hover:bg-orange-500 transition-colors"
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
          className="flex-1 bg-zinc-950 overflow-scroll flex items-center justify-center p-8 relative"
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
              backgroundColor: currentSlide.background,
              transform: 'scale(min(1, calc((100vw - 300px) / 800)))',
              transformOrigin: 'center center'
            }}
          >
            {currentSlide.elements.map(el => {
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
                  className={`absolute ${isSelected ? 'ring-2 ring-orange-500 ring-offset-1' : ''} ${isDragging && isSelected ? 'cursor-grabbing' : 'cursor-grab'}`}
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
                    justifyContent: el.type === 'text' ? 'flex-start' : 'center',
                    userSelect: 'none'
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
                        style={{ color: el.color, fontSize: el.fontSize, fontFamily: 'inherit' }}
                      />
                    ) : (
                      <div className="w-full h-full whitespace-pre-wrap break-words pointer-events-none">
                        {el.content}
                      </div>
                    )
                  )}
                  
                  {/* Resize handles (simplified, just bottom-right for now) */}
                  {isSelected && !isEditingText && (
                    <div 
                      className="absolute -right-1.5 -bottom-1.5 w-3 h-3 bg-white border-2 border-orange-500 rounded-full cursor-se-resize"
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
          <div className="w-64 border-l border-white/5 bg-zinc-900/50 p-4 flex flex-col gap-4 overflow-y-scroll">
            <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-2">Properties</h3>
            
            {currentSlide.elements.find(e => e.id === selectedElementId)?.type === 'text' && (
              <div className="space-y-2">
                <label className="text-xs text-zinc-500">Font Size</label>
                <input 
                  type="number" 
                  value={currentSlide.elements.find(e => e.id === selectedElementId)?.fontSize || 24}
                  onChange={(e) => updateElement(selectedElementId, { fontSize: parseInt(e.target.value) || 24 })}
                  className="w-full bg-black/20 border border-white/10 rounded px-2 py-1 text-sm text-white focus:border-orange-500 outline-none"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-xs text-zinc-500">Color</label>
              <div className="flex gap-2">
                <input 
                  type="color" 
                  value={currentSlide.elements.find(e => e.id === selectedElementId)?.color || '#000000'}
                  onChange={(e) => updateElement(selectedElementId, { color: e.target.value })}
                  className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                />
                <input 
                  type="text" 
                  value={currentSlide.elements.find(e => e.id === selectedElementId)?.color || '#000000'}
                  onChange={(e) => updateElement(selectedElementId, { color: e.target.value })}
                  className="flex-1 bg-black/20 border border-white/10 rounded px-2 py-1 text-sm text-white focus:border-orange-500 outline-none font-mono uppercase"
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
                    value={Math.round(currentSlide.elements.find(e => e.id === selectedElementId)?.width || 0)}
                    onChange={(e) => updateElement(selectedElementId, { width: parseInt(e.target.value) || 100 })}
                    className="w-full bg-black/20 border border-white/10 rounded pl-6 pr-2 py-1 text-sm text-white focus:border-orange-500 outline-none"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-600 absolute ml-2 mt-1.5">H</span>
                  <input 
                    type="number" 
                    value={Math.round(currentSlide.elements.find(e => e.id === selectedElementId)?.height || 0)}
                    onChange={(e) => updateElement(selectedElementId, { height: parseInt(e.target.value) || 100 })}
                    className="w-full bg-black/20 border border-white/10 rounded pl-6 pr-2 py-1 text-sm text-white focus:border-orange-500 outline-none"
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
