import React, { useState } from 'react';
import { ChurchLogo } from '../common/ChurchLogo';
import { ChurchConfig } from '../../types';
import { AuthUser, UserRole } from '../../types/auth';
import { loginUser, registerUser, resetUserPassword } from '../../services/authService';
import {
  Lock,
  Mail,
  User,
  Shield,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Smartphone
} from 'lucide-react';

interface LoginScreenProps {
  churchConfig: ChurchConfig;
  onLoginSuccess: (user: AuthUser) => void;
  onOpenLogoEditor: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  churchConfig,
  onLoginSuccess,
  onOpenLogoEditor,
}) => {
  const [tab, setTab] = useState<'login' | 'register' | 'recovery'>('login');
  
  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('Membro');
  const [regPhone, setRegPhone] = useState('');

  // Recovery fields
  const [recEmail, setRecEmail] = useState('');
  const [recNewPassword, setRecNewPassword] = useState('');
  const [recConfirmPassword, setRecConfirmPassword] = useState('');

  // Status state
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await loginUser(email, password);
      if (res.error) {
        setErrorMessage(res.error);
      } else if (res.user) {
        onLoginSuccess(res.user);
      }
    } catch {
      setErrorMessage('Erro ao efetuar login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (regPassword.length < 4) {
      setErrorMessage('A senha deve conter no mínimo 4 caracteres.');
      return;
    }

    setLoading(true);
    try {
      const res = await registerUser({
        name: regName,
        email: regEmail,
        password: regPassword,
        role: regRole,
        phone: regPhone,
      });

      if (res.error) {
        setErrorMessage(res.error);
      } else if (res.user) {
        setSuccessMessage('Conta ministerial criada com sucesso! Acessando...');
        setTimeout(() => {
          onLoginSuccess(res.user!);
        }, 800);
      }
    } catch {
      setErrorMessage('Erro ao registrar usuário.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (recNewPassword !== recConfirmPassword) {
      setErrorMessage('As senhas digitadas não coincidem.');
      return;
    }
    if (recNewPassword.length < 4) {
      setErrorMessage('A nova senha deve ter no mínimo 4 caracteres.');
      return;
    }

    setLoading(true);
    try {
      const res = await resetUserPassword(recEmail, recNewPassword);
      if (res.error) {
        setErrorMessage(res.error);
      } else {
        setSuccessMessage('Senha ministerial redefinida com sucesso! Você já pode entrar.');
        setEmail(recEmail);
        setTimeout(() => {
          setTab('login');
          setSuccessMessage(null);
        }, 1500);
      }
    } catch {
      setErrorMessage('Falha ao redefinir senha.');
    } finally {
      setLoading(false);
    }
  };

  // Quick select helper for evaluation
  const handleQuickLogin = (quickEmail: string, quickPass: string) => {
    setEmail(quickEmail);
    setPassword(quickPass);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#080E1E] via-[#0D182E] to-[#0A1224] text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 rounded-3xl shadow-2xl p-6 sm:p-8 relative z-10">
        
        {/* Header with editable Logo */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative group mb-3">
            <ChurchLogo
              logoUrl={churchConfig.logoUrl}
              size="lg"
              onClick={onOpenLogoEditor}
              showEditHint={true}
              className="ring-4 ring-amber-400/30 hover:ring-amber-400 transition-all shadow-xl"
            />
            <button
              type="button"
              onClick={onOpenLogoEditor}
              className="absolute -bottom-2 -right-2 bg-amber-500 hover:bg-amber-400 text-slate-950 p-1.5 rounded-full text-xs font-bold shadow-md transition-transform hover:scale-110"
              title="Clique para editar/trocar a logomarca da igreja"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>

          <h1 className="text-2xl font-black tracking-wide text-white uppercase flex items-center justify-center gap-2">
            <span>{churchConfig.name}</span>
          </h1>
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-400 mt-0.5">
            {churchConfig.subtitle}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {churchConfig.congregation}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-800/80 p-1 rounded-xl mb-6 border border-slate-700/50">
          <button
            type="button"
            onClick={() => { setTab('login'); setErrorMessage(null); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              tab === 'login'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Entrar</span>
          </button>
          <button
            type="button"
            onClick={() => { setTab('register'); setErrorMessage(null); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              tab === 'register'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Criar Conta</span>
          </button>
          <button
            type="button"
            onClick={() => { setTab('recovery'); setErrorMessage(null); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              tab === 'recovery'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Recuperar</span>
          </button>
        </div>

        {/* Error / Success Notifications */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-500/15 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-500/15 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* 1. LOGIN TAB */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                E-mail Ministerial
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ex: admin@admjebop.org"
                  required
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Senha
                </label>
                <button
                  type="button"
                  onClick={() => setTab('recovery')}
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha secreta"
                  required
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 text-blue-600 focus:ring-blue-500 bg-slate-800"
                />
                <span>Lembrar meu acesso</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Entrar no Sistema</span>
                </>
              )}
            </button>

            {/* Quick Demo Access Buttons */}
            <div className="pt-4 border-t border-slate-800">
              <p className="text-[11px] font-semibold text-slate-400 mb-2 text-center uppercase tracking-wider">
                Acesso Rápido para Avaliação
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin@admjebop.org', 'admin')}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-left transition-colors flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <div className="truncate">
                    <p className="font-semibold text-slate-200 truncate">Administrador</p>
                    <p className="text-[10px] text-slate-400">admin / admin</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('secretaria@admjebop.org', 'sec')}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-left transition-colors flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <div className="truncate">
                    <p className="font-semibold text-slate-200 truncate">Secretária</p>
                    <p className="text-[10px] text-slate-400">sec / sec</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('pastor@admjebop.org', '123')}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-left transition-colors flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <div className="truncate">
                    <p className="font-semibold text-slate-200 truncate">Pastor</p>
                    <p className="text-[10px] text-slate-400">pastor / 123</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('tesouraria@admjebop.org', '123')}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-left transition-colors flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <div className="truncate">
                    <p className="font-semibold text-slate-200 truncate">Tesouraria</p>
                    <p className="text-[10px] text-slate-400">tesouraria / 123</p>
                  </div>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* 2. REGISTER TAB */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Nome Completo
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Nome do obreiro(a) ou líder"
                  required
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl py-2 pl-9 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                E-mail
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="email@admjebop.org"
                  required
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl py-2 pl-9 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nível de Acesso
                </label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as UserRole)}
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl py-2 px-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Membro">Membro</option>
                  <option value="Líder de Ministério">Líder de Ministério</option>
                  <option value="Secretária">Secretária</option>
                  <option value="Tesouraria">Tesouraria</option>
                  <option value="Pastor">Pastor</option>
                  <option value="Administrador">Administrador Geral</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Telefone / WhatsApp
                </label>
                <div className="relative">
                  <Smartphone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="(83) 9...."
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl py-2 pl-8 pr-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Definir Senha
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Mínimo 4 caracteres"
                  required
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl py-2 pl-9 pr-9 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 text-sm"
            >
              <UserPlus className="w-4 h-4" />
              <span>Concluir Cadastro</span>
            </button>
          </form>
        )}

        {/* 3. RECOVERY TAB */}
        {tab === 'recovery' && (
          <form onSubmit={handleRecovery} className="space-y-3.5">
            <p className="text-xs text-slate-300">
              Digite o seu e-mail cadastrado e informe uma nova senha de acesso ministerial.
            </p>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                E-mail Cadastrado
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={recEmail}
                  onChange={(e) => setRecEmail(e.target.value)}
                  placeholder="ex: admin@admjebop.org"
                  required
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl py-2 pl-9 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Nova Senha
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={recNewPassword}
                  onChange={(e) => setRecNewPassword(e.target.value)}
                  placeholder="Nova senha"
                  required
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl py-2 pl-9 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Confirmar Nova Senha
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={recConfirmPassword}
                  onChange={(e) => setRecConfirmPassword(e.target.value)}
                  placeholder="Repita a nova senha"
                  required
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl py-2 pl-9 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 text-sm"
            >
              <KeyRound className="w-4 h-4" />
              <span>Salvar Nova Senha</span>
            </button>
          </form>
        )}

        {/* Footer info */}
        <div className="mt-6 text-center text-[11px] text-slate-400 border-t border-slate-800/80 pt-4">
          <p className="italic">
            &ldquo;Se o SENHOR não edificar a casa, em vão trabalham os que a edificam.&rdquo;
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">Salmos 127:1</p>
        </div>
      </div>
    </div>
  );
};
