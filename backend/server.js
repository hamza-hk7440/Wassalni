import express from "express";
import webhooksRouter from "./src/webhooks/index.js";
import paymentRoutes from "./src/routes/payment.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import ticketRoutes from "./src/routes/ticket.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import transportRoutes from "./src/routes/transport.routes.js";
import routeRoutes from "./src/routes/route.routes.js";
import scheduleRoutes from "./src/routes/schedule.routes.js";
import stationsRoutes from "./src/routes/stations.routes.js";

import cors from "cors";

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173", // Allow requests from the frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); //we add this bcz paymee don't use json it use a format called :application/x-www-form-urlencoded
//========wwebhooks routes=======//
//paymee webhook route
app.use("/webhooks", webhooksRouter);

//===========Normal routes=========
//paymee route
//so the post that comes from the user it contains /api/payments soit go here first,this route name will call paymentRoutes that is imported from payment.routes.js so we go there
app.use("/api/payments", paymentRoutes);
//update token balance route,verify number of tokens
app.use("/token", paymentRoutes);
//create user route
app.use("/users", userRoutes);
//create ticket route
app.use("/ticket", ticketRoutes);
//create admin route
app.use("/admin", adminRoutes);
//transport and stations routes
app.use("/transports", transportRoutes);
app.use("/stations", stationsRoutes);
//schedules and routes paths
app.use("/routes", routeRoutes);
app.use("/schedules", scheduleRoutes);

//test route to check if the server is running
app.get("/", (req, res) => {
  res.send("Backend API is running");
});
app.get("/payment-success", (req, res) =>
  res.send("Success! You can close this tab."),
);
app.get("/payment-error", (req, res) => res.send("Payment was cancelled."));

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
