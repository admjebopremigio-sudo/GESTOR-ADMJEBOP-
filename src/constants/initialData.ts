import { Asset, ChurchConfig, EventItem, Family, Member, MissionItem, ModuleColors, PastoralVisit, SecretariatDoc, SocialAction } from '../types';

export const DEFAULT_MODULE_COLORS: ModuleColors = {
  dashboard: '#0f172a',      // Azul-marinho
  members: '#2563eb',        // Azul
  families: '#16a34a',       // Verde
  secretariat: '#475569',    // Cinza
  missions: '#9333ea',       // Roxo
  socialAction: '#e11d48',   // Rosa
  pastoralVisits: '#0d9488', // Verde-água
  patrimony: '#d97706',      // Dourado
  birthdays: '#ea580c',      // Laranja
  agenda: '#0284c7',         // Azul-claro
};

export const DEFAULT_CHURCH_CONFIG: ChurchConfig = {
  name: 'GESTOR – ADMJEBOP',
  subtitle: 'Gestão Ministerial Integrada',
  congregation: 'Congregação de Remígio - PB',
  cityState: 'Remígio - PB',
  address: 'Rua Principal, Centro, Remígio - PB, CEP 58398-000',
  pastorName: 'Pr. Joel Bento',
  pastorPhone: '(83) 98845-2190',
  secretaryName: 'Irª. Sarah Medeiros',
  cnpj: '18.452.980/0001-44',
  logoUrl: '', // Will default to custom SVG crest
  customRoles: [
    'Pastor',
    'Pastor Dirigente',
    'Evangelista',
    'Presbítero',
    'Diácono',
    'Diaconisa',
    'Missionário(a)',
    'Cooperador(a)',
    'Auxiliar',
    'Líder de ministério',
    'Professor(a) da Escola Bíblica',
    'Secretária',
    'secretaria de missões',
    'dirigente do apocalipse',
    'dirigente do shalom adonai',
    'dirigente do vaso de unção',
    'dirigente do gideão',
    'dirigente do departamento de missões',
    'dirigente dos casais',
    'dirigente dos homens',
    'Membro sem cargo',
    'Outros'
  ],
};

