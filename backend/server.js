import express from "express";
import webhooksRouter from "./src/webhooks/index.js";
import paymentRoutes from "./src/routes/payment.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import ticketRoutes from "./src/routes/ticket.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import scheduleRoutes from "./src/routes/schedule.routes.js";
import stationsRoutes from "./src/routes/station.routes.js";
import routeRoutes from "./src/routes/route.routes.js";
import transportRoutes from "./src/routes/transport.routes.js";
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
//route for schedule
app.use("/schedules", scheduleRoutes);
//route for stations
app.use("/stations", stationsRoutes);
//route for routes
app.use("/routes", routeRoutes);
//route for transports
app.use("/transports", transportRoutes);
//test route to check if the server is running
app.get("/", (req, res) => {
  res.send("Backend API is running");
});

function renderPaymentCallbackPage({
  status,
  transactionId,
  extraParams = "",
}) {
  const isSuccess = status === "success";
  const title = isSuccess ? "Payment Confirmed" : "Payment Cancelled";
  const message = isSuccess
    ? "Your payment was received. You can return to Wasalni now."
    : "Your payment was not completed. You can return to Wasalni and try again.";
  const deepLink = `myapp://payment/callback?status=${status}&transaction_id=${encodeURIComponent(transactionId || "")}${extraParams}`;

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background: #f6f9fc;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        margin: 0;
      }
      .card {
        width: min(92vw, 480px);
        background: #fff;
        border-radius: 14px;
        padding: 24px;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
        text-align: center;
      }
      h1 {
        margin: 0 0 12px;
        color: ${isSuccess ? "#1e8e3e" : "#c62828"};
      }
      p {
        color: #4b5563;
        margin: 0 0 18px;
      }
      a.button {
        display: inline-block;
        text-decoration: none;
        background: #0d6efd;
        color: #fff;
        padding: 12px 18px;
        border-radius: 10px;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>${title}</h1>
      <p>${message}</p>
      <a class="button" href="${deepLink}">Return to Wasalni App</a>
    </div>
    <script>
      setTimeout(function () {
        window.location.href = "${deepLink}";
      }, 700);
    </script>
  </body>
</html>
`;
}

function extractTransactionId(rawValue) {
  const raw = String(rawValue || "");
  return (
    raw.match(
      /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/,
    )?.[0] || raw
  );
}

app.get("/payment-success", async (req, res) => {
  const transactionId = extractTransactionId(
    req.query.transaction_id || req.query.order_id || "",
  );
  // Important: do not finalize here. Webhook is the single source of truth
  // for marking recharge completed and crediting balance.
  const deepLinkExtra = "";
  res.status(200).send(
    renderPaymentCallbackPage({
      status: "success",
      transactionId,
      extraParams: deepLinkExtra,
    }),
  );
});

app.get("/payment-error", (req, res) => {
  const transactionId = extractTransactionId(
    req.query.transaction_id || req.query.order_id || "",
  );
  res
    .status(200)
    .send(renderPaymentCallbackPage({ status: "failed", transactionId }));
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
