import React, { useState, useCallback, KeyboardEvent, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { Table, Search, Download, Plus, Settings2, FileSpreadsheet, FileText } from 'lucide-react';

interface CellData {
  value: string;
  computed: string;
}

type GridData = Record<string, CellData>;

export function ExcelTool() {
  const ROWS = 50;
  const COLS = 26; // A to Z

  const [data, setData] = useState<GridData>({});
  const [selectedCell, setSelectedCell] = useState<string>('A1');
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [formulaBarValue, setFormulaBarValue] = useState('');
  
  const gridRef = useRef<HTMLDivElement>(null);

  const getColName = (index: number) => String.fromCharCode(65 + index);
  const getCellId = (col: number, row: number) => `${getColName(col)}${row + 1}`;

  const evaluateFormula = (formula: string, currentData: GridData): string => {
    if (!formula.startsWith('=')) return formula;
    
    try {
      // Basic SUM function support: =SUM(A1:A5)
      const sumMatch = formula.match(/^=SUM\(([A-Z]+[0-9]+):([A-Z]+[0-9]+)\)$/i);
      if (sumMatch) {
        const start = sumMatch[1].toUpperCase();
        const end = sumMatch[2].toUpperCase();
        
        const startCol = start.charCodeAt(0) - 65;
        const startRow = parseInt(start.substring(1)) - 1;
        const endCol = end.charCodeAt(0) - 65;
        const endRow = parseInt(end.substring(1)) - 1;

        let total = 0;
        for (let c = Math.min(startCol, endCol); c <= Math.max(startCol, endCol); c++) {
          for (let r = Math.min(startRow, endRow); r <= Math.max(startRow, endRow); r++) {
            const id = getCellId(c, r);
            const val = parseFloat(currentData[id]?.computed || '0');
            if (!isNaN(val)) total += val;
          }
        }
        return total.toString();
      }

      // Simple math evaluation (very basic, replacing cell refs with values)
      let expr = formula.substring(1).toUpperCase();
      
      // Replace cell references (e.g., A1, B2) with their computed values
      expr = expr.replace(/[A-Z]+[0-9]+/g, (match) => {
        const val = currentData[match]?.computed || '0';
        return isNaN(parseFloat(val)) ? '0' : val;
      });

      // Safely evaluate simple math (only allow numbers and basic operators)
      if (/^[0-9+\-*/().\s]+$/.test(expr)) {
        // eslint-disable-next-line no-new-func
        return new Function(`return ${expr}`)().toString();
      }
      
      return '#ERROR!';
    } catch (e) {
      return '#ERROR!';
    }
  };

  const updateCell = (id: string, value: string) => {
    const newData = { ...data };
    newData[id] = { value, computed: value };
    
    // Recompute all cells (simple approach, not optimized for large sheets)
    Object.keys(newData).forEach(key => {
      if (newData[key].value.startsWith('=')) {
        newData[key].computed = evaluateFormula(newData[key].value, newData);
      } else {
        newData[key].computed = newData[key].value;
      }
    });

    setData(newData);
  };

  const handleCellClick = (id: string) => {
    setSelectedCell(id);
    setEditingCell(null);
    setFormulaBarValue(data[id]?.value || '');
  };

  const handleCellDoubleClick = (id: string) => {
    setSelectedCell(id);
    setEditingCell(id);
    setFormulaBarValue(data[id]?.value || '');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, id: string) => {
    if (e.key === 'Enter') {
      setEditingCell(null);
      // Move down one cell
      const colMatch = id.match(/^[A-Z]+/);
      const rowMatch = id.match(/[0-9]+$/);
      if (colMatch && rowMatch) {
        const nextRow = parseInt(rowMatch[0]) + 1;
        if (nextRow <= ROWS) {
          const nextId = `${colMatch[0]}${nextRow}`;
          setSelectedCell(nextId);
          setFormulaBarValue(data[nextId]?.value || '');
        }
      }
    }
  };

  const handleFormulaBarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormulaBarValue(val);
    if (selectedCell) {
      updateCell(selectedCell, val);
    }
  };

  const handleCellChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const val = e.target.value;
    setFormulaBarValue(val);
    updateCell(id, val);
  };

  const handleExportPDF = () => {
    if (!gridRef.current) return;
    
    // Create a wrapper div for printing to ensure good formatting
    const printElement = document.createElement('div');
    printElement.innerHTML = `
      <h2 style="font-family: sans-serif; padding-left: 20px;">GOCOSMIC Spreadsheet</h2>
    `;
    printElement.appendChild(gridRef.current.cloneNode(true));
    
    const opt = {
      margin:       0.5,
      filename:     'gocosmic-spreadsheet.pdf',
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' as const }
    };
    
    html2pdf().set(opt).from(printElement).save();
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950/50 rounded-2xl border border-white/5 overflow-hidden shadow-xl shadow-black/20 relative">
      {/* Header / Ribbon */}
      <div className="p-3 border-b border-white/5 bg-zinc-900/80 backdrop-blur-sm flex items-center justify-between relative z-10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-lg border border-emerald-400/20">
            <FileSpreadsheet className="w-5 h-5" />
            <span className="font-semibold tracking-wide">GOCOSMIC Excel</span>
          </div>
          
          <div className="h-6 w-px bg-white/10 mx-2" />
          
          <div className="flex gap-1">
            <button onClick={handleExportPDF} className="p-1.5 text-zinc-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded transition-colors" title="Export as PDF">
              <FileText className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-white/5 rounded transition-colors" title="Save CSV">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-white/5 rounded transition-colors" title="New Sheet">
              <Plus className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-white/5 rounded transition-colors" title="Settings">
              <Settings2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search sheet..." 
            className="bg-black/20 border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all w-64"
          />
        </div>
      </div>

      {/* Formula Bar */}
      <div className="flex items-center gap-2 p-2 border-b border-white/5 bg-zinc-900/50 shrink-0">
        <div className="w-12 text-center font-mono text-xs text-zinc-400 bg-black/20 py-1 rounded border border-white/5">
          {selectedCell}
        </div>
        <div className="text-zinc-500 font-serif italic font-bold px-2">fx</div>
        <input
          type="text"
          value={formulaBarValue}
          onChange={handleFormulaBarChange}
          className="flex-1 bg-black/20 border border-white/10 rounded px-3 py-1 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50 font-mono"
          placeholder="Enter value or formula (e.g., =SUM(A1:A5) or =A1+B1)"
        />
      </div>

      {/* Spreadsheet Grid */}
      <div ref={gridRef} className="flex-1 overflow-scroll bg-zinc-950 relative custom-scrollbar">
        <table className="border-collapse w-max min-w-full">
          <thead className="sticky top-0 z-20 bg-zinc-900 shadow-sm">
            <tr>
              <th className="w-10 min-w-[40px] border border-zinc-800 bg-zinc-900/90 backdrop-blur sticky left-0 z-30"></th>
              {Array.from({ length: COLS }).map((_, i) => (
                <th key={i} className="w-24 min-w-[96px] border border-zinc-800 font-normal text-xs text-zinc-400 py-1 select-none">
                  {getColName(i)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: ROWS }).map((_, r) => (
              <tr key={r}>
                <td className="border border-zinc-800 bg-zinc-900/90 backdrop-blur text-center text-xs text-zinc-500 sticky left-0 z-10 select-none">
                  {r + 1}
                </td>
                {Array.from({ length: COLS }).map((_, c) => {
                  const id = getCellId(c, r);
                  const isSelected = selectedCell === id;
                  const isEditing = editingCell === id;
                  const cellData = data[id];

                  return (
                    <td 
                      key={c} 
                      className={`border border-zinc-800 relative p-0 ${isSelected ? 'ring-1 ring-inset ring-emerald-500 bg-emerald-500/5' : 'hover:bg-white/[0.02]'}`}
                      onClick={() => handleCellClick(id)}
                      onDoubleClick={() => handleCellDoubleClick(id)}
                    >
                      {isEditing ? (
                        <input
                          autoFocus
                          type="text"
                          value={cellData?.value || ''}
                          onChange={(e) => handleCellChange(e, id)}
                          onKeyDown={(e) => handleKeyDown(e, id)}
                          onBlur={() => setEditingCell(null)}
                          className="absolute inset-0 w-full h-full bg-zinc-900 text-zinc-100 px-1.5 text-sm outline-none font-mono"
                        />
                      ) : (
                        <div className="w-full h-full min-h-[24px] px-1.5 py-0.5 text-sm text-zinc-300 truncate font-mono cursor-cell">
                          {cellData?.computed || ''}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
