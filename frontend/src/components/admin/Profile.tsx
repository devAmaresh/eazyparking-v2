import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { BACKEND_URL } from "@/utils/backend";

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
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
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
  Edit2,
  Save,
  AtSign,
  User,
  Phone,
  Clock,
  ShieldCheck,
  Camera,
  Loader2,
} from "lucide-react";

// Form validation schema
const profileSchema = z.object({
  adminName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }).optional(),
  mobileNumber: z
    .string()
    .length(10, { message: "Mobile number must be 10 digits" })
    .regex(/^\d+$/, { message: "Mobile number must contain only digits" }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const token = Cookies.get("adminToken");

  // Initialize form with zod resolver
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      adminName: "",
      email: "",
      mobileNumber: "",
    },
  });

  useEffect(() => {
    if (!token) return;

    const fetchAdminProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BACKEND_URL}/api/admin/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { adminName, email, mobileNumber, adminRegDate, profileImage } = res.data;
        const profileData = {
          adminName,
          email,
          mobileNumber,
          profileImage,
          memberSince: new Date(adminRegDate).toLocaleDateString(),
          status: "Active",
        };

        setUser(profileData);
        form.reset({
          adminName,
          email,
          mobileNumber,
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, [token]);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!token) {
      toast.error("Authentication token not found");
      return;
    }

    try {
      setSubmitting(true);
      
      await axios.patch(
        `${BACKEND_URL}/api/admin/profile`,
        {
          adminName: values.adminName,
          mobileNumber: values.mobileNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setUser({ 
        ...user, 
        adminName: values.adminName,
        mobileNumber: values.mobileNumber
      });
      
      setEditMode(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 flex justify-center">
      <Card className="w-full max-w-md border shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex flex-col items-center space-y-2">
            <div className="relative group">
              {loading ? (
                <Skeleton className="h-24 w-24 rounded-full" />
              ) : (
                <div className="relative">
                  <div className="h-24 w-24 rounded-full overflow-hidden ring-4 ring-primary/10 group-hover:ring-primary/20 transition-all duration-300">
                    <img
                      src={user?.profileImage || "https://avatar.iran.liara.run/public"}
                      alt="Profile"
                      className={`h-full w-full object-cover transition-all duration-700 ${
                        avatarLoaded ? "scale-100 blur-0" : "scale-110 blur-md"
                      }`}
                      onLoad={() => setAvatarLoaded(true)}
                    />
                  </div>
                  <button className="absolute bottom-0 right-0 h-8 w-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:cursor-pointer hover:bg-primary/90">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
            
            <div className="text-center">
              <CardTitle className="text-2xl">{loading ? <Skeleton className="h-8 w-32 mx-auto" /> : user?.adminName}</CardTitle>
              <CardDescription>
                {loading ? (
                  <Skeleton className="h-4 w-48 mx-auto mt-2" />
                ) : (
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 mt-1">
                    <ShieldCheck className="h-3 w-3 mr-1" /> Administrator
                  </Badge>
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="adminName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          disabled={!editMode}
                          className={editMode ? "border-primary/50 focus-visible:ring-primary/20" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <AtSign className="h-4 w-4 text-muted-foreground" />
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          disabled={true}
                          className="bg-muted/40"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mobileNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        Mobile Number
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          disabled={!editMode}
                          className={editMode ? "border-primary/50 focus-visible:ring-primary/20" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Additional Information */}
                <div className="bg-muted/30 rounded-lg p-3 space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <Label className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Member Since
                    </Label>
                    <span className="font-medium">{user?.memberSince}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <Label className="flex items-center gap-2 text-muted-foreground">
                      <ShieldCheck className="h-4 w-4" />
                      Account Status
                    </Label>
                    <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                      {user?.status}
                    </Badge>
                  </div>
                </div>
              </form>
            </Form>
          )}
        </CardContent>

        <CardFooter className="flex justify-center pt-2">
          {!loading && (
            <Button
              type={editMode ? "submit" : "button"}
              className="w-full gap-2 hover:cursor-pointer"
              onClick={editMode ? form.handleSubmit(onSubmit) : () => setEditMode(true)}
              disabled={submitting}
            >
              {editMode ? (
                submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </>
                )
              ) : (
                <>
                  <Edit2 className="h-4 w-4" />
                  <span>Edit Profile</span>
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Profile;
