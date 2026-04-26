import { supabase } from "./supabase";

export type Lead = {
  id?: string;
  name: string;
  email: string;
  phone: string;
  status: string;
};

// GET
export const getLeads = async () => {
  const { data, error } = await supabase.from("leads").select("*");
  return { data, error };
};

// ADD
export const addLead = async (lead: Lead) => {
  const { data, error } = await supabase.from("leads").insert([lead]);
  return { data, error };
};

// UPDATE
export const updateLead = async (id: string, lead: Lead) => {
  const { data, error } = await supabase
    .from("leads")
    .update(lead)
    .eq("id", id);

  return { data, error };
};

// DELETE
export const deleteLead = async (id: string) => {
  const { data, error } = await supabase
    .from("leads")
    .delete()
    .eq("id", id);

  return { data, error };
};