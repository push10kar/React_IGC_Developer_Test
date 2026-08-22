import React, { useState, useMemo, useEffect } from "react";
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
  X,
} from "lucide-react";
import { useSourcing } from "../context/SourcingContext";
import type { SourcingTarget } from "../types/sourcing";

interface Props {
  onOpenAssignModal: () => void;
  onOpenMappingModal: (target: SourcingTarget, lineId?: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const TargetDashboard: React.FC<Props> = ({
  onOpenAssignModal,
  onOpenMappingModal,
  searchQuery: externalSearchQuery,
  onSearchChange: externalOnSearchChange,
}) => {
  const { targets, stats, currentUser } = useSourcing();
  const [activeTab, setActiveTab] = useState<"ALL" | "ASSIGNED">("ALL");
  const [internalSearchQuery, setInternalSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "In Progress" | "Completed"
  >("ALL");

  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  const setSearchQuery = (val: string) => {
    if (externalOnSearchChange) {
      externalOnSearchChange(val);
    } else {
      setInternalSearchQuery(val);
    }
  };

  const searchInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
      <div className="bg-card text-card-foreground border border-border rounded-lg p-3.5 shadow-sm flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        <div className="inline-flex bg-muted border border-border p-1 rounded-lg w-full md:w-auto justify-stretch">
          <button
            onClick={() => setActiveTab("ALL")}
            className={`flex-1 md:flex-none px-4 py-2 rounded-md text-xs font-semibold transition-colors flex items-center justify-center gap-2 ${
              activeTab === "ALL"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>All Targets</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                activeTab === "ALL"
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-background text-foreground"
              }`}
            >
              {stats.totalTargets}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("ASSIGNED")}
            className={`flex-1 md:flex-none px-4 py-2 rounded-md text-xs font-semibold transition-colors flex items-center justify-center gap-2 ${
              activeTab === "ASSIGNED"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Assigned to Me</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                activeTab === "ASSIGNED"
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-background text-foreground"
              }`}
            >
              {stats.assignedTargets}
            </span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 w-full md:max-w-xl">
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search targets by ID, title, product name or HSN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-input rounded-md pl-10 pr-16 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-flex absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-[9px]">⌘</span>K
              </kbd>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="flex-1 sm:flex-none bg-background border border-input rounded-md px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring"
            >
              <option value="ALL">All Statuses</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            <button
              onClick={onOpenAssignModal}
              className="bg-primary text-primary-foreground px-4 py-2.5 rounded-md font-semibold text-xs flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity whitespace-nowrap flex-1 sm:flex-none"
            >
              <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Assign Sourcing Target</span><span className="sm:hidden">Assign</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-card text-card-foreground border border-border rounded-lg overflow-hidden shadow-sm">
        {filteredTargets.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-lg bg-muted border border-border mx-auto flex items-center justify-center text-foreground">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-sm text-foreground">
              No Sourcing Targets Found
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              No records match the current filter or search parameters. Try
              adjusting your query or assign a new target.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
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
                  className="p-5 hover:bg-muted/50 transition-colors space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-muted text-foreground font-semibold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="font-mono font-semibold text-xs text-foreground bg-muted border border-border px-2.5 py-0.5 rounded-md">
                        {target.sourcingId}
                      </span>
                      <h3 className="font-semibold text-sm text-foreground tracking-tight">
                        {target.title}
                      </h3>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider bg-muted text-muted-foreground border border-border">
                        {target.sourceType}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <User className="w-3.5 h-3.5" />
                        <span>
                          Created:{" "}
                          <strong className="text-foreground font-medium">
                            {target.createdByName}
                          </strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-border" />
                        <span>
                          Assigned:{" "}
                          <strong className="text-foreground font-medium">
                            {target.assignedToName}
                          </strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                          Due:{" "}
                          <strong className="text-foreground font-medium">
                            {target.dueDate}
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/60 border border-border rounded-lg p-3.5 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex-1 min-w-[240px]">
                      <div className="flex justify-between items-center text-xs font-medium mb-1.5">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <span>Sourcing Fulfillment:</span>
                          <span className="text-foreground">
                            {completedLines} Done
                          </span>
                          <span className="text-border">/</span>
                          <span>
                            {pendingLines} Pending
                          </span>
                        </span>
                        <span className="text-foreground">
                          {percentage}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider bg-background text-muted-foreground border border-border">
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {isAllDone ? "Target Closed" : "In Progress"}
                      </span>

                      <button
                        onClick={() => onOpenMappingModal(target)}
                        className="bg-primary text-primary-foreground px-3.5 py-1.5 rounded-md font-semibold text-xs flex items-center gap-1.5 hover:opacity-90 transition-opacity"
                      >
                        <span>Sourcing Workspace</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-1 flex justify-between">
                      <span>Requirement Specifications</span>
                      <span>Target Price & Mapped Vendors</span>
                    </div>

                    <div className="divide-y divide-border border border-border rounded-lg overflow-hidden bg-card">
                      {target.lines.map((line) => (
                        <div
                          key={line.id}
                          className="p-3 flex flex-wrap items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="mt-0.5">
                              {line.isCompleted ? (
                                <CheckCircle2 className="w-4 h-4 text-foreground" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-muted-foreground" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground">
                                  {line.productName}
                                </span>
                                <span className="font-mono text-[10px] bg-muted border border-border px-1.5 py-0.5 rounded-sm text-muted-foreground">
                                  HSN: {line.hsnCode}
                                </span>
                              </div>
                              <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                <span className="font-medium">
                                  Clarity ({line.clarity.type}):
                                </span>
                                <span>{line.clarity.value}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <span className="text-[9px] uppercase font-medium text-muted-foreground block">
                                Target Rate
                              </span>
                              <span className="font-mono font-semibold text-xs text-foreground">
                                ₹{line.targetPrice.toLocaleString()}
                              </span>
                            </div>

                            <button
                              onClick={() =>
                                onOpenMappingModal(target, line.id)
                              }
                              className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                                line.mappings.length > 0
                                  ? "bg-muted border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary"
                                  : "bg-background border-input text-muted-foreground hover:border-foreground hover:text-foreground"
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
