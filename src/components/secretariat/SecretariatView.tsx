import React, { useState } from 'react';
import { ChurchConfig, Member, ModuleColors, SecretariatDoc } from '../../types';
import { AuthUser } from '../../types/auth';
import { hasPermission } from '../../services/authService';
import {
  FileText,
  Plus,
  Printer,
  Edit2,
  Trash2,
  X,
  FileCheck,
  Send,
  Eye,
  Building,
  CheckCircle2
} from 'lucide-react';

interface SecretariatViewProps {
  colors: ModuleColors;
  docs: SecretariatDoc[];
  churchConfig: ChurchConfig;
  currentUser: AuthUser;
  members: Member[];
  onAddDoc: (doc: Omit<SecretariatDoc, 'id'>) => void;
  onUpdateDoc: (id: string, updates: Partial<SecretariatDoc>) => void;
  onDeleteDoc: (id: string) => void;
}

export const SecretariatView: React.FC<SecretariatViewProps> = ({
  colors,
  docs,
  churchConfig,
  currentUser,
  members,
  onAddDoc,
  onUpdateDoc,
  onDeleteDoc,
}) => {
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<SecretariatDoc | null>(null);

  // Form states
  const [type, setType] = useState<SecretariatDoc['type']>('Ata de Reunião');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [content, setContent] = useState('');
  const [signee, setSignee] = useState(churchConfig.secretaryName || 'Irª. Sarah Medeiros');

  const canEdit = hasPermission(currentUser.role, 'secretariat', 'edit');
  const canDelete = hasPermission(currentUser.role, 'secretariat', 'delete');

  const filteredDocs = docs.filter(d => selectedType === 'ALL' || d.type === selectedType);

  const handleCreateDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onAddDoc({
      type,
      title: title.trim(),
      date,
      content: content.trim(),
      signee: signee.trim(),
      status: 'Oficial',
    });

    setTitle('');
    setContent('');
    setIsAddModalOpen(false);
  };

  const handlePrintDoc = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            style={{ backgroundColor: `${colors.secretariat}25`, color: colors.secretariat }}
            className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-sm shrink-0"
          >
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Secretaria Ministerial & Documentos
              </h1>
              <span
                style={{ backgroundColor: colors.secretariat }}
                className="px-2.5 py-0.5 rounded-full text-white text-xs font-bold"
              >
                {docs.length}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Atas de reuniões, cartas de recomendação, certidões e comunicados eclesiásticos
            </p>
          </div>
        </div>

        {canEdit && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            style={{ backgroundColor: colors.secretariat }}
            className="flex items-center gap-2 px-4 py-2.5 text-white font-bold rounded-xl text-xs shadow-lg hover:opacity-90 active:scale-[0.98] transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Emitir Novo Documento / Ata</span>
          </button>
        )}
      </div>

      {/* Type Filters Bar */}
      <div className="flex items-center gap-2 overflow-x-auto bg-slate-900 border border-slate-800 p-2 rounded-2xl">
        {['ALL', 'Ata de Reunião', 'Carta de Recomendação', 'Carta de Transferência', 'Certificado de Batismo', 'Certificado de Apresentação', 'Comunicado Oficial'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedType(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedType === cat
                ? 'bg-slate-700 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {cat === 'ALL' ? 'Todos os Registros' : cat}
          </button>
        ))}
      </div>

      {/* DOCS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.length === 0 ? (
          <div className="col-span-full bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
            <FileText className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="font-bold text-slate-300">Nenhum documento encontrado nesta categoria</p>
          </div>
        ) : (
          filteredDocs.map((doc) => (
            <div
              key={doc.id}
              style={{ borderTopColor: colors.secretariat }}
              className="bg-slate-900 border border-slate-800 border-t-4 rounded-2xl p-5 shadow-md flex flex-col justify-between hover:border-slate-600 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-800 text-slate-300">
                    {doc.type}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {doc.date.split('-').reverse().join('/')}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white line-clamp-2 mb-2">
                  {doc.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                  {doc.content}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 truncate max-w-[140px]">
                  Assina: {doc.signee}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewingDoc(doc)}
                    className="flex items-center gap-1 text-slate-300 hover:text-white font-semibold"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-400" />
                    <span>Abrir</span>
                  </button>

                  {canDelete && (
                    <button
                      onClick={() => {
                        if (window.confirm('Excluir este documento da secretaria?')) {
                          onDeleteDoc(doc.id);
                        }
                      }}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* VIEW / PRINT DOCUMENT MODAL */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-3xl w-full max-w-2xl p-8 shadow-2xl printable-area animate-in zoom-in-95 duration-150">
            {/* Church Letterhead */}
            <div className="text-center pb-4 border-b-2 border-slate-900/20 mb-6">
              <h2 className="text-lg font-black tracking-wide uppercase">
                {churchConfig.name}
              </h2>
              <p className="text-xs font-bold text-slate-600 uppercase">
                {churchConfig.congregation}
              </p>
              <p className="text-[11px] text-slate-500">
                {churchConfig.address} • Tel: {churchConfig.pastorPhone}
              </p>
            </div>

            <div className="text-center mb-6">
              <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-black uppercase tracking-wider text-slate-700">
                {viewingDoc.type}
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-2">
                {viewingDoc.title}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Remígio-PB, {viewingDoc.date.split('-').reverse().join('/')}
              </p>
            </div>

            <div className="text-sm text-slate-800 leading-relaxed whitespace-pre-line text-justify mb-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
              {viewingDoc.content}
            </div>

            <div className="flex justify-around pt-8 border-t border-slate-300 text-center text-xs">
              <div>
                <div className="w-48 border-b border-slate-400 mx-auto mb-1.5" />
                <p className="font-bold text-slate-800">{viewingDoc.signee}</p>
                <p className="text-[10px] text-slate-500">Secretaria Ministerial ADMJEBOP</p>
              </div>

              <div>
                <div className="w-48 border-b border-slate-400 mx-auto mb-1.5" />
                <p className="font-bold text-slate-800">{churchConfig.pastorName}</p>
                <p className="text-[10px] text-slate-500">Pastor Titular / Dirigente</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-200 no-print">
              <button
                onClick={() => setViewingDoc(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Fechar
              </button>
              <button
                onClick={handlePrintDoc}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Documento Oficial</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD DOC MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-xl shadow-2xl p-6 text-slate-100 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-400" />
                <span>Novo Documento da Secretaria</span>
              </h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDoc} className="space-y-3.5 flex-1 overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Tipo de Documento
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Ata de Reunião">Ata de Reunião</option>
                    <option value="Carta de Recomendação">Carta de Recomendação</option>
                    <option value="Carta de Transferência">Carta de Transferência</option>
                    <option value="Certificado de Batismo">Certificado de Batismo</option>
                    <option value="Certificado de Apresentação">Certificado de Apresentação</option>
                    <option value="Comunicado Oficial">Comunicado Oficial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Data de Emissão
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Título do Registro *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ex: Ata da Reunião de Obreiros de Outubro"
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Texto Completo / Ata / Deliberações *
                </label>
                <textarea
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Insira o texto oficial completo com data, presentes, decisões e termos..."
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Responsável pela Assinatura
                </label>
                <input
                  type="text"
                  value={signee}
                  onChange={(e) => setSignee(e.target.value)}
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
                  className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl text-xs"
                >
                  Salvar Documento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