export const INITIAL_FAMILIES: Family[] = [
  {
    id: 'fam-1',
    name: 'Família Bento',
    headMemberId: 'mem-1',
    addressSummary: 'Rua João Pessoa, 142 - Centro, Remígio-PB',
    phone: '(83) 98845-2190',
    notes: 'Família pastoral atuante no ministério',
    createdAt: '2024-01-15'
  },
  {
    id: 'fam-2',
    name: 'Família Medeiros',
    headMemberId: 'mem-2',
    addressSummary: 'Av. Brasil, 210 - Bela Vista, Remígio-PB',
    phone: '(83) 99612-4033',
    notes: 'Família atuante na secretaria e ação social',
    createdAt: '2024-01-20'
  },
  {
    id: 'fam-3',
    name: 'Família Silva Oliveira',
    headMemberId: 'mem-3',
    addressSummary: 'Rua Bela Vista, 85 - Remígio-PB',
    phone: '(83) 98711-2244',
    notes: 'Dirigentes de departamento e música',
    createdAt: '2024-02-10'
  },
  {
    id: 'fam-4',
    name: 'Família Albuquerque',
    headMemberId: 'mem-4',
    addressSummary: 'Sítio Gravatá, Zona Rural, Remígio-PB',
    phone: '(83) 99120-3355',
    notes: 'Liderança de missões e evangelismo',
    createdAt: '2024-02-14'
  }
];

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'mem-1',
    fullName: 'Joel Bento da Silva',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    birthDate: '1976-10-18', // Aniversário próximo para destacar
    gender: 'Masculino',
    maritalStatus: 'Casado(a)',
    phone: '(83) 98845-2190',
    email: 'bentojoelssa@gmail.com',
    address: {
      street: 'Rua João Pessoa',
      number: '142',
      neighborhood: 'Centro',
      city: 'Remígio',
      state: 'PB',
      cep: '58398-000'
    },
    entryDate: '2016-03-12',
    entryType: 'Batismo',
    status: 'Ativo',
    role: 'Pastor Dirigente',
    department: 'Diretoria Ministerial',
    familyId: 'fam-1',
    familyRole: 'Chefe de Família',
    baptismWaterDate: '1992-07-15',
    baptismSpiritDate: '1994-04-10',
    notes: 'Pastor titular da congregação ADMJEBOP Remígio-PB',
    documents: [
      {
        id: 'doc-101',
        title: 'Certificado de Ordenação Pastoral',
        category: 'Certificado',
        description: 'Credencial eclesiástica de ordenação ao ministério pastoral',
        fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
        fileName: 'ordenacao_pastoral.pdf',
        fileType: 'pdf',
        fileSize: '1.4 MB',
        uploadDate: '2024-01-10'
      },
      {
        id: 'doc-102',
        title: 'Documento Pessoal (RG e CPF)',
        category: 'Documento Pessoal',
        description: 'Documento de identificação com foto',
        fileUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=600&q=80',
        fileName: 'rg_cpf_joel.jpg',
        fileType: 'image',
        fileSize: '820 KB',
        uploadDate: '2024-01-10'
      }
    ],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: 'mem-2',
    fullName: 'Sarah Medeiros Bento',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    birthDate: '1982-10-24', // Aniversário em outubro
    gender: 'Feminino',
    maritalStatus: 'Casado(a)',
    phone: '(83) 99612-4033',
    email: 'sarah.medeiros@gmail.com',
    address: {
      street: 'Rua João Pessoa',
      number: '142',
      neighborhood: 'Centro',
      city: 'Remígio',
      state: 'PB',
      cep: '58398-000'
    },
    entryDate: '2016-03-12',
    entryType: 'Batismo',
    status: 'Ativo',
    role: 'Secretária',
    department: 'Secretaria Geral',
    familyId: 'fam-1',
    familyRole: 'Cônjuge',
    baptismWaterDate: '1998-09-20',
    baptismSpiritDate: '2001-02-14',
    notes: 'Responsável pelas atas, registros e certidões',
    documents: [
      {
        id: 'doc-201',
        title: 'Certidão de Casamento',
        category: 'Documento Pessoal',
        description: 'Certidão civil de casamento',
        fileUrl: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=600&q=80',
        fileName: 'certidao_casamento.pdf',
        fileType: 'pdf',
        fileSize: '950 KB',
        uploadDate: '2024-01-12'
      }
    ],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: 'mem-3',
    fullName: 'Carlos Eduardo Oliveira',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    birthDate: '1985-11-05',
    gender: 'Masculino',
    maritalStatus: 'Casado(a)',
    phone: '(83) 98711-2244',
    email: 'carlos.oliveira@gmail.com',
    address: {
      street: 'Rua Bela Vista',
      number: '85',
      neighborhood: 'Bela Vista',
      city: 'Remígio',
      state: 'PB',
      cep: '58398-000'
    },
    entryDate: '2018-05-10',
    entryType: 'Aclamação',
    status: 'Ativo',
    role: 'dirigente do vaso de unção',
    department: 'Departamento Vaso de Unção',
    familyId: 'fam-3',
    familyRole: 'Chefe de Família',
    baptismWaterDate: '2002-11-15',
    notes: 'Líder do círculo de oração e vigílias Vaso de Unção',
    documents: [],
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20'
  },
  {
    id: 'mem-4',
    fullName: 'Ana Cláudia Albuquerque',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    birthDate: '1990-10-21',
    gender: 'Feminino',
    maritalStatus: 'Casado(a)',
    phone: '(83) 99120-3355',
    email: 'ana.missoes@gmail.com',
    address: {
      street: 'Sítio Gravatá',
      number: 'S/N',
      neighborhood: 'Zona Rural',
      city: 'Remígio',
      state: 'PB',
      cep: '58398-000'
    },
    entryDate: '2019-08-15',
    entryType: 'Batismo',
    status: 'Ativo',
    role: 'secretaria de missões',
    department: 'Secretaria de Missões',
    familyId: 'fam-4',
    familyRole: 'Cônjuge',
    baptismWaterDate: '2006-03-18',
    notes: 'Coordena o envio de relatórios e ofertas de missões',
    documents: [],
    createdAt: '2024-02-01',
    updatedAt: '2024-02-01'
  },
  {
    id: 'mem-5',
    fullName: 'Marcos Vinícius Santos',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    birthDate: '1988-06-14',
    gender: 'Masculino',
    maritalStatus: 'Casado(a)',
    phone: '(83) 99344-8899',
    email: 'marcos.missoes@gmail.com',
    address: {
      street: 'Av. Epitácio Pessoa',
      number: '304',
      neighborhood: 'Centro',
      city: 'Remígio',
      state: 'PB',
      cep: '58398-000'
    },
    entryDate: '2017-02-18',
    entryType: 'Aclamação',
    status: 'Ativo',
    role: 'dirigente do departamento de missões',
    department: 'Missões',
    familyRole: 'Chefe de Família',
    baptismWaterDate: '2004-12-08',
    notes: 'Coordena viagens e cruzadas nos povoados vizinhos',
    documents: [],
    createdAt: '2024-02-05',
    updatedAt: '2024-02-05'
  },
  {
    id: 'mem-6',
    fullName: 'Priscila Ramos Silva',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    birthDate: '1993-12-03',
    gender: 'Feminino',
    maritalStatus: 'Casado(a)',
    phone: '(83) 98823-1100',
    address: {
      street: 'Rua São José',
      number: '45',
      neighborhood: 'Vila Nova',
      city: 'Remígio',
      state: 'PB',
      cep: '58398-000'
    },
    entryDate: '2020-01-22',
    entryType: 'Batismo',
    status: 'Ativo',
    role: 'dirigente do shalom adonai',
    department: 'Grupo Shalom Adonai',
    baptismWaterDate: '2012-04-11',
    notes: 'Dirigente do grupo de louvor e adoração Shalom Adonai',
    documents: [],
    createdAt: '2024-02-10',
    updatedAt: '2024-02-10'
  },
  {
    id: 'mem-7',
    fullName: 'Robson Lima Ferreira',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    birthDate: '1979-08-30',
    gender: 'Masculino',
    maritalStatus: 'Casado(a)',
    phone: '(83) 99655-4422',
    address: {
      street: 'Rua 7 de Setembro',
      number: '180',
      neighborhood: 'Centro',
      city: 'Remígio',
      state: 'PB',
      cep: '58398-000'
    },
    entryDate: '2015-09-10',
    entryType: 'Carta de Transferência',
    status: 'Ativo',
    role: 'dirigente do gideão',
    department: 'Círculo de Oração Gideões da Fé',
    baptismWaterDate: '1997-05-19',
    notes: 'Responsável pelas campanhas de jejum e oração',
    documents: [],
    createdAt: '2024-02-15',
    updatedAt: '2024-02-15'
  },
  {
    id: 'mem-8',
    fullName: 'Valter Silva Costa',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    birthDate: '1981-04-17',
    gender: 'Masculino',
    maritalStatus: 'Casado(a)',
    phone: '(83) 98788-3311',
    address: {
      street: 'Av. Severino Cabral',
      number: '92',
      neighborhood: 'Centro',
      city: 'Remígio',
      state: 'PB',
      cep: '58398-000'
    },
    entryDate: '2018-04-05',
    entryType: 'Batismo',
    status: 'Ativo',
    role: 'dirigente dos homens',
    department: 'União de Homens',
    baptismWaterDate: '2005-09-24',
    notes: 'Coordena o trabalho com os varões da igreja',
    documents: [],
    createdAt: '2024-02-20',
    updatedAt: '2024-02-20'
  },
  {
    id: 'mem-9',
    fullName: 'Luciana Farias Dantas',
    photoUrl: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=400&q=80',
    birthDate: '1986-10-29', // Aniversário em outubro
    gender: 'Feminino',
    maritalStatus: 'Casado(a)',
    phone: '(83) 99822-7711',
    address: {
      street: 'Rua do Sol',
      number: '55',
      neighborhood: 'Bela Vista',
      city: 'Remígio',
      state: 'PB',
      cep: '58398-000'
    },
    entryDate: '2019-11-12',
    entryType: 'Batismo',
    status: 'Ativo',
    role: 'dirigente do apocalipse',
    department: 'Mocidade Apocalipse',
    baptismWaterDate: '2003-10-10',
    notes: 'Coordena a mocidade e congressos de jovens',
    documents: [],
    createdAt: '2024-03-01',
    updatedAt: '2024-03-01'
  },
  {
    id: 'mem-10',
    fullName: 'Pastor Antônio Guimarães',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    birthDate: '1970-02-11',
    gender: 'Masculino',
    maritalStatus: 'Casado(a)',
    phone: '(83) 99100-2211',
    address: {
      street: 'Rua Bela Vista',
      number: '110',
      neighborhood: 'Centro',
      city: 'Remígio',
      state: 'PB',
      cep: '58398-000'
    },
    entryDate: '2014-06-18',
    entryType: 'Aclamação',
    status: 'Ativo',
    role: 'dirigente dos casais',
    department: 'Ministério de Casais',
    baptismWaterDate: '1988-11-20',
    notes: 'Conselheiro matrimonial e coordenador de encontros de casais',
    documents: [],
    createdAt: '2024-03-05',
    updatedAt: '2024-03-05'
  },
  {
    id: 'mem-11',
    fullName: 'Manoel Messias Cavalcanti',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    birthDate: '1965-10-19', // Aniversário em outubro
    gender: 'Masculino',
    maritalStatus: 'Casado(a)',
    phone: '(83) 98777-6655',
    address: {
      street: 'Rua do Açude',
      number: '33',
      neighborhood: 'São Sebastião',
      city: 'Remígio',
      state: 'PB',
      cep: '58398-000'
    },
    entryDate: '2012-08-10',
    entryType: 'Batismo',
    status: 'Ativo',
    role: 'Presbítero',
    department: 'Visitação Pastoral',
    baptismWaterDate: '1985-06-25',
    notes: 'Presbítero atuante nas visitas e ministrações',
    documents: [],
    createdAt: '2024-03-10',
    updatedAt: '2024-03-10'
  },
  {
    id: 'mem-12',
    fullName: 'Maria das Graças Cavalcanti',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    birthDate: '1968-07-22',
    gender: 'Feminino',
    maritalStatus: 'Casado(a)',
    phone: '(83) 98777-6656',
    address: {
      street: 'Rua do Açude',
      number: '33',
      neighborhood: 'São Sebastião',
      city: 'Remígio',
      state: 'PB',
      cep: '58398-000'
    },
    entryDate: '2012-08-10',
    entryType: 'Batismo',
    status: 'Ativo',
    role: 'Diaconisa',
    department: 'Diaconia e Ação Social',
    baptismWaterDate: '1986-01-14',
    notes: 'Coordenadora de assistência fraterna e recepção',
    documents: [],
    createdAt: '2024-03-10',
    updatedAt: '2024-03-10'
  }
];

