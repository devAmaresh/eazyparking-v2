import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';
import { BACKEND_URL } from '@/utils/backend';
import { VehicleTableLayout, StatusBadge } from './VehicleTableLayout';
import { format, formatDistance } from 'date-fns';

// Icons
import { Car, Calendar, User, FileText, Clock } from 'lucide-react';

interface InVehicleType {
  id: string;
  parkingNumber: string;
  ownerName: string;
  registrationNumber: string;
  inTime: string;
}

const InVehicle: React.FC = () => {
  const [data, setData] = useState<InVehicleType[]>([]);
  const [filteredData, setFilteredData] = useState<InVehicleType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchInVehicles = async () => {
    const token = Cookies.get('adminToken');
    if (!token) {
      toast.error('Admin token not found!');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${BACKEND_URL}/api/admin/vehicle/upcoming`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response.data);
      setFilteredData(response.data);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to fetch in vehicles';
      setError(msg);
      toast.error(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInVehicles();
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

  // Format date with relative time
  const formatInTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    try {
      // If it's in the future, show how far away
      if (date > now) {
        return (
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {format(date, 'MMM dd, yyyy h:mm a')}
            </span>
            <span className="text-xs text-muted-foreground mt-0.5">
              {formatDistance(date, now, { addSuffix: true })}
            </span>
          </div>
        );
      } else {
        // If it's in the past
        return (
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {format(date, 'MMM dd, yyyy h:mm a')}
            </span>
            <span className="text-xs text-destructive mt-0.5">
              {formatDistance(now, date, { addSuffix: true })}
            </span>
          </div>
        );
      }
    } catch (e) {
      return dateString;
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
      cell: (item: InVehicleType) => (
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
      cell: (item: InVehicleType) => <div>{item.ownerName}</div>,
    },
    {
      key: 'registrationNumber',
      header: (
        <div className="flex items-center gap-2">
          <Car className="h-4 w-4 text-primary" />
          <span>Reg. Number</span>
        </div>
      ),
      cell: (item: InVehicleType) => (
        <div className="font-mono">{item.registrationNumber}</div>
      ),
    },
    {
      key: 'inTime',
      header: (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          <span>Arrival Time</span>
        </div>
      ),
      cell: (item: InVehicleType) => formatInTime(item.inTime),
    },
    {
      key: 'status',
      header: (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <span>Status</span>
        </div>
      ),
      cell: (item: InVehicleType) => {
        const arrivalDate = new Date(item.inTime);
        const now = new Date();
        
        return (
          <StatusBadge 
            status={arrivalDate > now ? "upcoming" : "parked"} 
            text={arrivalDate > now ? "Upcoming" : "Due for Arrival"} 
          />
        );
      },
    },
  ];

  return (
    <VehicleTableLayout
      title="Upcoming Vehicles"
      subtitle="View all vehicles that are due for arrival"
      icon={<Car className="h-5 w-5 text-primary" />}
      data={filteredData}
      columns={columns}
      loading={loading}
      error={error}
      onSearch={setSearchQuery}
      searchQuery={searchQuery}
      onRefresh={fetchInVehicles}
      emptyMessage="No upcoming vehicles found"
    />
  );
};

export default InVehicle;
