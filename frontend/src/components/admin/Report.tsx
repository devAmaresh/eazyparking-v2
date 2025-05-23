import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { BACKEND_URL } from "@/utils/backend";
import Papa from "papaparse";
import { toast } from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

// ShadCN UI components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,

} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

// Icons
import {
  FileText,
  Search,
  Filter,
  FileSpreadsheet,
  FileType,
  Car,
  Timer,
  ClipboardList,
  Calendar,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  UserRound,
  MapPin,
  Tag,
} from "lucide-react";

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable: { finalY: number };
  }
}

interface BookingItem {
  key: string;
  name: string;
  company: string;
  registrationNumber: string;
  category: string;
  location: string;
  inTime: string;
  outTime?: string;
  totalSpent: string;
}

const Report = () => {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [ongoing, setOngoing] = useState<BookingItem[]>([]);
  const [upcoming, setUpcoming] = useState<BookingItem[]>([]);
  const [past, setPast] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [exporting, setExporting] = useState(false);
  const [activeTab, setActiveTab] = useState("ongoing");
  
  // Get unique categories for filter
  const categories = [...new Set(bookings.map(b => b.category))].filter(Boolean);

  const formatData = (data: any[]) => {
    return data.map((b) => ({
      key: b.bookId,
      name: `${b.user?.firstName || "N/A"} ${b.user?.lastName || ""}`,
      company: b.vehicle?.vehicleCompanyName || "N/A",
      registrationNumber: b.vehicle?.registrationNumber || "N/A",
      category: b.vehicle?.vehicleCategory?.vehicleCat || "N/A",
      location: b.parkingLot?.location || "N/A",
      inTime: b.vehicle?.inTime ? new Date(b.vehicle.inTime).toLocaleString() : "-",
      outTime: b.vehicle?.outTime ? new Date(b.vehicle.outTime).toLocaleString() : "-",
      totalSpent: `Rs.${b.parkingLot?.price || 0}`,
    }));
  };

  // Helper function to classify bookings
  useEffect(() => {
    const classifyBookings = () => {
      const now = new Date();
      const upcoming = [];
      const ongoing = [];
      const past = [];

      for (const b of bookings) {
        const inTime = new Date(b.inTime);
        const outTime = b.outTime ? new Date(b.outTime) : null;

        if (inTime > now) {
          upcoming.push(b);
        } else if (outTime && outTime < now) {
          past.push(b);
        } else {
          ongoing.push(b);
        }
      }

      setOngoing(ongoing);
      setPast(past);
      setUpcoming(upcoming);
    };
    classifyBookings();
  }, [bookings]);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/admin/generateReport`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("adminToken")}`,
          },
        });
        setBookings(formatData(res.data));
      } catch (error) {
        console.error("Failed to fetch data", error);
        toast.error("Failed to load booking data");
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  // Sort function
  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    
    if (sortConfig && sortConfig.key === key) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc";
    }
    
    setSortConfig({ key, direction });
  };

  // Filter and sort the data
  const getFilteredData = (data: BookingItem[]) => {
    let filteredData = [...data];
    
    // Apply category filter
    if (selectedCategory !== "all") {
      filteredData = filteredData.filter(item => item.category === selectedCategory);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredData = filteredData.filter(
        item =>
          item.key.toLowerCase().includes(query) ||
          item.name.toLowerCase().includes(query) ||
          item.company.toLowerCase().includes(query) ||
          item.registrationNumber.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    if (sortConfig) {
      filteredData.sort((a: any, b: any) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    
    return filteredData;
  };

  // Export functions
  const exportCSV = () => {
    setExporting(true);
    try {
      const activeData = activeTab === "ongoing" ? ongoing : activeTab === "upcoming" ? upcoming : past;
      const filteredData = getFilteredData(activeData);
      
      const csv = Papa.unparse(
        filteredData.map((b) => ({
          "Parking Number": b.key || "N/A",
          Name: b.name || "N/A",
          Company: b.company || "N/A",
          "Reg No": b.registrationNumber || "N/A",
          Category: b.category || "N/A",
          Location: b.location || "N/A",
          "In Time": b.inTime || "-",
          "Out Time": b.outTime || "-",
          "Total Spent": b.totalSpent,
        }))
      );
      
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}_Bookings_${format(new Date(), 'yyyy-MM-dd')}.csv`;
      link.click();
      toast.success("CSV file exported successfully");
    } catch (error) {
      console.error("Export failed", error);
      toast.error("Failed to export CSV");
    } finally {
      setExporting(false);
    }
  };

  const exportPDF = () => {
    setExporting(true);
    try {
      const doc = new jsPDF();
      const dateStr = format(new Date(), 'MMM dd, yyyy');
      
      // Add header with logo and title
      doc.setFillColor(52, 152, 219); // Blue background
      doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.text("EazyParking - Booking Report", 105, 20, { align: 'center' });
      
      doc.setFontSize(12);
      doc.text(`Generated on: ${dateStr}`, 105, 30, { align: 'center' });

      const activeData = activeTab === "ongoing" ? ongoing : activeTab === "upcoming" ? upcoming : past;
      const filteredData = getFilteredData(activeData);
      
      // Define column headers based on active tab
      const headers = [
        "Parking #",
        "Name",
        "Company",
        "Reg No",
        "Category",
        "Location",
        "In Time",
        ...(activeTab === "past" ? ["Out Time"] : []),
        "Total Spent",
      ];
      
      // Add section title
      doc.setFontSize(16);
      doc.setTextColor(52, 152, 219);
      doc.text(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Bookings (${filteredData.length})`, 14, 50);
      
      // Generate table
      autoTable(doc, {
        startY: 55,
        head: [headers],
        body: filteredData.map((b) => [
          b.key || "N/A",
          b.name || "N/A",
          b.company || "N/A",
          b.registrationNumber || "N/A",
          b.category || "N/A",
          b.location || "N/A",
          b.inTime || "-",
          ...(activeTab === "past" ? [b.outTime || "-"] : []),
          b.totalSpent,
        ]),
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { 
          fillColor: [52, 152, 219],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        alternateRowStyles: { fillColor: [240, 240, 240] },
        margin: { top: 55 }
      });
      
      // Add footer
      const pageCount = doc.internal.pages.length - 1; // Subtract 1 because jsPDF uses 1-indexed pages array
      for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(
          `Page ${i} of ${pageCount} - EazyParking Booking Report`, 
          105, 
          doc.internal.pageSize.height - 10, 
          { align: 'center' }
        );
      }
      
      doc.save(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}_Bookings_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      toast.success("PDF file exported successfully");
    } catch (error) {
      console.error("Export failed", error);
      toast.error("Failed to export PDF");
    } finally {
      setExporting(false);
    }
  };

  // Header component for each table
  const TableActions = () => (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-4">
      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 w-full"
          />
        </div>
        
        <div className="flex-shrink-0">
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="w-full sm:w-[180px] gap-1">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex gap-2 w-full md:w-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={exportCSV}
          className="flex items-center gap-1 hover:cursor-pointer"
          disabled={exporting}
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span className="hidden sm:inline">Export CSV</span>
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={exportPDF}
          className="flex items-center gap-1 hover:cursor-pointer"
          disabled={exporting}
        >
          <FileType className="h-4 w-4" />
          <span className="hidden sm:inline">Export PDF</span>
        </Button>
      </div>
    </div>
  );

  // Render function for data tables
  const renderTable = (data: BookingItem[], includeOutTime = false) => {
    const filteredData = getFilteredData(data);
    
    if (loading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between py-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-24" />
            </div>
          ))}
        </div>
      );
    }
    
    if (filteredData.length === 0) {
      return (
        <div className="text-center py-12 border rounded-md bg-muted/10">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            {searchQuery || selectedCategory !== "all" 
              ? "Try adjusting your search or filter criteria" 
              : "There are no bookings in this category yet"}
          </p>
        </div>
      );
    }
    
    return (
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted">
              <TableHead className="w-[100px]">
                <div 
                  className="flex items-center gap-1 hover:cursor-pointer"
                  onClick={() => handleSort("key")}
                >
                  <span>Parking #</span>
                  <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </TableHead>
              <TableHead>
                <div 
                  className="flex items-center gap-1 hover:cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  <UserRound className="h-3.5 w-3.5 text-primary mr-1" />
                  <span>Customer</span>
                  <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </TableHead>
              <TableHead>
                <div 
                  className="flex items-center gap-1 hover:cursor-pointer"
                  onClick={() => handleSort("registrationNumber")}
                >
                  <Car className="h-3.5 w-3.5 text-primary mr-1" />
                  <span>Vehicle Info</span>
                  <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </TableHead>
              <TableHead>
                <div 
                  className="flex items-center gap-1 hover:cursor-pointer"
                  onClick={() => handleSort("category")}
                >
                  <Tag className="h-3.5 w-3.5 text-primary mr-1" />
                  <span>Category</span>
                  <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </TableHead>
              <TableHead>
                <div 
                  className="flex items-center gap-1 hover:cursor-pointer"
                  onClick={() => handleSort("location")}
                >
                  <MapPin className="h-3.5 w-3.5 text-primary mr-1" />
                  <span>Location</span>
                  <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </TableHead>
              <TableHead>
                <div 
                  className="flex items-center gap-1 hover:cursor-pointer"
                  onClick={() => handleSort("inTime")}
                >
                  <Clock className="h-3.5 w-3.5 text-primary mr-1" />
                  <span>In Time</span>
                  <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </TableHead>
              {includeOutTime && (
                <TableHead>
                  <div 
                    className="flex items-center gap-1 hover:cursor-pointer"
                    onClick={() => handleSort("outTime")}
                  >
                    <Clock className="h-3.5 w-3.5 text-primary mr-1" />
                    <span>Out Time</span>
                    <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                </TableHead>
              )}
              <TableHead className="text-right">
                <div 
                  className="flex items-center justify-end gap-1 hover:cursor-pointer"
                  onClick={() => handleSort("totalSpent")}
                >
                  <span>Amount</span>
                  <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((booking) => (
              <TableRow key={booking.key} className="group hover:bg-muted/50">
                <TableCell className="font-medium">{booking.key}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{booking.name}</span>
                    <span className="text-xs text-muted-foreground">{booking.company}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-mono text-sm">
                    {booking.registrationNumber}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    {booking.category}
                  </Badge>
                </TableCell>
                <TableCell>{booking.location}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{booking.inTime}</span>
                  </div>
                </TableCell>
                {includeOutTime && (
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{booking.outTime}</span>
                    </div>
                  </TableCell>
                )}
                <TableCell className="text-right font-medium">{booking.totalSpent}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  // Tab icons for visual clarity
  const tabIcons = {
    ongoing: <Timer className="h-4 w-4 text-primary" />,
    upcoming: <ClipboardList className="h-4 w-4 text-primary" />,
    past: <CheckCircle2 className="h-4 w-4 text-primary" />
  };

  return (
    <div className="p-6 min-h-screen bg-background text-foreground transition-colors">
      <div className="mb-8">
        <div className="flex items-center gap-2">
          
          <h1 className="text-3xl font-bold tracking-tight">Booking Reports</h1>
        </div>
        <p className="text-muted-foreground mt-1">
          View, filter, and export your booking data
        </p>
      </div>

      <Card className="border shadow-sm overflow-hidden">
        <CardContent className="pt-6">
          <Tabs 
            defaultValue="ongoing" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex justify-center mb-6">
              <TabsList className="grid grid-cols-3 w-full max-w-md">
                <TabsTrigger 
                  value="ongoing" 
                  className="gap-1.5 hover:cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  {tabIcons.ongoing}
                  <span>Ongoing</span>
                  <Badge className="ml-1 bg-white/20 text-white hover:bg-white/30">
                    {ongoing.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger 
                  value="upcoming" 
                  className="gap-1.5 hover:cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  {tabIcons.upcoming}
                  <span>Upcoming</span>
                  <Badge className="ml-1 bg-white/20 text-white hover:bg-white/30">
                    {upcoming.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger 
                  value="past" 
                  className="gap-1.5 hover:cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  {tabIcons.past}
                  <span>Past</span>
                  <Badge className="ml-1 bg-white/20 text-white hover:bg-white/30">
                    {past.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </div>

            <TableActions />

            <TabsContent value="ongoing" className="mt-2">
              {renderTable(ongoing)}
            </TabsContent>

            <TabsContent value="upcoming" className="mt-2">
              {renderTable(upcoming)}
            </TabsContent>

            <TabsContent value="past" className="mt-2">
              {renderTable(past, true)}
            </TabsContent>
          </Tabs>

          {/* Footer with count */}
          <div className="mt-4 flex justify-between items-center">
            <Badge variant="outline" className="text-xs py-1 px-2">
              <span className="font-medium">
                {activeTab === "ongoing" 
                  ? getFilteredData(ongoing).length 
                  : activeTab === "upcoming" 
                    ? getFilteredData(upcoming).length 
                    : getFilteredData(past).length}
              </span>
              <span className="ml-1 text-muted-foreground">records displayed</span>
            </Badge>
            {(searchQuery || selectedCategory !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="h-8 text-xs hover:cursor-pointer"
              >
                Clear filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Report;
