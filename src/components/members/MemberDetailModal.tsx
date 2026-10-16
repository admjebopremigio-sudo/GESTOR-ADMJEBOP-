import React, { useState } from 'react';
import { ChurchConfig, Family, Member, MemberDocument, PastoralVisit } from '../../types';
import { AuthUser } from '../../types/auth';
import { hasPermission } from '../../services/authService';
import {
  X,
  User,
  Users,
  FileText,
  Church,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Upload,
  Trash2,
  Download,
  Eye,
  Plus,
  Printer,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Edit2,
  Save,
  MessageCircle
} from 'lucide-react';

interface MemberDetailModalProps {
  member: Member | null;
  onClose: () => void;
  onUpdate: (updated: Member) => void;
  onDelete: (id: string) => void;
  families: Family[];
  allMembers: Member[];
  visits: PastoralVisit[];
  churchConfig: ChurchConfig;
  currentUser: AuthUser;
  onSelectMember: (member: Member) => void;
}

export const MemberDetailModal: React.FC<MemberDetailModalProps> = ({
  member,
  onClose,
  onUpdate,
  onDelete,
  families,
  allMembers,
  visits,
  churchConfig,
  currentUser,
  onSelectMember,
}) => {
  const [activeTab, setActiveTab] = useState<'dados' | 'familia' | 'documentos' | 'visitas' | 'carteira'>('dados');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Member | null>(null);
  
  // Document upload state
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState<MemberDocument['category']>('Documento Pessoal');
  const [docDescription, setDocDescription] = useState('');
  const [docFileUrl, setDocFileUrl] = useState('');
  const [docFileName, setDocFileName] = useState('');
  const [docFileType, setDocFileType] = useState<'image' | 'pdf' | 'document'>('image');
  const [previewDocUrl, setPreviewDocUrl] = useState<string | null>(null);

  if (!member) return null;

  const canEdit = hasPermission(currentUser.role, 'members', 'edit');
  const canDelete = hasPermission(currentUser.role, 'members', 'delete');

  const startEdit = () => {
    setEditForm({ ...member });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setEditForm(null);
    setIsEditing(false);
  };

  const saveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;
    onUpdate(editForm);
    setIsEditing(false);
  };

  // Photo change handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          if (isEditing && editForm) {
            setEditForm({ ...editForm, photoUrl: reader.result });
          } else {
            const updated = { ...member, photoUrl: reader.result as string };
            onUpdate(updated);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    if (isEditing && editForm) {
      setEditForm({ ...editForm, photoUrl: '' });
    } else {
      const updated = { ...member, photoUrl: '' };
      onUpdate(updated);
    }
  };

  // Document upload handler
  const handleDocFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocFileName(file.name);
      const isPdf = file.type.includes('pdf') || file.name.endsWith('.pdf');
      setDocFileType(isPdf ? 'pdf' : 'image');
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setDocFileUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim() || !docFileUrl) return;

    const newDoc: MemberDocument = {
      id: 'doc-' + Date.now(),
      title: docTitle.trim(),
      category: docCategory,
      description: docDescription.trim(),
      fileUrl: docFileUrl,
      fileName: docFileName || 'documento.pdf',
      fileType: docFileType,
      fileSize: '1.2 MB',
      uploadDate: new Date().toISOString().split('T')[0],
    };

    const updatedDocuments = [...(member.documents || []), newDoc];
    const updatedMember = { ...member, documents: updatedDocuments };
    onUpdate(updatedMember);

    // Reset doc form
    setDocTitle('');
    setDocDescription('');
    setDocFileUrl('');
    setDocFileName('');
    setShowAddDocModal(false);
  };

  const handleDeleteDocument = (docId: string) => {
    if (window.confirm('Deseja realmente remover este anexo?')) {
      const updatedDocuments = (member.documents || []).filter(d => d.id !== docId);
      onUpdate({ ...member, documents: updatedDocuments });
    }
  };

  // Linked family
  const linkedFamily = families.find(f => f.id === member.familyId);
  const familyMembers = allMembers.filter(m => m.familyId === member.familyId && m.id !== member.id);

  // Visits to this member
  const memberVisits = visits.filter(v => v.memberId === member.id || v.memberName.toLowerCase().includes(member.fullName.toLowerCase()));

  // Calculate age
  const calculateAge = (birthDate?: string) => {
    if (!birthDate) return null;
    const parts = birthDate.split('-');
    if (parts.length < 3) return null;
    const birth = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(member.birthDate);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* MODAL HEADER */}
        <div className="px-5 sm:px-7 py-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative group shrink-0">
              {member.photoUrl ? (
                <img
                  src={member.photoUrl}
                  alt={member.fullName}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500 shadow"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-blue-600/30 text-blue-400 border border-blue-500/50 flex items-center justify-center font-bold text-lg">
                  {member.fullName.charAt(0)}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white truncate">
                  {member.fullName}
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {member.status}
                </span>
              </div>
              <p className="text-xs text-blue-400 font-semibold truncate">
                {member.role} {member.department ? `• ${member.department}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setActiveTab('carteira')}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 transition-colors"
              title="Carteira de Membro Digital"
            >
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Carteira</span>
            </button>

            <button
              onClick={handlePrint}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1.5 transition-colors"
              title="Imprimir Ficha de Membro"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TABS BAR */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-4 sm:px-6 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('dados')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'dados'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Dados & Ficha</span>
          </button>

          <button
            onClick={() => setActiveTab('familia')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'familia'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Família ({familyMembers.length + (linkedFamily ? 1 : 0)})</span>
          </button>

          <button
            onClick={() => setActiveTab('documentos')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'documentos'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Documentos & Anexos ({member.documents?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('visitas')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'visitas'
                ? 'border-teal-500 text-teal-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Church className="w-4 h-4" />
            <span>Visitações ({memberVisits.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('carteira')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'carteira'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Credencial</span>
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          
          {/* TAB 1: DADOS */}
          {activeTab === 'dados' && (
            <div className="space-y-6">
              
              {/* Photo & Actions Bar */}
              <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative group">
                    {isEditing && editForm ? (
                      editForm.photoUrl ? (
                        <img
                          src={editForm.photoUrl}
                          alt="Foto"
                          className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-slate-700 flex items-center justify-center text-slate-400 text-xs">
                          Sem foto
                        </div>
                      )
                    ) : member.photoUrl ? (
                      <img
                        src={member.photoUrl}
                        alt={member.fullName}
                        className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-slate-700 flex items-center justify-center text-slate-400 text-xs">
                        Sem foto
                      </div>
                    )}

                    {canEdit && (
                      <label className="absolute -bottom-2 -right-2 p-1.5 bg-blue-600 hover:bg-blue-500 rounded-full text-white cursor-pointer shadow-md transition-all">
                        <Upload className="w-3.5 h-3.5" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white">Foto de Perfil do Membro</h3>
                    <p className="text-xs text-slate-400">
                      Armazenada e vinculada ao cadastro individual
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <label className="text-xs font-semibold text-blue-400 hover:text-blue-300 cursor-pointer flex items-center gap-1">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Substituir foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                      {member.photoUrl && (
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remover</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!isEditing ? (
                    canEdit && (
                      <button
                        onClick={startEdit}
                        className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow transition-all"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Editar Cadastro</span>
                      </button>
                    )
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="px-3 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={saveEdit}
                        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow transition-all"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Salvar</span>
                      </button>
                    </div>
                  )}

                  {canDelete && !isEditing && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Deseja realmente excluir o cadastro de ${member.fullName}?`)) {
                          onDelete(member.id);
                        }
                      }}
                      className="p-2 text-rose-400 hover:bg-rose-500/20 rounded-xl transition-colors"
                      title="Excluir membro"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* View or Edit Details Form */}
              {!isEditing ? (
                <div className="space-y-6">
                  {/* Grid 1: Personal Data */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Informações Pessoais & Contato
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
                        <span className="text-[11px] text-slate-400">Data de Nascimento</span>
                        <p className="text-xs font-semibold text-white mt-0.5">
                          {member.birthDate ? `${member.birthDate.split('-').reverse().join('/')} (${age} anos)` : 'Não informada'}
                        </p>
                      </div>

                      <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
                        <span className="text-[11px] text-slate-400">Gênero / Estado Civil</span>
                        <p className="text-xs font-semibold text-white mt-0.5">
                          {member.gender} • {member.maritalStatus}
                        </p>
                      </div>

                      <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
                        <span className="text-[11px] text-slate-400">Telefone / WhatsApp</span>
                        <div className="flex items-center justify-between mt-0.5">
                          <p className="text-xs font-semibold text-white">
                            {member.phone || 'Não informado'}
                          </p>
                          {member.phone && (
                            <a
                              href={`https://wa.me/55${member.phone.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-400 hover:text-emerald-300 p-0.5"
                              title="Abrir WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/50 sm:col-span-2">
                        <span className="text-[11px] text-slate-400">Endereço Residencial</span>
                        <p className="text-xs font-semibold text-white mt-0.5">
                          {member.address.street}, {member.address.number} - {member.address.neighborhood}, {member.address.city}-{member.address.state}
                        </p>
                      </div>

                      <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
                        <span className="text-[11px] text-slate-400">E-mail</span>
                        <p className="text-xs font-semibold text-white mt-0.5 truncate">
                          {member.email || 'Não informado'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Grid 2: Ecclesial Data */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-3">
                      Dados Ministeriais & Eclesiásticos
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
                        <span className="text-[11px] text-slate-400">Função / Cargo</span>
                        <p className="text-xs font-bold text-blue-300 mt-0.5">
                          {member.role}
                        </p>
                      </div>

                      <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
                        <span className="text-[11px] text-slate-400">Departamento</span>
                        <p className="text-xs font-semibold text-white mt-0.5">
                          {member.department || 'Geral da Igreja'}
                        </p>
                      </div>

                      <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
                        <span className="text-[11px] text-slate-400">Situação Cadastral</span>
                        <p className="text-xs font-semibold text-emerald-400 mt-0.5">
                          {member.status}
                        </p>
                      </div>

                      <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
                        <span className="text-[11px] text-slate-400">Data de Entrada & Forma</span>
                        <p className="text-xs font-semibold text-white mt-0.5">
                          {member.entryDate ? member.entryDate.split('-').reverse().join('/') : '-'} ({member.entryType})
                        </p>
                      </div>

                      <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
                        <span className="text-[11px] text-slate-400">Batismo nas Águas</span>
                        <p className="text-xs font-semibold text-white mt-0.5">
                          {member.baptismWaterDate ? member.baptismWaterDate.split('-').reverse().join('/') : 'Não informado'}
                        </p>
                      </div>

                      <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
                        <span className="text-[11px] text-slate-400">Batismo no Espírito Santo</span>
                        <p className="text-xs font-semibold text-white mt-0.5">
                          {member.baptismSpiritDate ? member.baptismSpiritDate.split('-').reverse().join('/') : 'Não informado'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {member.notes && (
                    <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Observações Ministeriais
                      </span>
                      <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                        {member.notes}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* EDIT FORM */
                editForm && (
                  <form onSubmit={saveEdit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Nome Completo *
                        </label>
                        <input
                          type="text"
                          value={editForm.fullName}
                          onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                          required
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Função / Cargo na Congregação *
                        </label>
                        <select
                          value={editForm.role}
                          onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          {churchConfig.customRoles.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Data de Nascimento
                        </label>
                        <input
                          type="date"
                          value={editForm.birthDate}
                          onChange={(e) => setEditForm({ ...editForm, birthDate: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Telefone / WhatsApp
                        </label>
                        <input
                          type="text"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          placeholder="(83) 9...."
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Gênero
                        </label>
                        <select
                          value={editForm.gender}
                          onChange={(e) => setEditForm({ ...editForm, gender: e.target.value as 'Masculino' | 'Feminino' })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="Masculino">Masculino</option>
                          <option value="Feminino">Feminino</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Estado Civil
                        </label>
                        <select
                          value={editForm.maritalStatus}
                          onChange={(e) => setEditForm({ ...editForm, maritalStatus: e.target.value as any })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="Solteiro(a)">Solteiro(a)</option>
                          <option value="Casado(a)">Casado(a)</option>
                          <option value="Viúvo(a)">Viúvo(a)</option>
                          <option value="Divorciado(a)">Divorciado(a)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Situação Cadastral
                        </label>
                        <select
                          value={editForm.status}
                          onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="Ativo">Ativo / Em comunhão</option>
                          <option value="Congregado">Congregado</option>
                          <option value="Em disciplina">Em disciplina</option>
                          <option value="Afastado">Afastado</option>
                          <option value="Transferido">Transferido</option>
                          <option value="Falecido">Falecido</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Departamento / Ministério
                        </label>
                        <input
                          type="text"
                          value={editForm.department || ''}
                          onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                          placeholder="ex: Shalom Adonai, Vaso de Unção"
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Vínculo Familiar
                        </label>
                        <select
                          value={editForm.familyId || ''}
                          onChange={(e) => setEditForm({ ...editForm, familyId: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="">Sem vínculo familiar registrado</option>
                          {families.map(f => (
                            <option key={f.id} value={f.id}>
                              {f.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Grau de Parentesco na Família
                        </label>
                        <select
                          value={editForm.familyRole || 'Chefe de Família'}
                          onChange={(e) => setEditForm({ ...editForm, familyRole: e.target.value as any })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="Chefe de Família">Chefe de Família</option>
                          <option value="Cônjuge">Cônjuge</option>
                          <option value="Filho(a)">Filho(a)</option>
                          <option value="Parente">Parente</option>
                          <option value="Outro">Outro</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Rua e Número
                        </label>
                        <input
                          type="text"
                          value={`${editForm.address.street}, ${editForm.address.number}`}
                          onChange={(e) => {
                            const [street, num] = e.target.value.split(',');
                            setEditForm({
                              ...editForm,
                              address: {
                                ...editForm.address,
                                street: street || '',
                                number: num ? num.trim() : 'S/N'
                              }
                            });
                          }}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Observações Pastorais
                        </label>
                        <textarea
                          rows={3}
                          value={editForm.notes || ''}
                          onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow"
                      >
                        Salvar Alterações
                      </button>
                    </div>
                  </form>
                )
              )}
            </div>
          )}

          {/* TAB 2: FAMÍLIA */}
          {activeTab === 'familia' && (
            <div className="space-y-4">
              <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/60 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                    Núcleo Familiar Vinculado
                  </span>
                  <p className="text-sm font-bold text-white mt-0.5">
                    {linkedFamily ? linkedFamily.name : 'Nenhuma família vinculada a este membro'}
                  </p>
                  {linkedFamily && (
                    <p className="text-xs text-slate-400 mt-0.5">
                      {linkedFamily.addressSummary}
                    </p>
                  )}
                </div>

                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold rounded-xl">
                  {member.familyRole || 'Membro da Família'}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Outros Integrantes Cadastrados na Família
                </h4>

                {familyMembers.length === 0 ? (
                  <div className="bg-slate-800/20 border border-slate-800 rounded-2xl p-6 text-center text-xs text-slate-400">
                    Não há outros parentes cadastrados vinculados a esta família.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {familyMembers.map((rel) => (
                      <div
                        key={rel.id}
                        onClick={() => onSelectMember(rel)}
                        className="p-3 bg-slate-800/60 border border-slate-700/70 rounded-2xl flex items-center justify-between gap-3 hover:border-emerald-500/50 cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {rel.photoUrl ? (
                            <img
                              src={rel.photoUrl}
                              alt={rel.fullName}
                              className="w-10 h-10 rounded-full object-cover shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
                              {rel.fullName.charAt(0)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">
                              {rel.fullName}
                            </p>
                            <p className="text-[11px] text-emerald-400">
                              {rel.familyRole || 'Familiar'} • {rel.role}
                            </p>
                          </div>
                        </div>

                        <span className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
                          <span>Ver Ficha</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: DOCUMENTOS & ANEXOS */}
          {activeTab === 'documentos' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                    Documentos Pessoais & Anexos Digitais
                  </h4>
                  <p className="text-xs text-slate-400">
                    Fotos digitalizadas, certidões, cartas e PDFs com visualização e download
                  </p>
                </div>

                {canEdit && (
                  <button
                    onClick={() => setShowAddDocModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar Anexo</span>
                  </button>
                )}
              </div>

              {/* Upload Modal Drawer */}
              {showAddDocModal && (
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 shadow-xl space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                    <span className="text-xs font-bold text-white">Novo Documento ou Imagem</span>
                    <button
                      onClick={() => setShowAddDocModal(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleAddDocument} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-300 mb-1">
                          Título do Arquivo *
                        </label>
                        <input
                          type="text"
                          value={docTitle}
                          onChange={(e) => setDocTitle(e.target.value)}
                          placeholder="ex: RG e CPF Digitalizado"
                          required
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-300 mb-1">
                          Categoria
                        </label>
                        <select
                          value={docCategory}
                          onChange={(e) => setDocCategory(e.target.value as any)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                        >
                          <option value="Documento Pessoal">Documento Pessoal (RG, CPF)</option>
                          <option value="Certificado">Certificado / Consagração</option>
                          <option value="Ficha Cadastral">Ficha Cadastral</option>
                          <option value="Carta de Mudança">Carta de Mudança / Transferência</option>
                          <option value="Comprovante">Comprovante</option>
                          <option value="Outro">Outro Documento</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-medium text-slate-300 mb-1">
                          Descrição / Notas
                        </label>
                        <input
                          type="text"
                          value={docDescription}
                          onChange={(e) => setDocDescription(e.target.value)}
                          placeholder="Breve descrição do documento arquivado"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-medium text-slate-300 mb-1">
                          Selecione o Arquivo (Imagem ou PDF) *
                        </label>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-xs font-semibold cursor-pointer text-white">
                            <Upload className="w-4 h-4" />
                            <span>Buscar Arquivo...</span>
                            <input
                              type="file"
                              accept="image/*,application/pdf"
                              onChange={handleDocFileUpload}
                              className="hidden"
                            />
                          </label>
                          <span className="text-xs text-slate-400 truncate">
                            {docFileName || 'Nenhum arquivo selecionado'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddDocModal(false)}
                        className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={!docFileUrl}
                        className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold"
                      >
                        Salvar Anexo
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Documents List */}
              {(!member.documents || member.documents.length === 0) ? (
                <div className="bg-slate-800/20 border border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-400">
                  <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p>Nenhum documento ou anexo registrado para este membro.</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Toque no botão &quot;Adicionar Anexo&quot; acima para fazer upload de certidões, fotos ou PDFs.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {member.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 flex flex-col justify-between gap-3 hover:border-indigo-500/50 transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">
                              {doc.title}
                            </p>
                            <span className="text-[10px] text-indigo-300 font-semibold uppercase">
                              {doc.category}
                            </span>
                            {doc.description && (
                              <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                                {doc.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {canEdit && (
                          <button
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="text-slate-400 hover:text-rose-400 p-1"
                            title="Excluir anexo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-700/50 text-[11px] text-slate-400">
                        <span>{doc.uploadDate}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setPreviewDocUrl(doc.fileUrl)}
                            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Visualizar</span>
                          </button>
                          <a
                            href={doc.fileUrl}
                            download={doc.fileName}
                            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Baixar</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Document Preview Modal */}
              {previewDocUrl && (
                <div className="fixed inset-0 z-60 bg-black/85 flex flex-col items-center justify-center p-4">
                  <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full p-4 flex flex-col max-h-[85vh]">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <span className="text-xs font-bold text-white">Visualização do Anexo</span>
                      <button
                        onClick={() => setPreviewDocUrl(null)}
                        className="text-slate-400 hover:text-white"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
                      {previewDocUrl.startsWith('data:image') || previewDocUrl.includes('unsplash') ? (
                        <img
                          src={previewDocUrl}
                          alt="Prévia"
                          className="max-h-[65vh] max-w-full rounded-xl object-contain shadow-lg"
                        />
                      ) : (
                        <iframe
                          src={previewDocUrl}
                          title="Documento PDF"
                          className="w-full h-[65vh] rounded-xl border border-slate-800"
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: VISITAÇÕES PASTORAIS */}
          {activeTab === 'visitas' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400">
                Histórico de Visitas Pastorais Recebidas
              </h4>

              {memberVisits.length === 0 ? (
                <div className="bg-slate-800/20 border border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-400">
                  <Church className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p>Nenhuma visita pastoral registrada para este membro.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {memberVisits.map((vis) => (
                    <div
                      key={vis.id}
                      className="p-3.5 bg-slate-800/50 border border-slate-700/60 rounded-2xl flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">
                            {vis.purpose}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30">
                            {vis.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">
                          {vis.notes}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Visitador: {vis.visitorName} • Data: {vis.date} às {vis.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: CARTEIRA DE MEMBRO DIGITAL */}
          {activeTab === 'carteira' && (
            <div className="flex flex-col items-center justify-center py-4">
              <div className="w-full max-w-md bg-gradient-to-br from-[#0c1a30] via-[#091526] to-[#040810] border-2 border-amber-400/60 rounded-3xl p-5 shadow-2xl relative overflow-hidden text-white">
                <div className="flex items-center justify-between pb-3 border-b border-amber-400/30 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-amber-400/20 border border-amber-400 flex items-center justify-center font-bold text-amber-300 text-xs">
                      AD
                    </div>
                    <div>
                      <p className="text-xs font-black tracking-wider text-amber-300 uppercase">
                        {churchConfig.name}
                      </p>
                      <p className="text-[9px] text-slate-300 uppercase">
                        {churchConfig.congregation}
                      </p>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 bg-amber-500/20 text-amber-200 border border-amber-400/40 rounded-full font-bold">
                    Nº {member.id.replace('mem-', 'AD-')}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  {member.photoUrl ? (
                    <img
                      src={member.photoUrl}
                      alt={member.fullName}
                      className="w-20 h-20 rounded-2xl object-cover ring-2 ring-amber-400 shrink-0 shadow-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-slate-800 border-2 border-dashed border-amber-400/50 flex items-center justify-center text-slate-400 text-xs shrink-0">
                      Foto
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="text-xs text-amber-300/80 uppercase font-semibold">
                      Nome do Membro
                    </p>
                    <p className="text-sm font-black text-white truncate">
                      {member.fullName}
                    </p>

                    <p className="text-[10px] text-amber-300/80 uppercase font-semibold mt-1.5">
                      Função Eclesiástica
                    </p>
                    <p className="text-xs font-bold text-amber-300 truncate">
                      {member.role}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 mb-3">
                  <div>
                    <span className="text-slate-400">Nascimento:</span>
                    <p className="font-bold text-white">{member.birthDate || '-'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Batismo Águas:</span>
                    <p className="font-bold text-white">{member.baptismWaterDate || '-'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Situação:</span>
                    <p className="font-bold text-emerald-400">{member.status}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Admissão:</span>
                    <p className="font-bold text-white">{member.entryDate || '-'}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[9px] text-slate-400">
                  <span>Pastor: {churchConfig.pastorName}</span>
                  <span className="font-mono text-amber-400">Válida em território nacional</span>
                </div>
              </div>

              <button
                onClick={handlePrint}
                className="mt-4 flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Credencial</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