export const INITIAL_ASSETS: Asset[] = [
  {
    id: 'ast-1',
    name: 'Mesa de Som Digital Behringer X32',
    description: 'Mesa de som digital profissional 32 canais, gravação multipista e efeitos integrados',
    category: 'Som & Multimídia',
    quantity: 1,
    unitValue: 18500.00,
    totalValue: 18500.00,
    acquisitionDate: '2023-04-15',
    condition: 'Ótimo',
    location: 'Galeria - Cabine de Som',
    responsible: 'Carlos Eduardo (Ministério de Som)',
    patrimonyNumber: 'ADM-SOM-001',
    photoUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80',
    createdAt: '2024-01-10'
  },
  {
    id: 'ast-2',
    name: 'Púlpito de Acrílico Personalizado ADMJEBOP',
    description: 'Púlpito em acrílico cristal 15mm com brasão gravado a laser e iluminação LED embutida',
    category: 'Mobiliário',
    quantity: 1,
    unitValue: 4200.00,
    totalValue: 4200.00,
    acquisitionDate: '2022-11-20',
    condition: 'Novo',
    location: 'Altar Principal',
    responsible: 'Pr. Joel Bento',
    patrimonyNumber: 'ADM-MOB-001',
    photoUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=600&q=80',
    createdAt: '2024-01-10'
  },
  {
    id: 'ast-3',
    name: 'Caixas de Som Ativas JBL EON 715',
    description: 'Par de caixas amplificadas ativas 1300W com DSP e Bluetooth para templo principal',
    category: 'Som & Multimídia',
    quantity: 4,
    unitValue: 3600.00,
    totalValue: 14400.00,
    acquisitionDate: '2023-06-10',
    condition: 'Ótimo',
    location: 'Nave Principal (Suspensa em Fly)',
    responsible: 'Equipe de Sonorização',
    patrimonyNumber: 'ADM-SOM-002',
    photoUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80',
    createdAt: '2024-01-10'
  },
  {
    id: 'ast-4',
    name: 'Teclado Sintetizador Roland XPS-30',
    description: 'Teclado sintetizador profissional com sons de cordas, pianos e órgãos litúrgicos',
    category: 'Instrumentos Musicais',
    quantity: 1,
    unitValue: 6200.00,
    totalValue: 6200.00,
    acquisitionDate: '2022-08-05',
    condition: 'Bom',
    location: 'Altar - Espaço dos Músicos',
    responsible: 'Priscila Ramos (Shalom Adonai)',
    patrimonyNumber: 'ADM-INS-001',
    photoUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    createdAt: '2024-01-10'
  },
  {
    id: 'ast-5',
    name: 'Bateria Eletrônica Roland TD-17KVX',
    description: 'Bateria eletrônica completa com pads mesh head e pratos dual-zone',
    category: 'Instrumentos Musicais',
    quantity: 1,
    unitValue: 12800.00,
    totalValue: 12800.00,
    acquisitionDate: '2023-01-18',
    condition: 'Ótimo',
    location: 'Altar - Espaço dos Músicos',
    responsible: 'Diácono Lucas Silva',
    patrimonyNumber: 'ADM-INS-002',
    photoUrl: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=600&q=80',
    createdAt: '2024-01-10'
  },
  {
    id: 'ast-6',
    name: 'Aparelhos de Ar-Condicionado Split 30.000 BTUs',
    description: 'Splits Inverter de alta eficiência energética para climatização da nave da igreja',
    category: 'Climatização',
    quantity: 3,
    unitValue: 4800.00,
    totalValue: 14400.00,
    acquisitionDate: '2022-12-01',
    condition: 'Bom',
    location: 'Nave do Templo',
    responsible: 'Diaconia Geral',
    patrimonyNumber: 'ADM-CLM-001',
    photoUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
    createdAt: '2024-01-10'
  },
  {
    id: 'ast-7',
    name: 'Cadeiras Estofadas para o Templo (Longarinas)',
    description: 'Cadeiras estofadas em tecido impermeável azul marinho com porta-bíblia traseiro',
    category: 'Mobiliário',
    quantity: 120,
    unitValue: 110.00,
    totalValue: 13200.00,
    acquisitionDate: '2021-09-15',
    condition: 'Bom',
    location: 'Nave do Templo',
    responsible: 'Diaconia Geral',
    patrimonyNumber: 'ADM-MOB-002',
    photoUrl: 'https://images.unsplash.com/photo-1580481077195-c328a37db71a?auto=format&fit=crop&w=600&q=80',
    createdAt: '2024-01-10'
  },
  {
    id: 'ast-8',
    name: 'Projetor Laser Epson PowerLite 4000 Lumens',
    description: 'Projetor multimídia Full HD de alta luminosidade para letras de hinos e pregação',
    category: 'Som & Multimídia',
    quantity: 1,
    unitValue: 5600.00,
    totalValue: 5600.00,
    acquisitionDate: '2023-03-20',
    condition: 'Ótimo',
    location: 'Templo Central (Teto)',
    responsible: 'Mídia e Comunicação',
    patrimonyNumber: 'ADM-SOM-003',
    photoUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80',
    createdAt: '2024-01-10'
  }
];

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'evt-1',
    title: 'Santa Ceia do Senhor & Culto de Celebração',
    date: '2026-10-18', // Domingo próximo
    startTime: '19:00',
    endTime: '21:30',
    location: 'Templo Sede Remígio',
    department: 'Geral',
    category: 'Santa Ceia',
    color: '#e11d48',
    description: 'Celebração mensal da Santa Ceia com toda a congregação e ministração da Palavra',
    preacherOrLeader: 'Pr. Joel Bento'
  },
  {
    id: 'evt-2',
    title: 'Vigília e Clamor do Vaso de Unção',
    date: '2026-10-23', // Sexta
    startTime: '22:00',
    endTime: '03:00',
    location: 'Templo Sede Remígio',
    department: 'Vaso de Unção',
    category: 'Vigília',
    color: '#2563eb',
    description: 'Noite de intercessão profética, libertação e busca do poder de Deus',
    preacherOrLeader: 'Carlos Eduardo (Dirigente Vaso de Unção)'
  },
  {
    id: 'evt-3',
    title: 'Culto de Doutrina e Ensino Bíblico',
    date: '2026-10-20', // Terça
    startTime: '19:30',
    endTime: '21:00',
    location: 'Templo Sede Remígio',
    department: 'EBD',
    category: 'Culto',
    color: '#0284c7',
    description: 'Estudo das Escrituras e doutrinas fundamentais da fé cristã',
    preacherOrLeader: 'Pr. Joel Bento'
  },
  {
    id: 'evt-4',
    title: 'Cruzada Evangelística no Bairro Bela Vista',
    date: '2026-10-25', // Domingo
    startTime: '18:30',
    endTime: '21:00',
    location: 'Praça Central do Bairro Bela Vista',
    department: 'Missões',
    category: 'Cruzada',
    color: '#9333ea',
    description: 'Evangelismo ao ar livre com louvores, testemunhos e distribuição de folhetos',
    preacherOrLeader: 'Marcos Vinícius (Dirigente de Missões)'
  },
  {
    id: 'evt-5',
    title: 'Congresso da Mocidade Apocalipse',
    date: '2026-11-14',
    endDate: '2026-11-15',
    startTime: '19:00',
    endTime: '21:30',
    location: 'Templo Sede Remígio',
    department: 'Apocalipse',
    category: 'Festividade',
    color: '#ea580c',
    description: 'Grande congresso dos jovens com preletores convidados e muito louvor',
    preacherOrLeader: 'Luciana Farias (Dirigente Apocalipse)'
  },
  {
    id: 'evt-6',
    title: 'Encontro Edificante de Casais',
    date: '2026-11-21',
    startTime: '19:30',
    endTime: '22:00',
    location: 'Salão Social ADMJEBOP',
    department: 'Casais',
    category: 'Reunião',
    color: '#d97706',
    description: 'Jantar e palestra sobre princípios de um casamento sólido na presença de Deus',
    preacherOrLeader: 'Pr. Antônio Guimarães'
  }
];

