import {
  Asset,
  ChurchConfig,
  EventItem,
  Family,
  Member,
  MissionItem,
  ModuleColors,
  PastoralVisit,
  SecretariatDoc,
  SocialAction
} from '../types';
import {
  DEFAULT_CHURCH_CONFIG,
  DEFAULT_MODULE_COLORS,
  INITIAL_ASSETS,
  INITIAL_EVENTS,
  INITIAL_FAMILIES,
  INITIAL_MEMBERS,
  INITIAL_MISSIONS,
  INITIAL_SECRETARIAT_DOCS,
  INITIAL_SOCIAL_ACTIONS,
  INITIAL_VISITS
} from '../constants/initialData';

const KEYS = {
  MEMBERS: 'adm_members_v1',
  FAMILIES: 'adm_families_v1',
  ASSETS: 'adm_assets_v1',
  EVENTS: 'adm_events_v1',
  VISITS: 'adm_visits_v1',
  SOCIAL: 'adm_social_v1',
  SECRETARIAT: 'adm_secretariat_v1',
  MISSIONS: 'adm_missions_v1',
  COLORS: 'adm_module_colors_v1',
  CONFIG: 'adm_church_config_v1',
};

// Helper for safe JSON get
function getStored<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error loading key ${key}:`, e);
    return defaultValue;
  }
}

// Helper for safe JSON set
function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving key ${key}:`, e);
  }
}

