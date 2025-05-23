import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/utils/backend";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// ShadCN UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Icons
import {
  Loader2,
  ParkingSquare,
  MapPin,
  ImageIcon,
  CreditCard,
  Warehouse,
} from "lucide-react";

// Form validation schema
const parkingLotSchema = z.object({
  location: z
    .string()
    .min(3, { message: "Location must be at least 3 characters" }),
  imgUrl: z.string().url({ message: "Please enter a valid image URL" }),
  totalSlot: z
    .coerce
    .number()
    .positive({ message: "Total slots must be a positive number" }),
  price: z
    .coerce
    .number()
    .nonnegative({ message: "Price must be zero or positive" }),
});

type ParkingLotFormValues = z.infer<typeof parkingLotSchema>;

const AddParkingLot = () => {
  const [loading, setLoading] = useState(false);

  // Initialize form with zod resolver
  const form = useForm<ParkingLotFormValues>({
    resolver: zodResolver(parkingLotSchema),
    defaultValues: {
      location: "",
      imgUrl: "",
      totalSlot: 1,
      price: 0,
    },
  });

  const onSubmit = async (values: ParkingLotFormValues) => {
    setLoading(true);
    try {
      await axios.post(
        `${BACKEND_URL}/api/admin/addParkingLot`,
        values,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("adminToken")}`,
          },
        }
      );
      toast.success("Parking lot added successfully!");
      form.reset();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to add parking lot."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="border shadow-md">
        <CardHeader className="space-y-1 pb-4">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <ParkingSquare className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">
                Add Parking Lot
              </CardTitle>
              <CardDescription>
                Create a new parking lot location in your management system
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      Location
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Downtown Parking, Mall Garage"
                        {...field}
                        className="bg-muted/40"
                      />
                    </FormControl>
                    <FormDescription>
                      Enter a descriptive name for this parking location
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imgUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      Image URL
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/parking-image.jpg"
                        {...field}
                        className="bg-muted/40"
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a URL to an image representing this parking lot
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="totalSlot"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Warehouse className="h-4 w-4 text-muted-foreground" />
                        Total Slots
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          {...field}
                          className="bg-muted/40"
                        />
                      </FormControl>
                      <FormDescription>
                        Number of available parking slots
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        Price (per hour)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          step={1}
                          {...field}
                          className="bg-muted/40"
                        />
                      </FormControl>
                      <FormDescription>Hourly rate in ₹ (INR)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <CardFooter className="flex justify-end gap-3 px-0 pt-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => form.reset()}
                  disabled={loading}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="gap-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <ParkingSquare className="h-4 w-4" />
                      <span>Add Parking Lot</span>
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddParkingLot;
