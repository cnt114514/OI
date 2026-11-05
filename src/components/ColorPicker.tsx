import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface ColorPickerProps {
  open: boolean;
  onClose: () => void;
}

type ColorMode = 'bg' | 'border' | 'ui';

export default function ColorPicker({ open, onClose }: ColorPickerProps) {
  const [mode, setMode] = useState<ColorMode>('bg');
  
  // 从 localStorage 读取已保存的颜色
  const loadColor = (key: string, defaultH: number, defaultS: number, defaultL: number) => {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { h: defaultH, s: defaultS, l: defaultL };
      }
    }
    return { h: defaultH, s: defaultS, l: defaultL };
  };
  
  // 背景色
  const bgColor = loadColor('marktex-bg-color', 239, 84, 67);
  const [bgHue, setBgHue] = useState(bgColor.h);
  const [bgSat, setBgSat] = useState(bgColor.s);
  const [bgLight, setBgLight] = useState(bgColor.l);
  
  // 边框色
  const borderColor = loadColor('marktex-border-color', 0, 0, 50);
  const [borderHue, setBorderHue] = useState(borderColor.h);
  const [borderSat, setBorderSat] = useState(borderColor.s);
  const [borderLight, setBorderLight] = useState(borderColor.l);
  
  // UI框架色
  const uiColor = loadColor('marktex-ui-color', 220, 15, 15);
  const [uiHue, setUiHue] = useState(uiColor.h);
  const [uiSat, setUiSat] = useState(uiColor.s);
  const [uiLight, setUiLight] = useState(uiColor.l);
  
  const pickerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // 应用颜色到 CSS 变量
  const applyColors = (h: number, s: number, l: number, currentMode: ColorMode) => {
    if (currentMode === 'bg') {
      const isLightBg = l > 60;
      const textPrimary = isLightBg 
        ? `hsl(${h}, ${Math.min(s, 20)}%, ${Math.max(10, 100 - l * 0.8)}%)`
        : `hsl(${h}, ${Math.min(s * 0.3, 15)}%, ${Math.min(95, l + 75)}%)`;
      
      document.documentElement.style.setProperty('--editor-bg', `hsl(${h}, ${s}%, ${l}%)`);
      document.documentElement.style.setProperty('--editor-text', textPrimary);
    } else if (currentMode === 'border') {
      document.documentElement.style.setProperty('--border', `hsl(${h}, ${s}%, ${l}%)`);
      document.documentElement.style.setProperty('--editor-border', `hsl(${h}, ${s}%, ${l}%)`);
    } else {
      const uiBg = `hsl(${h}, ${s}%, ${l}%)`;
      const uiBgSecondary = `hsl(${h}, ${s}%, ${Math.min(l + 5, 100)}%)`;
      const uiBgTertiary = `hsl(${h}, ${s}%, ${Math.min(l + 10, 100)}%)`;
      const uiText = l < 50 ? `hsl(${h}, ${Math.min(s, 10)}%, 90%)` : `hsl(${h}, ${Math.min(s, 10)}%, 15%)`;
      
      document.documentElement.style.setProperty('--bg-primary', uiBg);
      document.documentElement.style.setProperty('--bg-secondary', uiBgSecondary);
      document.documentElement.style.setProperty('--bg-tertiary', uiBgTertiary);
      document.documentElement.style.setProperty('--text-primary', uiText);
    }
  };

  // 保存颜色到 localStorage
  const saveColors = () => {
    localStorage.setItem('marktex-bg-color', JSON.stringify({ h: bgHue, s: bgSat, l: bgLight }));
    localStorage.setItem('marktex-border-color', JSON.stringify({ h: borderHue, s: borderSat, l: borderLight }));
    localStorage.setItem('marktex-ui-color', JSON.stringify({ h: uiHue, s: uiSat, l: uiLight }));
  };

  // 监听颜色变化，自动应用和保存
  useEffect(() => {
    applyColors(bgHue, bgSat, bgLight, 'bg');
  }, [bgHue, bgSat, bgLight]);

  useEffect(() => {
    applyColors(borderHue, borderSat, borderLight, 'border');
  }, [borderHue, borderSat, borderLight]);

  useEffect(() => {
    applyColors(uiHue, uiSat, uiLight, 'ui');
  }, [uiHue, uiSat, uiLight]);

  useEffect(() => {
    saveColors();
  }, [bgHue, bgSat, bgLight, borderHue, borderSat, borderLight, uiHue, uiSat, uiLight]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const getCurrentValues = () => {
    if (mode === 'bg') return { h: bgHue, s: bgSat, l: bgLight };
    if (mode === 'border') return { h: borderHue, s: borderSat, l: borderLight };
    return { h: uiHue, s: uiSat, l: uiLight };
  };

  const setCurrentValues = (h: number, s: number, l: number) => {
    if (mode === 'bg') {
      setBgHue(h);
      setBgSat(s);
      setBgLight(l);
    } else if (mode === 'border') {
      setBorderHue(h);
      setBorderSat(s);
      setBorderLight(l);
    } else {
      setUiHue(h);
      setUiSat(s);
      setUiLight(l);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !pickerRef.current) return;
      
      const rect = pickerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
      
      const newSat = Math.round((x / rect.width) * 100);
      const newLight = Math.round(100 - (y / rect.height) * 100);
      
      const current = getCurrentValues();
      setCurrentValues(current.h, newSat, newLight);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, mode, bgHue, bgSat, bgLight, borderHue, borderSat, borderLight, uiHue, uiSat, uiLight]);

  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHue = parseInt(e.target.value);
    const current = getCurrentValues();
    setCurrentValues(newHue, current.s, current.l);
  };

  const resetColor = () => {
    if (mode === 'bg') {
      setBgHue(239);
      setBgSat(84);
      setBgLight(67);
    } else if (mode === 'border') {
      setBorderHue(0);
      setBorderSat(0);
      setBorderLight(50);
    } else {
      setUiHue(220);
      setUiSat(15);
      setUiLight(15);
    }
  };

  const current = getCurrentValues();

  if (!open) return null;

  return (
    <div 
      ref={pickerRef}
      className="absolute top-full right-0 mt-2 p-4 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg shadow-lg z-50 w-80"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">主题色设置</h3>
        <button onClick={onClose} className="p-1 rounded hover:bg-[var(--bg-tertiary)]">
          <X className="w-4 h-4 text-[var(--text-secondary)]" />
        </button>
      </div>

      {/* 模式选择 */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setMode('bg')}
          className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
            mode === 'bg' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
          }`}
        >
          背景色
        </button>
        <button
          onClick={() => setMode('border')}
          className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
            mode === 'border' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
          }`}
        >
          边框色
        </button>
        <button
          onClick={() => setMode('ui')}
          className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
            mode === 'ui' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
          }`}
        >
          UI框架
        </button>
      </div>

      {/* 色盘 */}
      <div
        className="w-full h-40 rounded-lg cursor-crosshair mb-3 relative overflow-hidden"
        style={{
          background: `linear-gradient(to bottom, transparent, hsl(${current.h}, 100%, 50%)), 
                       linear-gradient(to right, #fff, hsl(${current.h}, 100%, 50%))`,
        }}
        onMouseDown={() => setIsDragging(true)}
      >
        <div
          className="absolute w-4 h-4 rounded-full border-2 border-white shadow-lg pointer-events-none"
          style={{
            left: `${current.s}%`,
            top: `${100 - current.l}%`,
            transform: 'translate(-50%, -50%)',
            background: `hsl(${current.h}, ${current.s}%, ${current.l}%)`,
          }}
        />
      </div>

      {/* 色相滑块 */}
      <div className="mb-3">
        <label className="text-xs text-[var(--text-secondary)] mb-1 block">色相</label>
        <input
          type="range"
          min="0"
          max="360"
          value={current.h}
          onChange={handleHueChange}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, 
              hsl(0, 100%, 50%), 
              hsl(60, 100%, 50%), 
              hsl(120, 100%, 50%), 
              hsl(180, 100%, 50%), 
              hsl(240, 100%, 50%), 
              hsl(300, 100%, 50%), 
              hsl(360, 100%, 50%))`,
          }}
        />
      </div>

      {/* 颜色预览 */}
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-12 h-12 rounded-lg border border-[var(--border)]"
          style={{ background: `hsl(${current.h}, ${current.s}%, ${current.l}%)` }}
        />
        <div className="flex-1">
          <div className="text-xs text-[var(--text-secondary)]">当前颜色</div>
          <div className="text-sm font-mono text-[var(--text-primary)]">
            hsl({current.h}, {current.s}%, {current.l}%)
          </div>
        </div>
      </div>

      {/* 预设颜色 */}
      <div className="mb-3">
        <label className="text-xs text-[var(--text-secondary)] mb-2 block">预设颜色</label>
        <div className="grid grid-cols-6 gap-2">
          {[
            { h: 239, s: 84, l: 67, name: '靛蓝' },
            { h: 142, s: 71, l: 45, name: '翠绿' },
            { h: 38, s: 92, l: 50, name: '琥珀' },
            { h: 330, s: 81, l: 60, name: '玫红' },
            { h: 199, s: 89, l: 48, name: '天蓝' },
            { h: 270, s: 76, l: 55, name: '紫罗兰' },
          ].map((preset) => (
            <button
              key={preset.name}
              onClick={() => setCurrentValues(preset.h, preset.s, preset.l)}
              className="w-full aspect-square rounded-lg border-2 border-transparent hover:border-[var(--text-primary)] transition-all"
              style={{ background: `hsl(${preset.h}, ${preset.s}%, ${preset.l}%)` }}
              title={preset.name}
            />
          ))}
        </div>
      </div>

      {/* 重置按钮 */}
      <button
        onClick={resetColor}
        className="w-full py-2 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--border)] text-[var(--text-primary)] text-xs font-medium transition-colors"
      >
        重置为默认颜色
      </button>
    </div>
  );
}
