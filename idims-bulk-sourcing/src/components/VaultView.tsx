import React, { useState } from "react";
import { Shield, Plus, Copy, X, Key, Check } from "lucide-react";

interface CredentialItem {
  id: string;
  name: string;
  category: string;
  keyId: string;
  status: string;
  lastRotated: string;
  accessLevel: string;
}

const INITIAL_CREDENTIALS: CredentialItem[] = [
  {
    id: "c1",
    name: "GSTIN Portal API Key",
    category: "Compliance & Tax",
    keyId: "IDIMS-GST-PROD-8821",
    status: "Active",
    lastRotated: "2026-07-15",
    accessLevel: "Restricted",
  },
  {
    id: "c2",
    name: "Customs ICEGATE Credentials",
    category: "GTS Export/Import",
    keyId: "ICEGATE-AUTH-9092",
    status: "Active",
    lastRotated: "2026-08-01",
    accessLevel: "Admin Only",
  },
  {
    id: "c3",
    name: "Vendor Payment Gateway Token",
    category: "Financial P2P",
    keyId: "PG-BANK-SEC-4410",
    status: "Expiring Soon",
    lastRotated: "2026-05-20",
    accessLevel: "Finance Manager",
  },
];

export const VaultView: React.FC = () => {
  const [credentials, setCredentials] = useState<CredentialItem[]>(INITIAL_CREDENTIALS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal form states
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Compliance & Tax");
  const [accessLevel, setAccessLevel] = useState("Restricted");
  const [secretValue, setSecretValue] = useState("");

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddCredential = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newCred: CredentialItem = {
      id: `c-${Date.now()}`,
      name,
      category,
      keyId: `IDIMS-SEC-KEY-${randomSuffix}`,
      status: "Active",
      lastRotated: new Date().toISOString().split("T")[0],
      accessLevel,
    };

    setCredentials([newCred, ...credentials]);
    setName("");
    setSecretValue("");
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-card text-card-foreground border border-border rounded-lg p-6 shadow-sm flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-muted border border-border flex items-center justify-center text-foreground">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Credentials & Security Vault
            </h2>
            <p className="text-xs text-muted-foreground">
              Encrypted API keys, enterprise certificates & access tokens for IDIMS integrations.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-primary-foreground px-4 py-2.5 rounded-md font-semibold text-xs flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Credentials
        </button>
      </div>

      {/* Grid of Credentials */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {credentials.map((cred) => (
          <div
            key={cred.id}
            className="bg-card text-card-foreground border border-border rounded-lg p-5 shadow-sm space-y-4 hover:border-ring transition-colors"
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded-md">
                {cred.category}
              </span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  cred.status === "Active"
                    ? "bg-muted text-foreground border border-border"
                    : "bg-secondary text-secondary-foreground border border-border"
                }`}
              >
                {cred.status}
              </span>
            </div>

            <div>
              <h4 className="font-semibold text-sm text-foreground">
                {cred.name}
              </h4>
              <p className="font-mono text-xs text-muted-foreground mt-1 flex items-center gap-2">
                <span>{cred.keyId}</span>
                <button
                  onClick={() => handleCopy(cred.id, cred.keyId)}
                  className="hover:text-foreground transition-colors p-1"
                  title="Copy Key ID"
                >
                  {copiedId === cred.id ? (
                    <Check className="w-3.5 h-3.5 text-green-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </p>
            </div>

            <div className="pt-3 border-t border-border text-[11px] text-muted-foreground flex justify-between">
              <span>Rotated: {cred.lastRotated}</span>
              <span className="font-medium text-foreground">{cred.accessLevel}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Credential Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card text-card-foreground border border-border rounded-lg w-full max-w-md shadow-lg overflow-hidden">
            <div className="bg-muted px-6 py-4 border-b border-border flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-foreground" />
                <h3 className="font-semibold text-base text-foreground">Add New Credential</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-accent rounded-md transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCredential} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-medium text-muted-foreground uppercase text-[10px] block mb-1">
                  Credential Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS S3 Storage Access Token"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-background border border-input rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
                />
              </div>

              <div>
                <label className="font-medium text-muted-foreground uppercase text-[10px] block mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-background border border-input rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
                >
                  <option value="Compliance & Tax">Compliance & Tax</option>
                  <option value="GTS Export/Import">GTS Export/Import</option>
                  <option value="Financial P2P">Financial P2P</option>
                  <option value="Logistics & WMS">Logistics & WMS</option>
                  <option value="Core Infrastructure">Core Infrastructure</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-muted-foreground uppercase text-[10px] block mb-1">
                  Access Level
                </label>
                <select
                  value={accessLevel}
                  onChange={(e) => setAccessLevel(e.target.value)}
                  className="w-full bg-background border border-input rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
                >
                  <option value="Restricted">Restricted</option>
                  <option value="Admin Only">Admin Only</option>
                  <option value="Finance Manager">Finance Manager</option>
                  <option value="System Service">System Service</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-muted-foreground uppercase text-[10px] block mb-1">
                  Secret Key / API Token (Encrypted)
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••••••••••"
                  value={secretValue}
                  onChange={(e) => setSecretValue(e.target.value)}
                  className="w-full bg-background border border-input rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 font-mono"
                />
              </div>

              <div className="pt-4 border-t border-border flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-input rounded-md font-medium text-foreground hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-semibold hover:opacity-90 transition-opacity"
                >
                  Save Credential
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
