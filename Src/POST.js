module.exports = function(app) {  //receiving "app" instance
	const MongoClient = require("mongodb").MongoClient
	const bodyParser = require("body-parser")
	MongoClient.connect("mongodb+srv://ivan:!Joni1852!@cluster0.vb8as.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useUnifiedTopology: true }).then(client => {
		console.log("Connected to Database")
		app.use(bodyParser.urlencoded({ extended: true }))

		app.post("/auth", (req, res) => {

			var user_name = req.body.Email_Address
			var passwordd = req.body.pass
			var userType = req.body.user_type

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
				db =client.db("contractor-workers")
				db_collection = db.collection("contractorWorkersLogin")

				homepage_name = "contractor_worker_home_page"
          
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
					// Insert the contractor worker information to a collection of contractorWorkers
					db_collection.insertOne(data, function (err, collection) {
						if (err) {
							throw err
						}
						console.log("Record inserted Successfully" + collection.insertedCount)
					})

					data ={
						"user": username,
						"password": password
					}
					// Insert the contractor worker username and password to a collection of contractorWorkersLogin
					db_collection = db.collection("contractorWorkersLogin")
					db_collection.insertOne(data, function (err, collection) {
						if (err) {
							throw err
						}
						console.log("Record inserted Successfully" + collection.insertedCount)
					})
					
					res.render("added_contractor_successfully")
				})
			}
		})

	}).catch(console.error)
        
}
