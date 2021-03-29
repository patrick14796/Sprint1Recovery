const express = require("express")
const port = process.env.PORT || 3000
const app = express()
app.set("view engine", "ejs")
app.use(express.static("public"))


app.get("/", (req, res)=>{
	res.render("Homepage")
	res.status(200)
})

app.get("/Login", (req, res)=>{
	res.render("Login")
})

app.get("/Register", (req, res)=>{
	res.render("Register")
})

app.listen(port, ()=>{
	console.log("Listening to port 3000")
})