export const INITIAL_VISITS: PastoralVisit[] = [
  {
    id: 'vis-1',
    memberName: 'Irª. Maria José dos Santos',
    date: '2026-10-19',
    time: '15:00',
    visitorName: 'Pr. Joel Bento & Diaconia',
    visitorRole: 'Pastor Titular',
    purpose: 'Enfermidade',
    status: 'Agendada',
    notes: 'Visita de oração e conforto espiritual pós cirurgia',
    confidential: false,
    followUpNeeded: true,
    followUpDate: '2026-10-26'
  },
  {
    id: 'vis-2',
    memberName: 'Família Bento de Carvalho',
    date: '2026-10-17',
    time: '19:30',
    visitorName: 'Presb. Manoel Messias',
    visitorRole: 'Presbítero',
    purpose: 'Novo Convertido',
    status: 'Pendente',
    notes: 'Visita de discipulado e acolhimento dos recém-chegados',
    confidential: false,
    followUpNeeded: true
  },
  {
    id: 'vis-3',
    memberName: 'Ir. Severino da Silva',
    date: '2026-10-12',
    time: '16:00',
    visitorName: 'Diác. Carlos Oliveira',
    visitorRole: 'Diácono',
    purpose: 'Rotina',
    status: 'Realizada',
    notes: 'Visita fraterna realizada com leitura do Salmo 23 e oração pela família',
    confidential: false
  }
];

