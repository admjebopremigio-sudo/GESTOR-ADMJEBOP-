import React from 'react';
import {
  Asset,
  ChurchConfig,
  EventItem,
  Family,
  Member,
  ModuleColors,
  ModuleKey,
  PastoralVisit,
  SocialAction
} from '../../types';
import { AuthUser } from '../../types/auth';
import { ChurchLogo } from '../common/ChurchLogo';
import {
  Users,
  Home,
  FileText,
  Globe2,
  HeartHandshake,
  Church,
  Landmark,
  Cake,
  CalendarDays,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Clock,
  Sparkles,
  MessageCircle,
  Calendar,
  CheckCircle2,
  Phone
} from 'lucide-react';

interface DashboardViewProps {
  colors: ModuleColors;
  churchConfig: ChurchConfig;
  currentUser: AuthUser;
  onNavigate: (module: ModuleKey) => void;
  members: Member[];
  families: Family[];
  assets: Asset[];
  events: EventItem[];
  visits: PastoralVisit[];
  socialActions: SocialAction[];
  onOpenChurchConfig: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  colors,
  churchConfig,
  currentUser,
  onNavigate,
  members,
  families,
  assets,
  events,
  visits,
  socialActions,
  onOpenChurchConfig,
}) => {
  // 1. Calculate Total Patrimony automatically
  const totalPatrimony = assets.reduce((sum, a) => {
    return sum + (Number(a.totalValue) || (Number(a.quantity) * Number(a.unitValue)) || 0);
  }, 0);

  const formattedPatrimony = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(totalPatrimony);

  // 2. Active members count
  const activeMembersCount = members.filter(m => m.status === 'Ativo').length;

  // 3. Pending pastoral visits
  const pendingVisits = visits.filter(v => v.status === 'Pendente' || v.status === 'Agendada');

  // 4. Calculate Birthdays (this month & upcoming)
  const today = new Date();
  const currentMonth = today.getMonth() + 1; // 1-12
  const currentDay = today.getDate();

  const birthdaysThisMonth = members
    .filter(m => {
      if (!m.birthDate) return false;
      const parts = m.birthDate.split('-');
      if (parts.length < 3) return false;
      const month = parseInt(parts[1], 10);
      return month === currentMonth;
    })
    .sort((a, b) => {
      const dayA = parseInt(a.birthDate.split('-')[2], 10);
      const dayB = parseInt(b.birthDate.split('-')[2], 10);
      return dayA - dayB;
    });

  // 5. Sorted upcoming events
  const todayStr = today.toISOString().split('T')[0];
  const upcomingEvents = [...events]
    .filter(e => e.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4);

  // Helper for greeting
  const getGreeting = () => {
    const hour = today.getHours();
    if (hour < 12) return 'A paz do Senhor, bom dia';
    if (hour < 18) return 'A paz do Senhor, boa tarde';
    return 'A paz do Senhor, boa noite';
  };

  // Helper for WhatsApp birthday message
  const handleSendGreeting = (member: Member) => {
    const rawPhone = member.phone.replace(/\D/g, '');
    const cleanPhone = rawPhone.startsWith('55') ? rawPhone : `55${rawPhone}`;
    const text = encodeURIComponent(
      `A paz do Senhor, amado(a) ${member.fullName}! 🎂🎉\n\nA liderança e os irmãos da Assembleia de Deus – Ministério Jesus o Bom Pastor (Congregação de Remígio-PB) desejam a você um abençoado e feliz aniversário! Que o Senhor derrame ricas bênçãos, saúde, paz e graça sobre sua vida e família. Parabéns!`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      
      {/* 1. WELCOME HERO CARD */}
      <div
        style={{
          background: `linear-gradient(135deg, ${colors.dashboard || '#0f172a'} 0%, #1e293b 100%)`,
        }}
        className="rounded-3xl p-5 sm:p-7 border border-slate-700/80 shadow-xl relative overflow-hidden text-white"
      >
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-amber-500/10 to-transparent pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4">
            <div
              onClick={onOpenChurchConfig}
              className="cursor-pointer transition-transform hover:scale-105"
              title="Clique para editar a logomarca"
            >
              <ChurchLogo
                logoUrl={churchConfig.logoUrl}
                size="lg"
                showEditHint={true}
                className="ring-4 ring-amber-400/30 bg-slate-950/60 shadow-lg"
              />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-1">
                <Sparkles className="w-3 h-3" />
                <span>{churchConfig.congregation}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {getGreeting()}, {currentUser.name}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Painel Geral de Gestão Ministerial Integrada • ADMJEBOP
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-950/40 p-2.5 rounded-2xl border border-slate-700/50 backdrop-blur-xs">
            <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="text-xs">
              <p className="font-bold text-slate-200">
                {new Date().toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
              <p className="text-[10px] text-slate-400">
                {activeMembersCount} membros em plena comunhão
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN KPI METRICS (4 HIGHLIGHT CARDS) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Total Members */}
        <div
          onClick={() => onNavigate('members')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onNavigate('members'); }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg hover:border-blue-500/50 transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <div
              style={{ backgroundColor: `${colors.members}25`, color: colors.members }}
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
            >
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-blue-400 flex items-center gap-0.5 transition-colors">
              Membros <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {members.length}
          </p>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-emerald-400 font-semibold">{activeMembersCount} ativos</span>
            <span>• {members.length - activeMembersCount} outros</span>
          </p>
        </div>

        {/* Families */}
        <div
          onClick={() => onNavigate('families')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onNavigate('families'); }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg hover:border-emerald-500/50 transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <div
              style={{ backgroundColor: `${colors.families}25`, color: colors.families }}
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
            >
              <Home className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-emerald-400 flex items-center gap-0.5 transition-colors">
              Famílias <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {families.length}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Famílias registradas no rol
          </p>
        </div>

        {/* PATRIMONY (Calculated automatically from registered assets) */}
        <div
          onClick={() => onNavigate('patrimony')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onNavigate('patrimony'); }}
          style={{ borderColor: `${colors.patrimony}50` }}
          className="bg-slate-900 border-2 rounded-2xl p-4 sm:p-5 shadow-lg hover:border-amber-400 transition-all cursor-pointer group relative overflow-hidden col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between mb-2">
            <div
              style={{ backgroundColor: `${colors.patrimony}25`, color: colors.patrimony }}
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
            >
              <Landmark className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-0.5">
              Patrimônio <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-amber-400 tracking-tight">
            {formattedPatrimony}
          </p>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span>{assets.length} bens cadastrados</span>
            <span>• Cálculo em tempo real</span>
          </p>
        </div>

        {/* Upcoming Events */}
        <div
          onClick={() => onNavigate('agenda')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onNavigate('agenda'); }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg hover:border-sky-500/50 transition-all cursor-pointer group relative overflow-hidden col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between mb-3">
            <div
              style={{ backgroundColor: `${colors.agenda}25`, color: colors.agenda }}
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
            >
              <CalendarDays className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-sky-400 flex items-center gap-0.5 transition-colors">
              Agenda <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {events.length}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {upcomingEvents.length} eventos nos próximos dias
          </p>
        </div>
      </div>

      {/* 3. COLORFUL MODULE SHORTCUTS (All 10 modules formatted as cards) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span>Acesso Rápido aos Departamentos & Módulos</span>
          </h2>
          <span className="text-[11px] text-slate-500">Toque para abrir</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          
          {/* Membros */}
          <button
            onClick={() => onNavigate('members')}
            style={{ borderTopColor: colors.members }}
            className="bg-slate-900 border border-slate-800 border-t-4 rounded-2xl p-3.5 text-left hover:bg-slate-800/80 transition-all hover:scale-[1.02] shadow-md group"
          >
            <div
              style={{ backgroundColor: `${colors.members}25`, color: colors.members }}
              className="w-8 h-8 rounded-xl flex items-center justify-center mb-2"
            >
              <Users className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-slate-200">Membros</p>
            <p className="text-[11px] text-slate-400">{members.length} cadastrados</p>
          </button>

          {/* Famílias */}
          <button
            onClick={() => onNavigate('families')}
            style={{ borderTopColor: colors.families }}
            className="bg-slate-900 border border-slate-800 border-t-4 rounded-2xl p-3.5 text-left hover:bg-slate-800/80 transition-all hover:scale-[1.02] shadow-md group"
          >
            <div
              style={{ backgroundColor: `${colors.families}25`, color: colors.families }}
              className="w-8 h-8 rounded-xl flex items-center justify-center mb-2"
            >
              <Home className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-slate-200">Famílias</p>
            <p className="text-[11px] text-slate-400">{families.length} núcleos</p>
          </button>

          {/* Secretaria */}
          <button
            onClick={() => onNavigate('secretariat')}
            style={{ borderTopColor: colors.secretariat }}
            className="bg-slate-900 border border-slate-800 border-t-4 rounded-2xl p-3.5 text-left hover:bg-slate-800/80 transition-all hover:scale-[1.02] shadow-md group"
          >
            <div
              style={{ backgroundColor: `${colors.secretariat}25`, color: colors.secretariat }}
              className="w-8 h-8 rounded-xl flex items-center justify-center mb-2"
            >
              <FileText className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-slate-200">Secretaria</p>
            <p className="text-[11px] text-slate-400">Atas & Certidões</p>
          </button>

          {/* Missões */}
          <button
            onClick={() => onNavigate('missions')}
            style={{ borderTopColor: colors.missions }}
            className="bg-slate-900 border border-slate-800 border-t-4 rounded-2xl p-3.5 text-left hover:bg-slate-800/80 transition-all hover:scale-[1.02] shadow-md group"
          >
            <div
              style={{ backgroundColor: `${colors.missions}25`, color: colors.missions }}
              className="w-8 h-8 rounded-xl flex items-center justify-center mb-2"
            >
              <Globe2 className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-slate-200">Missões</p>
            <p className="text-[11px] text-slate-400">Projetos & Campos</p>
          </button>

          {/* Ação Social */}
          <button
            onClick={() => onNavigate('socialAction')}
            style={{ borderTopColor: colors.socialAction }}
            className="bg-slate-900 border border-slate-800 border-t-4 rounded-2xl p-3.5 text-left hover:bg-slate-800/80 transition-all hover:scale-[1.02] shadow-md group"
          >
            <div
              style={{ backgroundColor: `${colors.socialAction}25`, color: colors.socialAction }}
              className="w-8 h-8 rounded-xl flex items-center justify-center mb-2"
            >
              <HeartHandshake className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-slate-200">Ação Social</p>
            <p className="text-[11px] text-slate-400">{socialActions.length} campanhas</p>
          </button>

          {/* Visitação Pastoral */}
          <button
            onClick={() => onNavigate('pastoralVisits')}
            style={{ borderTopColor: colors.pastoralVisits }}
            className="bg-slate-900 border border-slate-800 border-t-4 rounded-2xl p-3.5 text-left hover:bg-slate-800/80 transition-all hover:scale-[1.02] shadow-md group"
          >
            <div
              style={{ backgroundColor: `${colors.pastoralVisits}25`, color: colors.pastoralVisits }}
              className="w-8 h-8 rounded-xl flex items-center justify-center mb-2"
            >
              <Church className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-slate-200">Visitação</p>
            <p className="text-[11px] text-slate-400">
              {pendingVisits.length > 0 ? `${pendingVisits.length} pendentes` : 'Em dia'}
            </p>
          </button>

          {/* Patrimônio */}
          <button
            onClick={() => onNavigate('patrimony')}
            style={{ borderTopColor: colors.patrimony }}
            className="bg-slate-900 border border-slate-800 border-t-4 rounded-2xl p-3.5 text-left hover:bg-slate-800/80 transition-all hover:scale-[1.02] shadow-md group"
          >
            <div
              style={{ backgroundColor: `${colors.patrimony}25`, color: colors.patrimony }}
              className="w-8 h-8 rounded-xl flex items-center justify-center mb-2"
            >
              <Landmark className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-slate-200">Patrimônio</p>
            <p className="text-[11px] text-amber-400 font-semibold">{assets.length} bens</p>
          </button>

          {/* Aniversariantes */}
          <button
            onClick={() => onNavigate('birthdays')}
            style={{ borderTopColor: colors.birthdays }}
            className="bg-slate-900 border border-slate-800 border-t-4 rounded-2xl p-3.5 text-left hover:bg-slate-800/80 transition-all hover:scale-[1.02] shadow-md group"
          >
            <div
              style={{ backgroundColor: `${colors.birthdays}25`, color: colors.birthdays }}
              className="w-8 h-8 rounded-xl flex items-center justify-center mb-2"
            >
              <Cake className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-slate-200">Aniversariantes</p>
            <p className="text-[11px] text-orange-400 font-semibold">{birthdaysThisMonth.length} neste mês</p>
          </button>

          {/* Agenda Anual */}
          <button
            onClick={() => onNavigate('agenda')}
            style={{ borderTopColor: colors.agenda }}
            className="bg-slate-900 border border-slate-800 border-t-4 rounded-2xl p-3.5 text-left hover:bg-slate-800/80 transition-all hover:scale-[1.02] shadow-md group col-span-2 sm:col-span-1"
          >
            <div
              style={{ backgroundColor: `${colors.agenda}25`, color: colors.agenda }}
              className="w-8 h-8 rounded-xl flex items-center justify-center mb-2"
            >
              <CalendarDays className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-slate-200">Agenda Anual</p>
            <p className="text-[11px] text-sky-400 font-semibold">{events.length} cultos & atos</p>
          </button>
        </div>
      </div>

      {/* 4. SPLIT SECTION: UPCOMING EVENTS & BIRTHDAYS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Next Events in Agenda */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <div
                style={{ backgroundColor: `${colors.agenda}25`, color: colors.agenda }}
                className="w-8 h-8 rounded-xl flex items-center justify-center"
              >
                <CalendarDays className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Próximos Eventos da Agenda</h3>
                <p className="text-[11px] text-slate-400">Programação ministerial confirmada</p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('agenda')}
              className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
            >
              <span>Ver agenda</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 flex-1">
            {upcomingEvents.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                Nenhum evento futuro agendado no momento.
              </p>
            ) : (
              upcomingEvents.map((evt) => {
                const [year, month, day] = evt.date.split('-');
                return (
                  <div
                    key={evt.id}
                    className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between gap-3 hover:border-slate-600 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Date Badge */}
                      <div
                        style={{ backgroundColor: `${evt.color || colors.agenda}20`, borderColor: evt.color || colors.agenda }}
                        className="w-11 h-11 rounded-xl border flex flex-col items-center justify-center text-center shrink-0"
                      >
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                          {month}/{year?.slice(2)}
                        </span>
                        <span className="text-sm font-black text-white leading-none">
                          {day}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-200 truncate">
                          {evt.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {evt.startTime}
                          </span>
                          <span>•</span>
                          <span className="truncate">{evt.location}</span>
                        </div>
                      </div>
                    </div>

                    <span
                      style={{ backgroundColor: `${evt.color || colors.agenda}25`, color: evt.color || colors.agenda }}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-lg shrink-0"
                    >
                      {evt.department}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Birthdays this Month */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <div
                style={{ backgroundColor: `${colors.birthdays}25`, color: colors.birthdays }}
                className="w-8 h-8 rounded-xl flex items-center justify-center"
              >
                <Cake className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Aniversariantes Próximos</h3>
                <p className="text-[11px] text-slate-400">
                  {birthdaysThisMonth.length} aniversariantes neste mês
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('birthdays')}
              className="text-xs text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1"
            >
              <span>Ver todos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5 flex-1">
            {birthdaysThisMonth.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                Nenhum membro aniversariando neste mês.
              </p>
            ) : (
              birthdaysThisMonth.slice(0, 4).map((m) => {
                const day = m.birthDate.split('-')[2];
                const isToday = parseInt(day, 10) === currentDay;

                return (
                  <div
                    key={m.id}
                    className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                      isToday
                        ? 'bg-amber-500/10 border-amber-500/40 shadow'
                        : 'bg-slate-800/50 border-slate-700/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {m.photoUrl ? (
                        <img
                          src={m.photoUrl}
                          alt={m.fullName}
                          className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-slate-700"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
                          {m.fullName.charAt(0)}
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-slate-200 truncate">
                            {m.fullName}
                          </p>
                          {isToday && (
                            <span className="px-1.5 py-0.2 bg-amber-400 text-slate-950 font-black text-[9px] rounded-full uppercase">
                              Hoje! 🎉
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">
                          {m.role} • Dia {day}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSendGreeting(m)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold shrink-0 transition-colors"
                      title="Enviar parabéns pelo WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="hidden sm:inline">Felicitar</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* 5. VISITS PENDING ALERT BANNER */}
      {pendingVisits.length > 0 && (
        <div className="bg-teal-950/40 border border-teal-500/40 rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-500/20 text-teal-300 rounded-2xl shrink-0">
              <Church className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{pendingVisits.length} Visitações Pastorais Agendadas / Pendentes</span>
                <span className="px-2 py-0.5 text-[10px] bg-teal-500/20 text-teal-300 rounded-full border border-teal-500/40 font-bold">
                  Atenção
                </span>
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Membros enfermos e novos convertidos necessitam de acompanhamento pastoral.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('pastoralVisits')}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-colors shadow-md flex items-center gap-1.5 shrink-0"
          >
            <span>Ver Escala de Visitas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
