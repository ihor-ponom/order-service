const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

let orders = [];

app.post("/orders", async (req,res)=>{

  const { productId, quantity } = req.body;

  const inventory =
    await axios.post(
      process.env.INVENTORY_URL +
      "/inventory/check",
      {
        productId,
        quantity
      }
    );

  if(!inventory.data.available){

      return res.status(400).json({
          error:"Out of stock"
      });
  }

  const order = {
      id: orders.length + 1,
      productId,
      quantity
  };

  orders.push(order);

  await axios.post(
    process.env.NOTIFICATION_URL +
    "/notify",
    {
      message:
      `Order ${order.id} created`
    }
  );

  res.json(order);
});

app.get("/orders",(req,res)=>{
   res.json(orders);
});

app.listen(
  process.env.PORT || 3000
);
