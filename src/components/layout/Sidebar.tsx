import React from 'react';
import { ModuleColors, ModuleKey } from '../../types';
import {
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
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeModule: ModuleKey;
  onSelectModule: (module: ModuleKey) => void;
  colors: ModuleColors;
  counts: {
    members: number;
    families: number;
    assets: number;
    events: number;
    birthdaysThisMonth: number;
    visitsPending: number;
  };
}

interface NavItem {
  key: ModuleKey;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  onSelectModule,
  colors,
  counts,
}) => {
  const navItems: NavItem[] = [
    { key: 'dashboard', label: 'Painel', icon: LayoutDashboard },
    { key: 'members', label: 'Membros', icon: Users, badge: counts.members },
    { key: 'families', label: 'Famílias', icon: Home, badge: counts.families },
    { key: 'secretariat', label: 'Secretaria', icon: FileText },
    { key: 'missions', label: 'Missões', icon: Globe2 },
    { key: 'socialAction', label: 'Ação Social', icon: HeartHandshake },
    { key: 'pastoralVisits', label: 'Visitação Pastoral', icon: Church, badge: counts.visitsPending > 0 ? `${counts.visitsPending} pend.` : undefined },
    { key: 'patrimony', label: 'Patrimônio', icon: Landmark, badge: counts.assets },
    { key: 'birthdays', label: 'Aniversariantes', icon: Cake, badge: counts.birthdaysThisMonth },
    { key: 'agenda', label: 'Agenda Anual', icon: CalendarDays, badge: counts.events },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 text-slate-300 shrink-0 select-none">
      <div className="p-3 space-y-1 overflow-y-auto flex-1">
        <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Módulos Ministeriais
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.key;
          const moduleColor = colors[item.key] || '#2563eb';

          return (
            <button
              key={item.key}
              onClick={() => onSelectModule(item.key)}
              style={
                isActive
                  ? {
                      backgroundColor: `${moduleColor}20`,
                      borderColor: moduleColor,
                      color: '#ffffff',
                    }
                  : undefined
              }
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                isActive
                  ? 'border-l-4 font-bold shadow-sm'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  style={{
                    backgroundColor: isActive ? moduleColor : `${moduleColor}25`,
                    color: isActive ? '#ffffff' : moduleColor,
                  }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors shadow-xs"
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="truncate">{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {item.badge !== undefined && (
                  <span
                    style={
                      isActive
                        ? { backgroundColor: moduleColor, color: '#ffffff' }
                        : { backgroundColor: 'rgba(51, 65, 85, 0.8)', color: '#cbd5e1' }
                    }
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-500">
        <p className="font-semibold text-slate-400">ADMJEBOP Remígio-PB</p>
        <p className="text-[10px]">Gestão Ministerial Integrada</p>
      </div>
    </aside>
  );
};
