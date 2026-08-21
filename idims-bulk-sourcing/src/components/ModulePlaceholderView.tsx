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
    <div className="bg-card text-card-foreground border border-border rounded-lg p-12 text-center space-y-4 shadow-sm">
      <div className="w-16 h-16 rounded-lg bg-muted border border-border text-foreground flex items-center justify-center mx-auto">
        <span className="font-semibold text-xl">{moduleName.substring(0, 2).toUpperCase()}</span>
      </div>
      <div className="max-w-md mx-auto space-y-2">
        <h2 className="text-lg font-semibold text-foreground">{moduleName} Workspace</h2>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted border border-border text-xs font-medium text-muted-foreground">
        <span className="w-2 h-2 rounded-full bg-primary" />
        <span>Module Active &amp; Connected to IDIMS Core</span>
      </div>
    </div>
  );
};
