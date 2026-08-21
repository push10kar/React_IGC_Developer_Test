import React, { useState, useMemo } from "react";
import {
  X,
  Plus,
  Trash2,
  Layers,
  Link2,
  Upload,
  Check,
  Lock,
  FileCheck,
} from "lucide-react";
import { useSourcing } from "../context/SourcingContext";
import type {
  SourcingLineItem,
  SourcingSourceType,
  ClarityType,
} from "../types/sourcing";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// Pre-defined Product Master Catalog for catalog selections
const PRODUCT_MASTER_CATALOG = [
  {
    id: "PM-101",
    name: "Galvanized I-Beam 200mm x 100mm",
    hsn: "7216.32",
    defaultPrice: 4200,
  },
  {
    id: "PM-102",
    name: "High-Tensile Anchor Fastener M16",
    hsn: "7318.15",
    defaultPrice: 85,
  },
  {
    id: "PM-103",
    name: "Epoxy Primer Coating Grade A (20L)",
    hsn: "3208.90",
    defaultPrice: 3800,
  },
  {
    id: "PM-104",
    name: "Cold Rolled Steel Sheet 1.2mm x 1250mm",
    hsn: "7209.16",
    defaultPrice: 5400,
  },
  {
    id: "PM-105",
    name: 'Stainless Steel Flange 150# ANSI 4"',
    hsn: "7307.21",
    defaultPrice: 1950,
  },
];

