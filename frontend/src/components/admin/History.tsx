import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';
import { BACKEND_URL } from '@/utils/backend';
import { VehicleTableLayout, StatusBadge } from './VehicleTableLayout';
import { format, formatDistance } from 'date-fns';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { Button } from '@/components/ui/button';

// Icons
import { Calendar, FileText, HistoryIcon, User, Car, FileDown, ReceiptText, Download } from 'lucide-react';

interface HistoryVehicleType {
  id: string;
  parkingNumber: string;
  ownerName: string;
  registrationNumber: string;
  settledTime: string;
  remark: string;
}

const History: React.FC = () => {
  const [data, setData] = useState<HistoryVehicleType[]>([]);
  const [filteredData, setFilteredData] = useState<HistoryVehicleType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloading, setDownloading] = useState(false);

  const fetchHistory = async () => {
    const token = Cookies.get('adminToken');
    if (!token) {
      toast.error('Admin token not found!');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${BACKEND_URL}/api/admin/vehicle/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response.data);
      setFilteredData(response.data);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to fetch historical vehicles';
      setError(msg);
      toast.error(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = data.filter(
        (vehicle) =>
          vehicle.parkingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vehicle.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vehicle.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vehicle.remark.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [searchQuery, data]);
  
  const generatePDF = () => {
    setDownloading(true);
    
    try {
      const doc = new jsPDF();
      
      // Add header with logo and title
      doc.setFillColor(52, 152, 219); // Blue background
      doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.text('EazyParking - Vehicle History', 105, 20, { align: 'center' });
      
      doc.setFontSize(11);
      const date = new Date();
      doc.text(`Generated on: ${format(date, 'PPP p')}`, 105, 30, { align: 'center' });
      
      // Add table data
      const tableColumn = ["S.No", "Parking Number", "Owner", "Vehicle Number", "Settled Time", "Remark"];
      const tableRows = filteredData.map((vehicle, index) => [
        index + 1,
        vehicle.parkingNumber,
        vehicle.ownerName,
        vehicle.registrationNumber,
        format(new Date(vehicle.settledTime), 'PPP p'),
        vehicle.remark || 'N/A'
      ]);
      
      // Generate table
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 50,
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { 
          fillColor: [52, 152, 219],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        alternateRowStyles: { fillColor: [240, 240, 240] },
        margin: { top: 50 }
      });
      
      // Add footer
      const pageCount = doc.internal.pages.length;
      for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(
          `Page ${i} of ${pageCount} - EazyParking Vehicle History`, 
          105, 
          doc.internal.pageSize.height - 10, 
          { align: 'center' }
        );
      }
      
      // Save PDF
      doc.save(`EazyParking_Vehicle_History_${format(date, 'yyyy-MM-dd')}.pdf`);
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setDownloading(false);
    }
  };

  // Download button that will appear in the header
  const downloadButton = (
    <Button 
      onClick={generatePDF} 
      disabled={downloading || loading || filteredData.length === 0}
      className="flex items-center gap-2 bg-primary hover:bg-primary/90 hover:cursor-pointer"
      size="sm"
    >
      {downloading ? (
        <>
          <FileDown className="h-4 w-4 animate-bounce" />
          <span>Generating...</span>
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          <span>Download PDF</span>
        </>
      )}
    </Button>
  );

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
      cell: (item: HistoryVehicleType) => (
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
      cell: (item: HistoryVehicleType) => <div>{item.ownerName}</div>,
    },
    {
      key: 'registrationNumber',
      header: (
        <div className="flex items-center gap-2">
          <Car className="h-4 w-4 text-primary" />
          <span>Reg. Number</span>
        </div>
      ),
      cell: (item: HistoryVehicleType) => (
        <div className="font-mono">{item.registrationNumber}</div>
      ),
    },
    {
      key: 'settledTime',
      header: (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          <span>Settled Time</span>
        </div>
      ),
      cell: (item: HistoryVehicleType) => {
        try {
          const date = new Date(item.settledTime);
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
          return item.settledTime;
        }
      },
    },
    {
      key: 'remark',
      header: (
        <div className="flex items-center gap-2">
          <ReceiptText className="h-4 w-4 text-primary" />
          <span>Remark</span>
        </div>
      ),
      cell: (item: HistoryVehicleType) => (
        <div className="max-w-[200px] truncate" title={item.remark}>
          {item.remark || <span className="text-muted-foreground italic text-xs">No remark</span>}
        </div>
      ),
    },
    {
      key: 'status',
      header: (
        <div className="flex items-center gap-2">
          <HistoryIcon className="h-4 w-4 text-primary" />
          <span>Status</span>
        </div>
      ),
      cell: () => <StatusBadge status="completed" text="Completed" />,
    }
  ];

  return (
    <VehicleTableLayout
      title="Completed Bookings"
      subtitle="View history of all completed parking transactions"
      icon={<HistoryIcon className="h-5 w-5 text-primary" />}
      data={filteredData}
      columns={columns}
      loading={loading}
      error={error}
      onSearch={setSearchQuery}
      searchQuery={searchQuery}
      onRefresh={fetchHistory}
      emptyMessage="No history records found"
      actionComponent={downloadButton}
    />
  );
};

export default History;
