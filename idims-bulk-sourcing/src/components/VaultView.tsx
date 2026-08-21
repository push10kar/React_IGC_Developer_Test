import React from "react";
import { Shield, Plus, Copy } from "lucide-react";

export const VaultView: React.FC = () => {
  const credentials = [
    {
      id: "c1",
      system: "GSTIN Portal API Key",
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

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#ECFEFF] border border-[#A5F3FC] flex items-center justify-center text-[#0891B2]">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-[#0F172A]">
              Credentials & Security Vault
            </h2>
            <p className="text-xs text-[#64748B]">
              Encrypted API keys, enterprise certificates & access tokens for IDIMS integrations.
            </p>
          </div>
        </div>

        <button className="bg-linear-to-r from-[#22D3EE] via-[#0891B2] to-[#0E7490] text-white px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 shadow-md">
          <Plus className="w-4 h-4" /> Add Credentials
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {credentials.map((cred) => (
          <div
            key={cred.id}
            className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs space-y-4 hover:border-[#0891B2] transition-colors"
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#0891B2] bg-[#ECFEFF] border border-[#A5F3FC] px-2 py-0.5 rounded-md">
                {cred.category}
              </span>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  cred.status === "Active"
                    ? "bg-[#DCFCE7] text-[#15803D]"
                    : "bg-[#FEF3C7] text-[#B45309]"
                }`}
              >
                {cred.status}
              </span>
            </div>

            <div>
              <h4 className="font-extrabold text-sm text-[#0F172A]">
                {cred.system || cred.name}
              </h4>
              <p className="font-mono text-xs text-[#64748B] mt-1 flex items-center gap-2">
                <span>{cred.keyId}</span>
                <Copy className="w-3.5 h-3.5 text-[#94A3B8] cursor-pointer hover:text-[#0891B2]" />
              </p>
            </div>

            <div className="pt-3 border-t border-[#F1F5F9] text-[11px] text-[#64748B] flex justify-between">
              <span>Rotated: {cred.lastRotated}</span>
              <span className="font-bold text-[#334155]">{cred.accessLevel}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
