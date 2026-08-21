import React, { createContext, useContext, useState, useMemo } from "react";
import type {
  SourcingTarget,
  SourcingLineItem,
  SupplierMapping,
  Supplier,
} from "../types/sourcing";
import { INITIAL_SUPPLIERS, INITIAL_TARGETS } from "../data/mockData";

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
  createTarget: (
    data: Omit<SourcingTarget, "id" | "sourcingId" | "status">,
  ) => void;
  addSupplierMapping: (
    targetId: string,
    lineId: string,
    mapping: Omit<SupplierMapping, "id" | "effectivePrice" | "mappedAt">,
  ) => void;
  removeSupplierMapping: (
    targetId: string,
    lineId: string,
    mappingId: string,
  ) => void;
  toggleLineCompletion: (
    targetId: string,
    lineId: string,
  ) => { success: boolean; message?: string };
}

const SourcingContext = createContext<SourcingContextType | undefined>(
  undefined,
);

export const SourcingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser] = useState<string>("Pushkar Sharma");
  const [suppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [targets, setTargets] = useState<SourcingTarget[]>(INITIAL_TARGETS);

  const stats = useMemo<SourcingStats>(() => {
    return {
      totalTargets: targets.length,
      assignedTargets: targets.filter((t) => t.assignedToName === currentUser)
        .length,
      completedTargets: targets.filter((t) => t.status === "Completed").length,
      inProgressTargets: targets.filter((t) => t.status === "In Progress")
        .length,
    };
  }, [targets, currentUser]);

  const createTarget = (
    data: Omit<SourcingTarget, "id" | "sourcingId" | "status">,
  ) => {
    const nextNum = targets.length + 1;
    const sequentialId = `BST-${nextNum.toString().padStart(3, "0")}`;

    const newTarget: SourcingTarget = {
      ...data,
      id: `target-${Date.now()}`,
      sourcingId: sequentialId,
      status: "In Progress",
    };

    setTargets((prev) => [newTarget, ...prev]);
  };

  const addSupplierMapping = (
    targetId: string,
    lineId: string,
    mappingData: Omit<SupplierMapping, "id" | "effectivePrice" | "mappedAt">,
  ) => {
    setTargets((prevTargets) =>
      prevTargets.map((target) => {
        if (target.id !== targetId) return target;

        const updatedLines = target.lines.map((line) => {
          if (line.id !== lineId) return line;

          const effectivePrice = Number(
            (mappingData.basePrice * (1 + mappingData.taxRate / 100)).toFixed(
              2,
            ),
          );

          const newMapping: SupplierMapping = {
            ...mappingData,
            id: `mapping-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            effectivePrice,
            mappedAt: new Date().toISOString().split("T")[0],
          };

          return {
            ...line,
            mappings: [...line.mappings, newMapping],
          };
        });

        return { ...target, lines: updatedLines };
      }),
    );
  };

  const removeSupplierMapping = (
    targetId: string,
    lineId: string,
    mappingId: string,
  ) => {
    setTargets((prevTargets) =>
      prevTargets.map((target) => {
        if (target.id !== targetId) return target;

        const updatedLines = target.lines.map((line) => {
          if (line.id !== lineId) return line;

          const updatedMappings = line.mappings.filter(
            (m) => m.id !== mappingId,
          );
          const isCompleted =
            updatedMappings.length === 0 ? false : line.isCompleted;

          return {
            ...line,
            mappings: updatedMappings,
            isCompleted,
          };
        });

        const allCompleted = updatedLines.every((l) => l.isCompleted);
        const status =
          allCompleted && updatedLines.length > 0 ? "Completed" : "In Progress";

        return { ...target, lines: updatedLines, status };
      }),
    );
  };

  const toggleLineCompletion = (
    targetId: string,
    lineId: string,
  ): { success: boolean; message?: string } => {
    let operationResult: { success: boolean; message?: string } = {
      success: true,
    };

    setTargets((prevTargets) =>
      prevTargets.map((target) => {
        if (target.id !== targetId) return target;

        const targetLine = target.lines.find((l) => l.id === lineId);
        if (!targetLine) return target;

        if (!targetLine.isCompleted && targetLine.mappings.length === 0) {
          operationResult = {
            success: false,
            message:
              "A supplier must be mapped before marking this line as completed.",
          };
          return target;
        }

        const updatedLines = target.lines.map((line) => {
          if (line.id !== lineId) return line;
          return { ...line, isCompleted: !line.isCompleted };
        });

        const allCompleted = updatedLines.every((l) => l.isCompleted);
        const status =
          allCompleted && updatedLines.length > 0 ? "Completed" : "In Progress";

        return { ...target, lines: updatedLines, status };
      }),
    );

    return operationResult;
  };

  return (
    <SourcingContext.Provider
      value={{
        targets,
        suppliers,
        stats,
        currentUser,
        createTarget,
        addSupplierMapping,
        removeSupplierMapping,
        toggleLineCompletion,
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
