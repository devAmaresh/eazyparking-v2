import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { BACKEND_URL } from "../../utils/backend";
import { useNavigate } from "react-router-dom";

// ShadCN UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Icons
import {
  CalendarIcon,
  CarFront,
  ArrowLeft,
  Timer,
  User,
  Tag,
  KeySquare,
} from "lucide-react";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Category {
  id: string;
  vehicleCat: string;
}

// Form validation schema
const formSchema = z.object({
  userId: z.string({
    required_error: "Please select a user",
  }),
  vehicleCategoryId: z.string({
    required_error: "Please select a vehicle category",
  }),
  vehicleCompanyName: z
    .string()
    .min(2, { message: "Company name must be at least 2 characters" })
    .max(50, { message: "Company name must be less than 50 characters" }),
  registrationNumber: z
    .string()
    .min(5, { message: "Registration number must be at least 5 characters" })
    .max(20, {
      message: "Registration number must be less than 20 characters",
    }),
  inTime: z
    .date({
      required_error: "Please select a date and time",
    })
    .refine((date) => {
      const now = new Date();
      // Add 1 minute to current time
      const minTime = new Date(now.getTime() + 60 * 1000);
      return date >= minTime;
    }, {
      message: "Booking time must be at least 1 minute in the future",
    }),
});

const VehicleForm = ({ parkingLotId }: { parkingLotId: string }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleCompanyName: "",
      registrationNumber: "",
    },
  });

  useEffect(() => {
    fetchUsers();
    fetchCategories();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = Cookies.get("adminToken");
      if (!token) {
        toast.error("Authentication token not found");
        return;
      }

      const res = await axios.get(
        `${BACKEND_URL}/api/admin/showRegisteredUsers`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(res.data);
    } catch (error) {
      toast.error("Failed to load users");
    }
  };

  const fetchCategories = async () => {
    try {
      const token = Cookies.get("adminToken");
      if (!token) {
        toast.error("Authentication token not found");
        return;
      }

      const res = await axios.get(`${BACKEND_URL}/api/admin/category/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const token = Cookies.get("adminToken");
    if (!token) {
      toast.error("Authentication token not found");
      return;
    }

    const payload = {
      parkingLotId,
      customerId: values.userId,
      vehicleCategoryId: values.vehicleCategoryId,
      vehicleCompanyName: values.vehicleCompanyName,
      registrationNumber: values.registrationNumber,
      inTime: values.inTime.toISOString(),
      paymentId: null,
    };

    try {
      setSubmitting(true);
      await axios.post(`${BACKEND_URL}/api/admin/book`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Booking successful!");
      form.reset();
      navigate("/admin/bookings");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Booking failed!";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-background text-foreground">
      <Button
        variant="ghost"
        size="sm"
        className="mb-6 hover:cursor-pointer"
        onClick={() => navigate("/admin/bookings")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Bookings
      </Button>
      <div className="max-w-md mx-auto">
        {/* Back button */}

        <Card className="shadow-md border-border">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <CarFront className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Vehicle Booking</CardTitle>
                <CardDescription>
                  Book a parking slot for a customer
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="-mt-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* User Selection */}
                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        Customer
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="">
                            <SelectValue placeholder="Select a customer" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="">
                          {users.map((user) => (
                            <SelectItem 
                              key={user.id} 
                              value={user.id}
                              className=""
                            >
                              {user.firstName} {user.lastName} (<span className="dark:text-zinc-400">{user.email}</span>)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Customer who is booking the parking slot
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Vehicle Category */}
                <FormField
                  control={form.control}
                  name="vehicleCategoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                        Vehicle Category
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="dark:bg-zinc-800 dark:border-zinc-700">
                            <SelectValue placeholder="Select vehicle type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="">
                          {categories.map((category) => (
                            <SelectItem 
                              key={category.id} 
                              value={category.id}
                              className=""
                            >
                              {category.vehicleCat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Vehicle Details - Two Columns */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Vehicle Company */}
                  <FormField
                    control={form.control}
                    name="vehicleCompanyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <CarFront className="h-4 w-4 mr-2 text-muted-foreground" />
                          Company
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Toyota" 
                            {...field} 
                            className="dark:bg-zinc-800 dark:border-zinc-700"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Registration Number */}
                  <FormField
                    control={form.control}
                    name="registrationNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <KeySquare className="h-4 w-4 mr-2 text-muted-foreground" />
                          Reg. Number
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., MH12AB1234" 
                            {...field} 
                            className="dark:bg-zinc-800 dark:border-zinc-700"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Date & Time Picker */}
                <FormField
                  control={form.control}
                  name="inTime"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="flex items-center">
                        <Timer className="h-4 w-4 mr-2 text-muted-foreground" />
                        Arrival Time
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full hover:cursor-pointer pl-3 text-left font-normal dark:bg-zinc-800 dark:border-zinc-700",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP HH:mm")
                              ) : (
                                <span>Pick a date and time</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 dark:bg-zinc-800 dark:border-zinc-700" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => {
                              // Allow same day if it's today, only disable past days
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              const compareDate = new Date(date);
                              compareDate.setHours(0, 0, 0, 0);
                              return compareDate < today;
                            }}
                            initialFocus
                            className="dark:bg-zinc-800"
                          />
                          <div className="p-3 border-t border-border dark:border-zinc-700">
                            <div className="flex items-center gap-2">
                              <Label>Time:</Label>
                              <Input
                                type="time"
                                className="w-full dark:bg-zinc-700 dark:border-zinc-600"
                                value={
                                  field.value
                                    ? format(field.value, "HH:mm")
                                    : ""
                                }
                                onChange={(e) => {
                                  const [hours, minutes] =
                                    e.target.value.split(":");
                                  const newDate = field.value || new Date();
                                  newDate.setHours(parseInt(hours));
                                  newDate.setMinutes(parseInt(minutes));
                                  field.onChange(newDate);
                                }}
                              />
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Booking time must be at least 1 minute from now
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <CardFooter className="flex justify-end gap-3 px-0 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/admin/bookings")}
                    disabled={submitting}
                    className="dark:bg-zinc-800 dark:border-zinc-700"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting} className="gap-2 hover:cursor-pointer">
                    {submitting ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <CarFront className="h-4 w-4" />
                        Book Vehicle
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VehicleForm;
