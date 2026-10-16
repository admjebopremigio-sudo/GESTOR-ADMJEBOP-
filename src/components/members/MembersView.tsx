import React, { useState, useMemo } from 'react';
import { ChurchConfig, Family, Member, ModuleColors, PastoralVisit } from '../../types';
import { AuthUser } from '../../types/auth';
import { hasPermission } from '../../services/authService';
import { MemberDetailModal } from './MemberDetailModal';
import { MemberFormModal } from './MemberFormModal';
import {
  Users,
  Search,
  UserPlus,
  Filter,
  Phone,
  LayoutGrid,
  List,
  Sparkles,
  Home,
  MessageCircle,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface MembersViewProps {
  colors: ModuleColors;
  members: Member[];
  families: Family[];
  visits: PastoralVisit[];
  churchConfig: ChurchConfig;
  currentUser: AuthUser;
  onAddMember: (data: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateMember: (updated: Member) => void;
  onDeleteMember: (id: string) => void;
}

export const MembersView: React.FC<MembersViewProps> = ({
  colors,
  members,
  families,
  visits,
  churchConfig,
  currentUser,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const canEdit = hasPermission(currentUser.role, 'members', 'edit');

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      // 1. Text Search (name, phone, family name, address)
      const q = searchQuery.toLowerCase().trim();
      const linkedFamily = families.find(f => f.id === m.familyId);
      const familyName = linkedFamily?.name.toLowerCase() || '';

      const matchesSearch =
        !q ||
        m.fullName.toLowerCase().includes(q) ||
        m.phone.toLowerCase().includes(q) ||
        familyName.includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.address.neighborhood.toLowerCase().includes(q);

      // 2. Role filter
      const matchesRole = roleFilter === 'ALL' || m.role === roleFilter;

      // 3. Status filter
      const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [members, searchQuery, roleFilter, statusFilter, families]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Nome Completo', 'Cargo', 'Situação', 'Telefone', 'Bairro', 'Data Nascimento'];
    const rows = filteredMembers.map(m => [
      m.id,
      `"${m.fullName}"`,
      `"${m.role}"`,
      `"${m.status}"`,
      `"${m.phone}"`,
      `"${m.address.neighborhood}"`,
      `"${m.birthDate || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `membros_admjebop_remigio_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            style={{ backgroundColor: `${colors.members}25`, color: colors.members }}
            className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-sm shrink-0"
          >
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Membros & Ficha Cadastral
              </h1>
              <span
                style={{ backgroundColor: colors.members }}
                className="px-2.5 py-0.5 rounded-full text-white text-xs font-bold"
              >
                {members.length}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Assembleia de Deus – Ministério Jesus o Bom Pastor • Congregação de Remígio-PB
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-colors"
            title="Exportar dados para planilha Excel / CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Exportar Planilha</span>
          </button>

          {canEdit && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              style={{ backgroundColor: colors.members }}
              className="flex items-center gap-2 px-4 py-2.5 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/25 hover:opacity-90 active:scale-[0.98] transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Novo Membro</span>
            </button>
          )}
        </div>
      </div>

      {/* SEARCH AND FILTERS TOOLBAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          
          {/* Main Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar por nome, telefone, família, cargo ou bairro..."
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Role Filter */}
          <div className="w-full sm:w-52">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Todos os Cargos</option>
              {churchConfig.customRoles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="w-full sm:w-40">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Todas Situações</option>
              <option value="Ativo">Ativo / Comunhão</option>
              <option value="Congregado">Congregado</option>
              <option value="Em disciplina">Em disciplina</option>
              <option value="Afastado">Afastado</option>
              <option value="Transferido">Transferido</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-slate-800 rounded-xl p-1 border border-slate-700 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs ${
                viewMode === 'grid' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
              title="Visualização em Cartões"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs ${
                viewMode === 'table' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
              title="Visualização em Lista/Tabela"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Results Info */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
          <span>
            Exibindo <strong>{filteredMembers.length}</strong> de {members.length} membros
          </span>
          {(searchQuery || roleFilter !== 'ALL' || statusFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setRoleFilter('ALL');
                setStatusFilter('ALL');
              }}
              className="text-blue-400 hover:text-blue-300 font-semibold"
            >
              Redefinir filtros
            </button>
          )}
        </div>
      </div>

      {/* MEMBERS LIST: GRID MODE */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredMembers.length === 0 ? (
            <div className="col-span-full bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
              <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="font-bold text-slate-300 text-sm">Nenhum membro encontrado</p>
              <p className="text-slate-500 mt-1">
                Tente ajustar os termos da pesquisa ou cadastre um novo membro.
              </p>
            </div>
          ) : (
            filteredMembers.map((m) => {
              const linkedFamily = families.find(f => f.id === m.familyId);

              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMember(m)}
                  className="bg-slate-900 border border-slate-800 hover:border-blue-500/60 rounded-2xl p-4 shadow-md hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Photo + Info */}
                    <div className="flex items-start gap-3.5 mb-3">
                      <div className="relative shrink-0">
                        {m.photoUrl ? (
                          <img
                            src={m.photoUrl}
                            alt={m.fullName}
                            className="w-13 h-13 rounded-2xl object-cover ring-2 ring-slate-700 group-hover:ring-blue-500 transition-all shadow"
                          />
                        ) : (
                          <div className="w-13 h-13 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-base">
                            {m.fullName.charAt(0)}
                          </div>
                        )}
                        <span
                          className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                            m.status === 'Ativo' ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors truncate">
                          {m.fullName}
                        </h3>
                        <p className="text-xs font-semibold text-blue-400 truncate mt-0.5">
                          {m.role}
                        </p>
                        {m.department && (
                          <p className="text-[10px] text-slate-400 truncate">
                            {m.department}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Metadata tags */}
                    <div className="space-y-1.5 text-[11px] text-slate-400 bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
                      {linkedFamily && (
                        <div className="flex items-center gap-1.5 text-emerald-400 font-medium truncate">
                          <Home className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{linkedFamily.name} ({m.familyRole || 'Membro'})</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="truncate">{m.address.neighborhood}, Remígio</span>
                        {m.birthDate && (
                          <span className="text-slate-400 shrink-0">
                            Nasc: {m.birthDate.split('-').slice(1).reverse().join('/')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800 text-[11px]">
                    <span className="text-slate-500">
                      {m.documents?.length || 0} anexo(s)
                    </span>

                    <div className="flex items-center gap-2">
                      {m.phone && (
                        <a
                          href={`https://wa.me/55${m.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1 rounded-lg text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                          title="WhatsApp do Membro"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      )}
                      <span className="text-blue-400 font-semibold group-hover:underline">
                        Ver Ficha
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* MEMBERS LIST: TABLE MODE */}
      {viewMode === 'table' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Membro</th>
                  <th className="py-3 px-4">Cargo / Função</th>
                  <th className="py-3 px-4">Família</th>
                  <th className="py-3 px-4">Telefone</th>
                  <th className="py-3 px-4">Bairro</th>
                  <th className="py-3 px-4">Situação</th>
                  <th className="py-3 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredMembers.map((m) => {
                  const linkedFamily = families.find(f => f.id === m.familyId);

                  return (
                    <tr
                      key={m.id}
                      onClick={() => setSelectedMember(m)}
                      className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 flex items-center gap-2.5">
                        {m.photoUrl ? (
                          <img
                            src={m.photoUrl}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700 shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white shrink-0">
                            {m.fullName.charAt(0)}
                          </div>
                        )}
                        <span className="font-bold text-white truncate max-w-[180px]">
                          {m.fullName}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-blue-400 font-medium">
                        {m.role}
                      </td>

                      <td className="py-3 px-4 text-slate-400">
                        {linkedFamily?.name || '-'}
                      </td>

                      <td className="py-3 px-4 text-slate-300">
                        {m.phone || '-'}
                      </td>

                      <td className="py-3 px-4 text-slate-400">
                        {m.address.neighborhood}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            m.status === 'Ativo'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {m.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button className="text-blue-400 hover:text-blue-300 font-semibold text-xs">
                          Abrir
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MEMBER DETAIL MODAL */}
      {selectedMember && (
        <MemberDetailModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
          onUpdate={(updated) => {
            onUpdateMember(updated);
            setSelectedMember(updated);
          }}
          onDelete={(id) => {
            onDeleteMember(id);
            setSelectedMember(null);
          }}
          families={families}
          allMembers={members}
          visits={visits}
          churchConfig={churchConfig}
          currentUser={currentUser}
          onSelectMember={(mem) => setSelectedMember(mem)}
        />
      )}

      {/* ADD MEMBER MODAL */}
      <MemberFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={onAddMember}
        families={families}
        churchConfig={churchConfig}
      />
    </div>
  );
};
