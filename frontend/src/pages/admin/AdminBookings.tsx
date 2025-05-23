import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { BACKEND_URL } from "@/utils/backend";
import { toast } from "react-hot-toast";
import { ParkingCardSlider } from "@/components/admin/ParkingCardSlider";

// UI Components
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Icons
import { Map, MapPin, Calendar } from "lucide-react";

interface ParkingSpot {
  id: number;
  image: string;
  location: string;
  availableSlot: number;
  totalSlot: number;
  price: string;
}

const AdminBookings = () => {
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLocations: 0,
    totalSlots: 0,
    availableSlots: 0,
  });

  // Fetch parking data from API
  useEffect(() => {
    const fetchParkingSpots = async () => {
      setLoading(true);
      try {
        const token = Cookies.get("adminToken");
        if (!token) {
          toast.error("Admin token not found");
          return;
        }

        const res = await axios.get(`${BACKEND_URL}/api/user/getParkings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const transformed = res.data.map((lot: any) => ({
          id: lot.id,
          image: lot.imgUrl,
          location: lot.location,
          availableSlot: lot.totalSlot - lot.bookedSlot,
          totalSlot: lot.totalSlot,
          price: `₹${lot.price}/hr`,
        }));

        setParkingSpots(transformed);

        // Calculate stats
        const totalSlots = transformed.reduce(
          (acc: any, spot: any) => acc + spot.totalSlot,
          0
        );
        const availableSlots = transformed.reduce(
          (acc: any, spot: any) => acc + spot.availableSlot,
          0
        );

        setStats({
          totalLocations: transformed.length,
          totalSlots,
          availableSlots,
        });
      } catch (error) {
        console.error("Failed to fetch parking spots:", error);
        toast.error("Failed to load parking locations");
      } finally {
        setLoading(false);
      }
    };

    fetchParkingSpots();
  }, []);

  return (
    <div className="p-6 bg-background text-foreground">
      {/* Compact Header with Inline Stats */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl font-bold">Parking Locations</h1>
          </div>
          <p className="text-muted-foreground">
            Book parking slots across different locations
          </p>
        </div>

        {/* Inline Stats */}
        {!loading && (
          <div className="flex gap-3 flex-wrap">
            <Badge
              variant="outline"
              className=" bg-blue-500/10 border-blue-500/20 text-foreground"
            >
              <Map className="h-8 w-8 mr-1 text-blue-500" />
              <span className="font-medium">{stats.totalLocations}</span>
              <span className="text-muted-foreground ml-1 text-xs">
                Locations
              </span>
            </Badge>

            <Badge
              variant="outline"
              className=" bg-purple-500/10 border-purple-500/20 text-foreground"
            >
              <Calendar className="h-5 w-5 mr-1 text-purple-500" />
              <span className="font-medium">{stats.totalSlots}</span>
              <span className="text-muted-foreground ml-1 text-xs">
                Total Slots
              </span>
            </Badge>

            <Badge
              variant="outline"
              className=" bg-emerald-500/10 border-emerald-500/20 text-foreground"
            >
              <MapPin className="h-8 w-8 mr-1 text-emerald-500" />
              <span className="font-medium">{stats.availableSlots}</span>
              <span className="text-muted-foreground ml-1 text-xs">
                Available
              </span>
            </Badge>
          </div>
        )}
      </div>

      {/* Main Content - Just the card slider with a subtle background */}
      <Card className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <CardContent className="p-6">
          <ParkingCardSlider parkingSpots={parkingSpots} loading={loading} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBookings;
