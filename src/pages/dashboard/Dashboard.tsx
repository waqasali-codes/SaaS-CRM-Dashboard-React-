import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import { useAuth } from "../../context/authContext";

import Card from "../../components/daahboard/StatCard";
import LeadsChart from "../../components/daahboard/LeadsChart";
import Loader from "../../components/common/Loader";

type Stats = {
  total: number;
  new: number;
  contacted: number;
  converted: number;
};

const Dashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState<Stats>({
    total: 0,
    new: 0,
    contacted: 0,
    converted: 0,
  });

  const [loading, setLoading] = useState(true);

  const chartData = [
    { name: "New", value: stats.new },
    { name: "Contacted", value: stats.contacted },
    { name: "Converted", value: stats.converted },
  ];

  const fetchStats = async () => {
    if (!user) return;

    setLoading(true);

    let query = supabase.from("leads").select("*");

    if (user.role !== "admin") {
      query = query.eq("user_id", user.id);
    }

    const { data, error } = await query;

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const leads = data || [];

    const newLeads = leads.filter(l => l.status === "New").length;
    const contacted = leads.filter(l => l.status === "Contacted").length;
    const converted = leads.filter(l => l.status === "Converted").length;

    setStats({
      total: leads.length,
      new: newLeads,
      contacted,
      converted,
    });

    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Total Leads" value={stats.total} />
        <Card title="New Leads" value={stats.new} />
        <Card title="Contacted" value={stats.contacted} />
        <Card title="Converted" value={stats.converted} />
      </div>

      {/* CHART */}
      <LeadsChart data={chartData} />


    </div>
  );
};

export default Dashboard;