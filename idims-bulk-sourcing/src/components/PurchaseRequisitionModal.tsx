import React, { useState } from "react";
import {
  ShoppingCart,
  CheckCircle2,
  FileCheck,
  Building2,
  Send,
  X,
  CreditCard,
  Building,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PurchaseRequisitionModal: React.FC<Props> = ({
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState<"review" | "submitted">("review");
  const [department, setDepartment] = useState("Industrial Procurement");
  const [costCenter, setCostCenter] = useState("CC-IN-4092 (Plant Infrastructure)");
  const [priority, setPriority] = useState("High");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleSubmitRequisition = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("submitted");
  };

  const handleDone = () => {
    setStep("review");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card text-card-foreground rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl border border-border">
        {/* Header */}
        <div className="bg-muted px-6 py-4 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Purchase Requisition Checkout
              </h2>
              <p className="text-xs text-muted-foreground">
                Generate official internal SAP PR document for approved items
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-accent rounded-md text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {step === "review" ? (
          <form onSubmit={handleSubmitRequisition} className="p-6 space-y-5">
            {/* Cart Summary Card */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Selected Line Items (2)
              </h3>
              <div className="bg-muted/40 rounded-lg border border-border divide-y divide-border overflow-hidden">
                <div className="p-3 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-semibold text-foreground">
                      Epoxy Primer Coating Grade A (20L)
                    </span>
                    <p className="text-[11px] text-muted-foreground">
                      SKU: PM-103 • HSN 3208.90 • Qty: 2 units
                    </p>
                  </div>
                  <span className="font-mono font-semibold text-foreground">
                    ₹7,600
                  </span>
                </div>
                <div className="p-3 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-semibold text-foreground">
                      Stainless Steel Flange 150# ANSI 4"
                    </span>
                    <p className="text-[11px] text-muted-foreground">
                      SKU: PM-105 • HSN 7307.21 • Qty: 1 unit
                    </p>
                  </div>
                  <span className="font-mono font-semibold text-foreground">
                    ₹1,950
                  </span>
                </div>
                <div className="p-3 bg-muted/80 flex justify-between items-center text-xs font-semibold">
                  <span className="text-foreground">Total Requisition Estimate:</span>
                  <span className="text-sm font-mono text-primary font-bold">
                    ₹9,550.00
                  </span>
                </div>
              </div>
            </div>

            {/* Procurement Allocation Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-muted-foreground" /> Target Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-background border border-input rounded-md px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option>Industrial Procurement</option>
                  <option>Plant Engineering & Operations</option>
                  <option>Quality Assurance & Testing</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-muted-foreground" /> Cost Center Allocation
                </label>
                <select
                  value={costCenter}
                  onChange={(e) => setCostCenter(e.target.value)}
                  className="w-full bg-background border border-input rounded-md px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option>CC-IN-4092 (Plant Infrastructure)</option>
                  <option>CC-IN-1008 (Raw Materials & Spares)</option>
                  <option>CC-IN-8820 (Capital Expenditures)</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Justification & Technical Remarks
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="E.g., Urgent replenishment for Scheduled Outrage Maintenance in Q3..."
                rows={2}
                className="w-full bg-background border border-input rounded-md px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-border flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-input rounded-md text-xs font-medium hover:bg-accent text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-primary text-primary-foreground rounded-md text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" /> Generate SAP Requisition
              </button>
            </div>
          </form>
        ) : (
          /* Success Screen */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="font-mono text-xs bg-muted border border-border px-3 py-1 rounded-full font-semibold text-emerald-600 dark:text-emerald-400">
                PR Number: PR-2026-90421
              </span>
              <h3 className="text-lg font-semibold text-foreground">
                Purchase Requisition Submitted
              </h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Requisition PR-2026-90421 has been submitted to ERP. A notification has been sent to the Finance & Approvals team.
              </p>
            </div>

            <div className="bg-muted/40 p-4 rounded-lg border border-border text-left max-w-md mx-auto space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Allocated Cost Center:</span>
                <span className="font-semibold text-foreground">{costCenter}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Authorized Amount:</span>
                <span className="font-mono font-bold text-primary">₹9,550.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Approval Flow:</span>
                <span className="text-emerald-500 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Auto-Routed to Lead
                </span>
              </div>
            </div>

            <button
              onClick={handleDone}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-md text-xs font-semibold hover:opacity-90 transition-opacity mx-auto flex items-center gap-2"
            >
              Return to Sourcing Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