export const INITIAL_SOCIAL_ACTIONS: SocialAction[] = [
  {
    id: 'soc-1',
    title: 'Campanha Cestas da Fé - Outubro Solidário',
    type: 'Cestas Básicas',
    beneficiaryName: 'Famílias assistidas da Comunidade do Açude',
    itemsDistributed: '15 Cestas Básicas completas com alimentos não perecíveis e óleo',
    quantity: 15,
    date: '2026-10-10',
    responsible: 'Diaconisa Maria das Graças',
    status: 'Entregue',
    notes: 'Ação realizada com recursos arrecadados nos cultos de missões'
  },
  {
    id: 'soc-2',
    title: 'Auxílio Medicamentoso Emergencial',
    type: 'Auxílio Saúde',
    beneficiaryName: 'Irª. Lourdes Rodrigues',
    itemsDistributed: 'Remédios de uso contínuo para hipertensão e fraldas geriátricas',
    quantity: 1,
    date: '2026-10-14',
    responsible: 'Sarah Medeiros',
    status: 'Entregue',
    confidential: true,
    notes: 'Apoio pontual aprovado pela liderança pastoral'
  },
  {
    id: 'soc-3',
    title: 'Arrecadação para Reforma de Residência S.O.S',
    type: 'S.O.S Famílias',
    beneficiaryName: 'Família Oliveira da Zona Rural',
    itemsDistributed: 'Telhas de fibrocimento e sacos de cimento',
    quantity: 25,
    date: '2026-10-22',
    responsible: 'Valter Silva (União de Homens)',
    status: 'Em Andamento',
    notes: 'Mutirão voluntário agendado para o próximo sábado com a União dos Homens'
  }
];

