import React, { useState, useMemo } from 'react';
import { Asset, ModuleColors } from '../../types';
import { AuthUser } from '../../types/auth';
import { hasPermission } from '../../services/authService';
import {
  Landmark,
  Plus,
  Search,
  Filter,
  DollarSign,
  Printer,
  Edit2,
  Trash2,
  Upload,
  X,
  Sparkles,
  Layers,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface PatrimonyViewProps {
  colors: ModuleColors;
  assets: Asset[];
  currentUser: AuthUser;
  onAddAsset: (asset: Omit<Asset, 'id' | 'createdAt' | 'totalValue'>) => void;
  onUpdateAsset: (id: string, updates: Partial<Asset>) => void;
  onDeleteAsset: (id: string) => void;
}

export const PatrimonyView: React.FC<PatrimonyViewProps> = ({
  colors,
  assets,
  currentUser,
  onAddAsset,
  onUpdateAsset,
  onDeleteAsset,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Asset['category']>('Som & Multimídia');
  const [quantity, setQuantity] = useState(1);
  const [unitValue, setUnitValue] = useState(100);
  const [acquisitionDate, setAcquisitionDate] = useState(new Date().toISOString().split('T')[0]);
  const [condition, setCondition] = useState<Asset['condition']>('Ótimo');
  const [location, setLocation] = useState('Nave Principal');
  const [responsible, setResponsible] = useState('Equipe Ministerial');
  const [patrimonyNumber, setPatrimonyNumber] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  const canEdit = hasPermission(currentUser.role, 'patrimony', 'edit');
  const canDelete = hasPermission(currentUser.role, 'patrimony', 'delete');

  // Automatic calculation of Total Patrimony
  const totalValueSum = useMemo(() => {
    return assets.reduce((sum, a) => {
      const itemTotal = Number(a.totalValue) || (Number(a.quantity) * Number(a.unitValue)) || 0;
      return sum + itemTotal;
    }, 0);
  }, [assets]);

  const formattedTotalPatrimony = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(totalValueSum);

  const filteredAssets = useMemo(() => {
    return assets.filter(a => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        (a.patrimonyNumber && a.patrimonyNumber.toLowerCase().includes(q)) ||
        a.responsible.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q);

      const matchesCategory = categoryFilter === 'ALL' || a.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [assets, searchQuery, categoryFilter]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          if (editingAsset) {
            setEditingAsset({ ...editingAsset, photoUrl: reader.result });
          } else {
            setPhotoUrl(reader.result);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddAsset({
      name: name.trim(),
      description: description.trim(),
      category,
      quantity: Number(quantity) || 1,
      unitValue: Number(unitValue) || 0,
      acquisitionDate,
      condition,
      location: location.trim() || 'Nave Principal',
      responsible: responsible.trim() || 'Diaconia',
      patrimonyNumber: patrimonyNumber.trim() || `ADM-${Date.now().toString().slice(-4)}`,
      photoUrl,
    });

    // Reset
    setName('');
    setDescription('');
    setQuantity(1);
    setUnitValue(100);
    setPhotoUrl('');
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAsset) return;

    onUpdateAsset(editingAsset.id, {
      name: editingAsset.name,
      description: editingAsset.description,
      category: editingAsset.category,
      quantity: Number(editingAsset.quantity),
      unitValue: Number(editingAsset.unitValue),
      acquisitionDate: editingAsset.acquisitionDate,
      condition: editingAsset.condition,
      location: editingAsset.location,
      responsible: editingAsset.responsible,
      patrimonyNumber: editingAsset.patrimonyNumber,
      photoUrl: editingAsset.photoUrl,
    });

    setEditingAsset(null);
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
            style={{ backgroundColor: `${colors.patrimony}25`, color: colors.patrimony }}
            className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-sm shrink-0"
          >
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Patrimônio & Bens Eclesiásticos
              </h1>
              <span
                style={{ backgroundColor: colors.patrimony }}
                className="px-2.5 py-0.5 rounded-full text-slate-950 text-xs font-black uppercase"
              >
                Dourado
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Controle inventarial e financeiro dos bens da ADMJEBOP Congregação Remígio-PB
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-colors"
            title="Imprimir relatório inventarial de patrimônio"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Imprimir Inventário</span>
          </button>

          {canEdit && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              style={{ backgroundColor: colors.patrimony }}
              className="flex items-center gap-2 px-4 py-2.5 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/25 hover:opacity-90 active:scale-[0.98] transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar Novo Bem</span>
            </button>
          )}
        </div>
      </div>

      {/* HIGHLIGHTED GOLDEN BANNER: TOTAL PATRIMONY VALUE */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1f1604 0%, #2e2005 50%, #151004 100%)',
          borderColor: colors.patrimony,
        }}
        className="rounded-3xl p-6 sm:p-8 border-2 shadow-2xl relative overflow-hidden text-white"
      >
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-amber-500/20 to-transparent pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Valor Total do Patrimônio da Congregação</span>
            </span>
            <p className="text-3xl sm:text-5xl font-black text-amber-400 tracking-tight">
              {formattedTotalPatrimony}
            </p>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Recalculado automaticamente em tempo real a partir dos {assets.length} itens registrados
            </p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end gap-2 bg-slate-950/60 p-4 rounded-2xl border border-amber-500/30">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Itens Registrados</span>
            <span className="text-xl sm:text-2xl font-black text-white">{assets.length}</span>
            <span className="text-[10px] text-emerald-400 font-bold">100% inventariado</span>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar por bem, número de tombamento, responsável ou local..."
            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="w-full sm:w-56">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="ALL">Todas as Categorias</option>
            <option value="Som & Multimídia">Som & Multimídia</option>
            <option value="Instrumentos Musicais">Instrumentos Musicais</option>
            <option value="Climatização">Climatização</option>
            <option value="Mobiliário">Mobiliário</option>
            <option value="Estrutura Predial">Estrutura Predial</option>
            <option value="Veículos">Veículos</option>
            <option value="Outros">Outros</option>
          </select>
        </div>
      </div>

      {/* ASSETS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssets.length === 0 ? (
          <div className="col-span-full bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
            <Landmark className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="font-bold text-slate-300">Nenhum bem patrimonial encontrado</p>
          </div>
        ) : (
          filteredAssets.map((asset) => {
            const itemTotal = Number(asset.totalValue) || (Number(asset.quantity) * Number(asset.unitValue));
            const formattedTotal = new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(itemTotal);

            const formattedUnit = new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(Number(asset.unitValue));

            return (
              <div
                key={asset.id}
                style={{ borderTopColor: colors.patrimony }}
                className="bg-slate-900 border border-slate-800 border-t-4 rounded-2xl p-4 shadow-md hover:border-amber-400 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Photo or Icon */}
                  <div className="relative mb-3 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 h-36 flex items-center justify-center">
                    {asset.photoUrl ? (
                      <img
                        src={asset.photoUrl}
                        alt={asset.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-slate-500 text-xs gap-1">
                        <Landmark className="w-8 h-8 text-amber-500/40" />
                        <span>Sem imagem</span>
                      </div>
                    )}
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-black/75 text-amber-300 backdrop-blur-xs">
                      {asset.patrimonyNumber || 'S/N'}
                    </span>
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/75 text-white backdrop-blur-xs">
                      {asset.condition}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white line-clamp-1 mb-1">
                    {asset.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mb-3">
                    {asset.description}
                  </p>

                  <div className="bg-slate-800/40 p-2.5 rounded-xl border border-slate-800 space-y-1 text-[11px] mb-3">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Categoria:</span>
                      <span className="font-semibold text-slate-200">{asset.category}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Quantidade:</span>
                      <span className="font-semibold text-white">{asset.quantity} un.</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Valor Unitário:</span>
                      <span className="font-semibold text-slate-300">{formattedUnit}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Localização:</span>
                      <span className="font-semibold text-slate-300 truncate max-w-[150px]">{asset.location}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Valor Total</span>
                      <p className="text-base font-black text-amber-400 leading-tight">
                        {formattedTotal}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      {canEdit && (
                        <button
                          onClick={() => setEditingAsset({ ...asset })}
                          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                          title="Editar bem"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}

                      {canDelete && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Deseja realmente excluir "${asset.name}"? O valor total do patrimônio será recalculado automaticamente.`)) {
                              onDeleteAsset(asset.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                          title="Excluir bem"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ADD ASSET MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-xl shadow-2xl p-6 text-slate-100 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Landmark className="w-5 h-5 text-amber-400" />
                <span>Cadastrar Novo Bem no Patrimônio</span>
              </h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAsset} className="flex-1 overflow-y-auto space-y-3.5 pr-1">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nome do Item / Equipamento *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ex: Mesa de Som Behringer X32"
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Descrição Detalhada
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Especificações técnicas, marca, modelo e estado"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Categoria
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Som & Multimídia">Som & Multimídia</option>
                    <option value="Instrumentos Musicais">Instrumentos Musicais</option>
                    <option value="Climatização">Climatização</option>
                    <option value="Mobiliário">Mobiliário</option>
                    <option value="Estrutura Predial">Estrutura Predial</option>
                    <option value="Veículos">Veículos</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Estado de Conservação
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Novo">Novo</option>
                    <option value="Ótimo">Ótimo</option>
                    <option value="Bom">Bom</option>
                    <option value="Regular">Regular</option>
                    <option value="Danificado">Danificado</option>
                    <option value="Em Manutenção">Em Manutenção</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Quantidade *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Valor Unitário (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={unitValue}
                    onChange={(e) => setUnitValue(parseFloat(e.target.value) || 0)}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="col-span-2 p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between">
                  <span className="text-xs text-amber-300 font-semibold">Valor Total Calculado:</span>
                  <span className="text-base font-black text-amber-400">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(quantity * unitValue)}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Localização no Templo
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Altar, Galeria, Nave, Secretaria..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Responsável pela Guarda
                  </label>
                  <input
                    type="text"
                    value={responsible}
                    onChange={(e) => setResponsible(e.target.value)}
                    placeholder="Nome do obreiro ou ministério"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Nº de Tombamento (Patrimônio)
                  </label>
                  <input
                    type="text"
                    value={patrimonyNumber}
                    onChange={(e) => setPatrimonyNumber(e.target.value)}
                    placeholder="ex: ADM-SOM-004"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Data de Aquisição
                  </label>
                  <input
                    type="date"
                    value={acquisitionDate}
                    onChange={(e) => setAcquisitionDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Foto do Item (Opcional)
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-xl text-xs font-semibold cursor-pointer text-white">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Carregar Foto</span>
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    </label>
                    <span className="text-xs text-slate-400 truncate">
                      {photoUrl ? 'Imagem carregada com sucesso!' : 'Nenhuma imagem selecionada'}
                    </span>
                  </div>
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
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg"
                >
                  Salvar Bem no Patrimônio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ASSET MODAL */}
      {editingAsset && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-xl p-6 text-slate-100 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="text-base font-bold text-white">Editar Bem do Patrimônio</h2>
              <button onClick={() => setEditingAsset(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="flex-1 overflow-y-auto space-y-3.5 pr-1">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nome do Item *</label>
                <input
                  type="text"
                  value={editingAsset.name}
                  onChange={(e) => setEditingAsset({ ...editingAsset, name: e.target.value })}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Descrição</label>
                <textarea
                  rows={2}
                  value={editingAsset.description}
                  onChange={(e) => setEditingAsset({ ...editingAsset, description: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Quantidade</label>
                  <input
                    type="number"
                    min="1"
                    value={editingAsset.quantity}
                    onChange={(e) => setEditingAsset({ ...editingAsset, quantity: parseInt(e.target.value, 10) || 1 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Valor Unitário (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingAsset.unitValue}
                    onChange={(e) => setEditingAsset({ ...editingAsset, unitValue: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="col-span-2 p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between">
                  <span className="text-xs text-amber-300 font-semibold">Valor Total Calculado:</span>
                  <span className="text-base font-black text-amber-400">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(editingAsset.quantity * editingAsset.unitValue)}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Localização</label>
                  <input
                    type="text"
                    value={editingAsset.location}
                    onChange={(e) => setEditingAsset({ ...editingAsset, location: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Responsável</label>
                  <input
                    type="text"
                    value={editingAsset.responsible}
                    onChange={(e) => setEditingAsset({ ...editingAsset, responsible: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingAsset(null)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
