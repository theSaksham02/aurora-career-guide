import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, XCircle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { mockApplications, applicationTimelineData, Application, ApplicationStatus } from "@/data/mockData";

const statusColors: Record<ApplicationStatus, string> = {
  pending: "hsl(45, 93%, 47%)",
  accepted: "hsl(142, 71%, 45%)",
  rejected: "hsl(0, 84%, 60%)",
  withdrawn: "hsl(0, 0%, 60%)",
};

const statusBadgeVariants: Record<ApplicationStatus, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  accepted: "default",
  rejected: "destructive",
  withdrawn: "outline",
};

const filters: ApplicationStatus[] = ["pending", "accepted", "rejected", "withdrawn"];

export default function Applications() {
  const [activeFilter, setActiveFilter] = useState<ApplicationStatus | "all">("all");

  const filteredApplications = activeFilter === "all"
    ? mockApplications
    : mockApplications.filter((app) => app.status === activeFilter);

  const statusCounts = mockApplications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    value: count,
    color: statusColors[status as ApplicationStatus],
  }));

  const stats = [
    { label: "Total Applications", value: mockApplications.length },
    { label: "Success Rate", value: `${Math.round((statusCounts.accepted || 0) / mockApplications.length * 100)}%` },
    { label: "Avg Response Time", value: "5 days" },
    { label: "Next Interview", value: "Jan 25" },
  ];

  return (
    <div className="min-h-screen bg-muted/30 py-16">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-hero text-foreground mb-4">Your Applications</h1>
          <p className="text-body text-muted-foreground">
            Track and manage your job applications
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="bg-background rounded-lg border border-border p-6 text-center animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-small text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Button
            variant={activeFilter === "all" ? "default" : "outline"}
            onClick={() => setActiveFilter("all")}
          >
            All ({mockApplications.length})
          </Button>
          {filters.map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"}
              onClick={() => setActiveFilter(filter)}
              className="capitalize"
            >
              {filter} ({statusCounts[filter] || 0})
            </Button>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Applications Table */}
          <div className="lg:col-span-8">
            <div className="bg-background rounded-lg border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left p-4 text-small font-semibold text-foreground">Company</th>
                      <th className="text-left p-4 text-small font-semibold text-foreground">Role</th>
                      <th className="text-left p-4 text-small font-semibold text-foreground">Status</th>
                      <th className="text-left p-4 text-small font-semibold text-foreground hidden md:table-cell">Applied</th>
                      <th className="text-left p-4 text-small font-semibold text-foreground hidden lg:table-cell">Next Step</th>
                      <th className="text-right p-4 text-small font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplications.map((app) => (
                      <tr
                        key={app.id}
                        className="border-b border-border hover:bg-muted/30 transition-colors"
                      >
                        <td className="p-4 text-foreground font-medium">{app.company}</td>
                        <td className="p-4 text-muted-foreground">{app.role}</td>
                        <td className="p-4">
                          <Badge 
                            variant={statusBadgeVariants[app.status]}
                            className="capitalize"
                          >
                            {app.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-muted-foreground hidden md:table-cell">{app.appliedDate}</td>
                        <td className="p-4 text-small text-muted-foreground hidden lg:table-cell">{app.nextStep}</td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="lg:col-span-4 space-y-6">
            {/* Pie Chart */}
            <div className="bg-background rounded-lg border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">Status Distribution</h3>
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
                    <span className="capitalize text-muted-foreground">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Area Chart */}
            <div className="bg-background rounded-lg border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">Application Timeline</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={applicationTimelineData}>
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: 'hsl(0, 0%, 40%)', fontSize: 11 }} 
                      axisLine={false} 
                      tickLine={false} 
                    />
                    <YAxis 
                      tick={{ fill: 'hsl(0, 0%, 40%)', fontSize: 11 }} 
                      axisLine={false} 
                      tickLine={false} 
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(0, 0%, 100%)', 
                        border: '1px solid hsl(0, 0%, 90%)',
                        borderRadius: '8px'
                      }} 
                    />
                    <Area
                      type="monotone"
                      dataKey="applications"
                      stroke="hsl(220, 100%, 32%)"
                      fill="hsl(220, 100%, 32%)"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
