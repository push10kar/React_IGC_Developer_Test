import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ChevronRight,
  Layers,
  Filter,
  X,
  ExternalLink,
  Edit2,
} from "lucide-react";
import { useSourcing } from "../context/SourcingContext";
import type { SourcingTarget } from "../types/sourcing";

interface Props {
  onOpenAssignModal: () => void;
  onOpenMappingModal: (target: SourcingTarget, lineId?: string) => void;
}

export const TargetDashboard: React.FC<Props> = ({
  onOpenAssignModal,
  onOpenMappingModal,
}) => {
  const { targets, stats, currentUser } = useSourcing();
  const [activeTab, setActiveTab] = useState<"ALL" | "ASSIGNED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "In Progress" | "Completed"
  >("ALL");

  const filteredTargets = useMemo(() => {
    return targets.filter((target) => {
      if (activeTab === "ASSIGNED" && target.assignedToName !== currentUser) {
        return false;
      }

      if (statusFilter !== "ALL" && target.status !== statusFilter) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesId = target.sourcingId.toLowerCase().includes(query);
        const matchesTitle = target.title.toLowerCase().includes(query);
        const matchesProduct = target.lines.some(
          (l) =>
            l.productName.toLowerCase().includes(query) ||
            l.hsnCode.toLowerCase().includes(query),
        );
        if (!matchesId && !matchesTitle && !matchesProduct) {
          return false;
        }
      }

      return true;
    });
  }, [targets, activeTab, statusFilter, searchQuery, currentUser]);

  return (
    <div className="space-y-4">
      <div className="bg-white border border-[#D6EEF5] rounded-2xl p-3.5 shadow-sm flex flex-wrap justify-between items-center gap-4">
        <div className="inline-flex bg-[#EEF7FA] border border-[#D8EEF4] p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("ALL")}
            className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeTab === "ALL"
                ? "bg-linear-to-r from-[#22D3EE] via-[#0891B2] to-[#0E7490] text-white shadow-sm" 
                : "text-[#5B7585] hover:text-[#0E7490]"
            }`}
          >
            <span>All Targets</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === "ALL"
                  ? "bg-white/25 text-white"
                  : "bg-[#E0FBFF] text-[#0E7490]"
              }`}
            >
              {stats.totalTargets}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("ASSIGNED")}
            className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeTab === "ASSIGNED"
                ? "bg-linear-to-r from-[#22D3EE] via-[#0891B2] to-[#0E7490] text-white shadow-sm" 
                : "text-[#5B7585] hover:text-[#0E7490]"
            }`}
          >
            <span>Assigned to Me</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === "ASSIGNED"
                  ? "bg-white/25 text-white"
                  : "bg-[#E0FBFF] text-[#0E7490]"
              }`}
            >
              {stats.assignedTargets}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94B2BF]" />
            <input
              type="text"
              placeholder="Search targets by ID, title, product name or HSN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F7FDFE] border border-[#D8EEF4] rounded-xl pl-10 pr-9 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#22D3EE] focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94B2BF] hover:text-[#475569]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-[#F7FDFE] border border-[#D8EEF4] rounded-xl px-3 py-2 text-xs font-bold text-[#0E7490] focus:outline-none focus:border-[#22D3EE]"
          >
            <option value="ALL">All Statuses</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <button
            onClick={onOpenAssignModal}
            className="bg-linear-to-r from-[#22D3EE] via-[#0891B2] to-[#0E7490] text-white px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 shadow-md hover:brightness-105 transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Assign Sourcing Target
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#D6EEF5] rounded-2xl overflow-hidden shadow-sm">
        {filteredTargets.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#ECFEFF] border border-[#A5F3FC] mx-auto flex items-center justify-center text-[#0891B2]">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-sm text-[#0C4A6E]">
              No Sourcing Targets Found
            </h3>
            <p className="text-xs text-[#8B9BB0] max-w-sm mx-auto">
              No records match the current filter or search parameters. Try
              adjusting your query or assign a new target.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#EFF5F8]">
            {filteredTargets.map((target, idx) => {
              const totalLines = target.lines.length;
              const completedLines = target.lines.filter(
                (l) => l.isCompleted,
              ).length;
              const pendingLines = totalLines - completedLines;
              const percentage =
                totalLines > 0
                  ? Math.round((completedLines / totalLines) * 100)
                  : 0;
              const isAllDone = totalLines > 0 && completedLines === totalLines;

              return (
                <div
                  key={target.id}
                  className="p-5 hover:bg-[#F8FCFD] transition-colors space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#E0FBFF] text-[#0891B2] font-black text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="font-mono font-extrabold text-xs text-[#0891B2] bg-[#ECFEFF] border border-[#A5F3FC] px-2.5 py-0.5 rounded-md">
                        {target.sourcingId}
                      </span>
                      <h3 className="font-black text-sm text-[#0C4A6E] tracking-tight">
                        {target.title}
                      </h3>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          target.sourceType === "MASTER"
                            ? "bg-[#E0FBFF] text-[#0E7490] border border-[#BDF0F7]"
                            : "bg-[#F3EDFF] text-[#7C3AED] border border-[#DDD0FB]"
                        }`}
                      >
                        {target.sourceType}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1.5 text-[#64748B]">
                        <User className="w-3.5 h-3.5 text-[#94B2BF]" />
                        <span>
                          Created:{" "}
                          <strong className="text-[#1E293B]">
                            {target.createdByName}
                          </strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#64748B]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#CBD5E1]" />
                        <span>
                          Assigned:{" "}
                          <strong className="text-[#1E293B]">
                            {target.assignedToName}
                          </strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#64748B]">
                        <Clock className="w-3.5 h-3.5 text-[#94B2BF]" />
                        <span>
                          Due:{" "}
                          <strong className="text-[#1E293B]">
                            {target.dueDate}
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#F8FCFD] border border-[#E6F3F7] rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex-1 min-w-[240px]">
                      <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                        <span className="text-[#5B7585] flex items-center gap-2">
                          <span>Sourcing Fulfillment:</span>
                          <span className="text-[#16A34A]">
                            {completedLines} Done
                          </span>
                          <span className="text-[#CBD5E1]">/</span>
                          <span className="text-[#EA7A0C]">
                            {pendingLines} Pending
                          </span>
                        </span>
                        <span
                          className={
                            isAllDone ? "text-[#16A34A]" : "text-[#0891B2]"
                          }
                        >
                          {percentage}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-[#E6EEF2] rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            isAllDone
                              ? "bg-linear-to-r from-[#4ADE80] to-[#16A34A]" 
                              : "bg-linear-to-r from-[#22D3EE] to-[#0891B2]"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                          isAllDone
                            ? "bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]"
                            : "bg-[#CFFAFE] text-[#0E7490] border border-[#A5F3FC]"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {isAllDone ? "Target Closed" : "In Progress"}
                      </span>

                      <button
                        onClick={() => onOpenMappingModal(target)}
                        className="bg-linear-to-r from-[#22D3EE] via-[#0891B2] to-[#0E7490] text-white px-3.5 py-1.5 rounded-lg font-extrabold text-xs flex items-center gap-1.5 shadow-sm hover:brightness-105 transition-all"
                      >
                        <span>Sourcing Workspace</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#7C93AE] px-1 flex justify-between">
                      <span>Requirement Specifications</span>
                      <span>Target Price & Mapped Vendors</span>
                    </div>

                    <div className="divide-y divide-[#F1F5F9] border border-[#E4EFF5] rounded-xl overflow-hidden bg-white">
                      {target.lines.map((line) => (
                        <div
                          key={line.id}
                          className="p-3 flex flex-wrap items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="mt-0.5">
                              {line.isCompleted ? (
                                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-[#EA7A0C]" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-[#0F172A]">
                                  {line.productName}
                                </span>
                                <span className="font-mono text-[10px] bg-[#F8FAFC] border border-[#E2E8F0] px-1.5 py-0.2 rounded text-[#475569]">
                                  HSN: {line.hsnCode}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#64748B] mt-0.5 flex items-center gap-1">
                                <FileText className="w-3 h-3 text-[#94A3B8]" />
                                <span className="font-medium text-[#7C8499]">
                                  Clarity ({line.clarity.type}):
                                </span>
                                <span>{line.clarity.value}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <span className="text-[9px] uppercase font-bold text-[#94A3B8] block">
                                Target Rate
                              </span>
                              <span className="font-mono font-extrabold text-xs text-[#0C4A6E]">
                                ₹{line.targetPrice.toLocaleString()}
                              </span>
                            </div>

                            <button
                              onClick={() =>
                                onOpenMappingModal(target, line.id)
                              }
                              className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 ${
                                line.mappings.length > 0
                                  ? "bg-[#ECFEFF] border-[#A5F3FC] text-[#0891B2] hover:bg-[#0891B2] hover:text-white"
                                  : "bg-white border-[#E2E8F0] text-[#64748B] hover:border-[#0891B2] hover:text-[#0891B2]"
                              }`}
                            >
                              <span>
                                {line.mappings.length > 0
                                  ? `${line.mappings.length} Mapped`
                                  : "Map Supplier"}
                              </span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
