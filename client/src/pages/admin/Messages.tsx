import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import {
  Loader2,
  Mail,
  CheckCircle2,
  Clock,
  ArrowUp,
  ArrowDown,
  Eye,
  X,
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

export default function MessagesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "read">(
    "all",
  );
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  const { data: messages, isLoading } = useQuery({
    queryKey: [api.messages.list.path],
    queryFn: async () => {
      const res = await fetch(api.messages.list.path);
      return res.json();
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return apiRequest("PATCH", `/api/messages/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.messages.list.path] });
    },
  });

  // Client-side filtering and sorting
  let filteredMessages = messages || [];

  if (searchTerm) {
    filteredMessages = filteredMessages.filter(
      (msg: any) =>
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.message.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }

  if (filterStatus !== "all") {
    filteredMessages = filteredMessages.filter(
      (msg: any) => (msg.status || "pending") === filterStatus,
    );
  }

  if (sortBy === "newest") {
    filteredMessages = [...filteredMessages].sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  } else {
    filteredMessages = [...filteredMessages].sort(
      (a: any, b: any) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }

  return (
    <div className="space-y-6">
      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-xl font-bold">Message Details</h3>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold mb-1">
                    Name
                  </p>
                  <p className="font-medium">{selectedMessage.name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold mb-1">
                    Email
                  </p>
                  <p className="font-medium text-sm break-all">
                    {selectedMessage.email}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold mb-2">
                  Message
                </p>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 overflow-x-hidden break-words">
                  <p className="text-sm whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold mb-1">
                    Status
                  </p>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                      (selectedMessage.status || "pending") === "read"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {(selectedMessage.status || "pending") === "read" ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <Clock className="w-3 h-3" />
                    )}
                    {(selectedMessage.status || "pending") === "read"
                      ? "Read"
                      : "Pending"}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold mb-1">
                    Received
                  </p>
                  <p className="text-sm">
                    {format(
                      new Date(selectedMessage.createdAt),
                      "MMM dd, yyyy HH:mm",
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  updateStatusMutation.mutate({
                    id: selectedMessage._id,
                    status:
                      (selectedMessage.status || "pending") === "read"
                        ? "pending"
                        : "read",
                  });
                  setSelectedMessage(null);
                }}
                className="w-full px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors font-medium"
              >
                Mark as{" "}
                {(selectedMessage.status || "pending") === "read"
                  ? "Pending"
                  : "Read"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Mail className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold">Contact Messages</h2>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by name, email, or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Messages</option>
            <option value="pending">Pending</option>
            <option value="read">Read</option>
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
                <TableHead>Sender</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Received</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMessages.length > 0 ? (
                filteredMessages.map((msg: any) => (
                  <TableRow key={msg._id}>
                    <TableCell className="font-medium">{msg.name}</TableCell>
                    <TableCell className="text-sm">{msg.email}</TableCell>
                    <TableCell className="max-w-md text-sm">
                      <div className="flex items-center gap-2">
                        <span className="truncate">{msg.message}</span>
                        <button
                          onClick={() => setSelectedMessage(msg)}
                          className="flex-shrink-0 p-1 hover:bg-primary/10 rounded transition-colors text-primary"
                          title="View full message"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          (msg.status || "pending") === "read"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {(msg.status || "pending") === "read" ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        {(msg.status || "pending") === "read"
                          ? "Read"
                          : "Pending"}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-500 text-xs whitespace-nowrap">
                      {format(new Date(msg.createdAt), "MMM dd, yyyy HH:mm")}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() =>
                          updateStatusMutation.mutate({
                            id: msg._id,
                            status:
                              (msg.status || "pending") === "read"
                                ? "pending"
                                : "read",
                          })
                        }
                        disabled={updateStatusMutation.isPending}
                        className="text-sm px-3 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50"
                      >
                        Mark as{" "}
                        {(msg.status || "pending") === "read"
                          ? "Pending"
                          : "Read"}
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-12 text-slate-400"
                  >
                    No messages found
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
