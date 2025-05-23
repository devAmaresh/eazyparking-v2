import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';
import { BACKEND_URL } from '@/utils/backend';
import { VehicleTableLayout, RemarkDialog, StatusBadge } from './VehicleTableLayout';
import { format, formatDistance } from 'date-fns';

// Icons
import { LogOut, Calendar, User, FileText, Car, ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OutVehicleType {
  id: string;
  parkingNumber: string;
  ownerName: string;
  registrationNumber: string;
  outTime: string;
}

const OutVehicle: React.FC = () => {
  const [data, setData] = useState<OutVehicleType[]>([]);
  const [filteredData, setFilteredData] = useState<OutVehicleType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [remarkModalVisible, setRemarkModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [remark, setRemark] = useState('');
  const [settling, setSettling] = useState(false);

  const fetchOutVehicles = async () => {
    const token = Cookies.get('adminToken');
    if (!token) {
      toast.error('Admin token not found!');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${BACKEND_URL}/api/admin/vehicle/out`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response.data);
      setFilteredData(response.data);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to fetch out vehicles';
      setError(msg);
      toast.error(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOutVehicles();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = data.filter(
        (vehicle) =>
          vehicle.parkingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vehicle.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vehicle.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [searchQuery, data]);

  const handleSettle = async () => {
    const token = Cookies.get('adminToken');
    if (!token) {
      toast.error('Admin token not found!');
      return;
    }

    try {
      setSettling(true);
      await axios.post(
        `${BACKEND_URL}/api/admin/vehicle/settle`,
        { vehicleId: selectedId, remark },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Vehicle settled and moved to history!');
      setRemark('');
      setRemarkModalVisible(false);
      fetchOutVehicles();
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to settle vehicle';
      toast.error(msg);
      console.error(err);
    } finally {
      setSettling(false);
    }
  };

  const columns = [
    {
      key: 'index',
      header: '#',
      cell: (_: any, index: number) => (
        <div className="font-medium text-muted-foreground">{index + 1}</div>
      ),
    },
    {
      key: 'parkingNumber',
      header: (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <span>Parking Number</span>
        </div>
      ),
      cell: (item: OutVehicleType) => (
        <div className="font-medium">{item.parkingNumber}</div>
      ),
    },
    {
      key: 'ownerName',
      header: (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-primary" />
          <span>Owner</span>
        </div>
      ),
      cell: (item: OutVehicleType) => <div>{item.ownerName}</div>,
    },
    {
      key: 'registrationNumber',
      header: (
        <div className="flex items-center gap-2">
          <Car className="h-4 w-4 text-primary" />
          <span>Reg. Number</span>
        </div>
      ),
      cell: (item: OutVehicleType) => (
        <div className="font-mono">{item.registrationNumber}</div>
      ),
    },
    {
      key: 'inTime',
      header: (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          <span>In Date</span>
        </div>
      ),
      cell: (item: OutVehicleType) => {
        try {
          const date = new Date(item.outTime); // Using outTime as this is what's in the data
          return (
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {format(date, 'MMM dd, yyyy h:mm a')}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDistance(new Date(), date, { addSuffix: true })}
              </span>
            </div>
          );
        } catch (e) {
          return item.outTime;
        }
      },
    },
    {
      key: 'status',
      header: (
        <div className="flex items-center gap-2">
          <LogOut className="h-4 w-4 text-primary" />
          <span>Status</span>
        </div>
      ),
      cell: () => <StatusBadge status="parked" text="Parked" />,
    },
    {
      key: 'action',
      header: '',
      cell: (item: OutVehicleType) => (
        <Button
          size="sm"
          className="bg-green-600 hover:cursor-pointer hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 flex items-center gap-1 font-medium"
          onClick={() => {
            setSelectedId(item.id);
            setRemarkModalVisible(true);
          }}
        >
          <ArrowRightLeft className="h-3.5 w-3.5" />
          Settle
        </Button>
      ),
    },
  ];

  return (
    <>
      <VehicleTableLayout
        title="Parked Vehicles"
        subtitle="Manage vehicles currently parked in your locations"
        icon={<LogOut className="h-5 w-5 text-primary" />}
        data={filteredData}
        columns={columns}
        loading={loading}
        error={error}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
        onRefresh={fetchOutVehicles}
        emptyMessage="No parked vehicles found"
      />

      <RemarkDialog
        isOpen={remarkModalVisible}
        onClose={() => setRemarkModalVisible(false)}
        onConfirm={handleSettle}
        remark={remark}
        setRemark={setRemark}
        title="Settle Vehicle"
        description="Add a remark to complete the parking transaction"
        confirmText="Settle Vehicle"
        loading={settling}
      />
    </>
  );
};

export default OutVehicle;
