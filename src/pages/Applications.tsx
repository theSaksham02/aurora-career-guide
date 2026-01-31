import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Edit, XCircle, FileText, TrendingUp, Clock, Award, Filter, Plus, Briefcase, X, Save } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { useUser, Application } from "@/contexts/UserContext";
import { toast } from "sonner";

type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn';

const statusColors: Record<ApplicationStatus, string> = {
  pending: "#5D93A9",
  accepted: "#22c55e",
  rejected: "#ef4444",
  withdrawn: "#9ca3af",
};

const statusBadgeStyles: Record<ApplicationStatus, string> = {
  pending: "bg-[#A1D1E5]/30 text-[#074C6B] border-[#A1D1E5]/50",
  accepted: "bg-emerald-100 text-emerald-700 border-emerald-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
  withdrawn: "bg-gray-100 text-gray-600 border-gray-200",
};

const filters: ApplicationStatus[] = ["pending", "accepted", "rejected", "withdrawn"];

const glassCard = "bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(11,43,61,0.1)]";

const applicationTimelineData = [
  { date: 'Week 1', applications: 2 },
  { date: 'Week 2', applications: 5 },
  { date: 'Week 3', applications: 3 },
  { date: 'Week 4', applications: 7 },
];

export default function Applications() {
  const { applications, addApplication, updateApplication, deleteApplication } = useUser();
  const [activeFilter, setActiveFilter] = useState<ApplicationStatus | "all">("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    status: 'pending' as ApplicationStatus,
    appliedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    nextStep: '',
  });

  const filteredApplications = activeFilter === "all"
    ? applications
    : applications.filter((app) => app.status === activeFilter);

  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    value: count,
    color: statusColors[status as ApplicationStatus],
  }));

  const stats = [
    { label: "Total Applications", value: applications.length, icon: FileText, gradient: "from-[#A1D1E5] to-[#5D93A9]" },
    { label: "Success Rate", value: `${applications.length > 0 ? Math.round((statusCounts.accepted || 0) / applications.length * 100) : 0}%`, icon: TrendingUp, gradient: "from-[#5D93A9] to-[#074C6B]" },
    { label: "Pending", value: statusCounts.pending || 0, icon: Clock, gradient: "from-[#074C6B] to-[#0B2B3D]" },
    { label: "Accepted", value: statusCounts.accepted || 0, icon: Award, gradient: "from-emerald-400 to-emerald-600" },
  ];

  const resetForm = () => {
    setFormData({
      company: '',
      role: '',
      status: 'pending',
      appliedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      nextStep: '',
    });
  };

  const handleAddApplication = () => {
    if (!formData.company || !formData.role) {
      toast.error("Please fill in company and role");
      return;
    }
    addApplication(formData);
    toast.success(`Added application for ${formData.company}`);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditApplication = () => {
    if (!editingApp) return;
    updateApplication(editingApp.id, formData);
    toast.success(`Updated ${formData.company} application`);
    setEditingApp(null);
    resetForm();
  };

  const handleDeleteApplication = (app: Application) => {
    deleteApplication(app.id);
    toast.success(`Deleted ${app.company} application`);
  };

  const openEditModal = (app: Application) => {
    setFormData({
      company: app.company,
      role: app.role,
      status: app.status,
      appliedDate: app.appliedDate,
      nextStep: app.nextStep,
    });
    setEditingApp(app);
  };

  // Modal Component
  const Modal = ({ onClose, onSave, title }: { onClose: () => void; onSave: () => void; title: string }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`${glassCard} rounded-2xl p-6 w-full max-w-md`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-[#0B2B3D]">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-[#0B2B3D]/10 rounded-lg">
            <X className="w-5 h-5 text-[#5D93A9]" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-[#0B2B3D]">Company *</Label>
            <Input
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
              placeholder="e.g., Google"
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-[#0B2B3D]">Role *</Label>
            <Input
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              placeholder="e.g., Software Engineer"
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-[#0B2B3D]">Status</Label>
            <Select value={formData.status} onValueChange={(v) => setFormData(prev => ({ ...prev, status: v as ApplicationStatus }))}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="withdrawn">Withdrawn</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-[#0B2B3D]">Next Step</Label>
            <Input
              value={formData.nextStep}
              onChange={(e) => setFormData(prev => ({ ...prev, nextStep: e.target.value }))}
              placeholder="e.g., Technical Interview"
              className="mt-1"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={onSave} className="flex-1 bg-gradient-to-r from-[#0B2B3D] to-[#074C6B] text-white">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen font-sf">
      {/* Modal */}
      {showAddModal && (
        <Modal
          title="Add New Application"
          onClose={() => { setShowAddModal(false); resetForm(); }}
          onSave={handleAddApplication}
        />
      )}
      {editingApp && (
        <Modal
          title="Edit Application"
          onClose={() => { setEditingApp(null); resetForm(); }}
          onSave={handleEditApplication}
        />
      )}

      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 bg-gradient-to-b from-[#0B2B3D] via-[#074C6B] to-[#0B2B3D] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-[#A1D1E5]/10 rounded-full blur-[80px]" />
        </div>

        <div className="container mx-auto px-6 lg:px-10 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-[#A1D1E5] text-sm font-semibold mb-4 backdrop-blur-sm">
                <Briefcase className="w-4 h-4" />
                APPLICATION TRACKING
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Your <span className="text-[#A1D1E5]">Applications</span>
              </h1>
              <p className="text-xl text-white/60 mt-4 max-w-xl">
                Track, manage, and optimize your job applications
              </p>
            </div>

            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-white text-[#0B2B3D] hover:bg-[#A1D1E5] font-semibold text-lg py-6 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all w-fit"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Application
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 lg:py-20 bg-gradient-to-b from-[#E8F4F8] via-[#F0F7FA] to-[#E0EEF4]">
        <div className="container mx-auto px-6 lg:px-10">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-10">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`${glassCard} rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(11,43,61,0.12)] hover:-translate-y-1`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-[#0B2B3D] mb-1">{stat.value}</div>
                <div className="text-sm text-[#5D93A9] font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Filter Buttons */}
          <div className={`${glassCard} rounded-2xl p-4 mb-8 flex flex-wrap items-center gap-3`}>
            <Filter className="w-5 h-5 text-[#5D93A9]" />
            <Button
              variant={activeFilter === "all" ? "default" : "outline"}
              onClick={() => setActiveFilter("all")}
              className={activeFilter === "all" ? "bg-gradient-to-r from-[#0B2B3D] to-[#074C6B] text-white" : "hover:bg-[#0B2B3D]/5 text-[#0B2B3D]"}
            >
              All ({applications.length})
            </Button>
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                onClick={() => setActiveFilter(filter)}
                className={`capitalize ${activeFilter === filter ? "bg-gradient-to-r from-[#0B2B3D] to-[#074C6B] text-white" : "hover:bg-[#0B2B3D]/5 text-[#0B2B3D]"}`}
              >
                {filter} ({statusCounts[filter] || 0})
              </Button>
            ))}
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Applications Table */}
            <div className="lg:col-span-8">
              <div className={`${glassCard} rounded-2xl overflow-hidden`}>
                {filteredApplications.length === 0 ? (
                  <div className="p-12 text-center">
                    <Briefcase className="w-12 h-12 text-[#5D93A9]/30 mx-auto mb-4" />
                    <p className="text-[#5D93A9]">No applications found</p>
                    <Button
                      onClick={() => setShowAddModal(true)}
                      className="mt-4 bg-gradient-to-r from-[#0B2B3D] to-[#074C6B] text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Application
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#0B2B3D]/10 bg-[#0B2B3D]/5">
                          <th className="text-left p-5 text-sm font-semibold text-[#0B2B3D]">Company</th>
                          <th className="text-left p-5 text-sm font-semibold text-[#0B2B3D]">Role</th>
                          <th className="text-left p-5 text-sm font-semibold text-[#0B2B3D]">Status</th>
                          <th className="text-left p-5 text-sm font-semibold text-[#0B2B3D] hidden md:table-cell">Applied</th>
                          <th className="text-left p-5 text-sm font-semibold text-[#0B2B3D] hidden lg:table-cell">Next Step</th>
                          <th className="text-right p-5 text-sm font-semibold text-[#0B2B3D]">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredApplications.map((app) => (
                          <tr
                            key={app.id}
                            className="border-b border-[#0B2B3D]/5 hover:bg-[#0B2B3D]/5 transition-colors"
                          >
                            <td className="p-5 text-[#0B2B3D] font-semibold">{app.company}</td>
                            <td className="p-5 text-[#5D93A9]">{app.role}</td>
                            <td className="p-5">
                              <Badge
                                variant="outline"
                                className={`capitalize ${statusBadgeStyles[app.status]}`}
                              >
                                {app.status}
                              </Badge>
                            </td>
                            <td className="p-5 text-[#5D93A9] hidden md:table-cell">{app.appliedDate}</td>
                            <td className="p-5 text-sm text-[#5D93A9] hidden lg:table-cell">{app.nextStep || '—'}</td>
                            <td className="p-5 text-right">
                              <div className="flex justify-end gap-1">
                                <Button variant="ghost" size="icon" className="hover:bg-[#A1D1E5]/20 text-[#074C6B]">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="hover:bg-[#A1D1E5]/20 text-[#074C6B]"
                                  onClick={() => openEditModal(app)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="hover:bg-red-100 text-red-500"
                                  onClick={() => handleDeleteApplication(app)}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Charts */}
            <div className="lg:col-span-4 space-y-6">
              {/* Pie Chart */}
              <div className={`${glassCard} rounded-2xl p-6`}>
                <h3 className="font-bold text-[#0B2B3D] text-lg mb-4">Status Distribution</h3>
                {pieData.length > 0 ? (
                  <>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={70}
                            dataKey="value"
                            stroke="none"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 mt-4">
                      {pieData.map((entry) => (
                        <div key={entry.name} className="flex items-center gap-2 text-sm">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="capitalize text-[#5D93A9]">{entry.name}: {entry.value}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-center text-[#5D93A9] py-8">No data yet</p>
                )}
              </div>

              {/* Area Chart */}
              <div className={`${glassCard} rounded-2xl p-6`}>
                <h3 className="font-bold text-[#0B2B3D] text-lg mb-4">Application Trend</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={applicationTimelineData}>
                      <XAxis
                        dataKey="date"
                        tick={{ fill: '#5D93A9', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: '#5D93A9', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255,255,255,0.95)',
                          border: '1px solid rgba(11,43,61,0.1)',
                          borderRadius: '12px',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="applications"
                        stroke="#074C6B"
                        fill="url(#chartGradient)"
                        strokeWidth={2}
                      />
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#A1D1E5" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="#A1D1E5" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
