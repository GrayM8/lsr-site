"use client";

import { useState } from "react";
import { Search, Wrench } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export type Tool = {
    id: string;
    name: string;
    description: string;
    icon?: React.ReactNode;
    component: React.ReactNode; 
}

type ToolsConsoleProps = {
    tools: Tool[];
};

export function ToolsConsole({ tools }: ToolsConsoleProps) {
  const [search, setSearch] = useState("");

  const filteredTools = tools.filter(t => 
      t.name.toLowerCase().includes(search.toLowerCase()) || 
      t.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] border border-white/10 bg-black/40 rounded-lg overflow-hidden font-mono text-sm">
      {/* Toolbar */}
      <div className="bg-white/5 p-3 border-b border-white/10 flex items-center gap-4 flex-wrap">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded border border-white/10 cursor-help">
                <Wrench size={14} className="text-lsr-orange" />
                <span className="font-bold text-white/80 tracking-wider uppercase">Misc. Tools</span>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs bg-black/90 border-white/10 text-white p-3">
              <p className="font-bold mb-1 text-lsr-orange">Tools Console</p>
              <p className="text-xs text-white/80">
                A collection of miscellaneous administrative utilities, feature flags, and maintenance scripts.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="h-6 w-px bg-white/10 mx-2" />

        <div className="flex items-center gap-2 relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 text-white/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tools..."
            className="w-full bg-black/50 border border-white/10 rounded pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-lsr-orange transition-colors"
          />
        </div>
      </div>

      {/* Header Labels */}
      <div className="bg-white/5 border-b border-white/10 px-5 py-2 flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
        <div className="flex-1 min-w-[200px]">Tool</div>
        <div className="w-1/3 min-w-[200px]">Description</div>
        <div className="w-48 shrink-0 text-right">Controls</div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto p-2 space-y-1">
        {filteredTools.length === 0 ? (
            <div className="flex items-center justify-center h-full text-white/40">
                No tools found matching your search.
            </div>
        ) : (
            filteredTools.map((tool) => (
                <div
                    key={tool.id}
                    className="flex items-center gap-4 p-3 hover:bg-white/5 rounded border border-transparent hover:border-white/10 transition-all group"
                >
                    {/* Name & Icon */}
                    <div className="flex-1 min-w-[200px] flex items-center gap-3">
                        {tool.icon && (
                            <div className="text-white/40 group-hover:text-lsr-orange transition-colors">
                                {tool.icon}
                            </div>
                        )}
                        <span className="font-bold text-white text-sm">{tool.name}</span>
                    </div>

                    {/* Description */}
                    <div className="w-1/3 min-w-[200px] text-xs text-white/60">
                        {tool.description}
                    </div>

                    {/* Controls */}
                    <div className="w-48 shrink-0 flex items-center justify-end gap-2">
                        {tool.component}
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
}
