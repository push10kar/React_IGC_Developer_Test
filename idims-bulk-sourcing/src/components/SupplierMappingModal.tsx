import React, { useState, useMemo } from "react";
import {
  X,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Plus,
  Trash2,
  FileText,
  Link2,
  Building2,
  Tag,
  ShieldCheck,
  MapPin,
  TrendingUp,
  PackageCheck,
  IndianRupee,
  PercentIcon,
  Check,
} from "lucide-react";
import { useSourcing } from "../context/SourcingContext";
import type { SourcingTarget, SourcingLineItem } from "../types/sourcing";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  target: SourcingTarget | null;
  initialLineId?: string;
}

export const SupplierMappingModal: React.FC<Props> = ({
  isOpen,
  onClose,
  target,
  initialLineId,
}) => {
  const { suppliers, addSupplierMapping, removeSupplierMapping, toggleLineCompletion } =
    useSourcing();

  // Active line navigator state
  const [activeLineId, setActiveLineId] = useState<string>(
    initialLineId ?? target?.lines[0]?.id ?? ""
  );

  // Add supplier form state
  const [selectedSupplierId, setSelectedSupplierId] = useState("");
  const [basePrice, setBasePrice] = useState<number | "">("");
  const [taxRate, setTaxRate] = useState<number | "">(18);
  const [formError, setFormError] = useState<string | null>(null);
  const [completionError, setCompletionError] = useState<string | null>(null);

  if (!isOpen || !target) return null;

  const activeLine: SourcingLineItem | undefined = target.lines.find(
    (l) => l.id === activeLineId
  );

  // Landed cost computation: BasePrice × (1 + TaxRate/100)
  const computedLandedCost = useMemo(() => {
    if (basePrice === "" || taxRate === "") return null;
    return Number((Number(basePrice) * (1 + Number(taxRate) / 100)).toFixed(2));
  }, [basePrice, taxRate]);

  // Suppliers not yet mapped on this line
  const unmappedSuppliers = useMemo(() => {
    if (!activeLine) return suppliers;
    const mappedIds = new Set(activeLine.mappings.map((m) => m.supplierId));
    return suppliers.filter((s) => !mappedIds.has(s.id));
  }, [suppliers, activeLine]);

  const resetForm = () => {
    setSelectedSupplierId("");
    setBasePrice("");
    setTaxRate(18);
    setFormError(null);
  };

  const handleAddMapping = () => {
    if (!activeLine) return;
    if (!selectedSupplierId) {
      setFormError("Please select a supplier.");
      return;
    }
    if (basePrice === "" || Number(basePrice) <= 0) {
      setFormError("Base price must be a positive number.");
      return;
    }
    if (taxRate === "" || Number(taxRate) < 0) {
      setFormError("Tax rate must be 0 or greater.");
      return;
    }

    const supplier = suppliers.find((s) => s.id === selectedSupplierId);
    if (!supplier) return;

    addSupplierMapping(target.id, activeLine.id, {
      supplierId: supplier.id,
      supplierName: supplier.name,
      supplierCode: supplier.code,
      basePrice: Number(basePrice),
      taxRate: Number(taxRate),
      rank: activeLine.mappings.length + 1,
    });

    setFormError(null);
    resetForm();
  };

  const handleToggleCompletion = (lineId: string) => {
    const result = toggleLineCompletion(target.id, lineId);
    if (!result.success) {
      setCompletionError(result.message ?? "Cannot mark line as completed.");
      setTimeout(() => setCompletionError(null), 4000);
    } else {
      setCompletionError(null);
    }
  };

  const totalLines = target.lines.length;
  const completedLines = target.lines.filter((l) => l.isCompleted).length;
  const progressPct =
    totalLines > 0 ? Math.round((completedLines / totalLines) * 100) : 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-[#A5F3FC]">

        {/* ── HEADER ── */}
        <div className="bg-gradient-to-r from-[#0E7490] via-[#0891B2] to-[#22D3EE] px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs bg-white/25 px-2 py-0.5 rounded font-extrabold">
                  {target.sourcingId}
                </span>
                <h2 className="text-base font-black">{target.title}</h2>
              </div>
              <p className="text-xs opacity-80">
                Supplier Mapping Workspace — {completedLines}/{totalLines} lines sourced
              </p>
            </div>
          </div>

          {/* Overall target progress */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-[10px] font-bold opacity-70 mb-1">Fulfillment</div>
              <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="text-xs font-extrabold mt-0.5">{progressPct}%</div>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── BODY: SPLIT LAYOUT ── */}
        <div className="flex flex-1 overflow-hidden">

          {/* LEFT — Line Navigator */}
          <div className="w-64 flex-shrink-0 border-r border-[#E4EFF5] bg-[#F8FCFD] flex flex-col">
            <div className="px-4 py-3 text-[10px] font-extrabold uppercase tracking-wider text-[#0891B2] border-b border-[#E4EFF5]">
              Line Items ({totalLines})
            </div>
            <div className="flex-1 overflow-y-auto">
              {target.lines.map((line, idx) => {
                const isActive = line.id === activeLineId;
                const mapped = line.mappings.length;
                return (
                  <button
                    key={line.id}
                    onClick={() => {
                      setActiveLineId(line.id);
                      setCompletionError(null);
                      resetForm();
                    }}
                    className={`w-full text-left px-4 py-3 border-b border-[#EEF4F7] transition-colors group ${
                      isActive
                        ? "bg-[#E0FBFF] border-l-2 border-l-[#0891B2]"
                        : "hover:bg-white"
                    }`}
                  >
                    {/* Line number + status */}
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-extrabold text-[#94A3B8]">
                        LINE #{idx + 1}
                      </span>
                      {line.isCompleted ? (
                        <span className="text-[9px] font-black text-[#15803D] bg-[#DCFCE7] px-1.5 py-0.5 rounded-full">
                          DONE
                        </span>
                      ) : mapped > 0 ? (
                        <span className="text-[9px] font-black text-[#0891B2] bg-[#ECFEFF] px-1.5 py-0.5 rounded-full">
                          {mapped} MAPPED
                        </span>
                      ) : (
                        <span className="text-[9px] font-black text-[#EA7A0C] bg-[#FFF7ED] px-1.5 py-0.5 rounded-full">
                          OPEN
                        </span>
                      )}
                    </div>
                    {/* Product name */}
                    <div className={`text-xs font-bold truncate ${isActive ? "text-[#0C4A6E]" : "text-[#334155]"}`}>
                      {line.productName}
                    </div>
                    {/* Target rate */}
                    <div className="text-[10px] font-mono text-[#64748B] mt-0.5">
                      ₹{line.targetPrice.toLocaleString()}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT — Mapping Workspace */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">

            {!activeLine ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
                <Building2 className="w-10 h-10 text-[#CBD5E1]" />
                <p className="text-sm text-[#94A3B8]">Select a line item from the left panel.</p>
              </div>
            ) : (
              <>
                {/* Line detail header */}
                <div className="bg-[#F8FCFD] border border-[#D8EEF4] rounded-xl p-4 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {activeLine.isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-[#EA7A0C]" />
                        )}
                        <h3 className="font-extrabold text-sm text-[#0C4A6E]">
                          {activeLine.productName}
                        </h3>
                        <span className="font-mono text-[10px] bg-white border border-[#E2E8F0] px-1.5 py-0.5 rounded text-[#475569]">
                          HSN: {activeLine.hsnCode}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#64748B]">
                        <FileText className="w-3 h-3 text-[#94A3B8]" />
                        <span className="font-semibold text-[#7C8499]">
                          Clarity ({activeLine.clarity.type}):
                        </span>
                        {activeLine.clarity.type === "link" ? (
                          <a
                            href={activeLine.clarity.value}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#0891B2] underline flex items-center gap-1"
                          >
                            <Link2 className="w-3 h-3" /> View Spec Link
                          </a>
                        ) : (
                          <span className="truncate max-w-sm">{activeLine.clarity.value}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-[9px] uppercase font-extrabold text-[#94A3B8] block">
                        Target Rate
                      </span>
                      <span className="font-mono font-extrabold text-lg text-[#0C4A6E]">
                        ₹{activeLine.targetPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Mark complete / completion guardrail */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#E6F3F7]">
                    {completionError && (
                      <div className="flex items-center gap-2 text-[11px] font-bold text-[#B45309] bg-[#FFF7ED] border border-[#FED7AA] px-3 py-1.5 rounded-lg flex-1 mr-4">
                        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                        {completionError}
                      </div>
                    )}
                    <button
                      onClick={() => handleToggleCompletion(activeLine.id)}
                      className={`ml-auto flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-extrabold border transition-all ${
                        activeLine.isCompleted
                          ? "bg-[#DCFCE7] border-[#BBF7D0] text-[#15803D] hover:bg-[#F0FDF4]"
                          : "bg-white border-[#E2E8F0] text-[#64748B] hover:border-[#0891B2] hover:text-[#0891B2]"
                      }`}
                    >
                      {activeLine.isCompleted ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Sourcing Completed
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" /> Mark as Completed
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* ── Mapped Suppliers Table ── */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0891B2]">
                      Mapped Vendors ({activeLine.mappings.length})
                    </span>
                  </div>

                  {activeLine.mappings.length === 0 ? (
                    <div className="border border-dashed border-[#A5F3FC] rounded-xl p-6 text-center space-y-1 bg-[#F0FDFF]">
                      <Building2 className="w-6 h-6 text-[#67E8F9] mx-auto" />
                      <p className="text-xs text-[#0891B2] font-bold">No vendors mapped yet</p>
                      <p className="text-[11px] text-[#64748B]">
                        Use the form below to add compliant suppliers.
                      </p>
                    </div>
                  ) : (
                    <div className="border border-[#D8EEF4] rounded-xl overflow-hidden">
                      {/* Table header */}
                      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-2 px-4 py-2 bg-[#EEF7FA] text-[10px] font-extrabold uppercase text-[#5B7585] tracking-wider border-b border-[#D8EEF4]">
                        <span>Supplier</span>
                        <span>Base Price</span>
                        <span>GST Rate</span>
                        <span className="text-[#0891B2]">Landed Cost</span>
                        <span>Rank</span>
                        <span></span>
                      </div>

                      {/* Table rows */}
                      {activeLine.mappings
                        .slice()
                        .sort((a, b) => a.rank - b.rank)
                        .map((mapping) => {
                          const isLowest =
                            mapping.effectivePrice ===
                            Math.min(...activeLine.mappings.map((m) => m.effectivePrice));
                          return (
                            <div
                              key={mapping.id}
                              className={`grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-2 px-4 py-3 items-center text-xs border-b border-[#F1F5F9] last:border-0 transition-colors ${
                                isLowest ? "bg-[#F0FFFE]" : "bg-white hover:bg-[#F8FCFD]"
                              }`}
                            >
                              {/* Supplier info */}
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-[#ECFEFF] text-[#0891B2] font-black text-[10px] flex items-center justify-center flex-shrink-0">
                                  {mapping.supplierName.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <div className="font-bold text-[#0F172A] truncate">
                                    {mapping.supplierName}
                                  </div>
                                  <div className="font-mono text-[10px] text-[#64748B]">
                                    {mapping.supplierCode}
                                  </div>
                                </div>
                                {isLowest && (
                                  <span className="text-[9px] font-black text-[#15803D] bg-[#DCFCE7] px-1.5 py-0.5 rounded-full flex-shrink-0">
                                    L1
                                  </span>
                                )}
                              </div>

                              {/* Base price */}
                              <div className="font-mono font-extrabold text-[#334155]">
                                ₹{mapping.basePrice.toLocaleString()}
                              </div>

                              {/* Tax rate */}
                              <div className="font-mono text-[#64748B]">
                                {mapping.taxRate}%
                              </div>

                              {/* Landed cost — computed field */}
                              <div className="font-mono font-extrabold text-[#0891B2]">
                                ₹{mapping.effectivePrice.toLocaleString()}
                              </div>

                              {/* Rank */}
                              <div className="text-[#64748B] font-bold">
                                #{mapping.rank}
                              </div>

                              {/* Remove */}
                              <button
                                onClick={() =>
                                  removeSupplierMapping(target.id, activeLine.id, mapping.id)
                                }
                                className="p-1.5 rounded-lg text-[#94A3B8] hover:text-red-500 hover:bg-red-50 transition-colors"
                                title="Remove mapping"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>

                {/* ── Add Supplier Form ── */}
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 space-y-4">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0891B2] flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Add Supplier Mapping
                  </span>

                  {formError && (
                    <div className="flex items-center gap-2 text-[11px] font-bold text-[#B45309] bg-[#FFF7ED] border border-[#FED7AA] px-3 py-1.5 rounded-lg">
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                      {formError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    {/* Supplier select */}
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1 flex items-center gap-1">
                        <Building2 className="w-3 h-3" /> Supplier
                      </label>
                      <select
                        value={selectedSupplierId}
                        onChange={(e) => {
                          setSelectedSupplierId(e.target.value);
                          setFormError(null);
                        }}
                        className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs font-bold text-[#0C4A6E] focus:outline-none focus:border-[#0891B2]"
                      >
                        <option value="">-- Select Compliant Vendor --</option>
                        {unmappedSuppliers.length === 0 ? (
                          <option disabled>All vendors already mapped</option>
                        ) : (
                          unmappedSuppliers.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name} ({s.code}) — {s.city}
                            </option>
                          ))
                        )}
                      </select>
                      {selectedSupplierId && (() => {
                        const s = suppliers.find(x => x.id === selectedSupplierId);
                        if (!s) return null;
                        return (
                          <div className="mt-1.5 flex items-center gap-3 text-[10px] text-[#64748B]">
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[#94A3B8]" />{s.city}, {s.state}</span>
                            <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-[#16A34A]" />{s.isCompliant ? "GST Compliant" : "Non-Compliant"}</span>
                            <span className="flex items-center gap-1"><Tag className="w-3 h-3 text-[#94A3B8]" />{s.category}</span>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Base price */}
                    <div>
                      <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1 flex items-center gap-1">
                        <IndianRupee className="w-3 h-3" /> Base Price (₹)
                      </label>
                      <input
                        type="number"
                        min={1}
                        placeholder="e.g. 3800"
                        value={basePrice}
                        onChange={(e) => {
                          setBasePrice(e.target.value === "" ? "" : Number(e.target.value));
                          setFormError(null);
                        }}
                        className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs font-mono font-bold text-[#0C4A6E] focus:outline-none focus:border-[#0891B2]"
                      />
                    </div>

                    {/* Tax rate */}
                    <div>
                      <label className="text-[10px] font-bold text-[#64748B] uppercase block mb-1 flex items-center gap-1">
                        <PercentIcon className="w-3 h-3" /> GST Rate (%)
                      </label>
                      <select
                        value={taxRate}
                        onChange={(e) => setTaxRate(Number(e.target.value))}
                        className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs font-bold text-[#0C4A6E] focus:outline-none focus:border-[#0891B2]"
                      >
                        <option value={0}>0% (Exempt)</option>
                        <option value={5}>5%</option>
                        <option value={12}>12%</option>
                        <option value={18}>18% (Standard)</option>
                        <option value={28}>28%</option>
                      </select>
                    </div>
                  </div>

                  {/* Computed landed cost preview */}
                  {computedLandedCost !== null && (
                    <div className="flex items-center gap-3 bg-[#ECFEFF] border border-[#A5F3FC] rounded-lg px-4 py-2.5">
                      <TrendingUp className="w-4 h-4 text-[#0891B2]" />
                      <span className="text-xs text-[#0E7490] font-bold">Computed Landed Cost:</span>
                      <span className="font-mono text-sm font-extrabold text-[#0C4A6E]">
                        ₹{computedLandedCost.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-[#64748B] ml-auto">
                        = ₹{Number(basePrice).toLocaleString()} × (1 + {taxRate}%)
                      </span>
                      {activeLine.targetPrice > 0 && computedLandedCost > activeLine.targetPrice && (
                        <span className="text-[10px] font-extrabold text-[#DC2626] bg-[#FEF2F2] border border-[#FECACA] px-2 py-0.5 rounded-full">
                          ▲ Exceeds target
                        </span>
                      )}
                      {activeLine.targetPrice > 0 && computedLandedCost <= activeLine.targetPrice && (
                        <span className="text-[10px] font-extrabold text-[#15803D] bg-[#DCFCE7] border border-[#BBF7D0] px-2 py-0.5 rounded-full">
                          ✓ Within target
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleAddMapping}
                      disabled={unmappedSuppliers.length === 0 && !selectedSupplierId}
                      className="px-5 py-2.5 bg-gradient-to-r from-[#0891B2] to-[#0E7490] text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-md hover:brightness-105 transition-all disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" /> Map Supplier to Line
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className="px-6 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
          <div className="text-xs text-[#64748B] flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
              <strong>{completedLines}</strong> completed
            </span>
            <span className="flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-[#EA7A0C]" />
              <strong>{totalLines - completedLines}</strong> pending
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-bold text-[#475569] hover:bg-[#F1F5F9] transition-colors"
          >
            Close Workspace
          </button>
        </div>

      </div>
    </div>
  );
};
