import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Props = {
  data: {
    name: string;
    value: number;
  }[];
};

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

const LeadsChart = ({ data }: Props) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow mt-6">

      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
        Leads by Status
      </h2>

      <div className="w-full h-72">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LeadsChart;