export const AssignTargetModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { targets, createTarget, currentUser } = useSourcing();

  // Next sequential ID display calculation
  const nextSequentialId = useMemo(() => {
    const nextNum = targets.length + 1;
    return `BST-${nextNum.toString().padStart(3, "0")}`;
  }, [targets]);

  // Form states
  const [title, setTitle] = useState("");
  const [assignedToName, setAssignedToName] = useState(currentUser);
  const [startDate, setStartDate] = useState("2026-08-21");
  const [dueDate, setDueDate] = useState("2026-09-15");
  const [sourceType, setSourceType] = useState<SourcingSourceType>("MASTER");

  // Product Master Selection state
  const [selectedCatalogSku, setSelectedCatalogSku] = useState("");

  // Line items state
  const [lines, setLines] = useState<
    Array<{
      productId?: string;
      productName: string;
      hsnCode: string;
      targetPrice: number;
      sourceType: SourcingSourceType;
      clarityType: ClarityType;
      clarityValue: string;
      fileName?: string;
    }>
  >([
    {
      productName: "",
      hsnCode: "",
      targetPrice: 0,
      sourceType: "MASTER",
      clarityType: "text",
      clarityValue: "",
    },
  ]);

  if (!isOpen) return null;

  // Add line item from catalog
  const handleAddCatalogProduct = () => {
    if (!selectedCatalogSku) return;
    const item = PRODUCT_MASTER_CATALOG.find(
      (p) => p.id === selectedCatalogSku,
    );
    if (!item) return;

    setLines((prev) => [
      ...prev.filter((l) => l.productName.trim() !== ""),
      {
        productId: item.id,
        productName: item.name,
        hsnCode: item.hsn,
        targetPrice: item.defaultPrice,
        sourceType: "MASTER",
        clarityType: "text",
        clarityValue:
          "Standard master catalog tolerances and technical parameters apply.",
      },
    ]);
    setSelectedCatalogSku("");
  };

  // Add empty manual line item
  const handleAddManualLine = () => {
    setLines((prev) => [
      ...prev,
      {
        productName: "",
        hsnCode: "",
        targetPrice: 0,
        sourceType: "MANUAL",
        clarityType: "text",
        clarityValue: "",
      },
    ]);
  };

  const handleRemoveLine = (index: number) => {
    setLines((prev) => prev.filter((_, i) => i !== index));
  };

  const handleLineFieldChange = (index: number, field: string, value: any) => {
    setLines((prev) =>
      prev.map((line, i) => {
        if (i !== index) return line;
        return { ...line, [field]: value };
      }),
    );
  };

  const handleFileUploadMock = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size exceeds 10MB limit.");
        return;
      }
      handleLineFieldChange(index, "fileName", file.name);
      handleLineFieldChange(
        index,
        "clarityValue",
        `Uploaded Document: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Target title is required.");
      return;
    }

    if (
      lines.length === 0 ||
      lines.some((l) => !l.productName.trim() || l.targetPrice <= 0)
    ) {
      alert(
        "Every line item must have a valid product name and target price greater than 0.",
      );
      return;
    }

    if (new Date(dueDate) <= new Date(startDate)) {
      alert("Due Date must be later than the Start Date.");
      return;
    }

    const formattedLines: SourcingLineItem[] = lines.map((l, idx) => ({
      id: `line-${Date.now()}-${idx}`,
      productId: l.productId,
      productName: l.productName,
      hsnCode: l.hsnCode || "7200.00",
      targetPrice: Number(l.targetPrice),
      sourceType: l.sourceType,
      clarity: {
        type: l.clarityType,
        value: l.clarityValue || "No technical notes specified.",
        fileName: l.fileName,
      },
      isCompleted: false,
      mappings: [],
    }));

    createTarget({
      title: title.trim(),
      sourceType,
      createdById: "u-current",
      createdByName: currentUser,
      assignedToId: "u-assigned",
      assignedToName,
      startDate,
      dueDate,
      lines: formattedLines,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card text-card-foreground rounded-lg w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden shadow-lg border border-border">
        {/* Modal Header */}
        <div className="bg-muted px-6 py-4 text-foreground flex justify-between items-center border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-background border border-border flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs bg-background border border-border px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
                  <Lock className="w-3 h-3" /> {nextSequentialId}
                </span>
                <h2 className="text-base font-semibold">Assign Sourcing Target</h2>
              </div>
              <p className="text-xs text-muted-foreground">
                Initialize bulk purchasing specifications and allocate buyer
                target lines
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto space-y-6 flex-1 text-xs"
        >
          {/* Target Parameters */}
          <div className="bg-muted/60 border border-border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-foreground">
              <span>Step 1: Header Configuration</span>
              <span className="font-mono bg-background px-2 py-0.5 border border-border rounded-md">
                Auto-Allocated ID
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="font-medium text-muted-foreground uppercase text-[10px] block mb-1">
                  Sourcing Target Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Heavy Castings & Fasteners Q3"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-background border border-input rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring"
                />
              </div>

              <div>
                <label className="font-medium text-muted-foreground uppercase text-[10px] block mb-1">
                  Assigned Buyer <span className="text-red-500">*</span>
                </label>
                <select
                  value={assignedToName}
                  onChange={(e) => setAssignedToName(e.target.value)}
                  className="w-full bg-background border border-input rounded-md px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring"
                >
                  <option value="Rajesh Meshram">
                    Rajesh Meshram (Senior Sourcing Lead)
                  </option>
                  <option value="Rajesh Nair">
                    Rajesh Nair (Procurement Manager)
                  </option>
                  <option value="Priya Patel">
                    Priya Patel (Category Buyer)
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-medium text-muted-foreground uppercase text-[10px] block mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-background border border-input rounded-md px-2 py-2 text-xs font-mono text-foreground"
                  />
                </div>
                <div>
                  <label className="font-medium text-muted-foreground uppercase text-[10px] block mb-1">
                    Due Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-background border border-input rounded-md px-2 py-2 text-xs font-mono text-foreground"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sourcing Source Selection */}
          <div className="space-y-2">
            <span className="font-semibold text-[10px] uppercase tracking-wider text-foreground block">
              Step 2: Source Type Selection
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label
                className={`border p-4 rounded-lg cursor-pointer flex items-center justify-between transition-colors ${
                  sourceType === "MASTER"
                    ? "border-primary bg-muted shadow-sm"
                    : "border-border bg-background"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="sourceType"
                    checked={sourceType === "MASTER"}
                    onChange={() => setSourceType("MASTER")}
                    className="accent-primary"
                  />
                  <div>
                    <span className="font-semibold text-foreground block">
                      Product Master Catalog
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Pre-validated catalog items with standardized HSN & specs
                    </span>
                  </div>
                </div>
              </label>

              <label
                className={`border p-4 rounded-lg cursor-pointer flex items-center justify-between transition-colors ${
                  sourceType === "MANUAL"
                    ? "border-primary bg-muted shadow-sm"
                    : "border-border bg-background"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="sourceType"
                    checked={sourceType === "MANUAL"}
                    onChange={() => setSourceType("MANUAL")}
                    className="accent-primary"
                  />
                  <div>
                    <span className="font-semibold text-foreground block">
                      Manual / Ad-Hoc Entry
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Bespoke or non-standard project items requiring new specs
                    </span>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Line Items Specification Builder */}
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-border pb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-foreground">
                  Step 3: Line Items Specification
                </span>
                <span className="bg-muted text-foreground text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  {lines.length} Line{lines.length > 1 ? "s" : ""}
                </span>
              </div>

              {sourceType === "MASTER" ? (
                <div className="flex items-center gap-2">
                  <select
                    value={selectedCatalogSku}
                    onChange={(e) => setSelectedCatalogSku(e.target.value)}
                    className="border border-input rounded-md px-2.5 py-1 text-xs bg-background text-foreground"
                  >
                    <option value="">-- Choose from Catalog --</option>
                    {PRODUCT_MASTER_CATALOG.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (₹{p.defaultPrice})
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddCatalogProduct}
                    disabled={!selectedCatalogSku}
                    className="bg-primary text-primary-foreground px-3 py-1 rounded-md font-medium hover:opacity-90 disabled:opacity-50"
                  >
                    Add Product
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleAddManualLine}
                  className="bg-primary text-primary-foreground px-3 py-1 rounded-md font-medium hover:opacity-90 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Custom Line
                </button>
              )}
            </div>

            {/* Line Cards List */}
            <div className="space-y-3">
              {lines.map((line, idx) => (
                <div
                  key={idx}
                  className="border border-border rounded-lg p-4 bg-card shadow-sm space-y-3"
                >
                  <div className="flex justify-between items-center text-[10px] font-medium text-muted-foreground">
                    <span className="bg-muted text-foreground px-2 py-0.5 rounded-md">
                      Line #{idx + 1}
                    </span>
                    {lines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLine(idx)}
                        className="text-red-500 hover:text-red-700 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    )}
                  </div>

                  {/* Product Details Row */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-medium text-muted-foreground block mb-1">
                        Product Description *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Product name, grade, dimension"
                        value={line.productName}
                        onChange={(e) =>
                          handleLineFieldChange(
                            idx,
                            "productName",
                            e.target.value,
                          )
                        }
                        className="w-full bg-background border border-input rounded-md px-2.5 py-1.5 text-xs text-foreground focus:border-ring"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-medium text-muted-foreground block mb-1">
                        HSN Code
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 7216.32"
                        value={line.hsnCode}
                        onChange={(e) =>
                          handleLineFieldChange(idx, "hsnCode", e.target.value)
                        }
                        className="w-full bg-background border border-input rounded-md px-2.5 py-1.5 text-xs font-mono text-foreground focus:border-ring"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-medium text-muted-foreground block mb-1">
                        Target Rate (₹) *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        placeholder="Estimated Unit Price"
                        value={line.targetPrice || ""}
                        onChange={(e) =>
                          handleLineFieldChange(
                            idx,
                            "targetPrice",
                            Number(e.target.value),
                          )
                        }
                        className="w-full bg-background border border-input rounded-md px-2.5 py-1.5 text-xs font-mono font-medium text-foreground focus:border-ring"
                      />
                    </div>
                  </div>

                  {/* Product Clarity Section */}
                  <div className="bg-muted/60 border border-border rounded-md p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-medium uppercase text-foreground flex items-center gap-1">
                        <FileCheck className="w-3.5 h-3.5" /> Product Clarity &
                        Technical Spec
                      </span>
                      <div className="inline-flex bg-background border border-border rounded-md p-0.5">
                        <button
                          type="button"
                          onClick={() =>
                            handleLineFieldChange(idx, "clarityType", "text")
                          }
                          className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                            line.clarityType === "text"
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          Text Spec
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleLineFieldChange(idx, "clarityType", "link")
                          }
                          className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                            line.clarityType === "link"
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          External Link
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleLineFieldChange(idx, "clarityType", "pdf")
                          }
                          className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                            line.clarityType === "pdf"
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          Document / PDF
                        </button>
                      </div>
                    </div>

                    {line.clarityType === "text" && (
                      <textarea
                        rows={2}
                        placeholder="Specify technical tolerances, material composition, coatings, or certification requirements..."
                        value={line.clarityValue}
                        onChange={(e) =>
                          handleLineFieldChange(
                            idx,
                            "clarityValue",
                            e.target.value,
                          )
                        }
                        className="w-full bg-background border border-input rounded-md p-2 text-xs text-foreground focus:border-ring"
                      />
                    )}

                    {line.clarityType === "link" && (
                      <div className="flex items-center gap-2">
                        <Link2 className="w-4 h-4 text-foreground" />
                        <input
                          type="url"
                          placeholder="https://specs.internal/cad-drawings/part-102.pdf"
                          value={line.clarityValue}
                          onChange={(e) =>
                            handleLineFieldChange(
                              idx,
                              "clarityValue",
                              e.target.value,
                            )
                          }
                          className="w-full bg-background border border-input rounded-md px-2.5 py-1.5 text-xs text-foreground"
                        />
                      </div>
                    )}

                    {line.clarityType === "pdf" && (
                      <div className="flex items-center gap-3">
                        <label className="cursor-pointer bg-background border border-dashed border-primary px-3 py-1.5 rounded-md flex items-center gap-2 hover:bg-muted">
                          <Upload className="w-3.5 h-3.5 text-foreground" />
                          <span className="text-[11px] font-medium text-foreground">
                            Upload Spec Sheet (PDF/PNG)
                          </span>
                          <input
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg"
                            onChange={(e) => handleFileUploadMock(idx, e)}
                            className="hidden"
                          />
                        </label>
                        <span className="text-[11px] text-muted-foreground font-mono truncate max-w-xs">
                          {line.fileName || "No file selected (Max 10MB)"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-border flex justify-end gap-3 sticky bottom-0 bg-card">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-input rounded-md font-medium text-foreground hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-md font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <Check className="w-4 h-4" /> Save Sourcing Target
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
