import type { SourcingTarget, SupplierMapping, Supplier } from "../types/sourcing";
import { INITIAL_SUPPLIERS, INITIAL_TARGETS } from "../data/mockData";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== "false";

// Delay simulator helper for mock backend behavior
const delay = (ms: number = 300) => new Promise((res) => setTimeout(res, ms));

export class SourcingApiService {
  /**
   * Fetch all sourcing targets
   */
  static async fetchTargets(): Promise<SourcingTarget[]> {
    if (USE_MOCK_API) {
      await delay();
      const saved = localStorage.getItem("idims_sourcing_targets");
      return saved ? JSON.parse(saved) : INITIAL_TARGETS;
    }
    const response = await fetch(`${API_BASE_URL}/api/sourcing/targets`);
    if (!response.ok) throw new Error("Failed to fetch sourcing targets");
    return response.json();
  }

  /**
   * Fetch compliant suppliers list
   */
  static async fetchSuppliers(): Promise<Supplier[]> {
    if (USE_MOCK_API) {
      await delay();
      return INITIAL_SUPPLIERS;
    }
    const response = await fetch(`${API_BASE_URL}/api/suppliers`);
    if (!response.ok) throw new Error("Failed to fetch suppliers");
    return response.json();
  }

  /**
   * Create a new sourcing target
   */
  static async createTarget(
    data: Omit<SourcingTarget, "id" | "sourcingId" | "status">
  ): Promise<SourcingTarget> {
    if (USE_MOCK_API) {
      await delay(400);
      const saved = localStorage.getItem("idims_sourcing_targets");
      const currentTargets: SourcingTarget[] = saved ? JSON.parse(saved) : INITIAL_TARGETS;
      
      const newTarget: SourcingTarget = {
        id: `target-${Date.now()}`,
        sourcingId: `BST-${(currentTargets.length + 1).toString().padStart(3, "0")}`,
        status: "In Progress",
        ...data,
      };

      const updated = [newTarget, ...currentTargets];
      localStorage.setItem("idims_sourcing_targets", JSON.stringify(updated));
      return newTarget;
    }

    const response = await fetch(`${API_BASE_URL}/api/sourcing/targets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create sourcing target");
    return response.json();
  }

  /**
   * Map supplier to a target line item
   */
  static async addSupplierMapping(
    targetId: string,
    lineId: string,
    mapping: Omit<SupplierMapping, "id" | "effectivePrice" | "mappedAt">
  ): Promise<SourcingTarget[]> {
    if (USE_MOCK_API) {
      await delay(300);
      const saved = localStorage.getItem("idims_sourcing_targets");
      const targets: SourcingTarget[] = saved ? JSON.parse(saved) : INITIAL_TARGETS;

      const updated = targets.map((t) => {
        if (t.id !== targetId) return t;
        const newLines = t.lines.map((l) => {
          if (l.id !== lineId) return l;
          const effectivePrice = mapping.basePrice * (1 + mapping.taxRate / 100);
          const newMapping: SupplierMapping = {
            id: `map-${Date.now()}`,
            effectivePrice,
            mappedAt: new Date().toISOString().split("T")[0],
            ...mapping,
          };
          return { ...l, mappings: [...l.mappings, newMapping] };
        });
        return { ...t, lines: newLines };
      });

      localStorage.setItem("idims_sourcing_targets", JSON.stringify(updated));
      return updated;
    }

    const response = await fetch(
      `${API_BASE_URL}/api/sourcing/targets/${targetId}/lines/${lineId}/mappings`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mapping),
      }
    );
    if (!response.ok) throw new Error("Failed to add supplier mapping");
    return response.json();
  }

  /**
   * Remove supplier mapping from a target line item
   */
  static async removeSupplierMapping(
    targetId: string,
    lineId: string,
    mappingId: string
  ): Promise<SourcingTarget[]> {
    if (USE_MOCK_API) {
      await delay(250);
      const saved = localStorage.getItem("idims_sourcing_targets");
      const targets: SourcingTarget[] = saved ? JSON.parse(saved) : INITIAL_TARGETS;

      const updated = targets.map((t) => {
        if (t.id !== targetId) return t;
        const newLines = t.lines.map((l) => {
          if (l.id !== lineId) return l;
          const filtered = l.mappings.filter((m) => m.id !== mappingId);
          const isCompleted = filtered.length > 0 ? l.isCompleted : false;
          return { ...l, mappings: filtered, isCompleted };
        });
        const completedLines = newLines.filter((l) => l.isCompleted).length;
        const status: "In Progress" | "Completed" =
          completedLines === newLines.length && newLines.length > 0
            ? "Completed"
            : "In Progress";
        return { ...t, lines: newLines, status };
      });

      localStorage.setItem("idims_sourcing_targets", JSON.stringify(updated));
      return updated;
    }

    const response = await fetch(
      `${API_BASE_URL}/api/sourcing/targets/${targetId}/lines/${lineId}/mappings/${mappingId}`,
      { method: "DELETE" }
    );
    if (!response.ok) throw new Error("Failed to remove supplier mapping");
    return response.json();
  }

  /**
   * Toggle line completion status
   */
  static async toggleLineCompletion(
    targetId: string,
    lineId: string
  ): Promise<SourcingTarget[]> {
    if (USE_MOCK_API) {
      await delay(200);
      const saved = localStorage.getItem("idims_sourcing_targets");
      const targets: SourcingTarget[] = saved ? JSON.parse(saved) : INITIAL_TARGETS;

      const updated = targets.map((t) => {
        if (t.id !== targetId) return t;
        const newLines = t.lines.map((l) => {
          if (l.id !== lineId) return l;
          if (!l.isCompleted && l.mappings.length === 0) {
            throw new Error("Cannot complete line item without mapping at least one supplier.");
          }
          return { ...l, isCompleted: !l.isCompleted };
        });
        const completedLines = newLines.filter((l) => l.isCompleted).length;
        const status: "In Progress" | "Completed" =
          completedLines === newLines.length && newLines.length > 0
            ? "Completed"
            : "In Progress";
        return { ...t, lines: newLines, status };
      });

      localStorage.setItem("idims_sourcing_targets", JSON.stringify(updated));
      return updated;
    }

    const response = await fetch(
      `${API_BASE_URL}/api/sourcing/targets/${targetId}/lines/${lineId}/toggle-complete`,
      { method: "PATCH" }
    );
    if (!response.ok) throw new Error("Failed to toggle line completion");
    return response.json();
  }
}
