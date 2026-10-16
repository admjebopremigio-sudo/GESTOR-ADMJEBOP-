import React, { useState, useEffect } from 'react';
import {
  Asset,
  ChurchConfig,
  EventItem,
  Family,
  Member,
  MissionItem,
  ModuleColors,
  ModuleKey,
  PastoralVisit,
  SecretariatDoc,
  SocialAction
} from './types';
import { AuthUser } from './types/auth';
import { getCurrentUserSession, logoutUser } from './services/authService';
import { StorageService } from './services/storageService';
import { LoginScreen } from './components/auth/LoginScreen';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { DashboardView } from './components/dashboard/DashboardView';
import { MembersView } from './components/members/MembersView';
import { FamiliesView } from './components/families/FamiliesView';
import { PatrimonyView } from './components/patrimony/PatrimonyView';
import { AgendaView } from './components/agenda/AgendaView';
import { BirthdaysView } from './components/birthdays/BirthdaysView';
import { SecretariatView } from './components/secretariat/SecretariatView';
import { MissionsView } from './components/missions/MissionsView';
import { SocialActionView } from './components/social/SocialActionView';
import { PastoralVisitsView } from './components/pastoral/PastoralVisitsView';
import { ColorSettingsModal } from './components/settings/ColorSettingsModal';
import { ChurchConfigModal } from './components/settings/ChurchConfigModal';
import { OrganogramModal } from './components/organogram/OrganogramModal';
import { ReportsModal } from './components/reports/ReportsModal';
import { MemberDetailModal } from './components/members/MemberDetailModal';

