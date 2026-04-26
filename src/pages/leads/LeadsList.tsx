import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import { useAuth } from "../../context/authContext";
import toast from "react-hot-toast";
import { Pencil, Trash2, Inbox ,X ,Check, ChevronDown } from "lucide-react";

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  user_id?: string;
};

const LeadsList = () => {
  const { user } = useAuth();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const counts = {
    All: leads.length,
    New: leads.filter(l => l.status === "New").length,
    Contacted: leads.filter(l => l.status === "Contacted").length,
    Converted: leads.filter(l => l.status === "Converted").length,
  };
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "New",
  });

  const fetchLeads = useCallback(async () => {
    if (!user) return;

    setLoading(true);

    let query = supabase.from("leads").select("*");

    if (user.role !== "admin") {
      query = query.eq("user_id", user.id);
    }

    const { data, error } = await query;

    if (error) {
      toast.error("Failed to load leads");
      setLoading(false);
      return;
    }

    setLeads((data as Lead[]) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleSave = async () => {
    if (!formData.name || !formData.email || !user) return;

    setLoading(true);

    if (editingLead) {
      const { error } = await supabase
        .from("leads")
        .update(formData)
        .eq("id", editingLead.id);

      if (error) {
        toast.error("Update failed");
        setLoading(false);
        return;
      }

      toast.success("Lead updated");
    } else {
      const { error } = await supabase.from("leads").insert([
        {
          ...formData,
          user_id: user.id,
        },
      ]);

      if (error) {
        toast.error("Failed to add lead");
        setLoading(false);
        return;
      }

      toast.success("Lead added");
    }

    await fetchLeads();

    setShowForm(false);
    setEditingLead(null);
    setFormData({ name: "", email: "", phone: "", status: "New" });

    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (user?.role !== "admin") return;

    const { error } = await supabase.from("leads").delete().eq("id", id);

    if (error) {
      toast.error("Delete failed");
      return;
    }

    toast.success("Lead deleted");
    fetchLeads();
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setFormData({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      status: lead.status,
    });
    setShowForm(true);
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
  <div className="text-gray-900 dark:text-white">

    {/* HEADER */}
    <div className="flex justify-between items-center mb-5">
      <h1 className="text-2xl font-bold">Leads</h1>

      <button
        onClick={() => {
          setEditingLead(null);
          setFormData({ name: "", email: "", phone: "", status: "New" });
          setShowForm(true);
        }}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
      >
        + Add Lead
      </button>
    </div>

    {/* SEARCH */}
    <input
      type="text"
      placeholder="Search leads..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full mb-4 p-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700"
    />

    {/* TABS */}
    <div className="flex gap-2 mb-5 border-b dark:border-gray-700">
      {["All", "New", "Contacted", "Converted"].map((status) => {
        const isActive = statusFilter === status;

        return (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`relative px-4 py-2 text-sm font-medium transition ${
              isActive
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {status}
            <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
              {counts[status as keyof typeof counts]}
            </span>

            {isActive && (
              <span className="absolute left-0 bottom-0 w-full h-[2px] bg-blue-600 rounded-full" />
            )}
          </button>
        );
      })}
    </div>

    {/* TABLE */}
    <div className="overflow-x-auto rounded-2xl border dark:border-gray-700 shadow-sm">

      <table className="w-full border-collapse">

        <thead className="bg-gray-100 dark:bg-gray-800 text-left">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Phone</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredLeads.map((lead) => (
            <tr
              key={lead.id}
              className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              <td className="p-3">{lead.name}</td>
              <td className="p-3">{lead.email}</td>
              <td className="p-3">{lead.phone}</td>

              <td className="p-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium
                  ${lead.status === "New"
                    ? "bg-blue-100 text-blue-600"
                    : lead.status === "Contacted"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-green-100 text-green-600"
                  }`}>
                  {lead.status}
                </span>
              </td>

              <td className="p-3 flex gap-2">

                <button
                  onClick={() => handleEdit(lead)}
                  className="p-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  <Pencil size={16} />
                </button>

                {user?.role === "admin" && (
                  <button
                    onClick={() => setDeleteId(lead.id)}
                    className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
                  >
                    <Trash2 size={16} />
                  </button>
                )}

              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>

    {filteredLeads.length === 0 && (
  <div className="flex flex-col items-center justify-center py-16 text-center">

    <Inbox size={40} className="text-gray-400 dark:text-gray-500 mb-3" />

    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
      No Leads Found
    </h3>

    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
      Try changing search or filter criteria
    </p>

  </div>
)}

    {/* FORM MODAL */}
    {showForm && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

        <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl p-6">

          <h2 className="text-lg font-semibold mb-4">
            {editingLead ? "Edit Lead" : "Add Lead"}
          </h2>

          <div className="space-y-3">

              <input
                placeholder="Name"
                value={formData.name}
                className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              <input
                placeholder="Email"
                value={formData.email}
                className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />

              <input
                placeholder="Phone"
                value={formData.phone}
                className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600"
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />

              <div className="relative w-full">

  <select
    value={formData.status}
    onChange={(e) =>
      setFormData({ ...formData, status: e.target.value })
    }
    className="w-full appearance-none border rounded-lg p-2 pr-10 
               bg-white dark:bg-gray-700 
               dark:border-gray-600
               focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <option value="New">New</option>
    <option value="Contacted"> Contacted</option>
    <option value="Converted"> Converted</option>
  </select>

  {/* ICON */}
  <ChevronDown
    size={18}
    className="absolute right-3 top-1/2 -translate-y-1/2 
               text-gray-500 dark:text-gray-300 pointer-events-none"
  />

</div>

            </div>

          <div className="flex justify-end gap-2 mt-5">

  {/* CANCEL */}
  <button
    onClick={() => {
      setShowForm(false);
      setEditingLead(null);
      setFormData({ name: "", email: "", phone: "", status: "New" });
    }}
    className="flex items-center gap-2 px-4 py-2 rounded-lg border 
               hover:bg-gray-100 dark:hover:bg-gray-700 
               dark:border-gray-600 transition"
  >
    <X size={16} />
    Cancel
  </button>

  {/* SAVE / UPDATE */}
  <button
    onClick={handleSave}
    className="flex items-center gap-2 px-4 py-2 rounded-lg 
               bg-blue-600 hover:bg-blue-700 text-white transition"
  >
    <Check size={16} />
    {editingLead ? "Update" : "Save"}
  </button>

</div>

        </div>
      </div>
    )}

    {/* DELETE MODAL */}
    {deleteId && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-full max-w-sm">

          <h2 className="text-lg font-semibold">Delete Lead</h2>
          <p className="text-sm text-gray-500 mt-2">
            Are you sure? This cannot be undone.
          </p>

          <div className="flex justify-end gap-2 mt-5">

            <button
              onClick={() => setDeleteId(null)}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>

            <button
              onClick={async () => {
                await handleDelete(deleteId);
                setDeleteId(null);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg"
            >
              Delete
            </button>

          </div>

        </div>
      </div>
    )}

  </div>
);
};

export default LeadsList;







