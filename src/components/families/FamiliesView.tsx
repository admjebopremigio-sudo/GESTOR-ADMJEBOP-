import React, { useState } from 'react';
import { Family, Member, ModuleColors } from '../../types';
import { AuthUser } from '../../types/auth';
import { hasPermission } from '../../services/authService';
import {
  Home,
  Users,
  Search,
  Plus,
  Phone,
  MapPin,
  ExternalLink,
  Edit2,
  Trash2,
  X,
  Save,
  CheckCircle2,
  Heart
} from 'lucide-react';

interface FamiliesViewProps {
  colors: ModuleColors;
  families: Family[];
  members: Member[];
  currentUser: AuthUser;
  onAddFamily: (family: Omit<Family, 'id' | 'createdAt'>) => void;
  onUpdateFamily: (id: string, updates: Partial<Family>) => void;
  onDeleteFamily: (id: string) => void;
  onSelectMember: (member: Member) => void;
}

export const FamiliesView: React.FC<FamiliesViewProps> = ({
  colors,
  families,
  members,
  currentUser,
  onAddFamily,
  onUpdateFamily,
  onDeleteFamily,
  onSelectMember,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingFamily, setEditingFamily] = useState<Family | null>(null);

  // Form states
  const [familyName, setFamilyName] = useState('');
  const [headMemberId, setHeadMemberId] = useState('');
  const [addressSummary, setAddressSummary] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const canEdit = hasPermission(currentUser.role, 'families', 'edit');
  const canDelete = hasPermission(currentUser.role, 'families', 'delete');

  const filteredFamilies = families.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (f.addressSummary && f.addressSummary.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (f.phone && f.phone.includes(searchQuery))
  );

  const handleCreateFamily = (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyName.trim()) return;

    onAddFamily({
      name: familyName.trim(),
      headMemberId: headMemberId || undefined,
      addressSummary: addressSummary.trim() || undefined,
      phone: phone.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    setFamilyName('');
    setHeadMemberId('');
    setAddressSummary('');
    setPhone('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFamily || !editingFamily.name.trim()) return;

    onUpdateFamily(editingFamily.id, {
      name: editingFamily.name.trim(),
      headMemberId: editingFamily.headMemberId,
      addressSummary: editingFamily.addressSummary,
      phone: editingFamily.phone,
      notes: editingFamily.notes,
    });

    setEditingFamily(null);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            style={{ backgroundColor: `${colors.families}25`, color: colors.families }}
            className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-sm shrink-0"
          >
            <Home className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Famílias da Congregação
              </h1>
              <span
                style={{ backgroundColor: colors.families }}
                className="px-2.5 py-0.5 rounded-full text-white text-xs font-bold"
              >
                {families.length}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Gestão de núcleos familiares integrados ao cadastro único de membros
            </p>
          </div>
        </div>

        {canEdit && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            style={{ backgroundColor: colors.families }}
            className="flex items-center gap-2 px-4 py-2.5 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/25 hover:opacity-90 active:scale-[0.98] transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Nova Família</span>
          </button>
        )}
      </div>

      {/* Search Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar família por sobrenome, endereço ou telefone..."
            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* FAMILIES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFamilies.length === 0 ? (
          <div className="col-span-full bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
            <Home className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="font-bold text-slate-300">Nenhuma família encontrada</p>
          </div>
        ) : (
          filteredFamilies.map((fam) => {
            const familyMembers = members.filter(m => m.familyId === fam.id);
            const headMember = members.find(m => m.id === fam.headMemberId);

            return (
              <div
                key={fam.id}
                onClick={() => setSelectedFamily(fam)}
                style={{ borderTopColor: colors.families }}
                className="bg-slate-900 border border-slate-800 border-t-4 hover:border-emerald-500/60 rounded-2xl p-5 shadow-md hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
                        {fam.name}
                      </h3>
                      {headMember && (
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          Responsável: <strong className="text-slate-200">{headMember.fullName}</strong>
                        </p>
                      )}
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
                      {familyMembers.length} {familyMembers.length === 1 ? 'membro' : 'membros'}
                    </span>
                  </div>

                  {/* Members Photos row */}
                  <div className="flex items-center gap-1.5 mb-4 overflow-hidden py-1">
                    {familyMembers.slice(0, 5).map((m) => (
                      <div key={m.id} title={m.fullName}>
                        {m.photoUrl ? (
                          <img
                            src={m.photoUrl}
                            alt={m.fullName}
                            className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-800"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-800 text-[11px] font-bold text-slate-300 flex items-center justify-center ring-2 ring-slate-800">
                            {m.fullName.charAt(0)}
                          </div>
                        )}
                      </div>
                    ))}
                    {familyMembers.length > 5 && (
                      <div className="w-8 h-8 rounded-full bg-slate-800 text-[10px] font-bold text-slate-400 flex items-center justify-center ring-2 ring-slate-800">
                        +{familyMembers.length - 5}
                      </div>
                    )}
                  </div>

                  {fam.addressSummary && (
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 truncate mb-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{fam.addressSummary}</span>
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-800 text-xs">
                  <span className="text-emerald-400 font-semibold group-hover:underline flex items-center gap-1">
                    <span>Ver Integrantes</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>

                  {canDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Excluir a ${fam.name}?`)) {
                          onDeleteFamily(fam.id);
                        }
                      }}
                      className="text-slate-500 hover:text-rose-400 p-1"
                      title="Excluir família"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* FAMILY DETAIL MODAL */}
      {selectedFamily && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-2xl">
                  <Home className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    {selectedFamily.name}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {selectedFamily.addressSummary || 'Endereço em Remígio-PB'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {canEdit && (
                  <button
                    onClick={() => {
                      setEditingFamily({ ...selectedFamily });
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                    title="Editar informações da família"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setSelectedFamily(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Membros Integrantes desta Família
                </span>
                <span className="text-xs font-bold text-emerald-400">
                  {members.filter(m => m.familyId === selectedFamily.id).length} pessoas
                </span>
              </div>

              <div className="space-y-2.5">
                {members
                  .filter(m => m.familyId === selectedFamily.id)
                  .map((m) => (
                    <div
                      key={m.id}
                      onClick={() => {
                        setSelectedFamily(null);
                        onSelectMember(m);
                      }}
                      className="p-3.5 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {m.photoUrl ? (
                          <img
                            src={m.photoUrl}
                            alt={m.fullName}
                            className="w-11 h-11 rounded-full object-cover shrink-0 ring-1 ring-slate-600 group-hover:ring-emerald-400"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white shrink-0">
                            {m.fullName.charAt(0)}
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white group-hover:text-emerald-300 truncate">
                            {m.fullName}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">
                            {m.familyRole || 'Membro'} • <span className="text-blue-400">{m.role}</span>
                          </p>
                          {m.phone && (
                            <p className="text-[10px] text-slate-500 mt-0.5">{m.phone}</p>
                          )}
                        </div>
                      </div>

                      <span className="text-xs text-slate-400 group-hover:text-white flex items-center gap-1 font-semibold shrink-0">
                        <span>Abrir Ficha</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  ))}
              </div>

              {selectedFamily.notes && (
                <div className="p-3 bg-slate-800/30 rounded-xl border border-slate-800 mt-4 text-xs text-slate-300">
                  <p className="font-bold text-slate-400 mb-1">Notas da Família:</p>
                  <p>{selectedFamily.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ADD FAMILY MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-lg shadow-2xl p-6 text-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Home className="w-5 h-5 text-emerald-400" />
                <span>Nova Família</span>
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFamily} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nome da Família (Sobrenome) *
                </label>
                <input
                  type="text"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  placeholder="ex: Família Bento"
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Chefe de Família / Responsável Principal
                </label>
                <select
                  value={headMemberId}
                  onChange={(e) => setHeadMemberId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="">Selecionar membro cadastrado</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.fullName} ({m.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Endereço Residencial em Remígio-PB
                </label>
                <input
                  type="text"
                  value={addressSummary}
                  onChange={(e) => setAddressSummary(e.target.value)}
                  placeholder="ex: Rua Principal, Centro, Remígio-PB"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Telefone de Contato
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(83) 9...."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Observações
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow"
                >
                  Cadastrar Família
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT FAMILY MODAL */}
      {editingFamily && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg p-6 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="text-base font-bold text-white">Editar Dados da Família</h2>
              <button onClick={() => setEditingFamily(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nome da Família *</label>
                <input
                  type="text"
                  value={editingFamily.name}
                  onChange={(e) => setEditingFamily({ ...editingFamily, name: e.target.value })}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Endereço</label>
                <input
                  type="text"
                  value={editingFamily.addressSummary || ''}
                  onChange={(e) => setEditingFamily({ ...editingFamily, addressSummary: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Telefone</label>
                <input
                  type="text"
                  value={editingFamily.phone || ''}
                  onChange={(e) => setEditingFamily({ ...editingFamily, phone: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingFamily(null)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
