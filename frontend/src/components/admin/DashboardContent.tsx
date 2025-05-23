import React, { useState, useEffect, useContext } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { BACKEND_URL } from "@/utils/backend";
import { ThemeContext } from "@/context/ThemeContext";

// shadcn components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { BarChart } from "@/components/ui/bar-chart";

// icons
import {
  CircleDot,
  TrendingUp,
  Car,
  Calendar,
  ParkingCircle,
  LogOut,
  History,
  CircleDollarSign,
} from "lucide-react";

import { Skeleton } from "../ui/skeleton";

interface DashboardStats {
  totalParkingLots: number;
  totalBookings: number;
  totalVehiclesIn: number;
  totalVehiclesOut: number;
  totalVehiclesHistory: number;
}

interface OccupancyDataItem {
  name: string;
  value: number;
}

interface TrendDataItem {
  date: string;
  in: number;
  out: number;
  history: number;
}

interface EarningsDataItem {
  month: string;
  earnings: number;
}

interface BarChartData {
  name: string;
  value: number;
  color?: string;
}

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const DashboardContent: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalParkingLots: 0,
    totalBookings: 0,
    totalVehiclesIn: 0,
    totalVehiclesOut: 0,
    totalVehiclesHistory: 0,
  });
  const { theme } = useContext(ThemeContext);
  const [occupancyData, setOccupancyData] = useState<OccupancyDataItem[]>([]);
  const [trendData, setTrendData] = useState<TrendDataItem[]>([]);
  const [earningsData, setEarningsData] = useState<EarningsDataItem[]>([]);
  const [formattedEarningsData, setFormattedEarningsData] = useState<
    BarChartData[]
  >([]);

  // Modern color palette
  const pieColors = ["#6366F1", "#F97316", "#06B6D4"];
  const lineColors = {
    in: "#8B5CF6",
    out: "#EC4899",
    history: "#10B981",
  };
  const barColor = "#0EA5E9";

  useEffect(() => {
    const token = Cookies.get("adminToken");
    if (!token) {
      toast.error("Admin token not found");
      return;
    }

    const fetchAll = async () => {
      try {
        const [statsRes, occupancyRes, trendsRes, earningsRes] =
          await Promise.all([
            axios.get(`${BACKEND_URL}/api/admin/dashboard/stats`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${BACKEND_URL}/api/admin/dashboard/occupancy`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${BACKEND_URL}/api/admin/dashboard/trends`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${BACKEND_URL}/api/admin/dashboard/earnings`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        setStats(statsRes.data);
        setOccupancyData(occupancyRes.data);
        setTrendData(trendsRes.data);
        setEarningsData(earningsRes.data);
      } catch (error) {
        toast.error("Failed to fetch dashboard data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // Add a new useEffect to transform earnings data for ShadCN BarList
  useEffect(() => {
    if (earningsData.length > 0) {
      const formatted = earningsData.map((item) => ({
        name: monthTickFormatter(item.month),
        value: item.earnings,
        color: barColor,
      }));
      setFormattedEarningsData(formatted);
    }
  }, [earningsData]);

  const monthTickFormatter = (value: string) => {
    const parts = value.split("-");
    if (parts.length === 2) {
      const monthIndex = parseInt(parts[1], 10) - 1;
      return monthNames[monthIndex];
    }
    return value;
  };

  const formatDateToDDMMYYYY = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}/${d.getFullYear()}`;
  };

  // Card data with icons and enhanced styling
  const summaryCards = [
    {
      title: "Parking Lots",
      value: stats.totalParkingLots,
      icon: <ParkingCircle className="h-6 w-6" />,
      gradient: "from-blue-500/20 to-blue-600/20",
      color: "text-blue-500",
      borderColor: "border-blue-500/20",
      shadow: "shadow-blue-500/10",
    },
    {
      title: "Bookings",
      value: stats.totalBookings,
      icon: <Calendar className="h-6 w-6" />,
      gradient: "from-purple-500/20 to-purple-600/20",
      color: "text-purple-500",
      borderColor: "border-purple-500/20",
      shadow: "shadow-purple-500/10",
    },
    {
      title: "Vehicles In",
      value: stats.totalVehiclesIn,
      icon: <Car className="h-6 w-6" />,
      gradient: "from-emerald-500/20 to-emerald-600/20",
      color: "text-emerald-500",
      borderColor: "border-emerald-500/20",
      shadow: "shadow-emerald-500/10",
    },
    {
      title: "Vehicles Out",
      value: stats.totalVehiclesOut,
      icon: <LogOut className="h-6 w-6" />,
      gradient: "from-amber-500/20 to-amber-600/20",
      color: "text-amber-500",
      borderColor: "border-amber-500/20",
      shadow: "shadow-amber-500/10",
    },
    {
      title: "History",
      value: stats.totalVehiclesHistory,
      icon: <History className="h-6 w-6" />,
      gradient: "from-rose-500/20 to-rose-600/20",
      color: "text-rose-500",
      borderColor: "border-rose-500/20",
      shadow: "shadow-rose-500/10",
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 border rounded-lg shadow-lg">
          <p className="font-medium text-sm">{formatDateToDDMMYYYY(label)}</p>
          <div className="mt-1 space-y-1">
            {payload.map((entry: any, index: number) => (
              <div
                key={`tooltip-${index}`}
                className="flex items-center text-sm"
              >
                <div
                  className="w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="font-medium">{entry.name}:</span>
                <span className="ml-1">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };


  return (
    <div className="p-6 min-h-screen bg-background text-foreground transition-colors">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your parking management system
        </p>
      </div>

      {/* Modern Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {summaryCards.map((item, index) => (
          <Card
            key={index}
            className={`border ${item.borderColor} ${item.shadow} overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
          >
            {loading ? (
              <CardContent className="p-6">
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            ) : (
              <>
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-70`}
                />
                <div className="absolute top-0 right-0 h-16 w-16 transform translate-x-6 -translate-y-6">
                  <div
                    className={`w-full h-full rounded-full ${item.gradient} opacity-20`}
                  />
                </div>
                <CardContent className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`${item.color} p-2 rounded-lg bg-background/80 backdrop-blur-sm`}
                    >
                      {item.icon}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-muted-foreground">
                        Total
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {item.title}
                    </p>
                    <p className={`text-3xl font-bold ${item.color}`}>
                      {item.value.toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        ))}
      </div>

      {/* Dashboard Analytics Header */}
      <div className="mt-8 mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">
          Dashboard Analytics
        </h2>
        <p className="text-muted-foreground mt-1">
          Comprehensive view of your parking system analytics
        </p>
      </div>

      {/* All Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Vehicle Occupancy Distribution</CardTitle>
              <CardDescription>
                Current distribution of vehicles by status
              </CardDescription>
            </div>
            <CircleDot className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-0">
            {loading ? (
              <div className="flex flex-col items-center space-y-4 py-12">
                <Skeleton className="h-[250px] w-[250px] rounded-full" />
              </div>
            ) : (
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={occupancyData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      innerRadius={80}
                      paddingAngle={6}
                      cornerRadius={6}
                      label={false}
                      labelLine={false}
                      animationDuration={1500}
                      animationEasing="ease-in-out"
                      className="drop-shadow-md"
                    >
                      {occupancyData.map((_entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={pieColors[index % pieColors.length]}
                          strokeWidth={0}
                          className="transition-opacity duration-300 hover:opacity-80"
                        />
                      ))}
                    </Pie>
                    <Legend
                      layout="horizontal"
                      align="center"
                      verticalAlign="bottom"
                      iconType="circle"
                      iconSize={10}
                      wrapperStyle={{
                        paddingTop: 30,
                        fontFamily: "var(--font-sans)",
                        fontSize: "14px",
                      }}
                      formatter={(value, _entry, index) => (
                        <div className="flex flex-col items-center">
                          <span className="font-medium text-sm">{value}</span>
                          <span className="text-xs text-muted-foreground">
                            {occupancyData[index]?.value || 0} vehicles (
                            {(
                              ((occupancyData[index]?.value || 0) /
                                occupancyData.reduce(
                                  (acc, item) => acc + item.value,
                                  0
                                )) *
                              100
                            ).toFixed(0)}
                            %)
                          </span>
                        </div>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Line Chart */}
        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Vehicle Trends Over Time</CardTitle>
              <CardDescription>
                Daily trends of vehicle status changes
              </CardDescription>
            </div>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-0">
            {loading ? (
              <div className="space-y-4 py-12">
                <Skeleton className="h-[300px] w-full" />
              </div>
            ) : (
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={trendData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={theme === "dark" ? "#333" : "#eee"}
                    />
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatDateToDDMMYYYY}
                      tick={{ fontSize: 12 }}
                      stroke="currentColor"
                      opacity={0.6}
                    />
                    <YAxis
                      stroke="currentColor"
                      opacity={0.6}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{
                        paddingTop: 20,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="in"
                      name="Upcoming"
                      stroke={lineColors.in}
                      strokeWidth={3}
                      dot={{
                        r: 4,
                        strokeWidth: 0,
                        fill: lineColors.in,
                      }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="out"
                      name="Parked"
                      stroke={lineColors.out}
                      strokeWidth={3}
                      dot={{
                        r: 4,
                        strokeWidth: 0,
                        fill: lineColors.out,
                      }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="history"
                      name="Settled"
                      stroke={lineColors.history}
                      strokeWidth={3}
                      dot={{
                        r: 4,
                        strokeWidth: 0,
                        fill: lineColors.history,
                      }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bar Chart - Full Width with ShadCN UI */}
        <Card className="border shadow-sm lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Monthly Revenue Analytics</CardTitle>
              <CardDescription>
                Total earnings breakdown by month
              </CardDescription>
            </div>
            <CircleDollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-0">
            {loading ? (
              <div className="space-y-4 py-12">
                <Skeleton className="h-[300px] w-full" />
              </div>
            ) : (
              <div className="h-[350px] w-full">
                <BarChart
                  data={formattedEarningsData}
                  valueFormatter={(value) => `₹${value.toLocaleString()}`}
                  showAnimation={true}
                  color={barColor}
                  onClick={(item) => {
                    toast.success(
                      `${item.name}: ₹${item.value.toLocaleString()}`
                    );
                  }}
                  className="h-full"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardContent;
