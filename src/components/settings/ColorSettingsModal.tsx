import React, { useState } from 'react';
import { ModuleColors, ModuleKey } from '../../types';
import { StorageService } from '../../services/storageService';
import { DEFAULT_MODULE_COLORS } from '../../constants/initialData';
import {
  X,
  Palette,
  RotateCcw,
  Save,
  Check,
  LayoutDashboard,
  Users,
  Home,
  FileText,
  Globe2,
  HeartHandshake,
  Church,
  Landmark,
  Cake,
  CalendarDays,
  Sparkles
} from 'lucide-react';

interface ColorSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  colors: ModuleColors;
  onSave: (newColors: ModuleColors) => void;
}

interface ModuleMeta {
  key: ModuleKey;
  label: string;
  defaultColorName: string;
  icon: React.ElementType;
}

const MODULES_META: ModuleMeta[] = [
  { key: 'dashboard', label: 'Painel Inicial', defaultColorName: 'Azul-marinho', icon: LayoutDashboard },
  { key: 'members', label: 'Membros', defaultColorName: 'Azul', icon: Users },
  { key: 'families', label: 'Famílias', defaultColorName: 'Verde', icon: Home },
  { key: 'secretariat', label: 'Secretaria', defaultColorName: 'Cinza / Chumbo', icon: FileText },
  { key: 'missions', label: 'Missões', defaultColorName: 'Roxo', icon: Globe2 },
  { key: 'socialAction', label: 'Ação Social', defaultColorName: 'Rosa', icon: HeartHandshake },
  { key: 'pastoralVisits', label: 'Visitação Pastoral', defaultColorName: 'Verde-água', icon: Church },
  { key: 'patrimony', label: 'Patrimônio', defaultColorName: 'Dourado / Âmbar', icon: Landmark },
  { key: 'birthdays', label: 'Aniversariantes', defaultColorName: 'Laranja', icon: Cake },
  { key: 'agenda', label: 'Agenda Anual', defaultColorName: 'Azul-claro', icon: CalendarDays },
];

export const ColorSettingsModal: React.FC<ColorSettingsModalProps> = ({
  isOpen,
  onClose,
  colors,
  onSave,
}) => {
  const [currentColors, setCurrentColors] = useState<ModuleColors>({ ...colors });
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleColorChange = (key: ModuleKey, newHex: string) => {
    setCurrentColors(prev => ({
      ...prev,
      [key]: newHex,
    }));
  };

  const handleReset = () => {
    setCurrentColors(DEFAULT_MODULE_COLORS);
  };

  const handleSave = () => {
    StorageService.saveModuleColors(currentColors);
    onSave(currentColors);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Personalização de Cores dos Módulos
              </h2>
              <p className="text-xs text-slate-400">
                Ajuste as cores de cada área ministerial via seletor ou código hexadecimal (HEX)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Live Preview Panel */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Prévia em Tempo Real dos Módulos</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {MODULES_META.map(meta => {
                const Icon = meta.icon;
                const col = currentColors[meta.key] || '#2563eb';
                return (
                  <div
                    key={meta.key}
                    style={{ borderTopColor: col }}
                    className="bg-slate-900/90 border border-slate-800 border-t-4 rounded-xl p-3 shadow-md flex flex-col items-center text-center transition-all duration-150 hover:scale-[1.02]"
                  >
                    <div
                      style={{ backgroundColor: col }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white mb-2 shadow"
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-200 line-clamp-1">
                      {meta.label}
                    </span>
                    <span
                      style={{ color: col }}
                      className="text-[10px] font-mono font-medium mt-0.5"
                    >
                      {col}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Color Inputs Grid */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Seletores de Cor por Módulo
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MODULES_META.map(meta => {
                const Icon = meta.icon;
                const currentColor = currentColors[meta.key] || '#2563eb';

                return (
                  <div
                    key={meta.key}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 hover:border-slate-600 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        style={{ backgroundColor: currentColor }}
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0"
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-200">{meta.label}</p>
                        <p className="text-[11px] text-slate-400">
                          Padrão: {meta.defaultColorName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Native HTML Color Picker */}
                      <div className="relative overflow-hidden w-9 h-9 rounded-lg border border-slate-600 cursor-pointer shadow">
                        <input
                          type="color"
                          value={currentColor}
                          onChange={(e) => handleColorChange(meta.key, e.target.value)}
                          className="absolute -inset-2 w-14 h-14 cursor-pointer opacity-100"
                        />
                      </div>

                      {/* HEX Code Text Input */}
                      <input
                        type="text"
                        value={currentColor}
                        onChange={(e) => handleColorChange(meta.key, e.target.value)}
                        placeholder="#000000"
                        maxLength={7}
                        className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-xs font-mono text-center text-white focus:outline-none focus:ring-1 focus:ring-blue-500 uppercase"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Padrão ADMJEBOP</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/25 transition-all"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Cores Aplicadas!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Salvar Cores</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
