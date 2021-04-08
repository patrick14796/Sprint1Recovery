module.exports = function(app) {  //receiving "app" instance
	const MongoClient = require("mongodb").MongoClient
	const bodyParser = require("body-parser")
	MongoClient.connect("mongodb+srv://ivan:!Joni1852!@cluster0.vb8as.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useUnifiedTopology: true }).then(client => {
		console.log("Connected to Database")
		const db = client.db("login-auth")
		const loginData = db.collection("loginData")
		console.log(loginData)
		app.use(bodyParser.urlencoded({ extended: true }))

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

			})
		}

		else
		{
			console.log("User Not Exist! \n")
			res.render("Login")
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

	}).catch(console.error)
        
}
