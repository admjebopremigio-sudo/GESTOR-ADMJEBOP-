import React, { useState } from 'react';
import {
  Asset,
  ChurchConfig,
  EventItem,
  Family,
  Member,
  PastoralVisit,
  SocialAction
} from '../../types';
import {
  FileSpreadsheet,
  X,
  Printer,
  Download,
  Users,
  Landmark,
  Cake,
  Church,
  HeartHandshake
} from 'lucide-react';

interface ReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  churchConfig: ChurchConfig;
  members: Member[];
  families: Family[];
  assets: Asset[];
  events: EventItem[];
  visits: PastoralVisit[];
  socialActions: SocialAction[];
}

export const ReportsModal: React.FC<ReportsModalProps> = ({
  isOpen,
  onClose,
  churchConfig,
  members,
  families,
  assets,
  events,
  visits,
  socialActions,
}) => {
  const [reportType, setReportType] = useState<'members' | 'patrimony' | 'birthdays' | 'visits' | 'social'>('members');

  if (!isOpen) return null;

  const totalPatrimony = assets.reduce((sum, a) => sum + (Number(a.totalValue) || (Number(a.quantity) * Number(a.unitValue)) || 0), 0);
  const formattedPatrimony = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPatrimony);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    let headers: string[] = [];
    let rows: string[][] = [];
    let filename = 'relatorio.csv';

    if (reportType === 'members') {
      filename = `rol_membros_${new Date().toISOString().split('T')[0]}.csv`;
      headers = ['Nome Completo', 'Cargo', 'Situação', 'Telefone', 'Bairro', 'Data Nascimento', 'Data Entrada'];
      rows = members.map(m => [
        `"${m.fullName}"`,
        `"${m.role}"`,
        `"${m.status}"`,
        `"${m.phone}"`,
        `"${m.address.neighborhood}"`,
        `"${m.birthDate || ''}"`,
        `"${m.entryDate || ''}"`
      ]);
    } else if (reportType === 'patrimony') {
      filename = `inventario_patrimonio_${new Date().toISOString().split('T')[0]}.csv`;
      headers = ['Nº Tombamento', 'Nome do Bem', 'Categoria', 'Quantidade', 'Valor Unitário', 'Valor Total', 'Conservação', 'Local'];
      rows = assets.map(a => [
        `"${a.patrimonyNumber || ''}"`,
        `"${a.name}"`,
        `"${a.category}"`,
        `${a.quantity}`,
        `${a.unitValue}`,
        `${a.totalValue}`,
        `"${a.condition}"`,
        `"${a.location}"`
      ]);
    } else if (reportType === 'birthdays') {
      filename = `aniversariantes_${new Date().toISOString().split('T')[0]}.csv`;
      headers = ['Nome Completo', 'Data Nascimento', 'Cargo', 'Telefone'];
      rows = members.map(m => [
        `"${m.fullName}"`,
        `"${m.birthDate || ''}"`,
        `"${m.role}"`,
        `"${m.phone}"`
      ]);
    } else if (reportType === 'visits') {
      filename = `visitas_pastorais_${new Date().toISOString().split('T')[0]}.csv`;
      headers = ['Pessoa / Membro', 'Data', 'Horário', 'Motivo', 'Status', 'Visitador'];
      rows = visits.map(v => [
        `"${v.memberName}"`,
        `"${v.date}"`,
        `"${v.time}"`,
        `"${v.purpose}"`,
        `"${v.status}"`,
        `"${v.visitorName}"`
      ]);
    } else {
      filename = `acao_social_${new Date().toISOString().split('T')[0]}.csv`;
      headers = ['Título', 'Tipo', 'Beneficiário', 'Itens', 'Quantidade', 'Data', 'Responsável'];
      rows = socialActions.map(s => [
        `"${s.title}"`,
        `"${s.type}"`,
        `"${s.beneficiaryName}"`,
        `"${s.itemsDistributed}"`,
        `${s.quantity}`,
        `"${s.date}"`,
        `"${s.responsible}"`
      ]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-2xl">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Central de Relatórios Eclesiásticos & Exportação
              </h2>
              <p className="text-xs text-slate-400">
                Gere documentos oficiais prontos para impressão ou exporte planilhas Excel / CSV
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Excel / CSV</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Relatório</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Selector Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 gap-2 overflow-x-auto no-print">
          <button
            onClick={() => setReportType('members')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              reportType === 'members'
                ? 'border-blue-500 text-blue-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Rol Geral de Membros ({members.length})</span>
          </button>

          <button
            onClick={() => setReportType('patrimony')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              reportType === 'patrimony'
                ? 'border-amber-500 text-amber-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>Inventário Patrimonial ({formattedPatrimony})</span>
          </button>

          <button
            onClick={() => setReportType('birthdays')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              reportType === 'birthdays'
                ? 'border-orange-500 text-orange-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cake className="w-4 h-4" />
            <span>Aniversariantes</span>
          </button>

          <button
            onClick={() => setReportType('visits')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              reportType === 'visits'
                ? 'border-teal-500 text-teal-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Church className="w-4 h-4" />
            <span>Visitas Pastorais ({visits.length})</span>
          </button>

          <button
            onClick={() => setReportType('social')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              reportType === 'social'
                ? 'border-rose-500 text-rose-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Ação Social & Cestas</span>
          </button>
        </div>

        {/* Printable Document Preview Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950/60 printable-area text-slate-900 bg-white">
          
          {/* Official Letterhead */}
          <div className="text-center pb-4 border-b-2 border-slate-900/20 mb-6">
            <h1 className="text-xl font-black uppercase tracking-wider text-slate-900">
              {churchConfig.name}
            </h1>
            <p className="text-xs font-bold text-slate-700 uppercase">
              {churchConfig.congregation} • {churchConfig.subtitle}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Pastor Dirigente: {churchConfig.pastorName} • Secretaria: {churchConfig.secretaryName}
            </p>
            <p className="text-[10px] text-slate-400">
              {churchConfig.address} • Data de emissão: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

          {/* REPORT CONTENT: MEMBERS */}
          {reportType === 'members' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold uppercase tracking-wide text-slate-800">
                  Relatório Oficial do Rol de Membros
                </h2>
                <span className="text-xs font-semibold text-slate-600">
                  Total de registros: {members.length}
                </span>
              </div>

              <table className="w-full text-left text-xs border border-slate-300">
                <thead className="bg-slate-100 text-[10px] uppercase font-bold text-slate-700 border-b border-slate-300">
                  <tr>
                    <th className="p-2 border-r border-slate-300">#</th>
                    <th className="p-2 border-r border-slate-300">Nome do Membro</th>
                    <th className="p-2 border-r border-slate-300">Função / Cargo</th>
                    <th className="p-2 border-r border-slate-300">Telefone</th>
                    <th className="p-2 border-r border-slate-300">Bairro</th>
                    <th className="p-2">Situação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {members.map((m, idx) => (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <td className="p-2 border-r border-slate-300 text-slate-500 font-mono text-[11px]">{idx + 1}</td>
                      <td className="p-2 border-r border-slate-300 font-bold text-slate-900">{m.fullName}</td>
                      <td className="p-2 border-r border-slate-300 text-slate-700">{m.role}</td>
                      <td className="p-2 border-r border-slate-300 text-slate-600">{m.phone}</td>
                      <td className="p-2 border-r border-slate-300 text-slate-600">{m.address.neighborhood}</td>
                      <td className="p-2 font-semibold text-slate-800">{m.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* REPORT CONTENT: PATRIMONY */}
          {reportType === 'patrimony' && (
            <div>
              <div className="flex items-center justify-between mb-4 bg-amber-50 p-4 rounded-xl border border-amber-200">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wide text-slate-900">
                    Inventário e Balanço Patrimonial da Congregação
                  </h2>
                  <p className="text-xs text-slate-600">
                    Cálculo automatizado de todos os equipamentos, móveis e instrumentos
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase text-slate-500 font-bold block">Valor Total</span>
                  <span className="text-xl font-black text-amber-700">{formattedPatrimony}</span>
                </div>
              </div>

              <table className="w-full text-left text-xs border border-slate-300">
                <thead className="bg-slate-100 text-[10px] uppercase font-bold text-slate-700 border-b border-slate-300">
                  <tr>
                    <th className="p-2 border-r border-slate-300">Tombamento</th>
                    <th className="p-2 border-r border-slate-300">Nome do Bem</th>
                    <th className="p-2 border-r border-slate-300">Categoria</th>
                    <th className="p-2 border-r border-slate-300 text-center">Qtd</th>
                    <th className="p-2 border-r border-slate-300 text-right">Valor Unit.</th>
                    <th className="p-2 border-r border-slate-300 text-right">Valor Total</th>
                    <th className="p-2">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {assets.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50">
                      <td className="p-2 border-r border-slate-300 font-mono text-[11px]">{a.patrimonyNumber || '-'}</td>
                      <td className="p-2 border-r border-slate-300 font-bold text-slate-900">{a.name}</td>
                      <td className="p-2 border-r border-slate-300 text-slate-700">{a.category}</td>
                      <td className="p-2 border-r border-slate-300 text-center font-semibold">{a.quantity}</td>
                      <td className="p-2 border-r border-slate-300 text-right text-slate-600">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(a.unitValue)}
                      </td>
                      <td className="p-2 border-r border-slate-300 text-right font-black text-slate-900">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(a.totalValue)}
                      </td>
                      <td className="p-2 text-slate-700">{a.condition}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Signatures Footer */}
          <div className="flex justify-around pt-12 mt-8 border-t border-slate-300 text-center text-xs">
            <div>
              <div className="w-48 border-b border-slate-400 mx-auto mb-1" />
              <p className="font-bold text-slate-800">{churchConfig.secretaryName}</p>
              <p className="text-[10px] text-slate-500">Secretária Geral</p>
            </div>
            <div>
              <div className="w-48 border-b border-slate-400 mx-auto mb-1" />
              <p className="font-bold text-slate-800">{churchConfig.pastorName}</p>
              <p className="text-[10px] text-slate-500">Pastor Titular</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
