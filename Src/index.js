const express = require("express")
const port = process.env.PORT || 3000
const app = express()

app.use(express.static('/videos'));
app.set("view engine", "ejs")
app.use(express.static("public"))
const bodyParser = require("body-parser")
const MongoClient = require("mongodb").MongoClient



MongoClient.connect("mongodb+srv://ivan:!Joni1852!@cluster0.vb8as.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useUnifiedTopology: true }).then(client => {
	console.log("Connected to Database")
	const db = client.db("login-auth")
	const loginData = db.collection("loginData")
	console.log(loginData)
	app.use(bodyParser.urlencoded({ extended: true }))
	app.post("/auth", (req, res) => {
	
		var user_name = req.body.Email_Address
		var passwordd = req.body.pass

		var data = {
			"user": user_name,
			"password": passwordd
		}

		console.log(data)
		//loginData.insertOne(data, function (err, collection) {
		//	if (err) {
		//		throw err
		//	}
		//	console.log("Record inserted Successfully" + collection.insertedCount)
		var dbo = client.db("login-auth")
		dbo.collection("loginData").find({"user":user_name , "password":passwordd}).count().then(function(numItems) {
			console.log("Number of items:",numItems) // Use this to debug
			if (numItems  == 1)
			{
				res.sendFile(__dirname + "/loggedIn.html")
			}

			else
			{
				console.log("User Not Exist! \n")
				res.render("Login")
			}
		})

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

	app.get("/add_new_contractor_worker", (req, res) => {
		res.render("add_new_contractor_worker")
	})

	app.get("/monitor_of_all_hires", (req, res) => {
		res.render("monitor_of_all_hires")
	})

	app.get("/search_for_a_contractor_worker", (req, res) => {
		res.render("search_for_a_contractor_worker")
	})

	app.get("/statistics", (req, res) => {
		res.render("statistics")
	})

	app.get("/shifts_monitor", (req, res) => {
		res.render("shifts_monitor")
	})

	app.listen(port, () => {
		console.log("Listening to port 3000!!!")
	})


}).catch(console.error)


