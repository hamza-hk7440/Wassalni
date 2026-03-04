import express from "express";
import webhooksRouter from "./src/webhooks/index.js";
import paymentRoutes from "./src/routes/payment.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import ticketRoutes from "./src/routes/ticket.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
const app = express();
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