export const StorageService = {
  // Members
  getMembers(): Member[] {
    return getStored<Member[]>(KEYS.MEMBERS, INITIAL_MEMBERS);
  },
  saveMembers(members: Member[]): void {
    setStored(KEYS.MEMBERS, members);
  },
  addMember(member: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>): Member {
    const members = this.getMembers();
    const newMember: Member = {
      ...member,
      id: 'mem-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    members.unshift(newMember);
    this.saveMembers(members);
    return newMember;
  },
  updateMember(id: string, updates: Partial<Member>): Member | null {
    const members = this.getMembers();
    const idx = members.findIndex(m => m.id === id);
    if (idx === -1) return null;
    const updated = {
      ...members[idx],
      ...updates,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    members[idx] = updated;
    this.saveMembers(members);
    return updated;
  },
  deleteMember(id: string): boolean {
    const members = this.getMembers();
    const filtered = members.filter(m => m.id !== id);
    if (filtered.length !== members.length) {
      this.saveMembers(filtered);
      return true;
    }
    return false;
  },

  // Families
  getFamilies(): Family[] {
    return getStored<Family[]>(KEYS.FAMILIES, INITIAL_FAMILIES);
  },
  saveFamilies(families: Family[]): void {
    setStored(KEYS.FAMILIES, families);
  },
  addFamily(family: Omit<Family, 'id' | 'createdAt'>): Family {
    const families = this.getFamilies();
    const newFamily: Family = {
      ...family,
      id: 'fam-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    families.unshift(newFamily);
    this.saveFamilies(families);
    return newFamily;
  },
  updateFamily(id: string, updates: Partial<Family>): Family | null {
    const families = this.getFamilies();
    const idx = families.findIndex(f => f.id === id);
    if (idx === -1) return null;
    const updated = { ...families[idx], ...updates };
    families[idx] = updated;
    this.saveFamilies(families);
    return updated;
  },
  deleteFamily(id: string): boolean {
    const families = this.getFamilies();
    const filtered = families.filter(f => f.id !== id);
    if (filtered.length !== families.length) {
      this.saveFamilies(filtered);
      return true;
    }
    return false;
  },

  // Assets (Patrimônio)
  getAssets(): Asset[] {
    return getStored<Asset[]>(KEYS.ASSETS, INITIAL_ASSETS);
  },
  saveAssets(assets: Asset[]): void {
    setStored(KEYS.ASSETS, assets);
  },
  addAsset(asset: Omit<Asset, 'id' | 'createdAt' | 'totalValue'>): Asset {
    const assets = this.getAssets();
    const totalValue = Number(asset.quantity) * Number(asset.unitValue);
    const newAsset: Asset = {
      ...asset,
      totalValue,
      id: 'ast-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    assets.unshift(newAsset);
    this.saveAssets(assets);
    return newAsset;
  },
  updateAsset(id: string, updates: Partial<Asset>): Asset | null {
    const assets = this.getAssets();
    const idx = assets.findIndex(a => a.id === id);
    if (idx === -1) return null;
    const current = assets[idx];
    const qty = updates.quantity !== undefined ? Number(updates.quantity) : current.quantity;
    const unit = updates.unitValue !== undefined ? Number(updates.unitValue) : current.unitValue;
    const totalValue = qty * unit;
    const updated: Asset = {
      ...current,
      ...updates,
      quantity: qty,
      unitValue: unit,
      totalValue,
    };
    assets[idx] = updated;
    this.saveAssets(assets);
    return updated;
  },
  deleteAsset(id: string): boolean {
    const assets = this.getAssets();
    const filtered = assets.filter(a => a.id !== id);
    if (filtered.length !== assets.length) {
      this.saveAssets(filtered);
      return true;
    }
    return false;
  },
  getTotalPatrimonyValue(): number {
    const assets = this.getAssets();
    return assets.reduce((sum, a) => sum + (Number(a.totalValue) || (Number(a.quantity) * Number(a.unitValue)) || 0), 0);
  },

  // Events (Agenda)
  getEvents(): EventItem[] {
    return getStored<EventItem[]>(KEYS.EVENTS, INITIAL_EVENTS);
  },
  saveEvents(events: EventItem[]): void {
    setStored(KEYS.EVENTS, events);
  },
  addEvent(event: Omit<EventItem, 'id'>): EventItem {
    const events = this.getEvents();
    const newEvent: EventItem = {
      ...event,
      id: 'evt-' + Date.now(),
    };
    events.push(newEvent);
    this.saveEvents(events);
    return newEvent;
  },
  updateEvent(id: string, updates: Partial<EventItem>): EventItem | null {
    const events = this.getEvents();
    const idx = events.findIndex(e => e.id === id);
    if (idx === -1) return null;
    const updated = { ...events[idx], ...updates };
    events[idx] = updated;
    this.saveEvents(events);
    return updated;
  },
  deleteEvent(id: string): boolean {
    const events = this.getEvents();
    const filtered = events.filter(e => e.id !== id);
    if (filtered.length !== events.length) {
      this.saveEvents(filtered);
      return true;
    }
    return false;
  },

  // Visits
  getVisits(): PastoralVisit[] {
    return getStored<PastoralVisit[]>(KEYS.VISITS, INITIAL_VISITS);
  },
  saveVisits(visits: PastoralVisit[]): void {
    setStored(KEYS.VISITS, visits);
  },
  addVisit(visit: Omit<PastoralVisit, 'id'>): PastoralVisit {
    const visits = this.getVisits();
    const newVisit: PastoralVisit = { ...visit, id: 'vis-' + Date.now() };
    visits.unshift(newVisit);
    this.saveVisits(visits);
    return newVisit;
  },
  updateVisit(id: string, updates: Partial<PastoralVisit>): PastoralVisit | null {
    const visits = this.getVisits();
    const idx = visits.findIndex(v => v.id === id);
    if (idx === -1) return null;
    const updated = { ...visits[idx], ...updates };
    visits[idx] = updated;
    this.saveVisits(visits);
    return updated;
  },
  deleteVisit(id: string): boolean {
    const visits = this.getVisits();
    const filtered = visits.filter(v => v.id !== id);
    if (filtered.length !== visits.length) {
      this.saveVisits(filtered);
      return true;
    }
    return false;
  },

  // Social Actions
  getSocialActions(): SocialAction[] {
    return getStored<SocialAction[]>(KEYS.SOCIAL, INITIAL_SOCIAL_ACTIONS);
  },
  saveSocialActions(actions: SocialAction[]): void {
    setStored(KEYS.SOCIAL, actions);
  },
  addSocialAction(action: Omit<SocialAction, 'id'>): SocialAction {
    const list = this.getSocialActions();
    const newItem: SocialAction = { ...action, id: 'soc-' + Date.now() };
    list.unshift(newItem);
    this.saveSocialActions(list);
    return newItem;
  },
  updateSocialAction(id: string, updates: Partial<SocialAction>): SocialAction | null {
    const list = this.getSocialActions();
    const idx = list.findIndex(s => s.id === id);
    if (idx === -1) return null;
    const updated = { ...list[idx], ...updates };
    list[idx] = updated;
    this.saveSocialActions(list);
    return updated;
  },
  deleteSocialAction(id: string): boolean {
    const list = this.getSocialActions();
    const filtered = list.filter(s => s.id !== id);
    if (filtered.length !== list.length) {
      this.saveSocialActions(filtered);
      return true;
    }
    return false;
  },

  // Secretariat Docs
  getSecretariatDocs(): SecretariatDoc[] {
    return getStored<SecretariatDoc[]>(KEYS.SECRETARIAT, INITIAL_SECRETARIAT_DOCS);
  },
  saveSecretariatDocs(docs: SecretariatDoc[]): void {
    setStored(KEYS.SECRETARIAT, docs);
  },
  addSecretariatDoc(doc: Omit<SecretariatDoc, 'id'>): SecretariatDoc {
    const docs = this.getSecretariatDocs();
    const newDoc: SecretariatDoc = { ...doc, id: 'sec-' + Date.now() };
    docs.unshift(newDoc);
    this.saveSecretariatDocs(docs);
    return newDoc;
  },
  updateSecretariatDoc(id: string, updates: Partial<SecretariatDoc>): SecretariatDoc | null {
    const docs = this.getSecretariatDocs();
    const idx = docs.findIndex(d => d.id === id);
    if (idx === -1) return null;
    const updated = { ...docs[idx], ...updates };
    docs[idx] = updated;
    this.saveSecretariatDocs(docs);
    return updated;
  },
  deleteSecretariatDoc(id: string): boolean {
    const docs = this.getSecretariatDocs();
    const filtered = docs.filter(d => d.id !== id);
    if (filtered.length !== docs.length) {
      this.saveSecretariatDocs(filtered);
      return true;
    }
    return false;
  },

  // Missions
  getMissions(): MissionItem[] {
    return getStored<MissionItem[]>(KEYS.MISSIONS, INITIAL_MISSIONS);
  },
  saveMissions(missions: MissionItem[]): void {
    setStored(KEYS.MISSIONS, missions);
  },
  addMission(mission: Omit<MissionItem, 'id'>): MissionItem {
    const missions = this.getMissions();
    const newItem: MissionItem = { ...mission, id: 'mis-' + Date.now() };
    missions.unshift(newItem);
    this.saveMissions(missions);
    return newItem;
  },
  updateMission(id: string, updates: Partial<MissionItem>): MissionItem | null {
    const missions = this.getMissions();
    const idx = missions.findIndex(m => m.id === id);
    if (idx === -1) return null;
    const updated = { ...missions[idx], ...updates };
    missions[idx] = updated;
    this.saveMissions(missions);
    return updated;
  },
  deleteMission(id: string): boolean {
    const missions = this.getMissions();
    const filtered = missions.filter(m => m.id !== id);
    if (filtered.length !== missions.length) {
      this.saveMissions(filtered);
      return true;
    }
    return false;
  },

  // Colors
  getModuleColors(): ModuleColors {
    return getStored<ModuleColors>(KEYS.COLORS, DEFAULT_MODULE_COLORS);
  },
  saveModuleColors(colors: ModuleColors): void {
    setStored(KEYS.COLORS, colors);
  },
  resetModuleColors(): ModuleColors {
    this.saveModuleColors(DEFAULT_MODULE_COLORS);
    return DEFAULT_MODULE_COLORS;
  },

  // Church Config
  getChurchConfig(): ChurchConfig {
    return getStored<ChurchConfig>(KEYS.CONFIG, DEFAULT_CHURCH_CONFIG);
  },
  saveChurchConfig(config: ChurchConfig): void {
    setStored(KEYS.CONFIG, config);
  },

  // Export full backup JSON
  exportBackup(): string {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      churchConfig: this.getChurchConfig(),
      moduleColors: this.getModuleColors(),
      members: this.getMembers(),
      families: this.getFamilies(),
      assets: this.getAssets(),
      events: this.getEvents(),
      visits: this.getVisits(),
      socialActions: this.getSocialActions(),
      secretariatDocs: this.getSecretariatDocs(),
      missions: this.getMissions(),
    };
    return JSON.stringify(data, null, 2);
  },

  // Restore backup from JSON string
  restoreBackup(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.members) this.saveMembers(data.members);
      if (data.families) this.saveFamilies(data.families);
      if (data.assets) this.saveAssets(data.assets);
      if (data.events) this.saveEvents(data.events);
      if (data.visits) this.saveVisits(data.visits);
      if (data.socialActions) this.saveSocialActions(data.socialActions);
      if (data.secretariatDocs) this.saveSecretariatDocs(data.secretariatDocs);
      if (data.missions) this.saveMissions(data.missions);
      if (data.moduleColors) this.saveModuleColors(data.moduleColors);
      if (data.churchConfig) this.saveChurchConfig(data.churchConfig);
      return true;
    } catch (e) {
      console.error('Failed to restore backup:', e);
      return false;
    }
  }
};