export const INITIAL_SECRETARIAT_DOCS: SecretariatDoc[] = [
  {
    id: 'sec-1',
    type: 'Ata de Reunião',
    title: 'Ata da Reunião Geral de Obreiros e Liderança - 02/10/2026',
    date: '2026-10-02',
    content: 'Aos dois dias do mês de outubro de 2026, reuniu-se a diretoria ministerial da ADMJEBOP Remígio-PB sob a presidência do Pr. Joel Bento. Foram deliberadas as datas do congresso da juventude Apocalipse, a aprovação do relatório patrimonial da aquisição da mesa Behringer X32 e a escala de visitação pastoral.',
    signee: 'Irª. Sarah Medeiros (Secretária Geral)',
    status: 'Oficial'
  },
  {
    id: 'sec-2',
    type: 'Carta de Recomendação',
    title: 'Carta de Recomendação Eclesiástica - Carlos Eduardo Oliveira',
    date: '2026-09-15',
    content: 'Recomendamos o estimado irmão Carlos Eduardo Oliveira à comunhão dos santos da congregação coirmã, dando testemunho de sua conduta ilibada, zelo ministerial e fidelidade ao Evangelho de Cristo.',
    signee: 'Pr. Joel Bento (Pastor Dirigente)',
    status: 'Oficial'
  },
  {
    id: 'sec-3',
    type: 'Certificado de Batismo',
    title: 'Certificado Oficial de Batismo nas Águas - Priscila Ramos',
    date: '2024-04-11',
    content: 'Certificamos que a irmã Priscila Ramos desceu às águas batismais conforme a ordenança do Senhor Jesus Cristo registrada em Mateus 28:19.',
    signee: 'Pr. Joel Bento',
    status: 'Oficial'
  }
];

