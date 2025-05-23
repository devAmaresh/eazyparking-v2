import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// UI Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Icons
import {
  ChevronLeft,
  ChevronRight,
  Search,
  MapPin,
  Car,
  Clock,
  ArrowRight,
  CalendarClock,
  Info,
} from "lucide-react";

interface ParkingSpot {
  id: number;
  image: string;
  location: string;
  availableSlot: number;
  totalSlot: number;
  price: string;
}

interface ParkingCardSliderProps {
  parkingSpots: ParkingSpot[];
  loading: boolean;
}

export const ParkingCardSlider: React.FC<ParkingCardSliderProps> = ({
  parkingSpots,
  loading,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSpots, setFilteredSpots] = useState<ParkingSpot[]>(parkingSpots);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSpots(parkingSpots);
    } else {
      const filtered = parkingSpots.filter((spot) =>
        spot.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSpots(filtered);
      setCurrentIndex(0);
    }
  }, [searchQuery, parkingSpots]);

  const getCardsToShow = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 1280) return 3;
      if (window.innerWidth >= 768) return 2;
      return 1;
    }
    return 3;
  };

  const [cardsToShow, setCardsToShow] = useState(getCardsToShow());

  useEffect(() => {
    const handleResize = () => {
      setCardsToShow(getCardsToShow());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    if (currentIndex < filteredSpots.length - cardsToShow) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const totalPages = Math.max(1, filteredSpots.length - cardsToShow + 1);
  const paginationDots = Array.from({ length: totalPages }, (_, i) => i);

  // Render loading skeletons
  if (loading) {
    return (
      <div className="w-full">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            disabled
            placeholder="Search locations..."
            className="pl-9"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-border">
                <Skeleton className="h-48 w-full" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-full mt-4" />
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  // Render no results
  if (filteredSpots.length === 0) {
    return (
      <div className="w-full">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="text-center py-16 px-4">
          <Info className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No parking locations found</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery
              ? `No results matching "${searchQuery}"`
              : "There are no parking locations available right now"}
          </p>
          {searchQuery && (
            <Button
              variant="outline"
              onClick={() => setSearchQuery("")}
              className="hover:cursor-pointer"
            >
              Clear search
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Calculate if we have enough cards to scroll
  const canScroll = filteredSpots.length > cardsToShow;

  return (
    <div className="w-full">
      {/* Search bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search parking locations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Slider container */}
      <div className="relative">
        {/* Navigation buttons - only show if we can scroll */}
        {canScroll && (
          <>
            <Button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              size="icon"
              variant="outline"
              className={`absolute hover:cursor-pointer -left-4 md:-left-6 top-1/2 transform -translate-y-1/2 z-10 h-8 w-8 md:h-10 md:w-10 rounded-full shadow-lg border-primary/10 bg-background/90 backdrop-blur-sm ${
                currentIndex === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "opacity-100 hover:bg-primary/10"
              }`}
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
            </Button>

            <Button
              onClick={nextSlide}
              disabled={currentIndex >= filteredSpots.length - cardsToShow}
              size="icon"
              variant="outline"
              className={`absolute hover:cursor-pointer -right-4 md:-right-6 top-1/2 transform -translate-y-1/2 z-10 h-8 w-8 md:h-10 md:w-10 rounded-full shadow-lg border-primary/10 bg-background/90 backdrop-blur-sm ${
                currentIndex >= filteredSpots.length - cardsToShow
                  ? "opacity-50 cursor-not-allowed"
                  : "opacity-100 hover:bg-primary/10"
              }`}
              aria-label="Next slide"
            >
              <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </>
        )}

        {/* Slider content */}
        <div ref={sliderRef} className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / cardsToShow)}%)`,
            }}
          >
            {filteredSpots.map((spot) => (
              <div
                key={spot.id}
                className="px-3 flex-shrink-0"
                style={{ width: `${100 / cardsToShow}%` }}
              >
                <ParkingCard spot={spot} />
              </div>
            ))}
          </div>
        </div>

        {/* Pagination dots - only show if we can scroll */}
        {canScroll && paginationDots.length > 1 && (
          <div className="flex justify-center mt-6 space-x-1.5">
            {paginationDots.map((dotIndex) => (
              <button
                key={dotIndex}
                onClick={() => goToSlide(dotIndex)}
                className={`w-2 h-2 hover:cursor-pointer rounded-full transition-all ${
                  currentIndex === dotIndex
                    ? "bg-primary w-6"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to slide ${dotIndex + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface ParkingCardProps {
  spot: ParkingSpot;
}

const ParkingCard: React.FC<ParkingCardProps> = ({ spot }) => {
  const availabilityPercentage = (spot.availableSlot / spot.totalSlot) * 100;
  const navigate = useNavigate();

  // Determine color based on availability
  const getAvailabilityColor = () => {
    if (availabilityPercentage > 60) return "text-green-500 dark:text-green-400";
    if (availabilityPercentage > 30) return "text-amber-500 dark:text-amber-400";
    return "text-red-500 dark:text-red-400";
  };



  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="rounded-xl overflow-hidden shadow-sm border border-border bg-card h-full transition-all duration-300"
    >
      {/* Card header - image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={spot.image || "/placeholder.svg"}
          alt={`Parking at ${spot.location}`}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t dark:from-background/80 dark:to-transparent" />

        {/* Price badge */}
        <Badge className="absolute top-3 right-3 bg-background/90 hover:bg-background backdrop-blur-sm text-foreground font-medium px-2.5 py-1">
          <Clock className="mr-1 h-3.5 w-3.5 text-primary" />
          {spot.price}
        </Badge>

        {/* Location badge */}
        <div className="absolute bottom-3 left-3 flex items-center">
          <Badge variant="outline" className="bg-background/90 hover:bg-background backdrop-blur-sm text-foreground py-1 pl-1.5 pr-2.5">
            <MapPin className="mr-1 h-3.5 w-3.5 text-primary" />
            {spot.location}
          </Badge>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4">
        {/* Availability section */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-1.5">
              <Car className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Availability</span>
            </div>
            <div className={`text-sm font-bold ${getAvailabilityColor()}`}>
              {spot.availableSlot}/{spot.totalSlot} slots
            </div>
          </div>

          <Progress
            value={availabilityPercentage}
            className="h-2 bg-muted"
            
          />

          <p className="text-xs text-muted-foreground mt-1.5">
            {availabilityPercentage < 30 ? (
              <span>Almost full! Book quickly</span>
            ) : availabilityPercentage < 60 ? (
              <span>Filling up quickly</span>
            ) : (
              <span>Plenty of space available</span>
            )}
          </p>
        </div>

        {/* Action button */}
        <Button
          className="w-full group hover:cursor-pointer"
          onClick={() => navigate(`/admin/bookings/${spot.id}`)}
        >
          <CalendarClock className="mr-2 h-4 w-4" />
          <span>Book Now</span>
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </motion.div>
  );
};
