import React, { useState } from 'react';
import { ModuleColors, ModuleKey } from '../../types';
import {
  LayoutDashboard,
  Users,
  Home,
  Landmark,
  CalendarDays,
  Menu,
  X,
  FileText,
  Globe2,
  HeartHandshake,
  Church,
  Cake,
  Palette,
  Network,
  FileSpreadsheet
} from 'lucide-react';

interface BottomNavProps {
  activeModule: ModuleKey;
  onSelectModule: (module: ModuleKey) => void;
  colors: ModuleColors;
  onOpenColorSettings: () => void;
  onOpenOrganogram: () => void;
  onOpenReports: () => void;
  counts: {
    members: number;
    families: number;
    assets: number;
    events: number;
    birthdaysThisMonth: number;
    visitsPending: number;
  };
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeModule,
  onSelectModule,
  colors,
  onOpenColorSettings,
  onOpenOrganogram,
  onOpenReports,
  counts,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const mainTabs: { key: ModuleKey; label: string; icon: React.ElementType }[] = [
    { key: 'dashboard', label: 'Painel', icon: LayoutDashboard },
    { key: 'members', label: 'Membros', icon: Users },
    { key: 'families', label: 'Famílias', icon: Home },
    { key: 'patrimony', label: 'Patrimônio', icon: Landmark },
    { key: 'agenda', label: 'Agenda', icon: CalendarDays },
  ];

  const moreTabs: { key: ModuleKey; label: string; icon: React.ElementType; badge?: number | string }[] = [
    { key: 'secretariat', label: 'Secretaria & Atas', icon: FileText },
    { key: 'missions', label: 'Missões & Obreiros', icon: Globe2 },
    { key: 'socialAction', label: 'Ação Social & Cestas', icon: HeartHandshake },
    { key: 'pastoralVisits', label: 'Visitação Pastoral', icon: Church, badge: counts.visitsPending > 0 ? `${counts.visitsPending} pendentes` : undefined },
    { key: 'birthdays', label: 'Aniversariantes do Mês', icon: Cake, badge: counts.birthdaysThisMonth },
  ];

  return (
    <>
      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />

          <div className="relative bg-slate-900 border-t border-slate-700/80 rounded-t-3xl p-5 shadow-2xl z-10 max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <Menu className="w-4 h-4 text-amber-400" />
                <span>Mais Módulos & Recursos</span>
              </span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 mb-5">
              {moreTabs.map((item) => {
                const Icon = item.icon;
                const isActive = activeModule === item.key;
                const moduleColor = colors[item.key] || '#2563eb';

                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      onSelectModule(item.key);
                      setDrawerOpen(false);
                    }}
                    style={
                      isActive
                        ? {
                            backgroundColor: `${moduleColor}25`,
                            borderColor: moduleColor,
                            color: '#ffffff',
                          }
                        : undefined
                    }
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border text-xs font-semibold transition-all ${
                      isActive
                        ? 'border-l-4 font-bold'
                        : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        style={{
                          backgroundColor: isActive ? moduleColor : `${moduleColor}25`,
                          color: isActive ? '#ffffff' : moduleColor,
                        }}
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        style={{ backgroundColor: moduleColor }}
                        className="px-2 py-0.5 rounded-full text-[10px] text-white font-bold"
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Tools */}
            <div className="pt-3 border-t border-slate-800">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Ferramentas do Sistema
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    onOpenOrganogram();
                  }}
                  className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-center flex flex-col items-center gap-1 text-[11px] font-semibold text-slate-300 hover:text-white"
                >
                  <Network className="w-4 h-4 text-cyan-400" />
                  <span>Organograma</span>
                </button>
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    onOpenReports();
                  }}
                  className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-center flex flex-col items-center gap-1 text-[11px] font-semibold text-slate-300 hover:text-white"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>Relatórios</span>
                </button>
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    onOpenColorSettings();
                  }}
                  className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-center flex flex-col items-center gap-1 text-[11px] font-semibold text-slate-300 hover:text-white"
                >
                  <Palette className="w-4 h-4 text-amber-400" />
                  <span>Cores</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-2 py-1 flex items-center justify-around shadow-2xl safe-area-pb">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeModule === tab.key;
          const moduleColor = colors[tab.key] || '#2563eb';

          return (
            <button
              key={tab.key}
              onClick={() => onSelectModule(tab.key)}
              className="flex-1 flex flex-col items-center justify-center py-1.5 px-1 relative transition-all"
            >
              <div
                style={
                  isActive
                    ? { backgroundColor: `${moduleColor}25`, color: moduleColor }
                    : { color: '#94a3b8' }
                }
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
              >
                <Icon className="w-4 h-4" />
              </div>
              <span
                style={isActive ? { color: moduleColor, fontWeight: 700 } : { color: '#94a3b8' }}
                className="text-[10px] mt-0.5 tracking-tight"
              >
                {tab.label}
              </span>
              {isActive && (
                <div
                  style={{ backgroundColor: moduleColor }}
                  className="w-1.5 h-1.5 rounded-full absolute bottom-0.5"
                />
              )}
            </button>
          );
        })}

        {/* More trigger */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex-1 flex flex-col items-center justify-center py-1.5 px-1 text-slate-400 hover:text-slate-200 transition-all"
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center">
            <Menu className="w-4 h-4" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Mais</span>
        </button>
      </nav>
    </>
  );
};
