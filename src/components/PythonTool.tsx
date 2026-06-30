import React, { useState } from 'react';
import { Terminal, Play, Loader2, Code2, Trash2 } from 'lucide-react';

export function PythonTool() {
  const [code, setCode] = useState<string>('# Write your Python code here\nprint("Hello, GOCOSMIC Universe!")\n');
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const runCode = async () => {
    if (!code.trim()) return;
    
    setIsRunning(true);
    setOutput('Executing...');
    
    try {
      const response = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: 'python',
          version: '3.10.0',
          files: [
            {
              content: code,
            },
          ],
        }),
      });

      const data = await response.json();
      
      if (data.run) {
        const out = data.run.stdout || '';
        const err = data.run.stderr || '';
        setOutput(out + err || 'Program exited with no output.');
      } else {
        setOutput(data.message || 'An error occurred while executing the code.');
      }
    } catch (error) {
      setOutput('Failed to connect to the execution engine. Please try again later.');
    } finally {
      setIsRunning(false);
    }
  };

  const clearOutput = () => {
    setOutput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      // Insert 4 spaces for Python indentation
      const newValue = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newValue);

      // Move cursor right after the inserted spaces
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      }, 0);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950/50 rounded-2xl border border-white/5 overflow-hidden shadow-xl shadow-black/20 relative">
      {/* Header */}
      <div className="p-3 border-b border-white/5 bg-zinc-900/80 backdrop-blur-sm flex items-center justify-between relative z-10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-blue-400 bg-blue-400/10 px-3 py-1.5 rounded-lg border border-blue-400/20">
            <Terminal className="w-5 h-5" />
            <span className="font-semibold tracking-wide">GOCOSMIC Python</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={runCode}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white rounded-lg transition-colors text-sm font-medium shadow-lg shadow-emerald-500/20"
          >
            {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {isRunning ? 'Running...' : 'Run Code'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* Editor Area */}
        <div className="flex-1 flex flex-col border-b md:border-b-0 md:border-r border-white/5 bg-zinc-950 relative">
          <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border-b border-white/5 text-xs font-medium text-zinc-400 uppercase tracking-wider">
            <Code2 className="w-4 h-4" />
            main.py
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            className="flex-1 w-full bg-transparent text-zinc-300 font-mono text-sm p-4 outline-none resize-none custom-scrollbar leading-relaxed"
            placeholder="# Write your Python code here..."
          />
        </div>

        {/* Terminal/Output Area */}
        <div className="flex-1 flex flex-col bg-zinc-950 relative">
          <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/50 border-b border-white/5 text-xs font-medium text-zinc-400 uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              Output
            </div>
            <button 
              onClick={clearOutput}
              className="p-1 hover:text-zinc-100 hover:bg-white/5 rounded transition-colors"
              title="Clear Output"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex-1 p-4 overflow-scroll custom-scrollbar">
            {output ? (
              <pre className="font-mono text-sm text-zinc-300 whitespace-pre-wrap break-words">
                {output}
              </pre>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-600 font-mono text-sm">
                Run your code to see the output here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
