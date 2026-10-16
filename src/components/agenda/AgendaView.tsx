import React, { useState, useMemo } from 'react';
import { EventItem, ModuleColors } from '../../types';
import { AuthUser } from '../../types/auth';
import { hasPermission } from '../../services/authService';
import {
  CalendarDays,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  User,
  Calendar,
  Filter,
  Printer,
  Edit2,
  Trash2,
  X,
  Tag,
  CheckCircle2,
  MoveHorizontal
} from 'lucide-react';

interface AgendaViewProps {
  colors: ModuleColors;
  events: EventItem[];
  currentUser: AuthUser;
  onAddEvent: (event: Omit<EventItem, 'id'>) => void;
  onUpdateEvent: (id: string, updates: Partial<EventItem>) => void;
  onDeleteEvent: (id: string) => void;
}

export const AgendaView: React.FC<AgendaViewProps> = ({
  colors,
  events,
  currentUser,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'timeline'>('calendar');
  const [selectedDayEvents, setSelectedDayEvents] = useState<string | null>(null);
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('19:00');
  const [endTime, setEndTime] = useState('21:00');
  const [location, setLocation] = useState('Templo Sede Remígio');
  const [department, setDepartment] = useState('Geral');
  const [category, setCategory] = useState<EventItem['category']>('Culto');
  const [eventColor, setEventColor] = useState('#0284c7');
  const [description, setDescription] = useState('');
  const [preacherOrLeader, setPreacherOrLeader] = useState('Pr. Joel Bento');

  const canEdit = hasPermission(currentUser.role, 'agenda', 'edit');
  const canDelete = hasPermission(currentUser.role, 'agenda', 'delete');

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0-11

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Calendar matrix calculation
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const days = [];

    // Prev month trailing days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        month: currentMonth - 1,
        year: currentMonth === 0 ? currentYear - 1 : currentYear,
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        month: currentMonth,
        year: currentYear,
        isCurrentMonth: true,
      });
    }

    // Next month leading days (fill up to 35 or 42)
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        day: i,
        month: currentMonth + 1,
        year: currentMonth === 11 ? currentYear + 1 : currentYear,
        isCurrentMonth: false,
      });
    }

    return days;
  }, [currentYear, currentMonth]);

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      if (departmentFilter !== 'ALL' && e.department !== departmentFilter) {
        return false;
      }
      return true;
    });
  }, [events, departmentFilter]);

  const monthName = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    onAddEvent({
      title: title.trim(),
      date,
      startTime,
      endTime,
      location: location.trim() || 'Templo Sede Remígio',
      department,
      category,
      color: eventColor,
      description: description.trim() || undefined,
      preacherOrLeader: preacherOrLeader.trim() || undefined,
    });

    // Reset
    setTitle('');
    setDescription('');
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    onUpdateEvent(editingEvent.id, {
      title: editingEvent.title,
      date: editingEvent.date, // Transferred or modified date!
      startTime: editingEvent.startTime,
      endTime: editingEvent.endTime,
      location: editingEvent.location,
      department: editingEvent.department,
      category: editingEvent.category,
      color: editingEvent.color,
      description: editingEvent.description,
      preacherOrLeader: editingEvent.preacherOrLeader,
    });

    setEditingEvent(null);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            style={{ backgroundColor: `${colors.agenda}25`, color: colors.agenda }}
            className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-sm shrink-0"
          >
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Agenda Anual Ministerial
              </h1>
              <span
                style={{ backgroundColor: colors.agenda }}
                className="px-2.5 py-0.5 rounded-full text-white text-xs font-bold"
              >
                {events.length}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Cultos, vigílias, festividades dos departamentos e reuniões da liderança
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canEdit && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              style={{ backgroundColor: colors.agenda }}
              className="flex items-center gap-2 px-4 py-2.5 text-white font-bold rounded-xl text-xs shadow-lg shadow-sky-500/25 hover:opacity-90 active:scale-[0.98] transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Evento Ministerial</span>
            </button>
          )}
        </div>
      </div>

      {/* CALENDAR CONTROLS & MONTH SELECTOR */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Mês anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-base sm:text-lg font-black text-white capitalize min-w-[180px] text-center">
            {monthName}
          </span>

          <button
            onClick={nextMonth}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Próximo mês"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={goToToday}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-sky-400 transition-colors ml-2"
          >
            Hoje
          </button>
        </div>

        {/* Filters and View mode */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="flex-1 sm:flex-none bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="ALL">Todos os Departamentos</option>
            <option value="Geral">Geral da Igreja</option>
            <option value="Vaso de Unção">Vaso de Unção</option>
            <option value="Shalom Adonai">Shalom Adonai</option>
            <option value="Gideão">Gideão</option>
            <option value="Apocalipse">Apocalipse</option>
            <option value="Missões">Missões</option>
            <option value="Casais">Casais</option>
            <option value="Homens">Homens</option>
            <option value="EBD">EBD</option>
          </select>

          <div className="flex bg-slate-800 rounded-xl p-1 border border-slate-700">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                viewMode === 'calendar' ? 'bg-sky-600 text-white' : 'text-slate-400'
              }`}
            >
              Grade
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                viewMode === 'timeline' ? 'bg-sky-600 text-white' : 'text-slate-400'
              }`}
            >
              Lista
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: MONTHLY GRID */}
      {viewMode === 'calendar' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 bg-slate-950/80 text-[11px] font-bold uppercase text-slate-400 border-b border-slate-800 text-center py-2.5">
            <span className="text-rose-400">Dom</span>
            <span>Seg</span>
            <span>Ter</span>
            <span>Qua</span>
            <span>Qui</span>
            <span>Sex</span>
            <span className="text-sky-400">Sáb</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-px bg-slate-800/60">
            {calendarDays.map((item, idx) => {
              const formattedDateStr = `${item.year}-${String(item.month + 1).padStart(2, '0')}-${String(item.day).padStart(2, '0')}`;
              const dayEvents = filteredEvents.filter(e => e.date === formattedDateStr);
              
              const isToday =
                new Date().toISOString().split('T')[0] === formattedDateStr;

              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (dayEvents.length > 0) {
                      setSelectedDayEvents(formattedDateStr);
                    }
                  }}
                  className={`min-h-[90px] sm:min-h-[110px] p-1.5 sm:p-2 bg-slate-900 flex flex-col justify-between transition-colors ${
                    !item.isCurrentMonth ? 'opacity-35 bg-slate-950/40' : 'hover:bg-slate-800/40'
                  } ${dayEvents.length > 0 ? 'cursor-pointer' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                        isToday
                          ? 'bg-sky-500 text-slate-950 font-black shadow'
                          : 'text-slate-300'
                      }`}
                    >
                      {item.day}
                    </span>

                    {dayEvents.length > 0 && (
                      <span className="text-[10px] font-bold text-sky-400 sm:hidden">
                        • {dayEvents.length}
                      </span>
                    )}
                  </div>

                  {/* Event Pills */}
                  <div className="space-y-1 mt-1 overflow-hidden">
                    {dayEvents.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        style={{ backgroundColor: `${ev.color || colors.agenda}30`, borderColor: ev.color || colors.agenda }}
                        className="text-[10px] font-semibold px-1.5 py-0.5 rounded border truncate text-slate-200"
                        title={`${ev.title} (${ev.startTime})`}
                      >
                        <span className="font-bold mr-1">{ev.startTime}</span>
                        <span>{ev.title}</span>
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-[9px] font-bold text-slate-400 block text-right">
                        +{dayEvents.length - 2} mais
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: TIMELINE LIST */}
      {viewMode === 'timeline' && (
        <div className="space-y-3">
          {filteredEvents.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
              <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="font-bold text-slate-300">Nenhum evento encontrado</p>
            </div>
          ) : (
            filteredEvents
              .sort((a, b) => a.date.localeCompare(b.date))
              .map((ev) => {
                const [year, month, day] = ev.date.split('-');
                return (
                  <div
                    key={ev.id}
                    className="p-4 bg-slate-900 border border-slate-800 hover:border-sky-500/60 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all shadow-md"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div
                        style={{ backgroundColor: `${ev.color || colors.agenda}25`, borderColor: ev.color || colors.agenda }}
                        className="w-14 h-14 rounded-2xl border-2 flex flex-col items-center justify-center text-center shrink-0"
                      >
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                          {month}/{year?.slice(2)}
                        </span>
                        <span className="text-base font-black text-white leading-none">
                          {day}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white truncate">
                            {ev.title}
                          </h3>
                          <span
                            style={{ backgroundColor: `${ev.color || colors.agenda}25`, color: ev.color || colors.agenda }}
                            className="text-[10px] font-bold px-2 py-0.5 rounded-lg shrink-0"
                          >
                            {ev.department}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          {ev.description || 'Evento ministerial da ADMJEBOP Remígio'}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1 text-slate-300">
                            <Clock className="w-3.5 h-3.5 text-sky-400" />
                            {ev.startTime} {ev.endTime ? `às ${ev.endTime}` : ''}
                          </span>
                          <span className="flex items-center gap-1 text-slate-300">
                            <MapPin className="w-3.5 h-3.5 text-slate-500" />
                            {ev.location}
                          </span>
                          {ev.preacherOrLeader && (
                            <span className="flex items-center gap-1 text-amber-300">
                              <User className="w-3.5 h-3.5" />
                              {ev.preacherOrLeader}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      {canEdit && (
                        <button
                          onClick={() => setEditingEvent({ ...ev })}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white transition-colors"
                          title="Alterar data ou detalhes do evento"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-sky-400" />
                          <span>Editar / Transferir Data</span>
                        </button>
                      )}

                      {canDelete && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Excluir evento "${ev.title}"?`)) {
                              onDeleteEvent(ev.id);
                            }
                          }}
                          className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-rose-500/10 transition-colors"
                          title="Excluir evento"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
          )}
        </div>
      )}

      {/* DAY EVENTS DRAWER */}
      {selectedDayEvents && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg p-6 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Eventos do Dia</h3>
                <p className="text-xs text-sky-400 font-semibold">
                  {selectedDayEvents.split('-').reverse().join('/')}
                </p>
              </div>
              <button
                onClick={() => setSelectedDayEvents(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {filteredEvents
                .filter(e => e.date === selectedDayEvents)
                .map(ev => (
                  <div key={ev.id} className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-white">{ev.title}</p>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold">
                        {ev.startTime}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{ev.description}</p>
                    <p className="text-[10px] text-slate-500 mt-1">{ev.location} • {ev.department}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ADD EVENT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-xl shadow-2xl p-6 text-slate-100 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-sky-400" />
                <span>Novo Evento Ministerial</span>
              </h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="flex-1 overflow-y-auto space-y-3.5 pr-1">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Título do Evento *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ex: Vigília do Vaso de Unção"
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Data do Evento *
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Horário de Início *
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Departamento Responsável
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Geral">Geral da Igreja</option>
                    <option value="Vaso de Unção">Vaso de Unção</option>
                    <option value="Shalom Adonai">Shalom Adonai</option>
                    <option value="Gideão">Gideão</option>
                    <option value="Apocalipse">Apocalipse</option>
                    <option value="Missões">Missões</option>
                    <option value="Casais">Casais</option>
                    <option value="Homens">Homens</option>
                    <option value="EBD">EBD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Categoria
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Culto">Culto</option>
                    <option value="Santa Ceia">Santa Ceia</option>
                    <option value="Vigília">Vigília</option>
                    <option value="Festividade">Festividade</option>
                    <option value="Reunião">Reunião de Liderança</option>
                    <option value="Ensaio">Ensaio</option>
                    <option value="Cruzada">Cruzada Evangelística</option>
                    <option value="Ação Social">Ação Social</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Local do Evento
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="ex: Templo Sede Remígio ou Praça Central"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Dirigente / Pregador Escalado
                  </label>
                  <input
                    type="text"
                    value={preacherOrLeader}
                    onChange={(e) => setPreacherOrLeader(e.target.value)}
                    placeholder="Nome do preletor ou líder"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Descrição & Observações
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detalhes sobre escala, tema bíblico ou louvores"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
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
                  className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs shadow-lg"
                >
                  Salvar na Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT / RESCHEDULE EVENT MODAL (ALLOWS TRANSFERRING DATES WITHOUT DATA LOSS) */}
      {editingEvent && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-xl p-6 text-slate-100 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <MoveHorizontal className="w-5 h-5 text-sky-400" />
                  <span>Editar & Transferir Data do Evento</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Altere a data, dia ou horário sem duplicação ou perda de informações
                </p>
              </div>
              <button onClick={() => setEditingEvent(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="flex-1 overflow-y-auto space-y-3.5 pr-1">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Título do Evento *</label>
                <input
                  type="text"
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-sky-950/30 border border-sky-500/30 rounded-2xl">
                <div className="col-span-2">
                  <span className="text-[11px] font-bold text-sky-300 uppercase block mb-1">
                    Transferir para Nova Data:
                  </span>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Data (Dia/Mês/Ano) *</label>
                  <input
                    type="date"
                    value={editingEvent.date}
                    onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Horário *</label>
                  <input
                    type="time"
                    value={editingEvent.startTime}
                    onChange={(e) => setEditingEvent({ ...editingEvent, startTime: e.target.value })}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Departamento</label>
                  <select
                    value={editingEvent.department}
                    onChange={(e) => setEditingEvent({ ...editingEvent, department: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Geral">Geral da Igreja</option>
                    <option value="Vaso de Unção">Vaso de Unção</option>
                    <option value="Shalom Adonai">Shalom Adonai</option>
                    <option value="Gideão">Gideão</option>
                    <option value="Apocalipse">Apocalipse</option>
                    <option value="Missões">Missões</option>
                    <option value="Casais">Casais</option>
                    <option value="Homens">Homens</option>
                    <option value="EBD">EBD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Local</label>
                  <input
                    type="text"
                    value={editingEvent.location}
                    onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Preletor / Líder</label>
                  <input
                    type="text"
                    value={editingEvent.preacherOrLeader || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, preacherOrLeader: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Descrição</label>
                  <textarea
                    rows={2}
                    value={editingEvent.description || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs"
                >
                  Salvar Nova Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
