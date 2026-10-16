import { ModuleKey } from './index';

export type UserRole =
  | 'Administrador'
  | 'Pastor'
  | 'Secretária'
  | 'Tesouraria'
  | 'Líder de Ministério'
  | 'Membro';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  isApproved: boolean;
  createdAt: string;
}

export interface PermissionRule {
  view: boolean;
  edit: boolean;
  delete: boolean;
}

export type RolePermissions = Record<UserRole, Record<ModuleKey | 'settings' | 'organogram' | 'reports', PermissionRule>>;

export const ROLE_PERMISSIONS: RolePermissions = {
  Administrador: {
    dashboard: { view: true, edit: true, delete: true },
    members: { view: true, edit: true, delete: true },
    families: { view: true, edit: true, delete: true },
    secretariat: { view: true, edit: true, delete: true },
    missions: { view: true, edit: true, delete: true },
    socialAction: { view: true, edit: true, delete: true },
    pastoralVisits: { view: true, edit: true, delete: true },
    patrimony: { view: true, edit: true, delete: true },
    birthdays: { view: true, edit: true, delete: true },
    agenda: { view: true, edit: true, delete: true },
    settings: { view: true, edit: true, delete: true },
    organogram: { view: true, edit: true, delete: true },
    reports: { view: true, edit: true, delete: true },
  },
  Pastor: {
    dashboard: { view: true, edit: true, delete: true },
    members: { view: true, edit: true, delete: true },
    families: { view: true, edit: true, delete: true },
    secretariat: { view: true, edit: true, delete: true },
    missions: { view: true, edit: true, delete: true },
    socialAction: { view: true, edit: true, delete: true },
    pastoralVisits: { view: true, edit: true, delete: true },
    patrimony: { view: true, edit: true, delete: false },
    birthdays: { view: true, edit: true, delete: true },
    agenda: { view: true, edit: true, delete: true },
    settings: { view: true, edit: true, delete: false },
    organogram: { view: true, edit: true, delete: false },
    reports: { view: true, edit: true, delete: true },
  },
  'Secretária': {
    dashboard: { view: true, edit: false, delete: false },
    members: { view: true, edit: true, delete: false },
    families: { view: true, edit: true, delete: false },
    secretariat: { view: true, edit: true, delete: true },
    missions: { view: true, edit: true, delete: false },
    socialAction: { view: true, edit: true, delete: false },
    pastoralVisits: { view: true, edit: true, delete: false },
    patrimony: { view: true, edit: false, delete: false },
    birthdays: { view: true, edit: true, delete: false },
    agenda: { view: true, edit: true, delete: true },
    settings: { view: true, edit: false, delete: false },
    organogram: { view: true, edit: false, delete: false },
    reports: { view: true, edit: true, delete: false },
  },
  Tesouraria: {
    dashboard: { view: true, edit: false, delete: false },
    members: { view: true, edit: false, delete: false },
    families: { view: true, edit: false, delete: false },
    secretariat: { view: true, edit: false, delete: false },
    missions: { view: true, edit: true, delete: false },
    socialAction: { view: true, edit: true, delete: false },
    pastoralVisits: { view: false, edit: false, delete: false },
    patrimony: { view: true, edit: true, delete: true },
    birthdays: { view: true, edit: false, delete: false },
    agenda: { view: true, edit: false, delete: false },
    settings: { view: true, edit: false, delete: false },
    organogram: { view: true, edit: false, delete: false },
    reports: { view: true, edit: true, delete: false },
  },
  'Líder de Ministério': {
    dashboard: { view: true, edit: false, delete: false },
    members: { view: true, edit: false, delete: false },
    families: { view: true, edit: false, delete: false },
    secretariat: { view: true, edit: false, delete: false },
    missions: { view: true, edit: true, delete: false },
    socialAction: { view: true, edit: false, delete: false },
    pastoralVisits: { view: true, edit: true, delete: false },
    patrimony: { view: true, edit: false, delete: false },
    birthdays: { view: true, edit: false, delete: false },
    agenda: { view: true, edit: true, delete: false },
    settings: { view: false, edit: false, delete: false },
    organogram: { view: true, edit: false, delete: false },
    reports: { view: false, edit: false, delete: false },
  },
  Membro: {
    dashboard: { view: true, edit: false, delete: false },
    members: { view: true, edit: false, delete: false },
    families: { view: false, edit: false, delete: false },
    secretariat: { view: false, edit: false, delete: false },
    missions: { view: true, edit: false, delete: false },
    socialAction: { view: false, edit: false, delete: false },
    pastoralVisits: { view: false, edit: false, delete: false },
    patrimony: { view: false, edit: false, delete: false },
    birthdays: { view: true, edit: false, delete: false },
    agenda: { view: true, edit: false, delete: false },
    settings: { view: false, edit: false, delete: false },
    organogram: { view: true, edit: false, delete: false },
    reports: { view: false, edit: false, delete: false },
  },
};
