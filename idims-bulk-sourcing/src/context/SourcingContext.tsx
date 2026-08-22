import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import type {
  SourcingTarget,
  SupplierMapping,
  Supplier,
} from "../types/sourcing";
import { SourcingApiService } from "../services/api";

interface SourcingStats {
  totalTargets: number;
  assignedTargets: number;
  completedTargets: number;
  inProgressTargets: number;
}

interface SourcingContextType {
  targets: SourcingTarget[];
  suppliers: Supplier[];
  stats: SourcingStats;
  currentUser: string;
  activeBranch: string;
  setActiveBranch: (branchTag: string) => void;
  isLoading: boolean;
  error: string | null;
  createTarget: (
    data: Omit<SourcingTarget, "id" | "sourcingId" | "status">,
  ) => Promise<void>;
  addSupplierMapping: (
    targetId: string,
    lineId: string,
    mapping: Omit<SupplierMapping, "id" | "effectivePrice" | "mappedAt">,
  ) => Promise<void>;
  removeSupplierMapping: (
    targetId: string,
    lineId: string,
    mappingId: string,
  ) => Promise<void>;
  toggleLineCompletion: (
    targetId: string,
    lineId: string,
  ) => Promise<{ success: boolean; message?: string }>;
  refreshData: () => Promise<void>;
}

const SourcingContext = createContext<SourcingContextType | undefined>(
  undefined,
);

export const SourcingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser] = useState<string>("Rajesh Meshram");
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [targets, setTargets] = useState<SourcingTarget[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [activeBranch, setActiveBranch] = useState<string>("ALL");

  const loadInitialData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [fetchedTargets, fetchedSuppliers] = await Promise.all([
        SourcingApiService.fetchTargets(),
        SourcingApiService.fetchSuppliers(),
      ]);
      setTargets(fetchedTargets);
      setSuppliers(fetchedSuppliers);
    } catch (err: any) {
      setError(err.message || "Failed to load sourcing data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const filteredTargets = useMemo(() => {
    if (activeBranch === "ALL") return targets;
    return targets.filter((t) => t.branch === activeBranch || !t.branch);
  }, [targets, activeBranch]);

  const stats = useMemo<SourcingStats>(() => {
    return {
      totalTargets: filteredTargets.length,
      assignedTargets: filteredTargets.filter(
        (t) => t.assignedToName === currentUser,
      ).length,
      completedTargets: filteredTargets.filter((t) => t.status === "Completed")
        .length,
      inProgressTargets: filteredTargets.filter(
        (t) => t.status === "In Progress",
      ).length,
    };
  }, [filteredTargets, currentUser]);

  const createTarget = async (
    data: Omit<SourcingTarget, "id" | "sourcingId" | "status">,
  ) => {
    setIsLoading(true);
    try {
      const newTarget = await SourcingApiService.createTarget(data);
      setTargets((prev) => [newTarget, ...prev]);
    } catch (err: any) {
      setError(err.message || "Failed to create target");
    } finally {
      setIsLoading(false);
    }
  };

  const addSupplierMapping = async (
    targetId: string,
    lineId: string,
    mappingData: Omit<SupplierMapping, "id" | "effectivePrice" | "mappedAt">,
  ) => {
    try {
      const updatedTargets = await SourcingApiService.addSupplierMapping(
        targetId,
        lineId,
        mappingData
      );
      setTargets(updatedTargets);
    } catch (err: any) {
      setError(err.message || "Failed to add supplier mapping");
    }
  };

  const removeSupplierMapping = async (
    targetId: string,
    lineId: string,
    mappingId: string,
  ) => {
    try {
      const updatedTargets = await SourcingApiService.removeSupplierMapping(
        targetId,
        lineId,
        mappingId
      );
      setTargets(updatedTargets);
    } catch (err: any) {
      setError(err.message || "Failed to remove supplier mapping");
    }
  };

  const toggleLineCompletion = async (
    targetId: string,
    lineId: string,
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const updatedTargets = await SourcingApiService.toggleLineCompletion(
        targetId,
        lineId
      );
      setTargets(updatedTargets);
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  return (
    <SourcingContext.Provider
      value={{
        targets: filteredTargets,
        suppliers,
        stats,
        currentUser,
        activeBranch,
        setActiveBranch,
        isLoading,
        error,
        createTarget,
        addSupplierMapping,
        removeSupplierMapping,
        toggleLineCompletion,
        refreshData: loadInitialData,
      }}
    >
      {children}
    </SourcingContext.Provider>
  );
};

export const useSourcing = () => {
  const context = useContext(SourcingContext);
  if (!context) {
    throw new Error("useSourcing must be used within a SourcingProvider");
  }
  return context;
};
