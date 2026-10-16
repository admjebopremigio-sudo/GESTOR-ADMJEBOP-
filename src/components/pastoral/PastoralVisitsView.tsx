import React, { useState } from 'react';
import { Member, ModuleColors, PastoralVisit } from '../../types';
import { AuthUser } from '../../types/auth';
import { hasPermission } from '../../services/authService';
import {
  Church,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  User,
  Trash2,
  X,
  Phone,
  Search,
  MessageCircle
} from 'lucide-react';

interface PastoralVisitsViewProps {
  colors: ModuleColors;
  visits: PastoralVisit[];
  members: Member[];
  currentUser: AuthUser;
  onAddVisit: (visit: Omit<PastoralVisit, 'id'>) => void;
  onUpdateVisit: (id: string, updates: Partial<PastoralVisit>) => void;
  onDeleteVisit: (id: string) => void;
}

export const PastoralVisitsView: React.FC<PastoralVisitsViewProps> = ({
  colors,
  visits,
  members,
  currentUser,
  onAddVisit,
  onUpdateVisit,
  onDeleteVisit,
}) => {
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Pendente' | 'Agendada' | 'Realizada'>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [memberId, setMemberId] = useState('');
  const [memberName, setMemberName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('15:00');
  const [visitorName, setVisitorName] = useState('Pr. Joel Bento & Diaconia');
  const [visitorRole, setVisitorRole] = useState('Pastor Titular');
  const [purpose, setPurpose] = useState<PastoralVisit['purpose']>('Enfermidade');
  const [status, setStatus] = useState<PastoralVisit['status']>('Agendada');
  const [notes, setNotes] = useState('');

  const canEdit = hasPermission(currentUser.role, 'pastoralVisits', 'edit');
  const canDelete = hasPermission(currentUser.role, 'pastoralVisits', 'delete');

  const filteredVisits = visits.filter(v => statusFilter === 'ALL' || v.status === statusFilter);

  const pendingCount = visits.filter(v => v.status === 'Pendente').length;
  const scheduledCount = visits.filter(v => v.status === 'Agendada').length;
  const completedCount = visits.filter(v => v.status === 'Realizada').length;

  const handleMemberSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setMemberId(id);
    const found = members.find(m => m.id === id);
    if (found) {
      setMemberName(found.fullName);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim()) return;

    onAddVisit({
      memberId: memberId || undefined,
      memberName: memberName.trim(),
      date,
      time,
      visitorName,
      visitorRole,
      purpose,
      status,
      notes: notes.trim(),
    });

    setMemberId('');
    setMemberName('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  const handleToggleComplete = (v: PastoralVisit) => {
    const newStatus = v.status === 'Realizada' ? 'Pendente' : 'Realizada';
    onUpdateVisit(v.id, { status: newStatus });
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            style={{ backgroundColor: `${colors.pastoralVisits}25`, color: colors.pastoralVisits }}
            className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-sm shrink-0"
          >
            <Church className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Visitação Pastoral & Diaconia
              </h1>
              <span
                style={{ backgroundColor: colors.pastoralVisits }}
                className="px-2.5 py-0.5 rounded-full text-white text-xs font-bold"
              >
                {visits.length}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Acompanhamento espiritual aos enfermos, novos convertidos e lares da congregação
            </p>
          </div>
        </div>

        {canEdit && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            style={{ backgroundColor: colors.pastoralVisits }}
            className="flex items-center gap-2 px-4 py-2.5 text-white font-bold rounded-xl text-xs shadow-lg shadow-teal-500/25 hover:opacity-90 active:scale-[0.98] transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Agendar Nova Visita Pastoral</span>
          </button>
        )}
      </div>

      {/* KPI COUNTERS */}
      <div className="grid grid-cols-3 gap-3">
        <div
          onClick={() => setStatusFilter(statusFilter === 'Pendente' ? 'ALL' : 'Pendente')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'Pendente'
              ? 'bg-rose-950/40 border-rose-500'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-rose-400 text-xs font-bold">
            <span>Pendentes / Urgentes</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-white mt-1">{pendingCount}</p>
        </div>

        <div
          onClick={() => setStatusFilter(statusFilter === 'Agendada' ? 'ALL' : 'Agendada')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'Agendada'
              ? 'bg-teal-950/40 border-teal-500'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-teal-400 text-xs font-bold">
            <span>Agendadas</span>
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-white mt-1">{scheduledCount}</p>
        </div>

        <div
          onClick={() => setStatusFilter(statusFilter === 'Realizada' ? 'ALL' : 'Realizada')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'Realizada'
              ? 'bg-emerald-950/40 border-emerald-500'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-emerald-400 text-xs font-bold">
            <span>Realizadas</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-white mt-1">{completedCount}</p>
        </div>
      </div>

      {/* VISITS LIST */}
      <div className="space-y-3">
        {filteredVisits.map((vis) => {
          const isDone = vis.status === 'Realizada';

          return (
            <div
              key={vis.id}
              style={{ borderLeftColor: colors.pastoralVisits }}
              className="p-4 bg-slate-900 border border-slate-800 border-l-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow"
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">{vis.memberName}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30">
                    Motivo: {vis.purpose}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isDone
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {vis.status}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {vis.notes || 'Sem observações registradas'}
                </p>

                <p className="text-[11px] text-slate-400">
                  Data: <strong className="text-slate-300">{vis.date.split('-').reverse().join('/')} às {vis.time}</strong> • Visitador: {vis.visitorName} ({vis.visitorRole})
                </p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <button
                  onClick={() => handleToggleComplete(vis)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    isDone
                      ? 'bg-slate-800 text-slate-400 hover:text-white'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isDone ? 'Reabrir' : 'Concluir Visita'}</span>
                </button>

                {canDelete && (
                  <button
                    onClick={() => {
                      if (window.confirm('Excluir este agendamento de visita?')) {
                        onDeleteVisit(vis.id);
                      }
                    }}
                    className="text-slate-500 hover:text-rose-400 p-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD VISIT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg shadow-2xl p-6 text-slate-100 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Church className="w-5 h-5 text-teal-400" />
                <span>Agendar Nova Visita Pastoral</span>
              </h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 flex-1 overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Membro a ser Visitado</label>
                <select
                  value={memberId}
                  onChange={handleMemberSelect}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="">Selecionar da lista ou digitar abaixo</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.fullName} ({m.role})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nome da Pessoa / Família *</label>
                <input
                  type="text"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder="Nome do irmão(ã) ou família visitada"
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Data da Visita</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Horário Previsto</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Propósito / Motivo</label>
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Enfermidade">Enfermidade / Hospitalar</option>
                    <option value="Novo Convertido">Novo Convertido / Discipulado</option>
                    <option value="Aconselhamento">Aconselhamento Pastoral</option>
                    <option value="Boas-vindas">Boas-vindas ao Membro</option>
                    <option value="Enlutado">Família Enlutada</option>
                    <option value="Rotina">Visita Fraterna de Rotina</option>
                    <option value="Urgência">Situação de Urgência</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Status Inicial</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Agendada">Agendada</option>
                    <option value="Pendente">Pendente / Urgente</option>
                    <option value="Realizada">Já Realizada</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Visitadores Responsáveis</label>
                <input
                  type="text"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  placeholder="ex: Pr. Joel Bento e Presb. Messias"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Observações Pastorais / Necessidades</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Relato do caso, pedidos de oração ou orientações"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
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
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-xs"
                >
                  Confirmar Agendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
