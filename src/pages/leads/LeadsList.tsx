import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import { useAuth } from "../../context/authContext";
import toast from "react-hot-toast";
import {
  Pencil, Trash2, Inbox, X, Check,
  ChevronDown, Search, Plus, AlertTriangle,
} from "lucide-react";

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  user_id?: string;
};

type StatusKey = "All" | "New" | "Contacted" | "Converted";

const STATUS_CONFIG = {
  New: { bg: "bg-blue-100 dark:bg-blue-900/40", text: "text-blue-700 dark:text-blue-300", dot: "bg-blue-500" },
  Contacted: { bg: "bg-amber-100 dark:bg-amber-900/40", text: "text-amber-700 dark:text-amber-300", dot: "bg-amber-500" },
  Converted: { bg: "bg-green-100 dark:bg-green-900/40", text: "text-green-700 dark:text-green-300", dot: "bg-green-500" },
};

const STATUSES: StatusKey[] = ["All", "New", "Contacted", "Converted"];
const defaultForm = { name: "", email: "", phone: "", status: "New" };

const LeadsList = () => {
  const { user } = useAuth();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusKey>("All");
  const [formData, setFormData] = useState(defaultForm);

  const counts: Record<StatusKey, number> = {
    All: leads.length,
    New: leads.filter(l => l.status === "New").length,
    Contacted: leads.filter(l => l.status === "Contacted").length,
    Converted: leads.filter(l => l.status === "Converted").length,
  };

  const fetchLeads = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    let query = supabase.from("leads").select("*");
    if (user.role !== "admin") query = query.eq("user_id", user.id);
    const { data, error } = await query;
    if (error) { toast.error("Failed to load leads"); setLoading(false); return; }
    setLeads((data as Lead[]) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.email.trim() || !user) {
      toast.error("Name and email are required");
      return;
    }
    setSaving(true);
    if (editingLead) {
      const { error } = await supabase.from("leads").update(formData).eq("id", editingLead.id);
      if (error) { toast.error("Update failed"); setSaving(false); return; }
      toast.success("Lead updated");
    } else {
      const { error } = await supabase.from("leads").insert([{ ...formData, user_id: user.id }]);
      if (error) { toast.error("Failed to add lead"); setSaving(false); return; }
      toast.success("Lead added");
    }
    await fetchLeads();
    closeForm();
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (user?.role !== "admin") return;
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) { toast.error("Delete failed"); return; }
    toast.success("Lead deleted");
    fetchLeads();
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setFormData({ name: lead.name, email: lead.email, phone: lead.phone, status: lead.status });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingLead(null);
    setFormData(defaultForm);
  };

  const filteredLeads = leads.filter(lead => {
    const q = search.toLowerCase();
    const matchesSearch =
      lead.name.toLowerCase().includes(q) ||
      lead.email.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "All" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="w-8 h-8 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading leads…</p>
      </div>
    );
  }
  return (
    <>
      <div className="w-full min-w-0 p-4 sm:p-6 text-gray-900 dark:text-white">

        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {leads.length} total lead{leads.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => { setEditingLead(null); setFormData(defaultForm); setShowForm(true); }}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 shadow-sm whitespace-nowrap"
          >
            <Plus size={16} />
            Add Lead
          </button>
        </div>

        {/* SEARCH */}
        <div className="relative mb-4">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
          />
        </div>

        <div className="flex gap-1 mb-5 border-b border-gray-200 dark:border-gray-700 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {STATUSES.map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`relative flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors
                ${statusFilter === status
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
            >
              {status}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium transition-colors
                ${statusFilter === status
                  ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                }`}>
                {counts[status]}
              </span>
              {statusFilter === status && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
              )}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto bg-white dark:bg-gray-800/40">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 hidden sm:table-cell">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead, i) => {
                  const cfg = STATUS_CONFIG[lead.status as keyof typeof STATUS_CONFIG];
                  return (
                    <tr
                      key={lead.id}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors
                        ${i !== 0 ? "border-t border-gray-100 dark:border-gray-700/60" : ""}`}
                    >
                      <td className="px-4 py-3.5 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                        {lead.name}
                      </td>
                      <td className="px-4 py-3.5 text-gray-600 dark:text-gray-300 max-w-[200px]">
                        <span className="block truncate" title={lead.email}>{lead.email}</span>
                      </td>
                      <td className="px-4 py-3.5 text-gray-600 dark:text-gray-300 whitespace-nowrap hidden sm:table-cell">
                        {lead.phone || "—"}
                      </td>
                      <td className="px-4 py-3.5">
                        {cfg ? (
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                            {lead.status}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">{lead.status}</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(lead)}
                            title="Edit lead"
                            className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
                          >
                            <Pencil size={14} />
                          </button>
                          {user?.role === "admin" && (
                            <button
                              onClick={() => setDeleteId(lead.id)}
                              title="Delete lead"
                              className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredLeads.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white dark:bg-gray-800/40">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-700/60 flex items-center justify-center mb-4">
                <Inbox size={24} className="text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-1">No leads found</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {search
                  ? "Try a different search term or clear filters."
                  : "Add your first lead to get started."}
              </p>
            </div>
          )}
        </div>

        {filteredLeads.length > 0 && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 text-right">
            Showing {filteredLeads.length} of {leads.length} lead{leads.length !== 1 ? "s" : ""}
          </p>
        )}

      </div>

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
          onClick={e => { if (e.target === e.currentTarget) closeForm(); }}
        >
          <div className="w-full sm:max-w-md bg-white dark:bg-gray-900 sm:rounded-2xl rounded-t-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">

            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                {editingLead ? "Edit Lead" : "Add New Lead"}
              </h2>
              <button
                onClick={closeForm}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="px-5 py-4 space-y-3 bg-white dark:bg-gray-900">
              {[
                { key: "name", label: "Full Name", type: "text", placeholder: "e.g. Ali Hassan", required: true },
                { key: "email", label: "Email Address", type: "email", placeholder: "e.g. ali@example.com", required: true },
                { key: "phone", label: "Phone Number", type: "tel", placeholder: "e.g. 0300-1234567", required: false },
              ].map(({ key, label, type, placeholder, required }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                    {label}{required && <span className="text-red-500 ml-0.5">*</span>}
                  </label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={formData[key as keyof typeof formData]}
                    onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                    className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition placeholder:text-gray-400"
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                  Status
                </label>
                <div className="relative">
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    className="w-full appearance-none border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 pr-9 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Converted">Converted</option>
                  </select>
                  <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60">
              <button
                onClick={closeForm}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X size={14} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium transition-all active:scale-95"
              >
                {saving
                  ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <Check size={14} />
                }
                {editingLead ? "Update Lead" : "Save Lead"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={e => { if (e.target === e.currentTarget) setDeleteId(null); }}
        >
          <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-5 bg-white dark:bg-gray-900">
              <div className="w-11 h-11 rounded-2xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center mb-4">
                <AlertTriangle size={20} className="text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Delete this lead?</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This action is permanent and cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => { await handleDelete(deleteId); setDeleteId(null); }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-all active:scale-95"
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LeadsList;