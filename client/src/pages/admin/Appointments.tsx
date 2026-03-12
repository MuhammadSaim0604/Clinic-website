import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import {
  Loader2,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function AppointmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "confirmed" | "completed"
  >("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  const { data: appointments, isLoading } = useQuery({
    queryKey: [api.appointments.list.path],
    queryFn: async () => {
      const res = await fetch(api.appointments.list.path);
      return res.json();
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return apiRequest("PATCH", `/api/appointments/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.appointments.list.path] });
    },
  });

  // Client-side filtering and sorting
  let filteredAppointments = appointments || [];

  if (searchTerm) {
    filteredAppointments = filteredAppointments.filter(
      (apt: any) =>
        apt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.service.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }

  if (filterStatus !== "all") {
    filteredAppointments = filteredAppointments.filter(
      (apt: any) => (apt.status || "pending") === filterStatus,
    );
  }

  if (sortBy === "newest") {
    filteredAppointments = [...filteredAppointments].sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  } else {
    filteredAppointments = [...filteredAppointments].sort(
      (a: any, b: any) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }

  const statusOptions = ["pending", "confirmed", "completed"];
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Calendar className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold">Appointment Bookings</h2>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by name, email, or service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Appointments</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
          </select>
          <button
            onClick={() => setSortBy(sortBy === "newest" ? "oldest" : "newest")}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            {sortBy === "newest" ? (
              <>
                <ArrowDown className="w-4 h-4" /> Newest
              </>
            ) : (
              <>
                <ArrowUp className="w-4 h-4" /> Oldest
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((app: any) => (
                  <TableRow key={app._id}>
                    <TableCell className="font-medium">{app.name}</TableCell>
                    <TableCell className="text-sm">{app.email}</TableCell>
                    <TableCell className="text-sm">{app.name}</TableCell>
                    <TableCell className="text-sm">{app.date}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          app.status || "pending",
                        )}`}
                      >
                        {getStatusIcon(app.status || "pending")}
                        {app.status || "pending"}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-500 text-xs whitespace-nowrap">
                      {format(new Date(app.createdAt), "MMM dd, yyyy HH:mm")}
                    </TableCell>
                    <TableCell>
                      <select
                        value={app.status || "pending"}
                        onChange={(e) =>
                          updateStatusMutation.mutate({
                            id: app._id,
                            status: e.target.value,
                          })
                        }
                        disabled={updateStatusMutation.isPending}
                        className="text-xs px-2 py-1 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-12 text-slate-400"
                  >
                    No appointments found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
