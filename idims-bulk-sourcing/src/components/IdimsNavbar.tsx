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
  Minimize2,
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
  searchQuery?: string;
  activeNav: string;
  onNavChange: (route: string) => void;
}

export const IdimsNavbar: React.FC<IdimsNavbarProps> = ({
  onSearchChange,
  searchQuery = "",
  activeNav,
  onNavChange,
}) => {
  const navSearchInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        navSearchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  const [search, setSearch] = useState("");
  const [isBranchOpen, setIsBranchOpen] = useState(false);
  const [activeBranch, setActiveBranch] = useState("All branch");
  const [branchTag, setBranchTag] = useState("ALL");
  const [isBrandTheme, setIsBrandTheme] = useState(
    () =>
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("brand"),
  );
  const [isDarkMode, setIsDarkMode] = useState(
    () =>
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark"),
  );
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [notificationsCount] = useState(3);
  const [inboxCount] = useState(5);
  const [cartCount] = useState(2);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const fsElement =
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement;
      setIsFullscreen(!!fsElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    const doc = document as any;
    const docEl = document.documentElement as any;

    const fsElement =
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement;

    if (!fsElement) {
      const reqFs =
        docEl.requestFullscreen ||
        docEl.webkitRequestFullscreen ||
        docEl.mozRequestFullScreen ||
        docEl.msRequestFullscreen;

      if (reqFs) {
        reqFs.call(docEl).catch((err: any) => {
          console.warn("Fullscreen request denied or not supported:", err);
        });
      }
    } else {
      const exitFs =
        doc.exitFullscreen ||
        doc.webkitExitFullscreen ||
        doc.mozCancelFullScreen ||
        doc.msExitFullscreen;

      if (exitFs) {
        exitFs.call(doc).catch((err: any) => {
          console.warn("Exit fullscreen failed:", err);
        });
      }
    }
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("idims-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    document.documentElement.classList.toggle("brand", isBrandTheme);
    localStorage.setItem("idims-brand", isBrandTheme ? "1" : "0");
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
              <a
                href="#"
                className="idims-logo"
                onClick={(e) => {
                  e.preventDefault();
                  onNavChange("p2p");
                }}
              >
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
                  ref={navSearchInputRef}
                  type="text"
                  placeholder="Search targets by ID, title, product or HSN..."
                  value={searchQuery || search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    handleSearchChange(e.target.value);
                  }}
                  className="idims-search-input"
                />
                <kbd className="idims-search-kbd">⌘K</kbd>
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
                    <div className="px-4 py-2.5 bg-muted border-b border-border text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
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
                          <div className="w-8 h-8 rounded-md bg-muted text-foreground font-semibold text-xs flex items-center justify-center flex-shrink-0">
                            {b.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-foreground truncate">
                                {b.name}
                              </span>
                              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-sm bg-muted text-muted-foreground border border-border">
                                {b.tag}
                              </span>
                            </div>
                            <p className="text-[10px] text-muted-foreground">
                              {b.sub}
                            </p>
                          </div>
                          {activeBranch === b.name && (
                            <Check className="w-4 h-4 text-foreground flex-shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* THEME TOGGLE */}
              <div
                className="idims-theme-switch"
                title="Toggle Brand Theme Accent"
              >
                <span className="text-[11px] font-medium text-muted-foreground">
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
                title={
                  isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
                }
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>

              {/* ACTION ICONS: Fullscreen, Inbox, Bell, Cart */}
              <div className="idims-actions">
                <button
                  onClick={toggleFullscreen}
                  className="idims-action-btn"
                  title={isFullscreen ? "Exit Fullscreen" : "Toggle Fullscreen Mode"}
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                {/* INBOX ICON BEFORE BELL */}
                <button className="idims-action-btn" title="Inbox & Messages">
                  <Mail className="w-4 h-4" />
                  {inboxCount > 0 && (
                    <span className="idims-action-badge" />
                  )}
                </button>

                {/* BELL ICON */}
                <button className="idims-action-btn" title="Notifications">
                  <Bell className="w-4 h-4" />
                  {notificationsCount > 0 && (
                    <span className="idims-action-badge" />
                  )}
                </button>

                {/* CART ICON AFTER BELL */}
                <button className="idims-action-btn" title="Requisition Cart">
                  <ShoppingCart className="w-4 h-4" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-semibold flex items-center justify-center border border-background">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>

              <div className="w-px h-6 bg-border" />

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
                  <div className="idims-avatar">RM</div>
                  <span className="idims-profile-name">Rajesh Meshram</span>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                </button>

                {isProfileOpen && (
                  <div className="idims-profile-panel">
                    <div className="idims-profile-head">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                          RM
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-foreground">
                            Rajesh Meshram
                          </h4>
                          <p className="text-[11px] text-muted-foreground font-medium">
                            Senior React / Fullstack Engineer
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2 divide-y divide-border">
                      <div className="py-1">
                        <button
                          onClick={() => setIsProfileOpen(false)}
                          className="w-full text-left px-3 py-2 text-xs font-medium text-foreground hover:bg-accent rounded-md flex items-center gap-2"
                        >
                          <User className="w-4 h-4 text-muted-foreground" /> User
                          Profile & Settings
                        </button>
                        <button
                          onClick={() => setIsProfileOpen(false)}
                          className="w-full text-left px-3 py-2 text-xs font-medium text-foreground hover:bg-accent rounded-md flex items-center gap-2"
                        >
                          <ShieldCheck className="w-4 h-4 text-muted-foreground" />{" "}
                          Role Permissions & Access
                        </button>
                      </div>
                      <div className="pt-1">
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            setIsLogoutModalOpen(true);
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-medium text-destructive hover:bg-accent rounded-md flex items-center gap-2"
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
                  <span className="ml-1 text-[9px] font-semibold px-1.5 py-0.5 bg-muted text-muted-foreground rounded-full border border-border">
                    ACTIVE
                  </span>
                  <ChevronDown className="w-3 h-3 dd-chev" />
                </button>

                {activeDropdown === "p2p" && (
                  <div className="idims-dropdown p-3 w-80 space-y-1">
                    <div className="px-3 py-1.5 text-[10px] font-semibold uppercase text-muted-foreground tracking-wider border-b border-border mb-1">
                      P2P Sourcing Modules
                    </div>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavChange("p2p");
                        setActiveDropdown(null);
                      }}
                      className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-accent transition-colors bg-muted/50 border border-border"
                    >
                      <div className="w-8 h-8 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-medium flex-shrink-0">
                        <Package className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-foreground">
                          Bulk Sourcing Management
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          Line-item target specs & mapped vendor price
                          negotiations.
                        </p>
                      </div>
                    </a>

                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-accent transition-colors opacity-75"
                    >
                      <div className="w-8 h-8 rounded-md bg-muted text-muted-foreground flex items-center justify-center font-medium flex-shrink-0">
                        <ShoppingCart className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-medium text-foreground">
                          Purchase Orders & Invoicing
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          PO releases, 3-way matching & automated payment
                          release.
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
                    <div className="px-3 py-1.5 text-[10px] font-semibold uppercase text-muted-foreground tracking-wider border-b border-border mb-1">
                      Trade & Compliance Docs
                    </div>
                    <div className="p-2 text-xs text-muted-foreground">
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
        <div className="fixed inset-0 z-150 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-card text-card-foreground border border-border rounded-lg p-6 max-w-md w-full shadow-lg space-y-4">
            <div className="w-12 h-12 rounded-lg bg-muted border border-border text-foreground flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-semibold text-foreground">
                Confirm Sign Out
              </h3>
              <p className="text-xs text-muted-foreground">
                Are you sure you want to end your current IDIMS Bulk Sourcing
                session?
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 py-2.5 rounded-md border border-input text-xs font-medium text-foreground hover:bg-accent"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsLogoutModalOpen(false);
                  alert("Logged out of IDIMS Enterprise");
                }}
                className="flex-1 py-2.5 rounded-md bg-destructive text-destructive-foreground text-xs font-semibold hover:opacity-90"
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
