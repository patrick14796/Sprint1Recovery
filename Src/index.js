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
	
		var user_name = req.body.Email_Address
		var passwordd = req.body.pass

		var data = {
			"user": user_name,
			"password": passwordd
		}

		//loginData.insertOne(data, function (err, collection) {
		//	if (err) {
		//		throw err
		//	}
		//	console.log("Record inserted Successfully" + collection.insertedCount)
		var dbo = client.db("login-auth")
		var count
		dbo.collection("loginData").find({"user":user_name , "password":passwordd}).count().then(function(numItems) {
			console.log("Number of items:",numItems); // Use this to debug
			if (numItems  == 1)
			{res.sendFile(__dirname + "/loggedIn.html")}

			else
			{console.log("User Not Exist! \n")
			res.render("Login")}
			})

		})

		//return res.sendFile(__dirname + "/loggedIn.html")
	//})

	app.get("/", (req, res) => {
		res.render("Homepage")
		res.status(200)
	})


	app.get("/Login", (req, res) => {
		//var dbo = client.db("login-auth")
		//var q = {password:"123"}
		//var userDb = {user: String(user_name)}
		//var pasDb = {password:String(passwordd)}
		//if (dbo.collection.count({ "user":user_name , "password":passwordd}, limit = 1) != 0)
		//{
		//	res.sendFile(__dirname + "/loggedIn.html")
		//}
  		//dbo.collection("loginData").find(userDb) == dbo.collection("loginData").find()
		//dbo.collection("loginData").find(q).toArray(function(err, result) {
    		//if (err) throw err
    		//console.log(result)
    		//client.close()
  		//})
		//else
		//{
		//	console.log("User Not Exist! \n")
		//	res.render("Login")
		//}
		//res.sendFile(__dirname + "/loggedIn.html")
		res.render("Login")
	})



	app.get("/Register", (req, res) => {
		res.render("Register")
	})

	app.listen(port, () => {
		console.log("Listening to port 3000!!!")
	})


}).catch(console.error)


