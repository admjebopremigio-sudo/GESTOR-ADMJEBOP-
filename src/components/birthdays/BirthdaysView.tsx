import React, { useState, useMemo } from 'react';
import { Member, ModuleColors } from '../../types';
import {
  Cake,
  Search,
  Printer,
  MessageCircle,
  Calendar,
  Sparkles,
  Phone,
  Gift,
  ArrowRight
} from 'lucide-react';

interface BirthdaysViewProps {
  colors: ModuleColors;
  members: Member[];
  onSelectMember: (member: Member) => void;
}

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const BirthdaysView: React.FC<BirthdaysViewProps> = ({
  colors,
  members,
  onSelectMember,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1); // 1-12
  const [filterType, setFilterType] = useState<'month' | 'today' | 'week'>('month');
  const [searchQuery, setSearchQuery] = useState('');

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  // Helper to calculate age
  const calculateAge = (birthDate: string) => {
    if (!birthDate) return null;
    const parts = birthDate.split('-');
    if (parts.length < 3) return null;
    const birthYear = parseInt(parts[0], 10);
    return today.getFullYear() - birthYear;
  };

  // Filter birthdays
  const filteredBirthdays = useMemo(() => {
    return members
      .filter(m => {
        if (!m.birthDate) return false;
        const parts = m.birthDate.split('-');
        if (parts.length < 3) return false;
        const mMonth = parseInt(parts[1], 10);
        const mDay = parseInt(parts[2], 10);

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          if (!m.fullName.toLowerCase().includes(q) && !m.role.toLowerCase().includes(q)) {
            return false;
          }
        }

        if (filterType === 'today') {
          return mMonth === currentMonth && mDay === currentDay;
        }

        if (filterType === 'week') {
          // Check if birthday falls within next 7 days
          if (mMonth === currentMonth) {
            return mDay >= currentDay && mDay <= currentDay + 7;
          }
          return false;
        }

        // Standard filter by selected month
        return mMonth === selectedMonth;
      })
      .sort((a, b) => {
        const dayA = parseInt(a.birthDate.split('-')[2], 10);
        const dayB = parseInt(b.birthDate.split('-')[2], 10);
        return dayA - dayB;
      });
  }, [members, selectedMonth, filterType, searchQuery, currentMonth, currentDay]);

  const handleSendWhatsApp = (m: Member) => {
    const rawPhone = m.phone.replace(/\D/g, '');
    const cleanPhone = rawPhone.startsWith('55') ? rawPhone : `55${rawPhone}`;
    const text = encodeURIComponent(
      `A paz do Senhor Jesus, amado(a) ${m.fullName}! 🎂🎈\n\nA Igreja Assembleia de Deus – Ministério Jesus o Bom Pastor (Congregação de Remígio-PB) tem a imensa alegria de congratulá-lo(a) nesta data especial pelo seu aniversário!\n\n"O SENHOR te abençoe e te guarde; o SENHOR faça resplandecer o seu rosto sobre ti e tenha misericórdia de ti; o SENHOR sobre ti levante o seu rosto e te dê a paz." (Números 6:24-26)\n\nCom carinho de toda a liderança e congregação!`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            style={{ backgroundColor: `${colors.birthdays}25`, color: colors.birthdays }}
            className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-sm shrink-0"
          >
            <Cake className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Aniversariantes da Congregação
              </h1>
              <span
                style={{ backgroundColor: colors.birthdays }}
                className="px-2.5 py-0.5 rounded-full text-white text-xs font-bold"
              >
                {filteredBirthdays.length}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Gerado automaticamente a partir das datas de nascimento dos membros cadastrados
            </p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          title="Imprimir lista de aniversariantes para leitura no púlpito"
        >
          <Printer className="w-4 h-4 text-orange-400" />
          <span>Imprimir para o Púlpito</span>
        </button>
      </div>

      {/* FILTERS & MONTH SELECTOR BAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          
          {/* Quick Filter Buttons */}
          <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700 w-full sm:w-auto">
            <button
              onClick={() => { setFilterType('month'); }}
              className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filterType === 'month' ? 'bg-orange-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Por Mês
            </button>
            <button
              onClick={() => { setFilterType('today'); }}
              className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filterType === 'today' ? 'bg-orange-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Aniversariantes de Hoje
            </button>
            <button
              onClick={() => { setFilterType('week'); }}
              className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filterType === 'week' ? 'bg-orange-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Próximos 7 Dias
            </button>
          </div>

          {/* Search by member */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar aniversariante..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-1.5 pl-9 pr-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* 12 Months Pills */}
        {filterType === 'month' && (
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-1 border-t border-slate-800">
            {MONTH_NAMES.map((name, idx) => {
              const monthNum = idx + 1;
              const isSelected = selectedMonth === monthNum;
              const isCurrent = currentMonth === monthNum;

              return (
                <button
                  key={name}
                  onClick={() => setSelectedMonth(monthNum)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 border ${
                    isSelected
                      ? 'bg-orange-600 border-orange-500 text-white shadow'
                      : isCurrent
                      ? 'bg-slate-800 border-orange-500/50 text-orange-300'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white'
                  }`}
                >
                  {name} {isCurrent && '•'}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* BIRTHDAYS LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredBirthdays.length === 0 ? (
          <div className="col-span-full bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
            <Gift className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="font-bold text-slate-300">Nenhum aniversariante para este período</p>
          </div>
        ) : (
          filteredBirthdays.map((m) => {
            const day = parseInt(m.birthDate.split('-')[2], 10);
            const isToday = currentMonth === parseInt(m.birthDate.split('-')[1], 10) && day === currentDay;
            const age = calculateAge(m.birthDate);

            return (
              <div
                key={m.id}
                style={{ borderTopColor: colors.birthdays }}
                className={`bg-slate-900 border border-slate-800 border-t-4 rounded-2xl p-4 shadow-md transition-all flex flex-col justify-between ${
                  isToday ? 'ring-2 ring-orange-500 bg-orange-950/20' : ''
                }`}
              >
                <div>
                  <div className="flex items-start gap-3.5 mb-3">
                    <div className="relative shrink-0">
                      {m.photoUrl ? (
                        <img
                          src={m.photoUrl}
                          alt={m.fullName}
                          className="w-13 h-13 rounded-2xl object-cover ring-2 ring-slate-700"
                        />
                      ) : (
                        <div className="w-13 h-13 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-base">
                          {m.fullName.charAt(0)}
                        </div>
                      )}
                      {isToday && (
                        <span className="absolute -bottom-1 -right-1 text-xs">
                          🎉
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-white truncate">
                          {m.fullName}
                        </h3>
                        {isToday && (
                          <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase bg-orange-500 text-slate-950">
                            Hoje!
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-orange-400 truncate mt-0.5">
                        {m.role}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Dia <strong>{day} de {MONTH_NAMES[parseInt(m.birthDate.split('-')[1], 10) - 1]}</strong>
                        {age !== null ? ` (${age} anos)` : ''}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 mt-1 border-t border-slate-800">
                  <button
                    onClick={() => onSelectMember(m)}
                    className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    Ver Ficha
                  </button>

                  <button
                    onClick={() => handleSendWhatsApp(m)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Enviar Parabéns</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
