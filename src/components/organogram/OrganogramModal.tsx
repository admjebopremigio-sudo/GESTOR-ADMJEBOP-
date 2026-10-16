import React from 'react';
import { ChurchConfig, Member } from '../../types';
import {
  Network,
  X,
  Printer,
  User,
  Shield,
  Heart,
  ChevronDown,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface OrganogramModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: Member[];
  churchConfig: ChurchConfig;
  onSelectMember: (member: Member) => void;
}

export const OrganogramModal: React.FC<OrganogramModalProps> = ({
  isOpen,
  onClose,
  members,
  churchConfig,
  onSelectMember,
}) => {
  if (!isOpen) return null;

  // Group members into ministerial tiers
  // 1. Pastoral Tier
  const pastors = members.filter(m =>
    m.role.toLowerCase().includes('pastor')
  );

  // 2. Secretarial & Finance Tier
  const secretariat = members.filter(m =>
    m.role.toLowerCase().includes('secretária') ||
    m.role.toLowerCase().includes('secretaria') ||
    m.role.toLowerCase().includes('tesour')
  );

  // 3. Department Leaders (All the requested dirigentes)
  const departmentLeaders = members.filter(m =>
    m.role.toLowerCase().includes('dirigente') && !m.role.toLowerCase().includes('pastor')
  );

  // 4. Presbytery & Ministerial Officers (Evangelistas, Presbíteros)
  const presbyters = members.filter(m =>
    m.role.toLowerCase().includes('presbítero') ||
    m.role.toLowerCase().includes('evangelista')
  );

  // 5. Diaconate & Assistants (Diáconos, Diaconisas, Cooperadores)
  const diaconate = members.filter(m =>
    m.role.toLowerCase().includes('diácono') ||
    m.role.toLowerCase().includes('diaconisa') ||
    m.role.toLowerCase().includes('cooperador') ||
    m.role.toLowerCase().includes('auxiliar')
  );

  const handlePrint = () => {
    window.print();
  };

  const renderMemberCard = (m: Member, accentColor: string) => (
    <div
      key={m.id}
      onClick={() => {
        onClose();
        onSelectMember(m);
      }}
      className="p-3 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-slate-500 rounded-2xl flex items-center gap-3 cursor-pointer transition-all shadow-md group min-w-[200px]"
    >
      {m.photoUrl ? (
        <img
          src={m.photoUrl}
          alt={m.fullName}
          className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-slate-600 group-hover:ring-amber-400"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white text-xs shrink-0">
          {m.fullName.charAt(0)}
        </div>
      )}

      <div className="min-w-0">
        <p className="text-xs font-bold text-white group-hover:text-amber-300 truncate">
          {m.fullName}
        </p>
        <p style={{ color: accentColor }} className="text-[10px] font-semibold truncate capitalize">
          {m.role}
        </p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/20 text-cyan-400 rounded-2xl">
              <Network className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Organograma Eclesiástico em Tempo Real
              </h2>
              <p className="text-xs text-slate-400">
                {churchConfig.name} • {churchConfig.congregation}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Organograma</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Organogram Flow Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 text-center printable-area">
          
          {/* TIER 1: PASTORAL */}
          <div className="flex flex-col items-center">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/40 mb-3">
              Pastor Presidente & Diretoria Pastoral
            </span>
            <div className="flex flex-wrap justify-center gap-3">
              {pastors.map(m => renderMemberCard(m, '#fbbf24'))}
            </div>
            <div className="w-0.5 h-6 bg-slate-700 my-1" />
          </div>

          {/* TIER 2: SECRETARIA & FINANÇAS */}
          <div className="flex flex-col items-center">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-700 text-slate-300 border border-slate-600 mb-3">
              Secretaria Geral & Secretaria de Missões
            </span>
            <div className="flex flex-wrap justify-center gap-3">
              {secretariat.map(m => renderMemberCard(m, '#94a3b8'))}
            </div>
            <div className="w-0.5 h-6 bg-slate-700 my-1" />
          </div>

          {/* TIER 3: DIRIGENTES DOS DEPARTAMENTOS */}
          <div className="flex flex-col items-center">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/40 mb-3">
              Dirigentes de Departamentos & Círculos de Oração
            </span>
            <p className="text-[11px] text-slate-400 mb-3 max-w-xl">
              Vaso de Unção, Shalom Adonai, Apocalipse, Gideão, Departamento de Missões, Casais, Homens e EBD
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 w-full max-w-4xl">
              {departmentLeaders.map(m => renderMemberCard(m, '#60a5fa'))}
            </div>
            <div className="w-0.5 h-6 bg-slate-700 my-1" />
          </div>

          {/* TIER 4: PRESBÍTEROS & EVANGELISTAS */}
          {presbyters.length > 0 && (
            <div className="flex flex-col items-center">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/40 mb-3">
                Corpo Presbiterial & Evangelistas
              </span>
              <div className="flex flex-wrap justify-center gap-3">
                {presbyters.map(m => renderMemberCard(m, '#2dd4bf'))}
              </div>
              <div className="w-0.5 h-6 bg-slate-700 my-1" />
            </div>
          )}

          {/* TIER 5: CORPO DIACONAL & AUXILIARES */}
          {diaconate.length > 0 && (
            <div className="flex flex-col items-center">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/40 mb-3">
                Corpo Diaconal & Assistência Ministerial
              </span>
              <div className="flex flex-wrap justify-center gap-3">
                {diaconate.map(m => renderMemberCard(m, '#c084fc'))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
