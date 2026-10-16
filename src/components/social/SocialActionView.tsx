import React, { useState } from 'react';
import { ModuleColors, SocialAction } from '../../types';
import { AuthUser } from '../../types/auth';
import { hasPermission } from '../../services/authService';
import {
  HeartHandshake,
  Plus,
  Shield,
  Eye,
  EyeOff,
  Trash2,
  X,
  Package,
  Calendar,
  UserCheck,
  CheckCircle2
} from 'lucide-react';

interface SocialActionViewProps {
  colors: ModuleColors;
  actions: SocialAction[];
  currentUser: AuthUser;
  onAddAction: (action: Omit<SocialAction, 'id'>) => void;
  onDeleteAction: (id: string) => void;
}

export const SocialActionView: React.FC<SocialActionViewProps> = ({
  colors,
  actions,
  currentUser,
  onAddAction,
  onDeleteAction,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showConfidential, setShowConfidential] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [type, setType] = useState<SocialAction['type']>('Cestas Básicas');
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [itemsDistributed, setItemsDistributed] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [responsible, setResponsible] = useState('Diaconisa Maria das Graças');
  const [confidential, setConfidential] = useState(false);
  const [notes, setNotes] = useState('');

  const canEdit = hasPermission(currentUser.role, 'socialAction', 'edit');
  const canDelete = hasPermission(currentUser.role, 'socialAction', 'delete');
  const canSeeConfidential = currentUser.role === 'Administrador' || currentUser.role === 'Pastor';

  const totalBaskets = actions
    .filter(a => a.type === 'Cestas Básicas')
    .reduce((sum, a) => sum + (a.quantity || 1), 0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !beneficiaryName.trim()) return;

    onAddAction({
      title: title.trim(),
      type,
      beneficiaryName: beneficiaryName.trim(),
      itemsDistributed: itemsDistributed.trim() || 'Cesta básica completa',
      quantity: Number(quantity) || 1,
      date,
      responsible: responsible.trim() || 'Diaconia',
      status: 'Entregue',
      confidential,
      notes: notes.trim() || undefined,
    });

    setTitle('');
    setBeneficiaryName('');
    setItemsDistributed('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            style={{ backgroundColor: `${colors.socialAction}25`, color: colors.socialAction }}
            className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-sm shrink-0"
          >
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Ação Social & Assistência Fraterna
              </h1>
              <span
                style={{ backgroundColor: colors.socialAction }}
                className="px-2.5 py-0.5 rounded-full text-white text-xs font-bold"
              >
                {actions.length}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Distribuição de alimentos, auxílios comunitários e socorro às famílias de Remígio-PB
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canSeeConfidential && (
            <button
              onClick={() => setShowConfidential(!showConfidential)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              {showConfidential ? <EyeOff className="w-3.5 h-3.5 text-rose-400" /> : <Eye className="w-3.5 h-3.5 text-rose-400" />}
              <span>{showConfidential ? 'Ocultar Confidenciais' : 'Revelar Confidenciais'}</span>
            </button>
          )}

          {canEdit && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              style={{ backgroundColor: colors.socialAction }}
              className="flex items-center gap-2 px-4 py-2.5 text-white font-bold rounded-xl text-xs shadow-lg shadow-rose-500/25 hover:opacity-90 active:scale-[0.98] transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Ação / Atendimento</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow">
          <span className="text-[11px] font-bold uppercase text-slate-400">Cestas Básicas Entregues</span>
          <p className="text-2xl font-black text-white mt-1">{totalBaskets}</p>
          <p className="text-[10px] text-emerald-400 mt-0.5">Famílias alimentadas com carinho</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow">
          <span className="text-[11px] font-bold uppercase text-slate-400">Campanhas Realizadas</span>
          <p className="text-2xl font-black text-white mt-1">{actions.length}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Atendimentos voluntários registrados</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow">
          <span className="text-[11px] font-bold uppercase text-slate-400">Coordenação Diaconal</span>
          <p className="text-sm font-bold text-white mt-1">Diaconisa Maria das Graças</p>
          <p className="text-[10px] text-rose-400 mt-0.5">Departamento de Ação Social ADMJEBOP</p>
        </div>
      </div>

      {/* ACTIONS LIST */}
      <div className="space-y-3">
        {actions.map((act) => (
          <div
            key={act.id}
            style={{ borderLeftColor: colors.socialAction }}
            className="p-4 bg-slate-900 border border-slate-800 border-l-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow"
          >
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">{act.title}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                  {act.type}
                </span>
                {act.confidential && (
                  <span className="flex items-center gap-1 text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                    <Shield className="w-2.5 h-2.5" />
                    Sigiloso
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300">
                Beneficiário(a): <strong className="text-white">{act.confidential && !showConfidential ? '•••••••••• (Informação Sigilosa)' : act.beneficiaryName}</strong>
              </p>

              <p className="text-xs text-slate-400">
                Itens: {act.itemsDistributed} ({act.quantity} unidades)
              </p>

              {act.notes && (
                <p className="text-[11px] text-slate-400 italic">
                  {act.confidential && !showConfidential ? 'Notas restritas aos pastores.' : act.notes}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto shrink-0 text-xs">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">{act.date.split('-').reverse().join('/')}</span>
                <span className="text-[11px] text-slate-300 font-semibold">{act.responsible}</span>
              </div>

              {canDelete && (
                <button
                  onClick={() => {
                    if (window.confirm('Excluir este registro de ação social?')) {
                      onDeleteAction(act.id);
                    }
                  }}
                  className="text-slate-500 hover:text-rose-400 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ADD ACTION MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg shadow-2xl p-6 text-slate-100 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-rose-400" />
                <span>Registrar Ação Social / Doação</span>
              </h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 flex-1 overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Título da Ação / Campanha *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ex: Campanha Cestas da Fé"
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Tipo de Auxílio</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Cestas Básicas">Cestas Básicas</option>
                    <option value="Roupas & Agasalhos">Roupas & Agasalhos</option>
                    <option value="Auxílio Saúde">Auxílio Saúde & Remédios</option>
                    <option value="S.O.S Famílias">S.O.S Famílias</option>
                    <option value="Atendimento Especial">Atendimento Especial</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Data</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Família ou Pessoa Beneficiada *</label>
                <input
                  type="text"
                  value={beneficiaryName}
                  onChange={(e) => setBeneficiaryName(e.target.value)}
                  placeholder="Nome da pessoa ou família assistida"
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Itens Fornecidos</label>
                  <input
                    type="text"
                    value={itemsDistributed}
                    onChange={(e) => setItemsDistributed(e.target.value)}
                    placeholder="ex: 1 Cesta básica de alimentos"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Quantidade</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Obreiro(a) Responsável</label>
                <input
                  type="text"
                  value={responsible}
                  onChange={(e) => setResponsible(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={confidential}
                    onChange={(e) => setConfidential(e.target.checked)}
                    className="rounded border-slate-700 text-rose-600 bg-slate-800"
                  />
                  <span>Informação Sensível / Confidencial (ocultar de acessos não pastorais)</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs"
                >
                  Registrar Atendimento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
