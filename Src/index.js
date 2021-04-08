const express = require("express")
const port = process.env.PORT || 3000
const app = express()
app.set("view engine", "ejs")
app.use(express.static("public"))

require("../Src/GET")(app);
require("../Src/POST")(app);

app.listen(port, () => {
	console.log("Listening to port 3000!!!")
})
