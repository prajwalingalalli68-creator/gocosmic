import React, { useState, useRef, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  List,
  ListOrdered,
  Undo,
  Redo,
  Save,
  Download,
  FileText
} from 'lucide-react';

export function WordTool() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState('<h1>GOCOSMIC Word</h1><p>Start typing your GOCOSMIC document here...</p>');

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content;
    }
  }, []);

  const executeCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const handleDownloadHTML = () => {
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gocosmic-document.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    if (!editorRef.current) return;
    
    const opt = {
      margin:       0.5,
      filename:     'gocosmic-document.pdf',
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' as const }
    };
    
    html2pdf().set(opt).from(editorRef.current).save();
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950/50 rounded-2xl border border-white/5 overflow-hidden shadow-xl shadow-black/20 relative">
      {/* Header / Ribbon */}
      <div className="p-3 border-b border-white/5 bg-zinc-900/80 backdrop-blur-sm flex items-center justify-between relative z-10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-blue-400 bg-blue-400/10 px-3 py-1.5 rounded-lg border border-blue-400/20">
            <FileText className="w-5 h-5" />
            <span className="font-semibold tracking-wide">GOCOSMIC Word</span>
          </div>
          
          <div className="h-6 w-px bg-white/10 mx-2" />
          
          <div className="flex gap-1">
            <button onClick={() => executeCommand('undo')} className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-white/5 rounded transition-colors" title="Undo">
              <Undo className="w-4 h-4" />
            </button>
            <button onClick={() => executeCommand('redo')} className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-white/5 rounded transition-colors" title="Redo">
              <Redo className="w-4 h-4" />
            </button>
            <div className="h-4 w-px bg-white/10 mx-1 self-center" />
            <button onClick={() => executeCommand('bold')} className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-white/5 rounded transition-colors" title="Bold">
              <Bold className="w-4 h-4" />
            </button>
            <button onClick={() => executeCommand('italic')} className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-white/5 rounded transition-colors" title="Italic">
              <Italic className="w-4 h-4" />
            </button>
            <button onClick={() => executeCommand('underline')} className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-white/5 rounded transition-colors" title="Underline">
              <Underline className="w-4 h-4" />
            </button>
            <div className="h-4 w-px bg-white/10 mx-1 self-center" />
            <button onClick={() => executeCommand('justifyLeft')} className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-white/5 rounded transition-colors" title="Align Left">
              <AlignLeft className="w-4 h-4" />
            </button>
            <button onClick={() => executeCommand('justifyCenter')} className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-white/5 rounded transition-colors" title="Align Center">
              <AlignCenter className="w-4 h-4" />
            </button>
            <button onClick={() => executeCommand('justifyRight')} className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-white/5 rounded transition-colors" title="Align Right">
              <AlignRight className="w-4 h-4" />
            </button>
            <button onClick={() => executeCommand('justifyFull')} className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-white/5 rounded transition-colors" title="Justify">
              <AlignJustify className="w-4 h-4" />
            </button>
            <div className="h-4 w-px bg-white/10 mx-1 self-center" />
            <button onClick={() => executeCommand('insertUnorderedList')} className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-white/5 rounded transition-colors" title="Bullet List">
              <List className="w-4 h-4" />
            </button>
            <button onClick={() => executeCommand('insertOrderedList')} className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-white/5 rounded transition-colors" title="Numbered List">
              <ListOrdered className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handleDownloadHTML}
            className="flex items-center gap-2 px-4 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors text-sm font-medium border border-blue-500/20"
          >
            <Download className="w-4 h-4" />
            HTML
          </button>
          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium shadow-lg shadow-blue-500/20"
          >
            <FileText className="w-4 h-4" />
            PDF
          </button>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 bg-zinc-950 overflow-y-scroll custom-scrollbar flex justify-center p-8 relative">
        <div 
          className="bg-white text-black shadow-2xl relative shrink-0 w-full max-w-[816px] min-h-[1056px] p-12 outline-none prose prose-sm max-w-none"
          style={{ 
            boxShadow: '0 0 20px rgba(0,0,0,0.5)'
          }}
        >
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            className="outline-none min-h-full"
            style={{ minHeight: '100%' }}
          />
        </div>
      </div>
    </div>
  );
}
