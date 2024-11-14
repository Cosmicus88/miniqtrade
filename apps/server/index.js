const app = require('./app')

const PORT = 8080
app.listen(PORT, () => {
  console.log(`✍️  Server listenting on http://localhost:${PORT}…`)
})
