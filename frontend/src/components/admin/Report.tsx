import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Table, Button, Space, Input } from "antd";
import { BACKEND_URL } from "@/utils/backend";
import Papa from "papaparse";
import Cookies from "js-cookie";
import { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable: { finalY: number };
  }
}

const Report = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [ongoing, setOngoing] = useState<any[]>([]);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [past, setPast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<any>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: string
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

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
  }
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
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  const exportCSV = () => {
    const csv = Papa.unparse(
      bookings.map((b) => ({
        "Parking Number": b.key || "N/A",
        Name: `${b.name}` || "N/A",
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
    link.download = "Report.csv";
    link.click();
  };

  const getColumnSearchProps = (dataIndex: string) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: FilterDropdownProps) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value: any, record: any) =>
      `${record[dataIndex]}`.toLowerCase().includes(value.toLowerCase()),
    render: (text: string) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const bookingsColumns = [
    {
      title: "Parking Number",
      dataIndex: "key",
      ...getColumnSearchProps("key"),
    },
    {
      title: "Name",
      dataIndex: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Company",
      dataIndex: "company",
      ...getColumnSearchProps("company"),
    },
    {
      title: "Reg No",
      dataIndex: "registrationNumber",
      ...getColumnSearchProps("registrationNumber"),
    },
    {
      title: "Category",
      dataIndex: "category",
      ...getColumnSearchProps("category"),
    },
    {
      title: "Location",
      dataIndex: "location",
      ...getColumnSearchProps("location"),
    },
    {
      title: "In Time",
      dataIndex: "inTime",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Total Spent",
      dataIndex: "totalSpent",
      render: (val: number) => `${val || 0}`,
    },
  ];

  const outTimeColumn = {
    title: "Out Time",
    dataIndex: "outTime",
    render: (date: string) => new Date(date).toLocaleDateString(),
  };

  const pastBookingColumns = [
    ...bookingsColumns.slice(0, 5),
    outTimeColumn,
    ...bookingsColumns.slice(5),
  ];

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text("Parking Booking Report", 14, 22);

    const sections = [
      { title: "Ongoing Bookings", data: ongoing },
      { title: "Upcoming Bookings", data: upcoming },
      { title: "Past Bookings", data: past },
    ];

    let finalY = 30;

    sections.forEach((section, _index) => {
      if (section.data.length > 0) {
        doc.setTextColor(0, 112, 192); // blue
        doc.setFontSize(14);
        doc.text(section.title, 14, finalY);
        finalY += 6;

        autoTable(doc, {
          startY: finalY,
          head: [
            [
              "Parking Number",
              "Name",
              "Company Name",
              "Reg No",
              "Category",
              "Location",
              "In Time",
              ...(section.title === "Past Bookings" ? ["Out Time"] : []),
              "Total Spent",
            ],
          ],
          body: section.data.map((b) => [
            b.key || "N/A",
            b.name || "N/A",
            b.company || "N/A",
            b.registrationNumber || "N/A",
            b.category || "N/A",
            b.location || "N/A",
            b.inTime || "-",
            ...(section.title === "Past Bookings" ? [b.outTime || "-"] : []),
            `₹${b.totalSpent}`,
          ]),
          theme: "grid",
          styles: {
            fillColor: [240, 240, 240],
            textColor: 20,
            fontSize: 10,
          },
          headStyles: {
            fillColor: [0, 112, 192], // blue header
            textColor: 255,
            fontStyle: "bold",
          },
          margin: { left: 14, right: 14 },
        });

        finalY = doc.lastAutoTable.finalY + 10;
      }
    });

    doc.save("Booking_Report.pdf");
  };



  return (
    <div className="flex flex-col">
        <Space className="flex items-center justify-end mt-8 -mb-4 mr-10">
          <Button type="primary" onClick={exportCSV}>
            Export CSV
          </Button>
          <Button
            onClick={exportPDF}
            type="dashed"
            icon={<Download className="w-4 h-4" />}
          >
            Export PDF
          </Button>
        </Space>
    <Tabs defaultValue="ongoing" className="w-full p-10">
      <center>
        <TabsList className="bg-zinc-200 dark:bg-zinc-800">
          <TabsTrigger value="ongoing" className="hover:cursor-pointer w-44">
            Ongoing Bookings
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="hover:cursor-pointer w-44">
            Upcoming Bookings
          </TabsTrigger>
          <TabsTrigger value="past" className="hover:cursor-pointer w-44">
            Past Bookings
          </TabsTrigger>
        </TabsList>
      </center>

      <TabsContent value="ongoing">
         <Table
            columns={bookingsColumns}
            dataSource={ongoing}
            rowKey="id"
            pagination={{ pageSize: 6 }}
            bordered
            loading={loading}
            className="my-4"
            />
      </TabsContent>

      <TabsContent value="upcoming">
      <Table
            columns={bookingsColumns}
            dataSource={upcoming}
            rowKey="id"
            pagination={{ pageSize: 6 }}
            bordered
            loading={loading}
            className="my-4"
            />
      </TabsContent>

      <TabsContent value="past">
      <Table
            columns={pastBookingColumns}
            dataSource={past}
            rowKey="id"
            pagination={{ pageSize: 6 }}
            bordered
            loading={loading}
            className="my-4"
          />
      </TabsContent>
    </Tabs>
    </div>
  );
};

export default Report;
