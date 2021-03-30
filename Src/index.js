const express = require("express")
const port = process.env.PORT || 3000
const app = express()
app.set("view engine", "ejs")
app.use(express.static("public"))
const bodyParser = require("body-parser")
const MongoClient = require("mongodb").MongoClient

MongoClient.connect("mongodb+srv://ivan:!Joni1852!@cluster0.vb8as.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useUnifiedTopology: true }).then(client => {
	console.log("Connected to Database")
	const db = client.db("login-auth")
	const loginData = db.collection("loginData")
	app.use(bodyParser.urlencoded({ extended: true }))
	app.post("/auth", (req, res) => {

		var user_name = req.body.user_name
		var password = req.body.password

		var data = {
			"user": user_name,
			"password": password
		}
		loginData.insertOne(data, function (err, collection) {
			if (err) {
				throw err
			}
			console.log("Record inserted Successfully" + collection.insertedCount)
		})

		return res.sendFile(__dirname + "/loggedIn.html")
	})

	app.get("/", (req, res) => {
		res.render("Homepage")
		res.status(200)
	})

	app.get("/Login", (req, res) => {
		res.render("Login")
	})

	app.get("/Register", (req, res) => {
		res.render("Register")
	})

	app.listen(port, () => {
		console.log("Listening to port 3000!!")
	})


}).catch(console.error)


