export type ClarityType = "text" | "link" | "pdf";
export type SourcingSourceType = "MASTER" | "MANUAL";
export type SourcingTargetStatus = "In Progress" | "Completed";

export interface ClarityAttachment {
  type: ClarityType;
  value: string;
  fileName?: string;
  fileSize?: number;
}

export interface Supplier {
  id: string;
  code: string;
  name: string;
  gstin: string;
  city: string;
  state: string;
  category: "material" | "logistics" | "services";
  isCompliant: boolean;
}

export interface SupplierMapping {
  id: string;
  supplierId: string;
  supplierName: string;
  supplierCode: string;
  basePrice: number;
  taxRate: number;
  effectivePrice: number;
  rank: number;
  mappedAt: string;
}

export interface SourcingLineItem {
  id: string;
  productId?: string;
  productName: string;
  hsnCode: string;
  targetPrice: number;
  sourceType: SourcingSourceType;
  clarity: ClarityAttachment;
  isCompleted: boolean;
  mappings: SupplierMapping[];
}

export interface SourcingTarget {
  id: string;
  sourcingId: string;
  title: string;
  sourceType: SourcingSourceType;
  createdById: string;
  createdByName: string;
  assignedToId: string;
  assignedToName: string;
  startDate: string;
  dueDate: string;
  status: SourcingTargetStatus;
  lines: SourcingLineItem[];
  branch?: "HEALTHCARE" | "AGROTECH" | "CORPORATION" | "ALL" | string;
}
