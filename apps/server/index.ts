import app from "./app";

// app.get("/", (req, res) => {
//   res.json({
//     api: process.env.POLYGON_API_KEY,
//   });
// });

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`✍️  Server listenting on http://localhost:${PORT}`);
});
