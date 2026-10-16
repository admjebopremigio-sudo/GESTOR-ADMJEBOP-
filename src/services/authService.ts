import { AuthUser, UserRole, ROLE_PERMISSIONS } from '../types/auth';
import { ModuleKey } from '../types';

const USERS_STORAGE_KEY = 'adm_users_v1';
const SESSION_STORAGE_KEY = 'adm_current_session_v1';

// Web Crypto SHA-256 hash helper with salt
export async function hashPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(salt + password + 'ADMJEBOP_SECURE_PEPPER_2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function generateSalt(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

// Initial preconfigured users
const SEED_USERS_CONFIG = [
  {
    id: 'user-admin',
    name: 'Pr. Joel Bento',
    email: 'admin@admjebop.org',
    password: 'admin',
    role: 'Administrador' as UserRole,
    phone: '(83) 98845-2190',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    isApproved: true,
  },
  {
    id: 'user-sec',
    name: 'Irª. Sarah Medeiros',
    email: 'secretaria@admjebop.org',
    password: 'sec',
    role: 'Secretária' as UserRole,
    phone: '(83) 99612-4033',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    isApproved: true,
  },
  {
    id: 'user-pastor',
    name: 'Presb. Manoel Messias',
    email: 'pastor@admjebop.org',
    password: '123',
    role: 'Pastor' as UserRole,
    phone: '(83) 98777-6655',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
    isApproved: true,
  },
  {
    id: 'user-tesouraria',
    name: 'Diác. Carlos Oliveira',
    email: 'tesouraria@admjebop.org',
    password: '123',
    role: 'Tesouraria' as UserRole,
    phone: '(83) 98711-2244',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    isApproved: true,
  },
  {
    id: 'user-membro',
    name: 'Membro Visitante / Obreiro',
    email: 'membro@admjebop.org',
    password: '123',
    role: 'Membro' as UserRole,
    phone: '(83) 99999-0000',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    isApproved: true,
  }
];

export async function initializeUsers(): Promise<AuthUser[]> {
  const existing = localStorage.getItem(USERS_STORAGE_KEY);
  if (existing) {
    try {
      return JSON.parse(existing);
    } catch {
      // Re-seed
    }
  }

  const seeded: AuthUser[] = [];
  for (const item of SEED_USERS_CONFIG) {
    const salt = generateSalt();
    const passwordHash = await hashPassword(item.password, salt);
    seeded.push({
      id: item.id,
      name: item.name,
      email: item.email.toLowerCase().trim(),
      passwordHash,
      salt,
      role: item.role,
      phone: item.phone,
      avatarUrl: item.avatarUrl,
      isApproved: item.isApproved,
      createdAt: '2024-01-01',
    });
  }

  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
}

export async function loginUser(email: string, password: string):Promise<{ user?: AuthUser; error?: string }> {
  let users: AuthUser[] = [];
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      users = await initializeUsers();
    } else {
      users = JSON.parse(raw);
    }
  } catch {
    users = await initializeUsers();
  }

  const cleanEmail = email.toLowerCase().trim();
  const user = users.find(u => u.email === cleanEmail);

  if (!user) {
    return { error: 'Usuário não encontrado com este e-mail.' };
  }

  const calculatedHash = await hashPassword(password, user.salt);
  if (calculatedHash !== user.passwordHash) {
    return { error: 'Senha incorreta. Verifique os dados digitados.' };
  }

  // Set session
  const sessionUser = { ...user };
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser));

  return { user: sessionUser };
}

export async function registerUser(params: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
}): Promise<{ user?: AuthUser; error?: string }> {
  let users: AuthUser[] = [];
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    users = raw ? JSON.parse(raw) : await initializeUsers();
  } catch {
    users = await initializeUsers();
  }

  const cleanEmail = params.email.toLowerCase().trim();
  if (users.some(u => u.email === cleanEmail)) {
    return { error: 'Já existe uma conta cadastrada com este e-mail.' };
  }

  const salt = generateSalt();
  const passwordHash = await hashPassword(params.password, salt);

  const newUser: AuthUser = {
    id: 'user-' + Date.now(),
    name: params.name.trim(),
    email: cleanEmail,
    passwordHash,
    salt,
    role: params.role,
    phone: params.phone,
    isApproved: true,
    createdAt: new Date().toISOString().split('T')[0],
  };

  users.push(newUser);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

  // Automatically log in the registered user
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newUser));

  return { user: newUser };
}

export async function resetUserPassword(email: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
  let users: AuthUser[] = [];
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    users = raw ? JSON.parse(raw) : await initializeUsers();
  } catch {
    users = await initializeUsers();
  }

  const cleanEmail = email.toLowerCase().trim();
  const index = users.findIndex(u => u.email === cleanEmail);

  if (index === -1) {
    return { success: false, error: 'E-mail não cadastrado no sistema.' };
  }

  const salt = generateSalt();
  const passwordHash = await hashPassword(newPassword, salt);

  users[index].salt = salt;
  users[index].passwordHash = passwordHash;

  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  return { success: true };
}

export function getCurrentUserSession(): AuthUser | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function logoutUser(): void {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}

export function hasPermission(
  userRole: UserRole | undefined,
  module: ModuleKey | 'settings' | 'organogram' | 'reports',
  action: 'view' | 'edit' | 'delete'
): boolean {
  if (!userRole) return false;
  const roleRules = ROLE_PERMISSIONS[userRole];
  if (!roleRules) return false;
  const moduleRule = roleRules[module];
  if (!moduleRule) return false;
  return moduleRule[action];
}
