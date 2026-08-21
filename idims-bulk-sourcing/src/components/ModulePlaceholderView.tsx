import React from "react";

interface Props {
  moduleName: string;
  description: string;
}

export const ModulePlaceholderView: React.FC<Props> = ({
  moduleName,
  description,
}) => {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-12 text-center space-y-4 shadow-xs">
      <div className="w-16 h-16 rounded-2xl bg-[#ECFEFF] border border-[#A5F3FC] text-[#0891B2] flex items-center justify-center mx-auto">
        <span className="font-black text-xl">{moduleName.substring(0, 2).toUpperCase()}</span>
      </div>
      <div className="max-w-md mx-auto space-y-2">
        <h2 className="text-lg font-black text-[#0F172A]">{moduleName} Workspace</h2>
        <p className="text-xs text-[#64748B]">{description}</p>
      </div>
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold text-[#475569]">
        <span className="w-2 h-2 rounded-full bg-[#0891B2] animate-pulse" />
        <span>Module Active &amp; Connected to IDIMS Core</span>
      </div>
    </div>
  );
};