export const INITIAL_MISSIONS: MissionItem[] = [
  {
    id: 'mis-1',
    title: 'Frente Missionária Sertão Vivo - Curimataú Paraibano',
    location: 'Comunidades Rurais de Barra de Santa Rosa e Picuí',
    type: 'Campo Missionário',
    leader: 'Missionário João Paulo & Família',
    phone: '(83) 99811-9988',
    report: '3 congregações ativas com cultos semanais, 14 batismos realizados este ano e implantação de poço artesiano comunitário.',
    prayerRequests: 'Oração pela saúde física da família missionária, provisão financeira para conclusão do salão de cultos e salvação dos jovens.',
    financialSupportMonthly: 1200.00,
    photos: [
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80'
    ],
    status: 'Ativo'
  },
  {
    id: 'mis-2',
    title: 'Projeto Evangelismo nos Sítios de Remígio',
    location: 'Sítio Gravatá, Sítio Coelho e Assentamentos de Remígio-PB',
    type: 'Projeto Local',
    leader: 'Marcos Vinícius & Ana Cláudia Albuquerque',
    phone: '(83) 99344-8899',
    report: 'Visitas mensais de casa em casa aos domingos à tarde, cultos relâmpago ao entardecer e discipulado com 18 novos crentes.',
    prayerRequests: 'Transporte para deslocamento da equipe nos fins de semana e abertura de portas nos lares mais resistentes.',
    financialSupportMonthly: 450.00,
    photos: [
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=600&q=80'
    ],
    status: 'Ativo'
  }
];
