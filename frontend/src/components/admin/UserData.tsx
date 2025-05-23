import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/utils/backend";
import Papa from "papaparse";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import Cookies from "js-cookie";
import { format } from "date-fns";

// ShadCN UI Components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart } from "@/components/ui/bar-chart";

// Icons
import {
  Download,
  FileText,
  Search,
  UserCircle2,
  Calendar,
  Phone,
  Mail,
  CreditCard,
  BarChart3,
  Clock,
  Car,
  MapPin,
  RefreshCw,
  FileDown,
  FileSpreadsheet,
} from "lucide-react";

// Types
declare module "jspdf" {
  interface jsPDF {
    lastAutoTable: { finalY: number };
  }
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  regDate: string;
  totalSpent: number;
  bookings: Booking[];
}

interface Booking {
  bookId: string;
  parkingLot?: {
    location: string;
    price: number;
  };
  vehicle?: {
    registrationNumber: string;
    status: string;
    inTime: string;
    outTime: string;
  };
}

const UserData = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportingCsv, setExportingCsv] = useState(false);
  // const { theme } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(
        (user) =>
          `${user.firstName} ${user.lastName}`.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.mobileNumber.includes(query)
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BACKEND_URL}/api/admin/userData`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("adminToken")}`,
        },
      });
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  const openUserDetails = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
    setActiveTab("details");
  };

  const exportUserPDF = async () => {
    if (!selectedUser) return;

    try {
      setExportingPdf(true);

      const doc = new jsPDF();

      // Add header with logo and title
      doc.setFillColor(52, 152, 219); // Blue background
      doc.rect(0, 0, doc.internal.pageSize.width, 40, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.text(
        `User Profile: ${selectedUser.firstName} ${selectedUser.lastName}`,
        105,
        20,
        { align: "center" }
      );

      doc.setFontSize(11);
      doc.text(`Generated on: ${format(new Date(), "PPP p")}`, 105, 30, {
        align: "center",
      });

      // User Basic Info
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.text("User Information", 14, 50);

      const basicInfo = [
        ["Full Name", `${selectedUser.firstName} ${selectedUser.lastName}`],
        ["Email", selectedUser.email],
        ["Phone", selectedUser.mobileNumber],
        ["Registration Date", format(new Date(selectedUser.regDate), "PPP")],
        ["Total Spent", `₹${selectedUser.totalSpent || 0}`],
      ];

      autoTable(doc, {
        startY: 55,
        head: [["Field", "Value"]],
        body: basicInfo,
        headStyles: { fillColor: [41, 128, 185] },
        styles: { fontSize: 10 },
        alternateRowStyles: { fillColor: [240, 240, 240] },
      });

      // Bookings Table
      if (selectedUser.bookings?.length) {
        doc.setFontSize(16);
        doc.text("Booking History", 14, doc.lastAutoTable.finalY + 15);

        autoTable(doc, {
          startY: doc.lastAutoTable.finalY + 20,
          head: [["Location", "Vehicle No", "Status", "In Time", "Out Time"]],
          body: selectedUser.bookings.map((booking) => [
            booking.parkingLot?.location || "N/A",
            booking.vehicle?.registrationNumber || "N/A",
            booking.vehicle?.status || "N/A",
            booking.vehicle?.inTime
              ? format(new Date(booking.vehicle.inTime), "PPp")
              : "-",
            booking.vehicle?.outTime
              ? format(new Date(booking.vehicle.outTime), "PPp")
              : "-",
          ]),
          headStyles: { fillColor: [41, 128, 185] },
          styles: { fontSize: 9 },
          alternateRowStyles: { fillColor: [240, 240, 240] },
        });
      }

      // Add footer
      const pageCount = doc.internal.pages.length;
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(
          `Page ${i} of ${pageCount} - EazyParking User Profile`,
          105,
          doc.internal.pageSize.height - 10,
          { align: "center" }
        );
      }

      doc.save(`User_${selectedUser.firstName}_${selectedUser.lastName}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setExportingPdf(false);
    }
  };

  const exportAllUsersCSV = async () => {
    try {
      setExportingCsv(true);

      const csvData = users.map((user) => ({
        Name: `${user.firstName} ${user.lastName}`,
        Email: user.email,
        Phone: user.mobileNumber,
        "Registration Date": format(new Date(user.regDate), "PPP"),
        "Total Spent": `₹${user.totalSpent || 0}`,
        "Bookings Count": user.bookings?.length || 0,
      }));

      const csv = Papa.unparse(csvData);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `EazyParking_Users_${format(
        new Date(),
        "yyyy-MM-dd"
      )}.csv`;
      link.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting CSV:", error);
    } finally {
      setExportingCsv(false);
    }
  };

  const formatChartData = (bookings: Booking[]) => {
    return bookings
      .filter((booking) => booking.parkingLot?.price)
      .map((booking, index) => ({
        name: booking.parkingLot?.location || `Booking ${index + 1}`,
        value: booking.parkingLot?.price || 0,
      }));
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP");
    } catch (e) {
      return dateString;
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPp");
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            User Insights
          </h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive view of all registered users and their activities
          </p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-full"
            />
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => fetchUsers()}
            className="flex-shrink-0 hover:cursor-pointer"
            title="Refresh users"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>

          <Button
            onClick={exportAllUsersCSV}
            disabled={exportingCsv || users.length === 0}
            className="flex-shrink-0 hover:cursor-pointer gap-1.5"
            title="Export all users to CSV"
          >
            {exportingCsv ? (
              <>
                <FileSpreadsheet className="h-4 w-4 animate-pulse" />
                <span className="hidden sm:inline">Exporting...</span>
              </>
            ) : (
              <>
                <FileDown className="h-4 w-4" />
                <span className="hidden sm:inline">Export CSV</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Registered Users</CardTitle>
          <CardDescription>
            {filteredUsers.length}{" "}
            {filteredUsers.length === 1 ? "user" : "users"} found
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <div className="rounded-md border overflow-hidden">
            {loading ? (
              <div className="p-4 space-y-5">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-4 w-1/4" />
                      </div>
                      <Skeleton className="h-8 w-20" />
                    </div>
                  ))}
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[250px]">
                      <div className="flex items-center gap-2">
                        <UserCircle2 className="h-4 w-4 text-primary" />
                        <span>User</span>
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-primary" />
                        <span>Email</span>
                      </div>
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-primary" />
                        <span>Phone</span>
                      </div>
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>Registered</span>
                      </div>
                    </TableHead>
                    <TableHead className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <CreditCard className="h-4 w-4 text-primary" />
                        <span>Spent</span>
                      </div>
                    </TableHead>
                    <TableHead className="w-[100px] text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-6 text-muted-foreground"
                      >
                        {searchQuery
                          ? "No users match your search"
                          : "No users found"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow
                        key={user.id}
                        className="group hover:bg-muted/50"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                              {user.firstName.charAt(0)}
                              {user.lastName.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-xs text-muted-foreground md:hidden">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="hidden md:table-cell">
                          {user.email}
                        </TableCell>

                        <TableCell className="hidden md:table-cell">
                          {user.mobileNumber}
                        </TableCell>

                        <TableCell className="hidden lg:table-cell">
                          {formatDate(user.regDate)}
                        </TableCell>

                        <TableCell className="text-right font-medium">
                          ₹{user.totalSpent || 0}
                        </TableCell>

                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openUserDetails(user)}
                            className="hover:cursor-pointer opacity-70 group-hover:opacity-100"
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            <span className="hidden sm:inline">Details</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* User Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <UserCircle2 className="h-6 w-6 text-primary" />
              User Details
            </DialogTitle>
            <DialogDescription>
              Comprehensive information about the selected user
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="details" className="hover:cursor-pointer">
                  <UserCircle2 className="h-4 w-4 mr-2" />
                  User Profile
                </TabsTrigger>
                <TabsTrigger value="bookings" className="hover:cursor-pointer">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Bookings & Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        Basic Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm text-muted-foreground">
                          Full Name
                        </span>
                        <span className="font-medium flex items-center gap-2">
                          <UserCircle2 className="h-4 w-4 text-primary" />
                          {selectedUser.firstName} {selectedUser.lastName}
                        </span>
                      </div>

                      <div className="flex flex-col space-y-1">
                        <span className="text-sm text-muted-foreground">
                          Email Address
                        </span>
                        <span className="font-medium flex items-center gap-2">
                          <Mail className="h-4 w-4 text-primary" />
                          {selectedUser.email}
                        </span>
                      </div>

                      <div className="flex flex-col space-y-1">
                        <span className="text-sm text-muted-foreground">
                          Mobile Number
                        </span>
                        <span className="font-medium flex items-center gap-2">
                          <Phone className="h-4 w-4 text-primary" />
                          {selectedUser.mobileNumber}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        Account Statistics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm text-muted-foreground">
                          Registration Date
                        </span>
                        <span className="font-medium flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          {formatDate(selectedUser.regDate)}
                        </span>
                      </div>

                      <div className="flex flex-col space-y-1">
                        <span className="text-sm text-muted-foreground">
                          Total Spent
                        </span>
                        <span className="font-medium flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-primary" />₹
                          {selectedUser.totalSpent || 0}
                        </span>
                      </div>

                      <div className="flex flex-col space-y-1">
                        <span className="text-sm text-muted-foreground">
                          Booking Count
                        </span>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              selectedUser.bookings.length > 0
                                ? "default"
                                : "outline"
                            }
                          >
                            {selectedUser.bookings.length} bookings
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="bookings" className="mt-0">
                <Card className="border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Booking History</CardTitle>
                    <CardDescription>
                      {selectedUser.bookings.length > 0
                        ? `${selectedUser.bookings.length} bookings found`
                        : "No booking history found"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedUser.bookings.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No bookings found for this user
                      </div>
                    ) : (
                      <div className="rounded-md border overflow-hidden">
                        <Table>
                          <TableHeader className="bg-muted/50">
                            <TableRow>
                              <TableHead>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-primary" />
                                  <span>Location</span>
                                </div>
                              </TableHead>
                              <TableHead>
                                <div className="flex items-center gap-2">
                                  <Car className="h-4 w-4 text-primary" />
                                  <span>Vehicle</span>
                                </div>
                              </TableHead>
                              <TableHead className="hidden md:table-cell">
                                Status
                              </TableHead>
                              <TableHead className="hidden md:table-cell">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-primary" />
                                  <span>Timing</span>
                                </div>
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedUser.bookings.map((booking) => (
                              <TableRow
                                key={booking.bookId}
                                className="group hover:bg-muted/50"
                              >
                                <TableCell>
                                  {booking.parkingLot?.location || "N/A"}
                                </TableCell>
                                <TableCell className="font-mono">
                                  {booking.vehicle?.registrationNumber || "N/A"}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  <Badge
                                    variant={
                                      booking.vehicle?.status === "in"
                                        ? "default"
                                        : booking.vehicle?.status === "out"
                                        ? "secondary"
                                        : "outline"
                                    }
                                  >
                                    {booking.vehicle?.status || "N/A"}
                                  </Badge>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  <div className="flex flex-col space-y-1">
                                    <div className="flex items-center text-xs">
                                      <span className="text-muted-foreground mr-2">
                                        In:
                                      </span>
                                      {booking.vehicle?.inTime
                                        ? formatDateTime(booking.vehicle.inTime)
                                        : "-"}
                                    </div>
                                    <div className="flex items-center text-xs">
                                      <span className="text-muted-foreground mr-2">
                                        Out:
                                      </span>
                                      {booking.vehicle?.outTime
                                        ? formatDateTime(
                                            booking.vehicle.outTime
                                          )
                                        : "-"}
                                    </div>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {selectedUser.bookings.length > 0 && (
                  <Card className="border shadow-sm mt-4">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        Spending Analytics
                      </CardTitle>
                      <CardDescription>
                        Visualization of user's spending per booking
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[350px] w-full">
                        <BarChart
                          data={formatChartData(selectedUser.bookings)}
                          valueFormatter={(value) => `₹${value}`}
                          showAnimation={true}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="hover:cursor-pointer"
            >
              Close
            </Button>
            <Button
              onClick={exportUserPDF}
              disabled={exportingPdf || !selectedUser}
              className="gap-1.5 hover:cursor-pointer"
            >
              {exportingPdf ? (
                <>
                  <Download className="h-4 w-4 animate-spin" />
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Export PDF</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserData;
