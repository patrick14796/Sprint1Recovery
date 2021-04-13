const express = require("express")
const port = process.env.PORT || 3000
const app = express()
app.set("view engine", "ejs")
app.use(express.static("public"))

const MongoClient = require("mongodb").MongoClient
const bodyParser = require("body-parser")
MongoClient.connect("mongodb+srv://ivan:!Joni1852!@cluster0.vb8as.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useUnifiedTopology: true }).then(client => {
	console.log("Connected to Database")
	app.use(bodyParser.urlencoded({ extended: true }))

	// GET functions
	app.get("/", (req, res) => {
		console.log("insdie")
		res.render("Homepage")
		res.status(200)
	})
	
	app.get("/Login", (req, res) => {
		res.render("Login")
	})
	
	app.get("/contributers", (req, res) => {
		res.render("contributers_page")
	})
	
	app.get("/CompanyWorkerHomepage", (req, res) => {
		res.render("CompanyWorkerHomepage")
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
	
	app.get("/why_us_page", (req, res) => {
		res.render("why_us_page")
	})
	
	app.get("/contractor_worker_home_page", (req, res) => {
		res.render("contractor_worker_home_page")
	})
	
	app.get("/contractor_worker_my_profile", (req, res) => {
		res.render("contractor_worker_my_profile")
	})
	
	app.get("/search_contractor_worker", (req, res) => {
		var db = client.db("contractor-workers")
		var db_collection = db.collection("contractorWorkers")
		//var result = db_collection.find({})
		//res.render("search_contractor_worker", {users: result}
		db_collection.find().toArray(function (err, allDetails) {
			if (err) {
				console.log(err);
			}
			else {
				res.render("search_contractor_worker", { details: allDetails })
			}
		})
	})
	// POST functions
	app.post("/auth", (req, res) => {
		var user_name = req.body.Email_Address
		var passwordd = req.body.pass
		var userType = req.body.user_type
		//var data = {
		//	"user": user_name,
		//	"password": passwordd
		//}
		//console.log(data)
		//loginData.insertOne(data, function (err, collection) {
		//	if (err) {
		//		throw err
		//	}
		//	console.log("Record inserted Successfully" + collection.insertedCount)
		//})
		var homepage_name=null
		var db_collection = null
		
			switch(userType)
			{
			case "Company Worker":
				var db = client.db("company-workers-login")
				db_collection = db.collection("companyWorkers")
				homepage_name = "CompanyWorkerHomepage"
				break
			case "Contractor Worker":
				db =client.db("login-auth")
				db_collection = db.collection("loginData")
				homepage_name = "CompanyWorkerHomepage"
				break
			case "Employee":
				db = client.db("login-auth")
				db_collection = db.collection("companyWorkers")
				homepage_name = "CompanyWorkerHomepage"
				break
			}
			if(db_collection){
				db_collection.find({"user":user_name , "password":passwordd}).count().then(function(numItems) {
					console.log("Number of items:",numItems) // Use this to debug
					if (numItems  == 1)
					{
						res.render(homepage_name + ".ejs")
					}
					else
					{
						console.log("User Not Exist! \n")
						res.render("Login")
					}
				})
			}
			//var dbo = client.db("login-auth")
			//dbo.collection("loginData").find({"user":user_name , "password":passwordd}).count().then(function(numItems) {
			//	console.log("Number of items:",numItems) // Use this to debug
			//	if (numItems  == 1)
			//	{
			//		res.sendFile(__dirname + "/loggedIn.html")
			//	}
			//	else
			//	{
			//		console.log("User Not Exist! \n")
			//		res.render("Login")
			//	}
			//})
	})

	app.post("/add_contractor", (req, res) => {
		var db = client.db("contractor-workers")
		var db_collection = db.collection("contractorWorkers")
		var first_name = req.body.first_name
		var last_name = req.body.last_name
		var hourly_pay = req.body.hourly_pay
		var city = req.body.city
		var home = req.body.home
		var phone_number = req.body.phone_number
		var email = req.body.email
		var gender = req.body.radio
		var skills = req.body.skills
		var username = first_name + "_" + last_name + "@contractor.sce"
		var password = "123456789"
		var data = null
		// Check if the user name is already taken
		if(db_collection){
			db_collection.find({"first_name": first_name, "last_name": last_name}).count().then(function(numItems) {
				console.log(numItems)
				if(numItems){
					username = first_name + "_" + last_name + numItems + "@contractor.sce"
				}
				data ={
					"first_name": first_name,
					"last_name": last_name,
					"hourly_pay": hourly_pay,
					"city": city,
					"home": home,
					"phone_number": phone_number,
					"email": email,
					"gender": gender,
					"skills": skills,
					"user": username,
					"password": password
				}
				// Add a new contractor worker to "contractorWorkers" collection with all of his information
				db_collection.insertOne(data, function (err, collection) {
					if (err) {
						throw err
					}
					console.log("Record inserted Successfully" + collection.insertedCount)
				})
				
			})
		}
		// Add a new contractor worker to "contractorWorkersLogin" db with his username and password only
		var db_collection_login = db.collection("contractorWorkersLogin")
		data ={
			"user": username,
			"password": password
		}
		db_collection_login.insertOne(data, function (err, collection) {
			if (err) {
				throw err
			}
			console.log("Record inserted Successfully" + collection.insertedCount)
		})
		res.render("CompanyWorkerHomepage")
	})

	
}).catch(console.error)

app.listen(port, () => {
	console.log("Listening to port 3000!!!")
})
