import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { BACKEND_URL } from '../utils/backend';

// Define the interface for a parking lot
interface ParkingLot {
  id: string;
  name: string;
  locations: string;
  imgUrl: string;
  totalSlots?: number;
  bookedSlots?: number;
  price?: number;
}

const ParkingCardSlider: React.FC = () => {
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([]);

  useEffect(() => {
    const fetchParkingLots = async () => {
      try {
        const response = await axios.get<ParkingLot[]>(`${BACKEND_URL}/api/locations/`);
        console.log('Fetched parking lots:', response.data); // Debugging line
        setParkingLots(response.data);
      } catch (error) {
        console.error('Error fetching parking lots:', error);
      }
    };

    fetchParkingLots();
  }, []);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Available Parking Locations
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', paddingBottom: 1 }}>
        {parkingLots.map((lot) => (
          <Card key={lot.id} sx={{ minWidth: 200, flex: '0 0 auto' }}>
            <CardMedia
              component="img"
              height="120"
              image={lot.imgUrl}
              alt={lot.name}
            />
            <CardContent>
              <Typography variant="h6">
                {lot.name}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" variant="contained">
                Book
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default ParkingCardSlider;