export default function App() {
  // 1. Auth state
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => getCurrentUserSession());

  // 2. Navigation state
  const [activeModule, setActiveModule] = useState<ModuleKey>('dashboard');

  // 3. Persistent Data State
  const [churchConfig, setChurchConfig] = useState<ChurchConfig>(() => StorageService.getChurchConfig());
  const [colors, setColors] = useState<ModuleColors>(() => StorageService.getModuleColors());
  const [members, setMembers] = useState<Member[]>(() => StorageService.getMembers());
  const [families, setFamilies] = useState<Family[]>(() => StorageService.getFamilies());
  const [assets, setAssets] = useState<Asset[]>(() => StorageService.getAssets());
  const [events, setEvents] = useState<EventItem[]>(() => StorageService.getEvents());
  const [visits, setVisits] = useState<PastoralVisit[]>(() => StorageService.getVisits());
  const [socialActions, setSocialActions] = useState<SocialAction[]>(() => StorageService.getSocialActions());
  const [secretariatDocs, setSecretariatDocs] = useState<SecretariatDoc[]>(() => StorageService.getSecretariatDocs());
  const [missions, setMissions] = useState<MissionItem[]>(() => StorageService.getMissions());

  // 4. Modals state
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [isChurchConfigModalOpen, setIsChurchConfigModalOpen] = useState(false);
  const [isOrganogramModalOpen, setIsOrganogramModalOpen] = useState(false);
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
  const [selectedMemberModal, setSelectedMemberModal] = useState<Member | null>(null);

  // Sync title
  useEffect(() => {
    document.title = `${churchConfig.name} – ${churchConfig.congregation}`;
  }, [churchConfig]);

  // Auth handlers
  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  // Handlers for Members
  const handleAddMember = (memberData: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>) => {
    const created = StorageService.addMember(memberData);
    setMembers(StorageService.getMembers());
  };

  const handleUpdateMember = (updated: Member) => {
    StorageService.updateMember(updated.id, updated);
    setMembers(StorageService.getMembers());
    if (selectedMemberModal?.id === updated.id) {
      setSelectedMemberModal(updated);
    }
  };

  const handleDeleteMember = (id: string) => {
    StorageService.deleteMember(id);
    setMembers(StorageService.getMembers());
    if (selectedMemberModal?.id === id) {
      setSelectedMemberModal(null);
    }
  };

  // Handlers for Families
  const handleAddFamily = (familyData: Omit<Family, 'id' | 'createdAt'>) => {
    StorageService.addFamily(familyData);
    setFamilies(StorageService.getFamilies());
  };

  const handleUpdateFamily = (id: string, updates: Partial<Family>) => {
    StorageService.updateFamily(id, updates);
    setFamilies(StorageService.getFamilies());
  };

  const handleDeleteFamily = (id: string) => {
    StorageService.deleteFamily(id);
    setFamilies(StorageService.getFamilies());
  };

  // Handlers for Assets
  const handleAddAsset = (assetData: Omit<Asset, 'id' | 'createdAt' | 'totalValue'>) => {
    StorageService.addAsset(assetData);
    setAssets(StorageService.getAssets());
  };

  const handleUpdateAsset = (id: string, updates: Partial<Asset>) => {
    StorageService.updateAsset(id, updates);
    setAssets(StorageService.getAssets());
  };

  const handleDeleteAsset = (id: string) => {
    StorageService.deleteAsset(id);
    setAssets(StorageService.getAssets());
  };

  // Handlers for Events
  const handleAddEvent = (eventData: Omit<EventItem, 'id'>) => {
    StorageService.addEvent(eventData);
    setEvents(StorageService.getEvents());
  };

  const handleUpdateEvent = (id: string, updates: Partial<EventItem>) => {
    StorageService.updateEvent(id, updates);
    setEvents(StorageService.getEvents());
  };

  const handleDeleteEvent = (id: string) => {
    StorageService.deleteEvent(id);
    setEvents(StorageService.getEvents());
  };

  // Handlers for Visits
  const handleAddVisit = (visitData: Omit<PastoralVisit, 'id'>) => {
    StorageService.addVisit(visitData);
    setVisits(StorageService.getVisits());
  };

  const handleUpdateVisit = (id: string, updates: Partial<PastoralVisit>) => {
    StorageService.updateVisit(id, updates);
    setVisits(StorageService.getVisits());
  };

  const handleDeleteVisit = (id: string) => {
    StorageService.deleteVisit(id);
    setVisits(StorageService.getVisits());
  };

  // Handlers for Social Actions
  const handleAddSocialAction = (actionData: Omit<SocialAction, 'id'>) => {
    StorageService.addSocialAction(actionData);
    setSocialActions(StorageService.getSocialActions());
  };

  const handleDeleteSocialAction = (id: string) => {
    StorageService.deleteSocialAction(id);
    setSocialActions(StorageService.getSocialActions());
  };

  // Handlers for Secretariat Docs
  const handleAddDoc = (docData: Omit<SecretariatDoc, 'id'>) => {
    StorageService.addSecretariatDoc(docData);
    setSecretariatDocs(StorageService.getSecretariatDocs());
  };

  const handleUpdateDoc = (id: string, updates: Partial<SecretariatDoc>) => {
    StorageService.updateSecretariatDoc(id, updates);
    setSecretariatDocs(StorageService.getSecretariatDocs());
  };

  const handleDeleteDoc = (id: string) => {
    StorageService.deleteSecretariatDoc(id);
    setSecretariatDocs(StorageService.getSecretariatDocs());
  };

  // Handlers for Missions
  const handleAddMission = (missionData: Omit<MissionItem, 'id'>) => {
    StorageService.addMission(missionData);
    setMissions(StorageService.getMissions());
  };

  const handleDeleteMission = (id: string) => {
    StorageService.deleteMission(id);
    setMissions(StorageService.getMissions());
  };

  // Handlers for Colors & Church Config
  const handleSaveColors = (newColors: ModuleColors) => {
    setColors(newColors);
  };

  const handleSaveChurchConfig = (newConfig: ChurchConfig) => {
    setChurchConfig(newConfig);
  };

  // 5. IF NOT LOGGED IN, RENDER LOGIN SCREEN (Individually Protected Administrative Data)
  if (!currentUser) {
    return (
      <>
        <LoginScreen
          churchConfig={churchConfig}
          onLoginSuccess={handleLoginSuccess}
          onOpenLogoEditor={() => setIsChurchConfigModalOpen(true)}
        />
        <ChurchConfigModal
          isOpen={isChurchConfigModalOpen}
          onClose={() => setIsChurchConfigModalOpen(false)}
          config={churchConfig}
          onSave={handleSaveChurchConfig}
        />
      </>
    );
  }

  // Calculate live badge counts
  const currentMonthNum = new Date().getMonth() + 1;
  const birthdaysThisMonthCount = members.filter(m => {
    if (!m.birthDate) return false;
    const parts = m.birthDate.split('-');
    return parts.length >= 2 && parseInt(parts[1], 10) === currentMonthNum;
  }).length;

  const visitsPendingCount = visits.filter(v => v.status === 'Pendente').length;

  const counts = {
    members: members.length,
    families: families.length,
    assets: assets.length,
    events: events.length,
    birthdaysThisMonth: birthdaysThisMonthCount,
    visitsPending: visitsPendingCount,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Top Navigation Bar */}
      <Navbar
        churchConfig={churchConfig}
        colors={colors}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenColorSettings={() => setIsColorModalOpen(true)}
        onOpenChurchConfig={() => setIsChurchConfigModalOpen(true)}
        onOpenOrganogram={() => setIsOrganogramModalOpen(true)}
        onOpenReports={() => setIsReportsModalOpen(true)}
      />

      {/* Main Body with Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Desktop Sidebar */}
        <Sidebar
          activeModule={activeModule}
          onSelectModule={(mod) => setActiveModule(mod)}
          colors={colors}
          counts={counts}
        />

        {/* Dynamic Module Content View */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 md:pb-8 pb-24">
          <div className="max-w-7xl mx-auto">
            
            {/* 1. Painel Inicial */}
            {activeModule === 'dashboard' && (
              <DashboardView
                colors={colors}
                churchConfig={churchConfig}
                currentUser={currentUser}
                onNavigate={(mod) => setActiveModule(mod)}
                members={members}
                families={families}
                assets={assets}
                events={events}
                visits={visits}
                socialActions={socialActions}
                onOpenChurchConfig={() => setIsChurchConfigModalOpen(true)}
              />
            )}

            {/* 2. Membros */}
            {activeModule === 'members' && (
              <MembersView
                colors={colors}
                members={members}
                families={families}
                visits={visits}
                churchConfig={churchConfig}
                currentUser={currentUser}
                onAddMember={handleAddMember}
                onUpdateMember={handleUpdateMember}
                onDeleteMember={handleDeleteMember}
              />
            )}

            {/* 3. Famílias */}
            {activeModule === 'families' && (
              <FamiliesView
                colors={colors}
                families={families}
                members={members}
                currentUser={currentUser}
                onAddFamily={handleAddFamily}
                onUpdateFamily={handleUpdateFamily}
                onDeleteFamily={handleDeleteFamily}
                onSelectMember={(mem) => setSelectedMemberModal(mem)}
              />
            )}

            {/* 4. Patrimônio */}
            {activeModule === 'patrimony' && (
              <PatrimonyView
                colors={colors}
                assets={assets}
                currentUser={currentUser}
                onAddAsset={handleAddAsset}
                onUpdateAsset={handleUpdateAsset}
                onDeleteAsset={handleDeleteAsset}
              />
            )}

            {/* 5. Agenda Anual */}
            {activeModule === 'agenda' && (
              <AgendaView
                colors={colors}
                events={events}
                currentUser={currentUser}
                onAddEvent={handleAddEvent}
                onUpdateEvent={handleUpdateEvent}
                onDeleteEvent={handleDeleteEvent}
              />
            )}

            {/* 6. Aniversariantes */}
            {activeModule === 'birthdays' && (
              <BirthdaysView
                colors={colors}
                members={members}
                onSelectMember={(mem) => setSelectedMemberModal(mem)}
              />
            )}

            {/* 7. Secretaria */}
            {activeModule === 'secretariat' && (
              <SecretariatView
                colors={colors}
                docs={secretariatDocs}
                churchConfig={churchConfig}
                currentUser={currentUser}
                members={members}
                onAddDoc={handleAddDoc}
                onUpdateDoc={handleUpdateDoc}
                onDeleteDoc={handleDeleteDoc}
              />
            )}

            {/* 8. Missões */}
            {activeModule === 'missions' && (
              <MissionsView
                colors={colors}
                missions={missions}
                currentUser={currentUser}
                onAddMission={handleAddMission}
                onDeleteMission={handleDeleteMission}
              />
            )}

            {/* 9. Ação Social */}
            {activeModule === 'socialAction' && (
              <SocialActionView
                colors={colors}
                actions={socialActions}
                currentUser={currentUser}
                onAddAction={handleAddSocialAction}
                onDeleteAction={handleDeleteSocialAction}
              />
            )}

            {/* 10. Visitação Pastoral */}
            {activeModule === 'pastoralVisits' && (
              <PastoralVisitsView
                colors={colors}
                visits={visits}
                members={members}
                currentUser={currentUser}
                onAddVisit={handleAddVisit}
                onUpdateVisit={handleUpdateVisit}
                onDeleteVisit={handleDeleteVisit}
              />
            )}

          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        activeModule={activeModule}
        onSelectModule={(mod) => setActiveModule(mod)}
        colors={colors}
        onOpenColorSettings={() => setIsColorModalOpen(true)}
        onOpenOrganogram={() => setIsOrganogramModalOpen(true)}
        onOpenReports={() => setIsReportsModalOpen(true)}
        counts={counts}
      />

      {/* Global Modals */}
      <ColorSettingsModal
        isOpen={isColorModalOpen}
        onClose={() => setIsColorModalOpen(false)}
        colors={colors}
        onSave={handleSaveColors}
      />

      <ChurchConfigModal
        isOpen={isChurchConfigModalOpen}
        onClose={() => setIsChurchConfigModalOpen(false)}
        config={churchConfig}
        onSave={handleSaveChurchConfig}
      />

      <OrganogramModal
        isOpen={isOrganogramModalOpen}
        onClose={() => setIsOrganogramModalOpen(false)}
        members={members}
        churchConfig={churchConfig}
        onSelectMember={(mem) => setSelectedMemberModal(mem)}
      />

      <ReportsModal
        isOpen={isReportsModalOpen}
        onClose={() => setIsReportsModalOpen(false)}
        churchConfig={churchConfig}
        members={members}
        families={families}
        assets={assets}
        events={events}
        visits={visits}
        socialActions={socialActions}
      />

      {/* Member Detail Modal (accessible globally from any module) */}
      {selectedMemberModal && (
        <MemberDetailModal
          member={selectedMemberModal}
          onClose={() => setSelectedMemberModal(null)}
          onUpdate={handleUpdateMember}
          onDelete={handleDeleteMember}
          families={families}
          allMembers={members}
          visits={visits}
          churchConfig={churchConfig}
          currentUser={currentUser}
          onSelectMember={(mem) => setSelectedMemberModal(mem)}
        />
      )}
    </div>
  );
}
