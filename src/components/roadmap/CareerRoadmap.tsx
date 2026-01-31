import { useCallback, useState } from 'react';
import {
    ReactFlow,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    Edge,
    Node,
    MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
    GraduationCap,
    Briefcase,
    Code,
    Laptop,
    Users,
    Target,
    Crown,
    X
} from 'lucide-react';
import CustomNode from './CustomNode';
import { Button } from "@/components/ui/button";

const nodeTypes = {
    custom: CustomNode,
};

const initialNodes: Node[] = [
    {
        id: '1',
        type: 'custom',
        position: { x: 250, y: 0 },
        data: {
            label: 'Student',
            icon: GraduationCap,
            description: 'Building foundations. Learning core CS concepts, algorithms, and first languages.',
            salary: '$0 - Internship',
        },
    },
    {
        id: '2',
        type: 'custom',
        position: { x: 250, y: 150 },
        data: {
            label: 'Intern / Junior',
            icon: Briefcase,
            description: 'First professional experience. Fixing bugs, learning git, and understanding agile.',
            salary: '$50k - $80k',
        },
    },
    {
        id: '3',
        type: 'custom',
        position: { x: 250, y: 300 },
        data: {
            label: 'Mid-Level Dev',
            icon: Code,
            description: 'Independent contributor. owning features, mentoring juniors, and system design.',
            salary: '$90k - $140k',
        },
    },
    {
        id: '4',
        type: 'custom',
        position: { x: 100, y: 450 },
        data: {
            label: 'Senior Dev',
            icon: Laptop,
            description: 'Technical expert. Leading projects, architectural decisions, and high impact.',
            salary: '$150k - $220k',
        },
    },
    {
        id: '5',
        type: 'custom',
        position: { x: 400, y: 450 },
        data: {
            label: 'Tech Lead / EM',
            icon: Users,
            description: 'People & Tech management. Balancing code with team growth and delivery.',
            salary: '$180k - $250k',
        },
    },
    {
        id: '6',
        type: 'custom',
        position: { x: 250, y: 600 },
        data: {
            label: 'Principal / Staff',
            icon: Target,
            description: 'Cross-team impact. Setting technical strategy and solving the hardest problems.',
            salary: '$230k - $350k+',
        },
    },
    {
        id: '7',
        type: 'custom',
        position: { x: 250, y: 750 },
        data: {
            label: 'CTO / VP',
            icon: Crown,
            description: 'Executive leadership. Aligning technology with business goals.',
            salary: '$300k - $500k+',
        },
    },
];

const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#A1D1E5' } },
    { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#A1D1E5' } },
    { id: 'e3-4', source: '3', target: '4', animated: true, style: { stroke: '#A1D1E5' }, label: 'Individual Contributor Track' },
    { id: 'e3-5', source: '3', target: '5', animated: true, style: { stroke: '#A1D1E5' }, label: 'Management Track' },
    { id: 'e4-6', source: '4', target: '6', animated: true, style: { stroke: '#A1D1E5' } },
    { id: 'e5-6', source: '5', target: '6', animated: true, style: { stroke: '#A1D1E5' } },
    { id: 'e6-7', source: '6', target: '7', animated: true, style: { stroke: '#ff0072' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ff0072' } },
];

export default function CareerRoadmap() {
    const [nodes, , onNodesChange] = useNodesState(initialNodes);
    const [edges, , onEdgesChange] = useEdgesState(initialEdges);
    const [selectedNode, setSelectedNode] = useState<any>(null);

    const onNodeClick = useCallback((event: any, node: Node) => {
        setSelectedNode(node.data);
    }, []);

    return (
        <div className="w-full h-[800px] relative glass-card rounded-3xl overflow-hidden border border-white/20">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                fitView
                className="bg-gradient-to-br from-[#0B2B3D] to-[#074C6B]"
            >
                <Background color="#A1D1E5" gap={20} size={1} />
                <Controls className="bg-white/10 border border-white/20 text-white fill-white" />
            </ReactFlow>

            {/* Selected Node Details Drawer */}
            {selectedNode && (
                <div className="absolute top-4 right-4 w-80 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl animate-slide-in-right z-50">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#074C6B] to-[#0B2B3D] flex items-center justify-center shadow-lg">
                            <selectedNode.icon className="w-6 h-6 text-[#A1D1E5]" />
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setSelectedNode(null)} className="h-8 w-8 text-white/50 hover:text-white">
                            <X className="w-4 h-4" />
                        </Button>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-1">{selectedNode.label}</h2>
                    <p className="text-[#A1D1E5] font-semibold mb-4">{selectedNode.salary}</p>

                    <div className="space-y-4">
                        <div>
                            <h4 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Description</h4>
                            <p className="text-white/80 text-sm leading-relaxed">{selectedNode.description}</p>
                        </div>

                        <div className="pt-4 border-t border-white/10">
                            <Button className="w-full bg-[#A1D1E5] text-[#0B2B3D] hover:bg-white font-semibold">
                                View Resources
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
