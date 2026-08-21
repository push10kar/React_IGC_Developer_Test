import React, { useState } from "react";
import { SourcingProvider } from "./context/SourcingContext";
import { TargetDashboard } from "./components/TargetDashboard";
import { IdimsNavbar } from "./components/IdimsNavbar";
import { VaultView } from "./components/VaultView";
import { ModulePlaceholderView } from "./components/ModulePlaceholderView";
import { AssignTargetModal } from "./components/AssignTargetModal";
import { SupplierMappingModal } from "./components/SupplierMappingModal";
import type { SourcingTarget } from "./types/sourcing";

export const App: React.FC = () => {
  const [activeNav, setActiveNav] = useState("p2p");
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isMappingModalOpen, setIsMappingModalOpen] = useState(false);
  const [activeTarget, setActiveTarget] = useState<SourcingTarget | null>(null);
  const [activeLineId, setActiveLineId] = useState<string | undefined>(
    undefined,
  );

  const handleOpenMappingModal = (target: SourcingTarget, lineId?: string) => {
    setActiveTarget(target);
    setActiveLineId(lineId);
    setIsMappingModalOpen(true);
  };

  const renderContent = () => {
    switch (activeNav) {
      case "p2p":
        return (
          <TargetDashboard
            onOpenAssignModal={() => setIsAssignModalOpen(true)}
            onOpenMappingModal={handleOpenMappingModal}
          />
        );
      case "vault":
        return <VaultView />;
      case "dashboard":
        return (
          <ModulePlaceholderView
            moduleName="Executive Dashboard"
            description="Overview of company sourcing, active targets, vendor analytics, and key performance indicators."
          />
        );
      case "projects":
        return (
          <ModulePlaceholderView
            moduleName="Project Navigator"
            description="Manage corporate expansion projects, procurement milestones, and multi-department timelines."
          />
        );
      case "hrms":
        return (
          <ModulePlaceholderView
            moduleName="Human Resource Management System (HRMS)"
            description="Employee directories, procurement access authorizations, role assignments, and team management."
          />
        );
      case "sales":
        return (
          <ModulePlaceholderView
            moduleName="Sales Matrix"
            description="Track outbound client proposals, contract values, margin projections, and sales pipelines."
          />
        );
      case "clm":
        return (
          <ModulePlaceholderView
            moduleName="Contract Lifecycle Management (CLM)"
            description="Draft, negotiate, review, and archive legal supply agreements and vendor NDAs."
          />
        );
      case "gts":
        return (
          <ModulePlaceholderView
            moduleName="Global Trade & Compliance (GTS E-Docs)"
            description="Customs filings, export declarations, Bills of Lading, and international trade compliance vault."
          />
        );
      case "wms":
        return (
          <ModulePlaceholderView
            moduleName="Warehouse Management System (WMS)"
            description="Real-time inventory levels, stock transfers, batch tracking, and warehouse dispatching."
          />
        );
      case "shipment":
        return (
          <ModulePlaceholderView
            moduleName="Shipment 360"
            description="Live GPS tracking, freight forwarder updates, ETAs, and logistics manifest management."
          />
        );
      case "master":
        return (
          <ModulePlaceholderView
            moduleName="Master Data Management"
            description="Centralized product SKUs, HSN codes, tax rates, vendor directories, and master tables."
          />
        );
      default:
        return (
          <TargetDashboard
            onOpenAssignModal={() => setIsAssignModalOpen(true)}
            onOpenMappingModal={handleOpenMappingModal}
          />
        );
    }
  };

  return (
    <SourcingProvider>
      <div className="min-h-screen bg-[#F4F6FB] flex flex-col font-sans">
        <IdimsNavbar activeNav={activeNav} onNavChange={(route) => setActiveNav(route)} />

        <main className="max-w-7xl w-full mx-auto p-6 flex-1">
          {renderContent()}
        </main>

        <AssignTargetModal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
        />

        <SupplierMappingModal
          isOpen={isMappingModalOpen}
          onClose={() => setIsMappingModalOpen(false)}
          target={activeTarget}
          initialLineId={activeLineId}
        />
      </div>
    </SourcingProvider>
  );
};

export default App;
