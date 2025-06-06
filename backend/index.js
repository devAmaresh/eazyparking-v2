import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import authRoute from "./routes/authRoute.js";
import getLocationsRoute from "./routes/getParkingLot.js";

import adminAuthRoute from "./routes/admin/authRoute.js";
import addParkingLotRoute from "./routes/admin/addParkingLot.js";
import categoryRoutes from "./routes/admin/categoryRoutes.js";
import showRegisteredUsersRoute from "./routes/admin/showRegisteredUsers.js";
import generateReportRoute from "./routes/admin/generateReport.js";
import vehicleRoutes from "./routes/admin/Vehicle.js";

import getPastBookingsRoute from "./routes/user/getPastBookings.js";
import getparkingsRoute from "./routes/user/getParkings.js";
import bookRoute from "./routes/user/book.js";
import getdashboardDataRoute from "./routes/user/dashboardData.js";
import getuserprofileRoute from "./routes/user/getuserprofile.js";
import changePasswordRoute from "./routes/user/changePassword.js";
import userData from "./routes/admin/userData.js";
import getAdmindashboardDataRoute from "./routes/admin/dashboard.js";
import AdminbookRoute from "./routes/admin/Adminbook.js";
import adminprofileRoute from "./routes/admin/profile.js";
import adminchangePasswordRoute from "./routes/admin/changePassword.js";
import googleAuthRoute from "./routes/googleAuth.js";
import getReport from "./routes/user/getReport.js";
import verifyPayment from "./routes/verifyPayment.js";
import stripeRoutes from "./routes/stripe.js";
import webhookRouter from "./routes/stripeWebhook.js";

const app = express();

const PORT = 3000;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://eazy-parking-mern.vercel.app",
      "https://eazyparking.tech",
      "https://eazyparking-v2.vercel.app",
    ],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use("/api/stripe/webhook", webhookRouter);

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoute);
app.use("/api/locations", getLocationsRoute);
app.use("/api/admin/addParkingLot", addParkingLotRoute);
app.use("/api/admin/auth", adminAuthRoute);
app.use("/api/admin/userData", userData);
app.use("/api/user/getPastBookings", getPastBookingsRoute);
app.use("/api/admin/category", categoryRoutes);
app.use("/api/admin/showRegisteredUsers", showRegisteredUsersRoute);
app.use("/api/admin/generateReport", generateReportRoute);
app.use("/api/admin/vehicle", vehicleRoutes);
app.use("/api/admin/dashboard", getAdmindashboardDataRoute);
app.use("/api/admin/book", AdminbookRoute);
app.use("/api/admin/profile", adminprofileRoute);
app.use("/api/admin/changePassword", adminchangePasswordRoute);

app.use("/api/user/getParkings", getparkingsRoute);
app.use("/api/user/book", bookRoute);
app.use("/api/user/dashboardData", getdashboardDataRoute);
app.use("/api/user/profile", getuserprofileRoute);
app.use("/api/user/report", getReport);
app.use("/api/user/changePassword", changePasswordRoute);

app.use("/api/user/googleAuth", googleAuthRoute);

app.use("/api/stripe", stripeRoutes);
app.use("/api/payment/verifyPayment", verifyPayment);



app.get("/", (req, res) => {
  res.send("Hello, World! pyaaare kushagra");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
