import React, { useState } from 'react';
import { ChurchConfig, ModuleColors } from '../../types';
import { AuthUser } from '../../types/auth';
import { ChurchLogo } from '../common/ChurchLogo';
import {
  Palette,
  Network,
  FileSpreadsheet,
  LogOut,
  User,
  Shield,
  ChevronDown,
  Sparkles,
  Download,
  Upload,
  Settings
} from 'lucide-react';
import { StorageService } from '../../services/storageService';

interface NavbarProps {
  churchConfig: ChurchConfig;
  colors: ModuleColors;
  currentUser: AuthUser;
  onLogout: () => void;
  onOpenColorSettings: () => void;
  onOpenChurchConfig: () => void;
  onOpenOrganogram: () => void;
  onOpenReports: () => void;
  onSwitchUser?: (newUser: AuthUser) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  churchConfig,
  colors,
  currentUser,
  onLogout,
  onOpenColorSettings,
  onOpenChurchConfig,
  onOpenOrganogram,
  onOpenReports,
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [backupStatus, setBackupStatus] = useState<string | null>(null);

  const handleDownloadBackup = () => {
    const jsonStr = StorageService.exportBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_admjebop_remigio_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setBackupStatus('Backup salvo com sucesso!');
    setTimeout(() => setBackupStatus(null), 2500);
  };

  const handleRestoreBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const ok = StorageService.restoreBackup(reader.result);
          if (ok) {
            setBackupStatus('Dados restaurados com sucesso! Atualizando...');
            setTimeout(() => window.location.reload(), 1200);
          } else {
            alert('Arquivo de backup inválido.');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const roleBadgeColor: Record<string, string> = {
    Administrador: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    Pastor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    'Secretária': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    Tesouraria: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    'Líder de Ministério': 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    Membro: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        
        {/* Left: Church Brand & Logo */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            onClick={onOpenChurchConfig}
            className="cursor-pointer group flex items-center gap-2.5"
            title="Clique para editar dados da igreja ou trocar o logo"
          >
            <div className="relative">
              <ChurchLogo
                logoUrl={churchConfig.logoUrl}
                size="sm"
                className="ring-2 ring-amber-400/30 group-hover:ring-amber-400 transition-all shrink-0"
              />
              <span className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-0.5 rounded-full text-[9px] opacity-0 group-hover:opacity-100 transition-opacity">
                <Sparkles className="w-2.5 h-2.5" />
              </span>
            </div>
            
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm sm:text-base tracking-wide text-white truncate">
                  {churchConfig.name}
                </span>
                <span className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 rounded border border-amber-500/30 uppercase">
                  Remígio-PB
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate hidden sm:block">
                {churchConfig.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Quick Action: Organogram */}
          <button
            onClick={onOpenOrganogram}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 flex items-center gap-1.5 transition-all"
            title="Organograma Eclesiástico em Tempo Real"
          >
            <Network className="w-4 h-4 text-cyan-400" />
            <span className="hidden lg:inline">Organograma</span>
          </button>

          {/* Quick Action: Reports */}
          <button
            onClick={onOpenReports}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 flex items-center gap-1.5 transition-all"
            title="Relatórios e Documentos Oficiais"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span className="hidden lg:inline">Relatórios</span>
          </button>

          {/* Quick Action: Color Settings */}
          <button
            onClick={onOpenColorSettings}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 flex items-center gap-1.5 transition-all"
            title="Personalizar Cores dos Módulos"
          >
            <Palette className="w-4 h-4 text-amber-400" />
            <span className="hidden lg:inline">Cores</span>
          </button>

          {/* User Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition-all text-left"
            >
              {currentUser.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-blue-500"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                  {currentUser.name.charAt(0)}
                </div>
              )}
              
              <div className="hidden sm:block text-left leading-tight">
                <p className="text-xs font-bold text-slate-200 truncate max-w-[120px]">
                  {currentUser.name}
                </p>
                <span className={`inline-block text-[10px] px-1.5 py-0.2 rounded border font-semibold ${roleBadgeColor[currentUser.role] || 'text-slate-400'}`}>
                  {currentUser.role}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {/* Dropdown Menu */}
            {userMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl py-2 z-50 text-slate-200 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-2.5 border-b border-slate-800">
                    <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-[11px] font-semibold text-blue-300">
                        {currentUser.role}
                      </span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onOpenChurchConfig();
                      }}
                      className="w-full text-left px-4 py-2 text-xs flex items-center gap-2.5 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>Dados da Congregação & Logo</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onOpenColorSettings();
                      }}
                      className="w-full text-left px-4 py-2 text-xs flex items-center gap-2.5 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                    >
                      <Palette className="w-4 h-4 text-amber-400" />
                      <span>Cores dos Módulos</span>
                    </button>

                    <button
                      onClick={handleDownloadBackup}
                      className="w-full text-left px-4 py-2 text-xs flex items-center gap-2.5 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                    >
                      <Download className="w-4 h-4 text-emerald-400" />
                      <span>Fazer Backup (Baixar JSON)</span>
                    </button>

                    <label className="w-full text-left px-4 py-2 text-xs flex items-center gap-2.5 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer">
                      <Upload className="w-4 h-4 text-cyan-400" />
                      <span>Restaurar Backup</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleRestoreBackup}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="pt-1 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-xs flex items-center gap-2.5 text-rose-400 hover:bg-rose-500/10 transition-colors font-semibold"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Encerrar Sessão</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {backupStatus && (
        <div className="bg-emerald-600 text-white text-xs text-center py-1 font-semibold">
          {backupStatus}
        </div>
      )}
    </header>
  );
};
