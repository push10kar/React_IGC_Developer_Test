import React, { useState, useEffect } from "react";
import {
  Search,
  Building2,
  Moon,
  Sun,
  Bell,
  Mail,
  ShoppingCart,
  LogOut,
  Maximize2,
  ChevronDown,
  User,
  Check,
  Package,
  FileText,
  Layers,
  ShieldCheck,
  Briefcase,
  LayoutDashboard,
  TrendingUp,
  Truck,
  Database,
  AlertTriangle,
} from "lucide-react";

interface IdimsNavbarProps {
  onSearchChange?: (query: string) => void;
  activeNav: string;
  onNavChange: (route: string) => void;
}

export const IdimsNavbar: React.FC<IdimsNavbarProps> = ({
  onSearchChange,
  activeNav,
  onNavChange,
}) => {
  const [search, setSearch] = useState("");
  const [isBranchOpen, setIsBranchOpen] = useState(false);
  const [activeBranch, setActiveBranch] = useState("All branch");
  const [branchTag, setBranchTag] = useState("ALL");
  const [isBrandTheme, setIsBrandTheme] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [notificationsCount] = useState(3);
  const [inboxCount] = useState(5);
  const [cartCount] = useState(2);

  // Sync Dark Mode & Brand Theme class on body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("idims-dark");
    } else {
      document.body.classList.remove("idims-dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (isBrandTheme) {
      document.body.classList.add("idims-brand");
    } else {
      document.body.classList.remove("idims-brand");
    }
  }, [isBrandTheme]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    if (onSearchChange) onSearchChange(val);
  };

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
    setIsBranchOpen(false);
    setIsProfileOpen(false);
  };

  const branches = [
    {
      id: "b1",
      name: "All branch",
      tag: "ALL",
      sub: "Global • Consolidated View",
    },
    {
      id: "b2",
      name: "Inorbvict healthcare India Pvt Ltd",
      tag: "HEALTHCARE",
      sub: "Medical & Pharma Sourcing • Mumbai",
    },
    {
      id: "b3",
      name: "Inorbvict Agrotech India Pvt Ltd",
      tag: "AGROTECH",
      sub: "Agri Tech & Equipment • Pune",
    },
    {
      id: "b4",
      name: "Inorbvict Vortex Corporation",
      tag: "CORPORATION",
      sub: "Enterprise Sourcing • New Delhi",
    },
  ];

  return (
    <>
      <header className="idims-nav">
        <div className="idims-nav-stack">
          {/* TOP ROW */}
          <div className="idims-nav-row idims-row-top">
            {/* LOGO */}
            <div className="flex items-center gap-3">
              <a href="#" className="idims-logo" onClick={(e) => { e.preventDefault(); onNavChange("p2p"); }}>
                <img
                  src="/download.png"
                  alt="IGC Logo"
                  className="h-8 w-auto object-contain hover:scale-105 transition-transform"
                />
              </a>

              <div className="idims-divider" />

              {/* SEARCH BAR */}
              <div className="idims-search">
                <Search className="w-4 h-4 idims-search-ico" />
                <input
                  type="text"
                  placeholder="Search modules, contracts, parties, documents..."
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="idims-search-input"
                />
                <span className="idims-search-kbd">⌘K</span>
              </div>
            </div>

            {/* TOP RIGHT CONTROLS */}
            <div className="flex items-center gap-3">
              {/* BRANCH SWITCHER */}
              <div className="idims-branch-wrap">
                <button
                  onClick={() => {
                    setIsBranchOpen(!isBranchOpen);
                    setActiveDropdown(null);
                    setIsProfileOpen(false);
                  }}
                  className={`idims-branch-btn ${isBranchOpen ? "dd-open" : ""}`}
                >
                  <div className="idims-branch-ico">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="idims-branch-meta">
                    <span className="idims-branch-name">{activeBranch}</span>
                    <span className="idims-branch-tag">{branchTag}</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 idims-branch-chev ml-auto" />
                </button>

                {isBranchOpen && (
                  <div className="idims-branch-panel">
                    <div className="px-4 py-2.5 bg-[#F8FAFC] border-b border-[#E2E8F0] text-[10px] font-extrabold tracking-wider text-[#64748B] uppercase">
                      Switch Active Organization Branch
                    </div>
                    <div className="p-1.5 space-y-1">
                      {branches.map((b) => (
                        <div
                          key={b.id}
                          onClick={() => {
                            setActiveBranch(b.name);
                            setBranchTag(b.tag);
                            setIsBranchOpen(false);
                          }}
                          className={`idims-branch-item ${
                            activeBranch === b.name ? "active" : ""
                          }`}
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#E0FBFF] text-[#0891B2] font-black text-xs flex items-center justify-center flex-shrink-0">
                            {b.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[#0F172A] truncate">
                                {b.name}
                              </span>
                              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-[#ECFEFF] text-[#0891B2] border border-[#A5F3FC]">
                                {b.tag}
                              </span>
                            </div>
                            <p className="text-[10px] text-[#64748B]">{b.sub}</p>
                          </div>
                          {activeBranch === b.name && (
                            <Check className="w-4 h-4 text-[#0891B2] flex-shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* THEME TOGGLE */}
              <div className="idims-theme-switch" title="Toggle Brand Theme Accent">
                <span className="text-[11px] font-extrabold text-[#64748B]">
                  {isBrandTheme ? "Brand (IGC)" : "Default"}
                </span>
                <button
                  onClick={() => setIsBrandTheme(!isBrandTheme)}
                  className="idims-theme-toggle"
                  aria-label="Toggle Brand Theme"
                />
              </div>

              {/* DARK MODE TOGGLE */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="idims-action-btn"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4 text-[#F59E0B]" />
                ) : (
                  <Moon className="w-4 h-4 text-[#64748B]" />
                )}
              </button>

              {/* ACTION ICONS: Fullscreen, Inbox, Bell, Cart */}
              <div className="idims-actions">
                <button
                  onClick={() => {
                    if (!document.fullscreenElement) {
                      document.documentElement.requestFullscreen();
                    } else {
                      document.exitFullscreen();
                    }
                  }}
                  className="idims-action-btn"
                  title="Toggle Fullscreen Mode"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                {/* INBOX ICON BEFORE BELL */}
                <button className="idims-action-btn" title="Inbox & Messages">
                  <Mail className="w-4 h-4" />
                  {inboxCount > 0 && <span className="idims-action-badge bg-[#0891B2]" />}
                </button>

                {/* BELL ICON */}
                <button className="idims-action-btn" title="Notifications">
                  <Bell className="w-4 h-4" />
                  {notificationsCount > 0 && <span className="idims-action-badge" />}
                </button>

                {/* CART ICON AFTER BELL */}
                <button className="idims-action-btn" title="Requisition Cart">
                  <ShoppingCart className="w-4 h-4" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#0891B2] text-white text-[9px] font-black flex items-center justify-center border border-white">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>

              <div className="w-[1px] h-6 bg-[#E2E8F0]" />

              {/* PROFILE DROPDOWN TRIGGER */}
              <div className="idims-profile-wrap">
                <button
                  onClick={() => {
                    setIsProfileOpen(!isProfileOpen);
                    setIsBranchOpen(false);
                    setActiveDropdown(null);
                  }}
                  className="idims-profile-btn"
                >
                  <div className="idims-avatar">PS</div>
                  <span className="idims-profile-name">Pushkar Sharma</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
                </button>

                {isProfileOpen && (
                  <div className="idims-profile-panel">
                    <div className="idims-profile-head">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-black text-sm text-white">
                          PS
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-white">
                            Pushkar Sharma
                          </h4>
                          <p className="text-[11px] text-white/80 font-medium">
                            Senior React / Fullstack Engineer
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2 divide-y divide-[#F1F5F9]">
                      <div className="py-1">
                        <button
                          onClick={() => setIsProfileOpen(false)}
                          className="w-full text-left px-3 py-2 text-xs font-bold text-[#334155] hover:bg-[#F8FAFC] rounded-lg flex items-center gap-2"
                        >
                          <User className="w-4 h-4 text-[#0891B2]" /> User Profile & Settings
                        </button>
                        <button
                          onClick={() => setIsProfileOpen(false)}
                          className="w-full text-left px-3 py-2 text-xs font-bold text-[#334155] hover:bg-[#F8FAFC] rounded-lg flex items-center gap-2"
                        >
                          <ShieldCheck className="w-4 h-4 text-[#0891B2]" /> Role Permissions & Access
                        </button>
                      </div>
                      <div className="pt-1">
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            setIsLogoutModalOpen(true);
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-bold text-[#EF4444] hover:bg-[#FEF2F2] rounded-lg flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out of IDIMS
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* BOTTOM ROW — MAIN NAVIGATION BAR */}
          <div className="idims-nav-row idims-row-bottom">
            <nav className="idims-nav-items">
              <button
                onClick={() => {
                  onNavChange("dashboard");
                  setActiveDropdown(null);
                }}
                className={`idims-nav-btn ${activeNav === "dashboard" ? "nav-active" : ""}`}
              >
                <LayoutDashboard className="w-4 h-4 idims-ico" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => {
                  onNavChange("vault");
                  setActiveDropdown(null);
                }}
                className={`idims-nav-btn ${activeNav === "vault" ? "nav-active" : ""}`}
              >
                <ShieldCheck className="w-4 h-4 idims-ico" />
                <span>Credentials Vault</span>
              </button>

              <button
                onClick={() => {
                  onNavChange("projects");
                  setActiveDropdown(null);
                }}
                className={`idims-nav-btn ${activeNav === "projects" ? "nav-active" : ""}`}
              >
                <Layers className="w-4 h-4 idims-ico" />
                <span>Project Navigator</span>
              </button>

              <button
                onClick={() => {
                  onNavChange("hrms");
                  setActiveDropdown(null);
                }}
                className={`idims-nav-btn ${activeNav === "hrms" ? "nav-active" : ""}`}
              >
                <Briefcase className="w-4 h-4 idims-ico" />
                <span>HRMS</span>
              </button>

              <button
                onClick={() => {
                  onNavChange("sales");
                  setActiveDropdown(null);
                }}
                className={`idims-nav-btn ${activeNav === "sales" ? "nav-active" : ""}`}
              >
                <TrendingUp className="w-4 h-4 idims-ico" />
                <span>Sales Matrix</span>
              </button>

              <button
                onClick={() => {
                  onNavChange("clm");
                  toggleDropdown("clm");
                }}
                className={`idims-nav-btn ${
                  activeNav === "clm" || activeDropdown === "clm"
                    ? "nav-active dd-open"
                    : ""
                }`}
              >
                <FileText className="w-4 h-4 idims-ico" />
                <span>CLM</span>
                <ChevronDown className="w-3 h-3 dd-chev" />
              </button>

              {/* PROCURE TO PAY (P2P) - ACTIVE MODULE */}
              <div className="relative">
                <button
                  onClick={() => {
                    onNavChange("p2p");
                    toggleDropdown("p2p");
                  }}
                  className={`idims-nav-btn ${
                    activeNav === "p2p" || activeDropdown === "p2p"
                      ? "nav-active dd-open"
                      : ""
                  }`}
                >
                  <ShoppingCart className="w-4 h-4 idims-ico" />
                  <span>Procure to Pay (P2P)</span>
                  <span className="ml-1 text-[9px] font-black px-1.5 py-0.2 bg-[#ECFEFF] text-[#0891B2] rounded-full border border-[#A5F3FC]">
                    ACTIVE
                  </span>
                  <ChevronDown className="w-3 h-3 dd-chev" />
                </button>

                {activeDropdown === "p2p" && (
                  <div className="idims-dropdown p-3 w-80 space-y-1">
                    <div className="px-3 py-1.5 text-[10px] font-black uppercase text-[#0891B2] tracking-wider border-b border-[#E0FBFF] mb-1">
                      P2P Sourcing Modules
                    </div>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavChange("p2p");
                        setActiveDropdown(null);
                      }}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#ECFEFF] transition-colors bg-[#F0FDFF] border border-[#A5F3FC]"
                    >
                      <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-[#0891B2] to-[#22D3EE] text-white flex items-center justify-center font-bold flex-shrink-0">
                        <Package className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-[#0C4A6E]">
                          Bulk Sourcing Management
                        </div>
                        <p className="text-[10px] text-[#0E7490] mt-0.5">
                          Line-item target specs & mapped vendor price negotiations.
                        </p>
                      </div>
                    </a>

                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F8FAFC] transition-colors opacity-75"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] text-[#64748B] flex items-center justify-center font-bold flex-shrink-0">
                        <ShoppingCart className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#334155]">
                          Purchase Orders & Invoicing
                        </div>
                        <p className="text-[10px] text-[#94A3B8] mt-0.5">
                          PO releases, 3-way matching & automated payment release.
                        </p>
                      </div>
                    </a>
                  </div>
                )}
              </div>

              {/* GTS (E-Docs) */}
              <div className="relative">
                <button
                  onClick={() => {
                    onNavChange("gts");
                    toggleDropdown("gts");
                  }}
                  className={`idims-nav-btn ${
                    activeNav === "gts" || activeDropdown === "gts"
                      ? "nav-active dd-open"
                      : ""
                  }`}
                >
                  <FileText className="w-4 h-4 idims-ico" />
                  <span>GTS (E-Docs)</span>
                  <ChevronDown className="w-3 h-3 dd-chev" />
                </button>

                {activeDropdown === "gts" && (
                  <div className="idims-dropdown p-3 w-72 space-y-1">
                    <div className="px-3 py-1.5 text-[10px] font-black uppercase text-[#0891B2] tracking-wider border-b border-[#E0FBFF] mb-1">
                      Trade & Compliance Docs
                    </div>
                    <div className="p-2 text-xs text-[#64748B]">
                      Customs, Bills of Lading & Export Compliance Vault.
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  onNavChange("wms");
                  setActiveDropdown(null);
                }}
                className={`idims-nav-btn ${activeNav === "wms" ? "nav-active" : ""}`}
              >
                <Package className="w-4 h-4 idims-ico" />
                <span>Inventory (WMS)</span>
              </button>

              <button
                onClick={() => {
                  onNavChange("shipment");
                  setActiveDropdown(null);
                }}
                className={`idims-nav-btn ${
                  activeNav === "shipment" ? "nav-active" : ""
                }`}
              >
                <Truck className="w-4 h-4 idims-ico" />
                <span>Shipment 360</span>
              </button>

              <button
                onClick={() => {
                  onNavChange("master");
                  setActiveDropdown(null);
                }}
                className={`idims-nav-btn ${activeNav === "master" ? "nav-active" : ""}`}
              >
                <Database className="w-4 h-4 idims-ico" />
                <span>Master Data</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* LOGOUT CONFIRMATION MODAL */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-150 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF2F2] border border-[#FEE2E2] text-[#EF4444] flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-[#0F172A]">
                Confirm Sign Out
              </h3>
              <p className="text-xs text-[#64748B]">
                Are you sure you want to end your current IDIMS Bulk Sourcing session?
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#475569] hover:bg-[#F8FAFC]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsLogoutModalOpen(false);
                  alert("Logged out of IDIMS Enterprise");
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#EF4444] text-white text-xs font-black shadow-md hover:bg-[#DC2626]"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
