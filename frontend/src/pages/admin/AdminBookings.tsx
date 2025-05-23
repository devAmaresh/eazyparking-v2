import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { BACKEND_URL } from "@/utils/backend";
import { toast } from "react-hot-toast";
import { ParkingCardSlider } from "@/components/admin/ParkingCardSlider";

const AdminBookings = () => {
  const [parkingSpots, setParkingSpots] = useState([]);
  const [loading, setLoading] = useState(true);

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
      } catch (error) {
        console.error("Failed to fetch parking spots:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchParkingSpots();
  }, []);

  return <ParkingCardSlider parkingSpots={parkingSpots} loading={loading} />;
};

export default AdminBookings;
