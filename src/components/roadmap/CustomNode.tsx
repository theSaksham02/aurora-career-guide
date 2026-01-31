import { Handle, Position } from '@xyflow/react';
import { LucideIcon } from 'lucide-react';
import { cn } from "@/lib/utils";

interface CustomNodeProps {
    data: {
        label: string;
        icon: LucideIcon;
        description: string;
        salary: string;
        onClick: () => void;
    };
}

export default function CustomNode({ data }: CustomNodeProps) {
    const Icon = data.icon;

    return (
        <div
            onClick={data.onClick}
            className={cn(
                "bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 w-64 shadow-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-white/20 group",
                "relative overflow-hidden"
            )}
        >
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#A1D1E5] to-[#5D93A9]" />

            <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#074C6B] to-[#0B2B3D] flex items-center justify-center shadow-inner group-hover:shadow-glow transition-shadow">
                    <Icon className="w-5 h-5 text-[#A1D1E5]" />
                </div>
                <div>
                    <h3 className="text-white font-bold text-lg leading-tight">{data.label}</h3>
                    <p className="text-[#A1D1E5] text-xs font-semibold">{data.salary}</p>
                </div>
            </div>

            <p className="text-white/70 text-sm leading-snug line-clamp-2">
                {data.description}
            </p>

            {/* Handles for connections */}
            <Handle type="target" position={Position.Top} className="!bg-[#A1D1E5] !w-3 !h-3 !border-2 !border-[#0B2B3D]" />
            <Handle type="source" position={Position.Bottom} className="!bg-[#A1D1E5] !w-3 !h-3 !border-2 !border-[#0B2B3D]" />
        </div>
    );
}
