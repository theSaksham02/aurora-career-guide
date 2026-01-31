import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Compass, Share2 } from "lucide-react";
// CareerRoadmap import will be resolved once the file is fully processed by TS
// Currently assuming it's in the same directory structure or adjacent
import CareerRoadmap from "@/components/roadmap/CareerRoadmap";

export default function RoadmapPage() {
    return (
        <div className="min-h-screen bg-subtle-gradient pb-20">

            {/* Header */}
            <section className="relative pt-32 pb-12 bg-hero-gradient overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#A1D1E5]/10 rounded-full blur-[100px] animate-pulse-slow" />
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <Link to="/dashboard" className="inline-flex items-center text-white/70 hover:text-white mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Link>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#A1D1E5] text-xs font-semibold mb-4 backdrop-blur-sm border border-white/10 shadow-glow">
                                <Compass className="w-3 h-3" />
                                INTERACTIVE ROADMAP
                            </div>
                            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                                Your Career <span className="text-gradient bg-gradient-to-r from-[#A1D1E5] to-[#5D93A9]">Evolution</span>
                            </h1>
                            <p className="text-white/70 max-w-xl">
                                Visualize the path from where you are to where you want to be. Click on any stage to unlock resources.
                            </p>
                        </div>

                        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 hover:text-white">
                            <Share2 className="w-4 h-4 mr-2" />
                            Share Path
                        </Button>
                    </div>
                </div>
            </section>

            {/* Roadmap Canvas */}
            <div className="container mx-auto px-6 -mt-8 relative z-20">
                <CareerRoadmap />
            </div>
        </div>
    );
}
