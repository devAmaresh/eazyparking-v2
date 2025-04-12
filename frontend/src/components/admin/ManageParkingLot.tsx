import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Table, Spin, Input, Button, Space, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { BACKEND_URL } from "@/utils/backend";

type ParkingLot = {
  id: string;
  location: string;
  imgUrl: string;
  totalSlot: number;
  bookedSlot: number;
  price: number;
};

type DataIndex = keyof ParkingLot;

const ManageParkingLot = () => {
  const token = Cookies.get("adminToken");
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  useEffect(() => {
    const fetchParkingLots = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${BACKEND_URL}/api/user/getParkings`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setParkingLots(response.data);
      } catch (error) {
        console.error("Error fetching parking lots:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchParkingLots();
  }, []);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<ParkingLot> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
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
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ?.toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
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

  const columns: TableColumnsType<ParkingLot> = [
    {
      title: "Image",
      dataIndex: "imgUrl",
      key: "imgUrl",
      render: (url: string) => (
        <img src={url} alt="parking" style={{ width: 100, borderRadius: 8 }} />
      ),
    },

    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      ...getColumnSearchProps("location"),
    },
    {
      title: "Total Slots",
      dataIndex: "totalSlot",
      key: "totalSlot",
    },
    {
      title: "Booked Slot",
      dataIndex: "bookedSlot",
      key: "bookedSlot",
      render: (booked, record) => (
        <Tag color={booked === record.totalSlot ? "red" : "green"}>
          {booked}/{record.totalSlot}
        </Tag>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `₹${price}`,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <a
          onClick={() => editParkingLot(record.id)}
          style={{ color: "#1677ff" }}
        >
          Edit
        </a>
      ),
    },
  ];

  const editParkingLot = (id: string) => {
    console.log("Edit parking lot:", id);
  };

  return (
    <div style={{ padding: 24 }}>
      {loading ? (
        <div style={{ textAlign: "center", marginTop: 50 }}>
          <Spin size="large" tip="Loading Parking Lots" />
          
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={parkingLots}
          rowKey="id"
          bordered
          pagination={{ pageSize: 5 }}
        />
      )}
    </div>
  );
};

export default ManageParkingLot;
