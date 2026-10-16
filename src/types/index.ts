export type ModuleKey = 
  | 'dashboard'
  | 'members'
  | 'families'
  | 'secretariat'
  | 'missions'
  | 'socialAction'
  | 'pastoralVisits'
  | 'patrimony'
  | 'birthdays'
  | 'agenda';

export interface ModuleColors {
  dashboard: string;
  members: string;
  families: string;
  secretariat: string;
  missions: string;
  socialAction: string;
  pastoralVisits: string;
  patrimony: string;
  birthdays: string;
  agenda: string;
}

export type EcclesialRole =
  | 'Pastor'
  | 'Pastor Dirigente'
  | 'Evangelista'
  | 'Presbítero'
  | 'Diácono'
  | 'Diaconisa'
  | 'Missionário(a)'
  | 'Cooperador(a)'
  | 'Auxiliar'
  | 'Líder de ministério'
  | 'Professor(a) da Escola Bíblica'
  | 'Secretária'
  | 'secretaria de missões'
  | 'dirigente do apocalipse'
  | 'dirigente do shalom adonai'
  | 'dirigente do vaso de unção'
  | 'dirigente do gideão'
  | 'dirigente do departamento de missões'
  | 'dirigente dos casais'
  | 'dirigente dos homens'
  | 'Membro sem cargo'
  | 'Outros';

export type MemberStatus =
  | 'Ativo'
  | 'Congregado'
  | 'Em comunhão'
  | 'Em disciplina'
  | 'Afastado'
  | 'Transferido'
  | 'Falecido';

export interface MemberDocument {
  id: string;
  title: string;
  category: 'Documento Pessoal' | 'Certificado' | 'Ficha Cadastral' | 'Carta de Mudança' | 'Comprovante' | 'Outro';
  description?: string;
  fileUrl: string;
  fileName: string;
  fileType: 'image' | 'pdf' | 'document';
  fileSize: string;
  uploadDate: string;
}

export interface Member {
  id: string;
  fullName: string;
  photoUrl?: string;
  birthDate: string; // YYYY-MM-DD
  gender: 'Masculino' | 'Feminino';
  maritalStatus: 'Solteiro(a)' | 'Casado(a)' | 'Viúvo(a)' | 'Divorciado(a)';
  phone: string;
  email?: string;
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    cep?: string;
  };
  entryDate: string; // YYYY-MM-DD
  entryType: 'Batismo' | 'Aclamação' | 'Carta de Transferência' | 'Congregado';
  status: MemberStatus;
  role: string;
  department?: string;
  familyId?: string;
  familyRole?: 'Chefe de Família' | 'Cônjuge' | 'Filho(a)' | 'Parente' | 'Outro';
  baptismWaterDate?: string;
  baptismSpiritDate?: string;
  previousChurch?: string;
  notes?: string;
  documents: MemberDocument[];
  createdAt: string;
  updatedAt: string;
}

export interface Family {
  id: string;
  name: string;
  headMemberId?: string;
  addressSummary?: string;
  phone?: string;
  notes?: string;
  createdAt: string;
}

export interface Asset {
  id: string;
  name: string;
  description: string;
  category: 'Mobiliário' | 'Som & Multimídia' | 'Instrumentos Musicais' | 'Climatização' | 'Estrutura Predial' | 'Veículos' | 'Outros';
  quantity: number;
  unitValue: number;
  totalValue: number; // calculated: quantity * unitValue
  acquisitionDate: string; // YYYY-MM-DD
  condition: 'Novo' | 'Ótimo' | 'Bom' | 'Regular' | 'Danificado' | 'Em Manutenção';
  location: string;
  responsible: string;
  patrimonyNumber?: string;
  photoUrl?: string;
  documents?: { title: string; url: string; fileName: string }[];
  createdAt: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime?: string; // HH:MM
  location: string;
  department: string;
  category: 'Culto' | 'Santa Ceia' | 'Reunião' | 'Vigília' | 'Festividade' | 'Ensaio' | 'Ação Social' | 'Cruzada' | 'Outro';
  color: string;
  description?: string;
  preacherOrLeader?: string;
}

export interface PastoralVisit {
  id: string;
  memberId?: string;
  memberName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  visitorName: string;
  visitorRole: string;
  purpose: 'Enfermidade' | 'Novo Convertido' | 'Aconselhamento' | 'Boas-vindas' | 'Enlutado' | 'Rotina' | 'Urgência';
  status: 'Agendada' | 'Realizada' | 'Pendente' | 'Cancelada';
  notes: string;
  confidential?: boolean;
  followUpNeeded?: boolean;
  followUpDate?: string;
}

export interface SocialAction {
  id: string;
  title: string;
  type: 'Cestas Básicas' | 'Roupas & Agasalhos' | 'Auxílio Saúde' | 'S.O.S Famílias' | 'Atendimento Especial' | 'Outro';
  beneficiaryName: string;
  beneficiaryFamilyId?: string;
  itemsDistributed: string;
  quantity: number;
  date: string;
  responsible: string;
  status: 'Pendente' | 'Entregue' | 'Em Andamento';
  notes?: string;
  confidential?: boolean;
}

export interface SecretariatDoc {
  id: string;
  type: 'Ata de Reunião' | 'Carta de Recomendação' | 'Carta de Transferência' | 'Certificado de Batismo' | 'Certificado de Apresentação' | 'Comunicado Oficial' | 'Relatório';
  title: string;
  date: string;
  content: string;
  signee: string;
  memberId?: string;
  status: 'Rascunho' | 'Oficial' | 'Arquivado';
}

export interface MissionItem {
  id: string;
  title: string;
  location: string;
  type: 'Campo Missionário' | 'Cruzada' | 'Viagem Missionária' | 'Apoio a Missionário' | 'Projeto Local';
  leader: string;
  phone?: string;
  report: string;
  prayerRequests: string;
  financialSupportMonthly?: number;
  photos?: string[];
  status: 'Ativo' | 'Planejado' | 'Concluído';
}

export interface ChurchConfig {
  name: string;
  subtitle: string;
  congregation: string;
  cityState: string;
  address: string;
  pastorName: string;
  pastorPhone: string;
  secretaryName: string;
  cnpj?: string;
  logoUrl: string;
  customRoles: string[];
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: 'Administrador Geral' | 'Pastor Dirigente' | 'Secretária' | 'Tesouraria' | 'Diaconia';
  avatarUrl?: string;
}
