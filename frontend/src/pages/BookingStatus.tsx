import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "@/utils/backend";
import Cookies from "js-cookie";
import ReactConfetti from "react-confetti";
import { motion } from "framer-motion";

// ShadCN UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

// Icons
import {
  AlertTriangle,
  Calendar,
  Car,
  Check,
  ChevronsRight,
  Clock,
  Loader2,
  MapPin,
  PartyPopper,
  User,
} from "lucide-react";
import { toast } from "sonner";

const BookingStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing"); // processing, success, failed, or pending
  const [bookingData, setBookingData] = useState<any>(null);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiRef = useRef<HTMLDivElement>(null);
  const [confettiDimensions, setConfettiDimensions] = useState({
    width: 0,
    height: 0,
  });
  useEffect(() => {
    //if no token is found, redirect to home
    if (!Cookies.get("token") && !Cookies.get("adminToken")) {
      toast.error("You must be logged in to view this page.");
      navigate("/");
      return;
    }
  }, []);
  const [redirectTimer, setRedirectTimer] = useState<number | null>(null);

  // Parse payment token from URL
  const searchParams = new URLSearchParams(location.search);
  const verifyToken = searchParams.get("token");

  // Progress simulation
  useEffect(() => {
    const timer = setInterval(() => {
      if (progress < 100) {
        setProgress((prev) => prev + 10);
      } else {
        clearInterval(timer);
      }
    }, 300);

    return () => clearInterval(timer);
  }, []);

  // Handle redirection based on status
  useEffect(() => {
    if (redirectTimer === 0) {
      // Determine where to redirect based on status and available tokens
      if (status === "success" || status === "pending") {
        if (Cookies.get("adminToken")) {
          navigate("/admin/reports");
        } else if (Cookies.get("token")) {
          navigate("/reports");
        } else {
          navigate("/");
        }
      } else if (status === "failed" || status === "error") {
        if (Cookies.get("adminToken")) {
          navigate("/admin/bookings");
        } else if (Cookies.get("token")) {
          navigate("/bookings");
        } else {
          navigate("/");
        }
      }
    }

    // Decrement timer if set
    if (redirectTimer !== null && redirectTimer > 0) {
      const timeout = setTimeout(() => {
        setRedirectTimer(redirectTimer - 1);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [redirectTimer, status, navigate]);

  // Handle confetti dimensions and position
  useEffect(() => {
    if (confettiRef.current && status === "success") {
      const { clientWidth, clientHeight } = confettiRef.current;
      setConfettiDimensions({
        width: clientWidth,
        height: clientHeight,
      });
      setShowConfetti(true);

      // Hide confetti after 5 seconds
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [confettiRef.current, status]);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!verifyToken) {
        setStatus("error");
        setError("No payment reference found.");
        setRedirectTimer(5); // Start redirect countdown
        return;
      }

      try {
        const res = await axios.post(
          `${BACKEND_URL}/api/payment/verifypayment`,
          { token: verifyToken },
          {
            headers: {
              Authorization: `Bearer ${
                Cookies.get("token") || Cookies.get("adminToken") || ""
              }`,
            },
          }
        );

        // Handle different statuses from the API
        if (res.data.status === "success") {
          setStatus("success");
          setBookingData(res.data.booking);
          setShowConfetti(true);
          setRedirectTimer(10); // Redirect after 10 seconds on success
        } else if (res.data.status === "pending") {
          setStatus("pending");
          setBookingData(res.data.booking);
          setRedirectTimer(8); // Redirect after 8 seconds on pending
        } else {
          setStatus("failed");
          setError(res.data.message || "Payment verification failed");
          setRedirectTimer(5); // Redirect after 5 seconds on failure
        }
      } catch (err: any) {
        setStatus("error");
        setError(
          err.response?.data?.message ||
            "An error occurred during payment verification"
        );
        setRedirectTimer(5); // Redirect after 5 seconds on error
      }
    };

    // Only verify if we're still in processing state and have progress at 100%
    if (status === "processing" && progress === 100) {
      verifyPayment();
    }
  }, [verifyToken, progress]);

  // Function to handle navigation to reports
  const handleViewReport = () => {
    if (Cookies.get("adminToken")) {
      navigate("/admin/reports");
    } else if (Cookies.get("token")) {
      navigate("/reports");
    } else {
      navigate("/");
    }
  };

  // Function to handle navigation to bookings
  const handleViewBookings = () => {
    if (Cookies.get("adminToken")) {
      navigate("/admin/bookings");
    } else if (Cookies.get("token")) {
      navigate("/bookings");
    } else {
      navigate("/");
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delayChildren: 0.1, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/30 dark:to-zinc-950"
      ref={confettiRef}
    >
      {/* Confetti overlay - only show on success */}
      {showConfetti && status === "success" && (
        <ReactConfetti
          width={confettiDimensions.width}
          height={confettiDimensions.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.15}
          colors={[
            "#8b5cf6", // violet
            "#3b82f6", // blue
            "#10b981", // emerald
            "#f59e0b", // amber
            "#ec4899", // pink
          ]}
        />
      )}

      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[50%] top-0 h-[60rem] w-[90rem] -translate-x-1/2 opacity-20 dark:opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-blue-400 dark:to-indigo-400"></div>
        </div>
      </div>

      <motion.div
        className="w-full max-w-lg"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Card className="border border-blue-100 dark:border-blue-900/30 shadow-xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-xl overflow-hidden">
            <div
              className={`absolute top-0 left-0 right-0 h-1 ${
                status === "success"
                  ? "bg-gradient-to-r from-green-500 to-emerald-500"
                  : status === "pending"
                  ? "bg-gradient-to-r from-amber-500 to-yellow-500"
                  : status === "failed" || status === "error"
                  ? "bg-gradient-to-r from-red-500 to-pink-500"
                  : "bg-gradient-to-r from-blue-500 to-indigo-500"
              }`}
            ></div>

            <CardHeader className="pb-3">
              {status === "processing" ? (
                <>
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center relative">
                      <Loader2 className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-spin" />
                      <div className="absolute inset-0 rounded-full border-2 border-blue-200 dark:border-blue-800/30 border-t-transparent dark:border-t-transparent animate-spin"></div>
                    </div>
                  </div>
                  <CardTitle className="text-center text-xl text-blue-950 dark:text-blue-200">
                    Processing Your Booking
                  </CardTitle>
                  <CardDescription className="text-center text-blue-700/70 dark:text-blue-400/70">
                    Please wait while we verify your payment...
                  </CardDescription>
                  <div className="mt-4">
                    <Progress
                      value={progress}
                      className="h-2 bg-blue-100 dark:bg-blue-900/30"
                    />
                    <p className="text-xs text-blue-700/70 dark:text-blue-400/70 text-center mt-2">
                      {progress}% complete
                    </p>
                  </div>
                </>
              ) : status === "success" ? (
                <>
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
                      <PartyPopper className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <CardTitle className="text-center text-xl text-green-950 dark:text-green-200">
                    Booking Successful!
                  </CardTitle>
                  <CardDescription className="text-center text-green-700/70 dark:text-green-400/70">
                    Your parking spot has been reserved.
                    {redirectTimer !== null && (
                      <div className="mt-2 text-xs">
                        Redirecting to reports in {redirectTimer} second
                        {redirectTimer !== 1 ? "s" : ""}...
                      </div>
                    )}
                  </CardDescription>
                </>
              ) : status === "pending" ? (
                <>
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
                      <Clock className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                    </div>
                  </div>
                  <CardTitle className="text-center text-xl text-amber-950 dark:text-amber-200">
                    Booking Pending
                  </CardTitle>
                  <CardDescription className="text-center text-amber-700/70 dark:text-amber-400/70">
                    Your booking has been received and is being processed.
                    {redirectTimer !== null && (
                      <div className="mt-2 text-xs">
                        Redirecting to reports in {redirectTimer} second
                        {redirectTimer !== 1 ? "s" : ""}...
                      </div>
                    )}
                  </CardDescription>
                </>
              ) : (
                <>
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
                      <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
                    </div>
                  </div>
                  <CardTitle className="text-center text-xl text-red-950 dark:text-red-200">
                    Booking Failed
                  </CardTitle>
                  <CardDescription className="text-center text-red-700/70 dark:text-red-400/70">
                    {error || "There was an issue with your booking."}
                    {redirectTimer !== null && (
                      <div className="mt-2 text-xs">
                        Redirecting to bookings in {redirectTimer} second
                        {redirectTimer !== 1 ? "s" : ""}...
                      </div>
                    )}
                  </CardDescription>
                </>
              )}
            </CardHeader>

            {(status === "success" || status === "pending") && bookingData && (
              <>
                <CardContent className="pb-3 space-y-4">
                  <Separator
                    className={
                      status === "success"
                        ? "bg-green-100 dark:bg-green-900/30"
                        : "bg-amber-100 dark:bg-amber-900/30"
                    }
                  />

                  <div
                    className={`rounded-lg border ${
                      status === "success"
                        ? "border-green-100 dark:border-green-800/30 bg-green-50/50 dark:bg-green-900/10"
                        : "border-amber-100 dark:border-amber-800/30 bg-amber-50/50 dark:bg-amber-900/10"
                    } p-4`}
                  >
                    <h3
                      className={`text-sm font-medium mb-3 ${
                        status === "success"
                          ? "text-green-800 dark:text-green-300"
                          : "text-amber-800 dark:text-amber-300"
                      }`}
                    >
                      Booking Details
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <User
                          className={`h-4 w-4 ${
                            status === "success"
                              ? "text-green-600 dark:text-green-400"
                              : "text-amber-600 dark:text-amber-400"
                          } flex-shrink-0`}
                        />
                        <span className="text-zinc-600 dark:text-zinc-400">
                          Name:
                        </span>
                        <span
                          className={`font-medium ${
                            status === "success"
                              ? "text-green-800 dark:text-green-200"
                              : "text-amber-800 dark:text-amber-200"
                          }`}
                        >
                          {bookingData.customerName}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                        <span className="text-zinc-600 dark:text-zinc-400">
                          Date:
                        </span>
                        <span className="font-medium text-green-800 dark:text-green-200">
                          {new Date(bookingData.inTime).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                        <span className="text-zinc-600 dark:text-zinc-400">
                          Location:
                        </span>
                        <span className="font-medium text-green-800 dark:text-green-200">
                          {bookingData.location}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                        <span className="text-zinc-600 dark:text-zinc-400">
                          Time:
                        </span>
                        <span className="font-medium text-green-800 dark:text-green-200">
                          {new Date(bookingData.inTime).toLocaleTimeString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                        <span className="text-zinc-600 dark:text-zinc-400">
                          Vehicle:
                        </span>
                        <span className="font-medium text-green-800 dark:text-green-200">
                          {bookingData.registrationNumber}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center space-x-1">
                    {status === "success" ? (
                      <>
                        <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                          Payment Completed Successfully
                        </p>
                      </>
                    ) : (
                      <>
                        <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">
                          Payment Processing - Please Wait
                        </p>
                      </>
                    )}
                  </div>
                </CardContent>
              </>
            )}

            <CardFooter className="flex flex-col gap-3 pt-2">
              {status === "success" ? (
                <>
                  <Button
                    onClick={handleViewReport}
                    className="w-full gap-1.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 dark:from-green-500 dark:to-emerald-500 dark:hover:from-green-400 dark:hover:to-emerald-400 text-white dark:text-zinc-900 h-10 font-medium shadow-md shadow-green-500/10 dark:shadow-green-400/5 border border-green-700/10 dark:border-green-300/20"
                  >
                    <ChevronsRight className="h-4 w-4" />
                    View My Bookings
                  </Button>
                </>
              ) : status === "pending" ? (
                <>
                  <Button
                    onClick={handleViewReport}
                    className="w-full gap-1.5 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 dark:from-amber-500 dark:to-yellow-500 dark:hover:from-amber-400 dark:hover:to-yellow-400 text-white dark:text-zinc-900 h-10 font-medium shadow-md shadow-amber-500/10 dark:shadow-amber-400/5 border border-amber-700/10 dark:border-amber-300/20"
                  >
                    <ChevronsRight className="h-4 w-4" />
                    View My Reports
                  </Button>
                </>
              ) : status === "failed" || status === "error" ? (
                <>
                  <Button
                    onClick={handleViewBookings}
                    className="w-full gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-400 dark:hover:to-indigo-400 text-white dark:text-zinc-900 h-10 font-medium shadow-md shadow-blue-500/10 dark:shadow-blue-400/5 border border-blue-700/10 dark:border-blue-300/20"
                  >
                    <Car className="h-4 w-4" />
                    Try Again
                  </Button>
                </>
              ) : (
                <div className="text-center w-full p-2 text-sm text-blue-700/70 dark:text-blue-400/70">
                  Please wait while we process your booking...
                </div>
              )}

              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="w-full border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
              >
                Return to Home
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default BookingStatus;
