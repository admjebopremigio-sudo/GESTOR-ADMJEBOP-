import React, { useState } from 'react';
import { MissionItem, ModuleColors } from '../../types';
import { AuthUser } from '../../types/auth';
import { hasPermission } from '../../services/authService';
import {
  Globe2,
  Plus,
  Phone,
  MapPin,
  Heart,
  Image,
  Trash2,
  Edit2,
  X,
  CheckCircle2
} from 'lucide-react';

interface MissionsViewProps {
  colors: ModuleColors;
  missions: MissionItem[];
  currentUser: AuthUser;
  onAddMission: (mission: Omit<MissionItem, 'id'>) => void;
  onDeleteMission: (id: string) => void;
}

export const MissionsView: React.FC<MissionsViewProps> = ({
  colors,
  missions,
  currentUser,
  onAddMission,
  onDeleteMission,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<MissionItem['type']>('Campo Missionário');
  const [leader, setLeader] = useState('');
  const [phone, setPhone] = useState('');
  const [report, setReport] = useState('');
  const [prayerRequests, setPrayerRequests] = useState('');
  const [financialSupport, setFinancialSupport] = useState(500);

  const canEdit = hasPermission(currentUser.role, 'missions', 'edit');
  const canDelete = hasPermission(currentUser.role, 'missions', 'delete');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !leader.trim()) return;

    onAddMission({
      title: title.trim(),
      location: location.trim(),
      type,
      leader: leader.trim(),
      phone: phone.trim() || undefined,
      report: report.trim(),
      prayerRequests: prayerRequests.trim(),
      financialSupportMonthly: financialSupport,
      photos: [],
      status: 'Ativo',
    });

    setTitle('');
    setLocation('');
    setLeader('');
    setReport('');
    setPrayerRequests('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            style={{ backgroundColor: `${colors.missions}25`, color: colors.missions }}
            className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-sm shrink-0"
          >
            <Globe2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Missões & Evangelismo
              </h1>
              <span
                style={{ backgroundColor: colors.missions }}
                className="px-2.5 py-0.5 rounded-full text-white text-xs font-bold"
              >
                {missions.length} campos
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Departamento de Missões • Sustento, oração e cruzadas nos sítios e sertão
            </p>
          </div>
        </div>

        {canEdit && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            style={{ backgroundColor: colors.missions }}
            className="flex items-center gap-2 px-4 py-2.5 text-white font-bold rounded-xl text-xs shadow-lg shadow-purple-500/25 hover:opacity-90 active:scale-[0.98] transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Projeto Missionário</span>
          </button>
        )}
      </div>

      {/* MISSIONS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {missions.map((m) => (
          <div
            key={m.id}
            style={{ borderTopColor: colors.missions }}
            className="bg-slate-900 border border-slate-800 border-t-4 rounded-2xl p-5 shadow-lg flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block">
                    {m.type}
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    {m.title}
                  </h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>{m.location}</span>
                  </p>
                </div>

                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
                  {m.status}
                </span>
              </div>

              {/* Photos row if present */}
              {m.photos && m.photos.length > 0 && (
                <div className="flex gap-2 h-28 rounded-xl overflow-hidden">
                  {m.photos.map((p, idx) => (
                    <img key={idx} src={p} alt="Campo" className="w-1/2 object-cover rounded-xl" />
                  ))}
                </div>
              )}

              <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Relatório das Atividades:
                  </span>
                  <p className="text-slate-300 mt-0.5 leading-relaxed">
                    {m.report}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase text-purple-300 block">
                    Motivos de Oração:
                  </span>
                  <p className="text-slate-300 mt-0.5 leading-relaxed italic">
                    &ldquo;{m.prayerRequests}&rdquo;
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800 text-xs">
              <div>
                <span className="text-[11px] text-slate-400">Responsável: </span>
                <strong className="text-slate-200">{m.leader}</strong>
              </div>

              {canDelete && (
                <button
                  onClick={() => {
                    if (window.confirm(`Excluir ${m.title}?`)) {
                      onDeleteMission(m.id);
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

      {/* ADD MISSION MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg shadow-2xl p-6 text-slate-100 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-purple-400" />
                <span>Novo Campo / Projeto Missionário</span>
              </h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 flex-1 overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nome do Projeto *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ex: Frente Missionária Sertão Vivo"
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Localidade / Cidade</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="ex: Zona Rural de Remígio-PB"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Tipo de Ação</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Campo Missionário">Campo Missionário</option>
                    <option value="Projeto Local">Projeto Local</option>
                    <option value="Cruzada">Cruzada Evangelística</option>
                    <option value="Viagem Missionária">Viagem Missionária</option>
                    <option value="Apoio a Missionário">Apoio a Missionário</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Líder / Missionário Responsável *</label>
                <input
                  type="text"
                  value={leader}
                  onChange={(e) => setLeader(e.target.value)}
                  placeholder="Nome do missionário(a)"
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Relatório Recente</label>
                <textarea
                  rows={3}
                  value={report}
                  onChange={(e) => setReport(e.target.value)}
                  placeholder="Resumo dos cultos, batismos e pessoas evangelizadas"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Pedidos de Oração</label>
                <textarea
                  rows={2}
                  value={prayerRequests}
                  onChange={(e) => setPrayerRequests(e.target.value)}
                  placeholder="Motivos de oração da família e do campo"
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
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs"
                >
                  Salvar Projeto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
