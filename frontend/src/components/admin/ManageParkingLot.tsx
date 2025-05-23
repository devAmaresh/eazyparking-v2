import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { BACKEND_URL } from "@/utils/backend";
import { toast } from "react-hot-toast";

// ShadCN UI Components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Icons
import {
  Pencil,
  Search,
  Loader2,
  ParkingSquare,
  ArrowUpDown,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type ParkingLot = {
  id: string;
  location: string;
  imgUrl: string;
  totalSlot: number;
  bookedSlot: number;
  price: number;
};

// Form validation schema
const parkingLotSchema = z.object({
  location: z
    .string()
    .min(3, { message: "Location must be at least 3 characters" }),
  imgUrl: z.string().url({ message: "Please enter a valid image URL" }),
  totalSlot: z.coerce
    .number()
    .positive({ message: "Total slots must be a positive number" }),
  price: z.coerce
    .number()
    .nonnegative({ message: "Price must be zero or positive" }),
});

type ParkingLotFormValues = z.infer<typeof parkingLotSchema>;

const ManageParkingLot = () => {
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([]);
  const [filteredLots, setFilteredLots] = useState<ParkingLot[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLot, setSelectedLot] = useState<ParkingLot | null>(null);
  const [updating, setUpdating] = useState(false);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Initialize form
  const form = useForm<ParkingLotFormValues>({
    resolver: zodResolver(parkingLotSchema),
    defaultValues: {
      location: "",
      imgUrl: "",
      totalSlot: 1,
      price: 0,
    },
  });

  useEffect(() => {
    fetchParkingLots();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = parkingLots.filter((lot) =>
        lot.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredLots(filtered);
    } else {
      setFilteredLots(parkingLots);
    }
  }, [searchQuery, parkingLots]);

  const fetchParkingLots = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("adminToken");
      if (!token) {
        toast.error("Authentication token not found");
        return;
      }

      const response = await axios.get(`${BACKEND_URL}/api/user/getParkings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setParkingLots(response.data);
      setFilteredLots(response.data);
    } catch (error) {
      console.error("Error fetching parking lots:", error);
      toast.error("Failed to load parking lots");
    } finally {
      setLoading(false);
    }
  };

  const editParkingLot = (lot: ParkingLot) => {
    setSelectedLot(lot);
    form.reset({
      location: lot.location,
      imgUrl: lot.imgUrl,
      totalSlot: lot.totalSlot,
      price: lot.price,
    });
    setIsEditDialogOpen(true);
  };

  const onSubmit = async (values: ParkingLotFormValues) => {
    if (!selectedLot) return;

    const token = Cookies.get("adminToken");
    if (!token) {
      toast.error("Authentication token not found");
      return;
    }

    try {
      setUpdating(true);
      const response = await axios.patch(
        `${BACKEND_URL}/api/admin/addParkingLot/${selectedLot.id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setParkingLots((prev) =>
        prev.map((lot) =>
          lot.id === selectedLot.id ? { ...response.data } : lot
        )
      );

      setIsEditDialogOpen(false);
      toast.success("Parking lot updated successfully!");
    } catch (error) {
      console.error("Error updating parking lot:", error);
      toast.error("Failed to update parking lot");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = (lot: ParkingLot) => {
    setSelectedLot(lot);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedLot) return;

    const token = Cookies.get("adminToken");
    if (!token) {
      toast.error("Authentication token not found");
      return;
    }

    try {
      setUpdating(true);
      await axios.delete(
        `${BACKEND_URL}/api/admin/addParkingLot/${selectedLot.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setParkingLots((prev) => prev.filter((lot) => lot.id !== selectedLot.id));
      setFilteredLots((prev) =>
        prev.filter((lot) => lot.id !== selectedLot.id)
      );

      setIsDeleteDialogOpen(false);
      toast.success("Parking lot deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting parking lot:", error);
      toast.error(
        "Failed to delete parking lot " + error?.response?.data?.message
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Toggle direction if already sorting by this column
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new sort column and default to ascending
      setSortColumn(column);
      setSortDirection("asc");
    }

    // Sort the data
    const sorted = [...filteredLots].sort((a: any, b: any) => {
      if (column === "location") {
        return sortDirection === "asc"
          ? a.location.localeCompare(b.location)
          : b.location.localeCompare(a.location);
      } else {
        return sortDirection === "asc"
          ? a[column] - b[column]
          : b[column] - a[column];
      }
    });

    setFilteredLots(sorted);
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <ParkingSquare className="h-6 w-6 text-primary" />
              Manage Parking Lots
            </CardTitle>
            <CardDescription>
              View and edit all parking locations in your system
            </CardDescription>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-full"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={fetchParkingLots}
              className="flex-shrink-0"
              title="Refresh"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border overflow-hidden">
          {loading ? (
            <div className="p-4 space-y-5">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-20 w-20 rounded-md" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                  </div>
                ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[100px]">Image</TableHead>
                    <TableHead>
                      <div
                        className="flex items-center gap-1 cursor-pointer"
                        onClick={() => handleSort("location")}
                      >
                        Location
                        <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                    </TableHead>
                    <TableHead className="text-center">
                      <div
                        className="flex items-center justify-center gap-1 cursor-pointer"
                        onClick={() => handleSort("totalSlot")}
                      >
                        Total Slots
                        <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                    </TableHead>
                    <TableHead className="text-center">
                      <div
                        className="flex items-center justify-center gap-1 cursor-pointer"
                        onClick={() => handleSort("bookedSlot")}
                      >
                        Occupancy
                        <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                    </TableHead>
                    <TableHead className="text-center">
                      <div
                        className="flex items-center justify-center gap-1 cursor-pointer"
                        onClick={() => handleSort("price")}
                      >
                        Price
                        <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLots.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-muted-foreground"
                      >
                        {searchQuery
                          ? "No matching parking lots found"
                          : "No parking lots available"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLots.map((lot) => (
                      <TableRow
                        key={lot.id}
                        className="group hover:bg-muted/50"
                      >
                        <TableCell>
                          <img
                            src={lot.imgUrl}
                            alt={lot.location}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {lot.location}
                        </TableCell>
                        <TableCell className="text-center">
                          {lot.totalSlot}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={
                              lot.bookedSlot >= 0.9 * lot.totalSlot
                                ? "destructive"
                                : lot.bookedSlot >= 0.6 * lot.totalSlot
                                ? "secondary"
                                : "outline"
                            }
                            className={`font-medium text-black ${
                              lot.bookedSlot >= 0.9 * lot.totalSlot
                                ? "bg-red-300/80"
                                : lot.bookedSlot >= 0.6 * lot.totalSlot
                                ? "bg-yellow-300/80"
                                : "bg-green-300/80"
                            }`}
                          >
                            {lot.bookedSlot}/{lot.totalSlot}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          ₹{lot.price}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => editParkingLot(lot)}
                              className="opacity-70 group-hover:opacity-100"
                            >
                              <Pencil className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(lot)}
                              className="opacity-70 hover:cursor-pointer flex justify-center items-center group-hover:opacity-100 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                             
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Parking Lot</DialogTitle>
            <DialogDescription>
              Update the details for {selectedLot?.location}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 py-2"
            >
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imgUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalSlot"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Slots</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (₹ per hour)</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  disabled={updating}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updating} className="ml-2">
                  {updating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Parking Lot</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the parking lot "
              {selectedLot?.location}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={updating}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={updating}
              className="ml-2"
              onClick={confirmDelete}
            >
              {updating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Parking Lot"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ManageParkingLot;
