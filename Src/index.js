const express = require("express")
const port = process.env.PORT || 3000
const app = express()
app.set("view engine", "ejs")
app.use(express.static("public"))
const session = require("express-session")
const {authUser, authRole} = require("./simpleAuth")
// initialize express-session to allow us track the logged-in user across sessions.
app.use(
	session({
		key: "user_sid",
		secret: "somerandonstuffs",
		resave: false,
		saveUninitialized: false,
		cookie: {
			expires: 600000,
		},
	})
)

const MongoClient = require("mongodb").MongoClient
const bodyParser = require("body-parser")
MongoClient.connect("mongodb+srv://ivan:!Joni1852!@cluster0.vb8as.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useUnifiedTopology: true }).then(client => {
	console.log("Connected to Database")
	app.use(bodyParser.urlencoded({ extended: true }))
	
	// GET functions
	app.get("/", (req, res) => {
		res.render("Homepage")
		res.status(200)
	})
	
	app.get("/Login", (req, res) => {
		res.render("Login")
	})
	
	app.get("/contributers", (req, res) => {
		res.render("contributers_page")
	})
	
	app.get("/CompanyWorkerHomepage", authUser, authRole("Company Worker"), (req, res) => {
		res.render("CompanyWorkerHomepage")
	})
	
	app.get("/recruiters_home_page", authUser, authRole("Recruiter"), (req, res) => {
		var db = client.db("contractor-workers")
		var db_collection = db.collection("contractorWorkers")
		
		db_collection.find().toArray(function (err, allDetails) {
			if (err) {
				console.log(err)
			}
			else {
				res.render("recruiters_home_page", {details: allDetails})
			}
		})
	})

	app.get("/contractor_add_new_shift" ,(req,res) => {
		res.render("contractor_add_new_shift")
	})
		
	app.get("/Register", (req, res) => {
		res.render("Register")
	})
		
	app.get("/add_new_contractor_worker", authUser, authRole("Company Worker"), (req, res) => {
		res.render("add_new_contractor_worker")
	})

	app.get("/contractor_job_requests_status", authUser, (req, res) => {
		var db =client.db("contractor-workers")
		var db_collection = db.collection("contractorWorkers")
		db_collection.find({"id": req.session.user.id}).toArray(function (err, allDetails) {
			if (err) {
				console.log(err)
			}
			else{
				var waiting_requests = allDetails[0].job_requests
				var approved_requests = allDetails[0].hiring
				var canceled_requests = allDetails[0].canceled_jobs
				var all_job_requests = waiting_requests.concat(approved_requests, canceled_requests)
				res.render("contractor_job_requests_status", {details: all_job_requests})
			}
		})  
	})

	app.get("/contractor_worker_edit_shift/:date", authUser, (req, res) => {
		var hire_old_date = req.params.date
		hire_old_date = hire_old_date.replace(".", "/")
		hire_old_date = hire_old_date.replace(".", "/")
		console.log(hire_old_date)
		var start = null
		var end = null
		var rec_id = null
		var db = client.db("contractor-workers")
		var db_collection = db.collection("contractorWorkers")
				
		db_collection.find({"id": req.session.user.id}).toArray(function (err, allDetails) {
			if (err) {
				console.log(err)
			}
			else {
				var contr_shifts = allDetails[0].shifts
				for(var i = 0; i<contr_shifts.length; ++i){
					if(contr_shifts[i][0] == hire_old_date){
						start = contr_shifts[i][1]
						end = contr_shifts[i][2]
						rec_id = contr_shifts[i][3]
					}
				}
				res.render("contractor_worker_edit_shift", {"old_date": hire_old_date, "end_hire": end, "start_hire": start, "rec_id": rec_id})
			}
		})
				
	})

	app.get("/contractor_shifts", authUser, (req, res) => {
		var db = client.db("contractor-workers")
		var db_collection = db.collection("contractorWorkers")
				
		db_collection.find({"id": req.session.user.id}).toArray(function (err, allDetails) {
			if (err) {
				console.log(err)
			}
			else {
				var contr_shifts = allDetails[0].shifts 
				res.render("contractor_shifts", {details: contr_shifts})
			}
		})
				
	})
		
	app.get("/monitor_of_all_hires", authUser, authRole("Company Worker"), (req, res) => {
		var db = client.db("contractor-workers")
		var db_collection = db.collection("contractorWorkers")
		
		db_collection.find().toArray(function (err, allDetails) {
			if (err) {
				console.log(err)
			}
			else {
				var all_hiring = []
				for(var i=0; i < allDetails.length; ++i){
					var contractor_hirings = allDetails[i].hiring
					for (var j=0; j<contractor_hirings.length; ++j){
						var one_hire = {
							"contractor_id": allDetails[i].id,
							"full_name": allDetails[i].first_name + " " + allDetails[i].last_name,
							"date": contractor_hirings[j][0],
							"start": contractor_hirings[j][1],
							"end": contractor_hirings[j][2],
							"recrutier_id": contractor_hirings[j][3]
						}
						all_hiring.push(one_hire)
					}
					
				}
				res.render("monitor_of_all_hires", {details: all_hiring})
			}
		})
	})
		
	app.get("/statistics", authUser, authRole("Company Worker"), (req, res) => {
		res.render("statistics")
	})
		
	app.get("/shifts_monitor", authUser, authRole("Company Worker"), (req, res) => {
		res.render("shifts_monitor")
	})
		
	app.get("/why_us_page", (req, res) => {
		res.render("why_us_page")
	})
		
	app.get("/contractor_worker_home_page", authUser, authRole("Contractor Worker"), (req, res) => {
		res.render("contractor_worker_home_page")
	})

	app.get("/send_data_calendar", authUser, authRole("Contractor Worker"), (req, res) => {
		// Connect contractor workers db and collection
		var db =client.db("contractor-workers")
		var db_collection = db.collection("contractorWorkers")
		db_collection.find({"id": req.session.user.id}).toArray(function (err, allDetails) {
			if (err) {
				console.log(err)
			}
			else{
				console.log(allDetails[0].hiring)
				res.send(allDetails)
			}
		})  
	})

		
	app.get("/contractor_worker_profile/:id", authUser, (req, res) => {
		// Connect contractor workers db and collection
		var db =client.db("contractor-workers")
		var db_collection = db.collection("contractorWorkers")
		db_collection.find({"id": req.params.id}).toArray(function (err, allDetails) {
			if (err) {
				console.log(err)
			}
			else{
				res.render("contractor_worker_profile", {details: allDetails, type: req.session.user.type})
			}
		})  
	})

	app.get("/contractor_worker_edit_my_profile", authUser, authRole("Contractor Worker"), (req, res) => {
		// Connect contractor workers db and collection
		var db =client.db("contractor-workers")
		var db_collection = db.collection("contractorWorkers")
		db_collection.find({"id": req.session.user.id}).toArray(function (err, allDetails) {
			if (err) {
				console.log(err)
			}
			else{
				var user = allDetails[0]
				res.render("contractor_worker_edit_profile", {"id": user.id, "first_name": user.first_name, "last_name": user.last_name, "city": user.city, "home":user.home, "phone":user.phone_number, "email": user.email, "gender":user.gender})
			}
		})  
	})

	app.get("/contractor_worker_edit_profile/:id", authUser, authRole("Company Worker"), (req, res) => {
		// Connect contractor workers db and collection
		var db =client.db("contractor-workers")
		var db_collection = db.collection("contractorWorkers")
		db_collection.find({"id": req.params.id}).toArray(function (err, allDetails) {
			if (err) {
				console.log(err)
			}
			else{
				var user = allDetails[0]
				res.render("contractor_worker_edit_profile", {"id": user.id, "first_name": user.first_name, "last_name": user.last_name, "city": user.city, "home":user.home, "phone":user.phone_number, "email": user.email, "gender":user.gender})
			}
		})  
	})

	app.get("/careers", (req, res) => {
		res.render("careers_page")
	})
		
	app.get("/contact_us", (req, res) => {
		res.render("contact_us_page")
	})
	app.get("/contractor_pay_rates", authUser, authRole("Contractor Worker"), (req, res) => {
		res.render("contractor_pay_rates")
	})

	app.get("/contractor_job_requests", authUser, authRole("Contractor Worker"), (req, res) => {
		var db =client.db("contractor-workers")
		var db_collection = db.collection("contractorWorkers")
		db_collection.find({"id": req.session.user.id}).toArray(function (err, allDetails) {
			if (err) {
				console.log(err)
			}
			else{
				var job_requests = allDetails[0].job_requests
				res.render("contractor_job_requests", {details: job_requests})
			}
		})  
	})

	app.get("/accept_job_request/:recrutier_date", authUser, (req, res) => {
		var data = req.params.recrutier_date
		data = data.split("_")
		var rec_id = data[0]
		var date = data[1]
		date = date.split(".")
		date = date.join("/")

		var db = client.db("contractor-workers")
		var db_collection = db.collection("contractorWorkers")
		db_collection.find({"id": req.session.user.id}).toArray(function (err, allDetails) {
			if (err) {
				console.log(err)
			}
			else{
				var job_requests = allDetails[0].job_requests
				var start = null
				var end = null

				for(var i=0; i<job_requests.length; ++i){
					if(job_requests[i][0] == date && job_requests[i][3] == rec_id){
						start = job_requests[i][1]
						end = job_requests[i][2]
						break
					}
				}
				db_collection.updateOne({"id":req.session.user.id, "job_requests": { $in : [[date, start, end, rec_id, "Waiting for approval"]]}}, {$pull: {"job_requests": { $in : [[date, start, end, rec_id, "Waiting for approval"]]}}})
				if(db_collection.updateOne({"id":req.session.user.id},{$push:{hiring:[date,start,end,rec_id, "Approved"]}})){
					res.redirect("/contractor_worker_home_page")
				}
				else{
					res.redirect("/contractor_worker_home_page")
				}
			}
		})
	})

	app.get("/decline_job_request/:recrutier_date", authUser, (req, res) => {
		var data = req.params.recrutier_date
		data = data.split("_")
		var rec_id = data[0]
		var date = data[1]
		date = date.split(".")
		date = date.join("/")

		var db = client.db("contractor-workers")
		var db_collection = db.collection("contractorWorkers")
		db_collection.find({"id": req.session.user.id}).toArray(function (err, allDetails) {
			if (err) {
				console.log(err)
			}
			else{
				var job_requests = allDetails[0].job_requests
				var start = null
				var end = null

				for(var i=0; i<job_requests.length; ++i){
					if(job_requests[i][0] == date && job_requests[i][3] == rec_id){
						start = job_requests[i][1]
						end = job_requests[i][2]
						break
					}
				}
				db_collection.updateOne({"id":req.session.user.id, "job_requests": { $in : [[date, start, end, rec_id, "Waiting for approval"]]}}, {$pull: {"job_requests": { $in : [[date, start, end, rec_id, "Waiting for approval"]]}}})
				if(db_collection.updateOne({"id":req.session.user.id},{$push:{canceled_jobs:[date,start,end,rec_id, "Declined"]}})){
					res.redirect("/contractor_worker_home_page")
				}
				else{
					res.redirect("/contractor_worker_home_page")
				}
			}
		})
	})
		

	app.get("/search_contractor_worker", authUser, authRole("Company Worker"), (req, res) => {
		var db = client.db("contractor-workers")
		var db_collection = db.collection("contractorWorkers")
		
		db_collection.find().toArray(function (err, allDetails) {
			if (err) {
				console.log(err)
			}
			else {
				res.render("search_contractor_worker", {details: allDetails})
			}
		})
	})

	app.get("/delete/:id", authUser, authRole("Company Worker"), (req,res)=>{
		// Connect contractor workers db and collection
		var db =client.db("contractor-workers")
		var db_collection = db.collection("contractorWorkers")
		var myquery = { id: req.params.id }

		if(db_collection){
			// Deleting contractor worker from collection contractorWorkers
			db_collection.deleteOne(myquery, function(err, obj) {
				if (err) throw err
				return obj
			})
			res.redirect("/search_contractor_worker")
		}
		
		db_collection = db.collection("contractorWorkersLogin")
		if(db_collection){
			// Deleting contractor worker from collection contractorWorkersLogin
			db_collection.deleteOne(myquery, function(err, obj) {
				if (err) throw err
				return obj
			})
		}
	})

	app.get("/contractor_worker_my_profile", authUser, authRole("Contractor Worker"), (req,res) => {
		// Connect contractor workers db and collection
		var db =client.db("contractor-workers")
		var db_collection = db.collection("contractorWorkers")
		db_collection.find({"id": req.session.user.id}).toArray(function (err, allDetails) {
			if (err) {
				console.log(err)
			}
			else{
				res.render("contractor_worker_my_profile", {details: allDetails})
			}
		})      
	})

	app.get("/hire_contractor/:id", (req, res) => {
		res.render("hire_contractor",{"id":req.params.id})
	})

	// POST functions
	app.post("/add_note_calendar" ,(req,res) => {
		var date = req.body.d
		var title = req.body.t
		var dec = req.body.e
		console.log(res)
		var db = client.db("contractor-workers")
		var db_collection = db.collection("contractorWorkers")
		db_collection.updateOne({"id":req.session.user.id},{$push:{not_able_to_work:[date,title,dec]}})
		console.log(date,title,dec)
	})

	app.post("/delete_note_calendar" ,(req,res) => {
		var date = req.body.d
		var title = req.body.t
		var dec = req.body.e
		console.log(res)
		var db = client.db("contractor-workers")
		var db_collection = db.collection("contractorWorkers")
		db_collection.updateOne({"id":req.session.user.id},{$pull:{not_able_to_work:[date,title,dec]}})
		console.log("Deleted note",date,title,dec)
	})
	
	app.post("/auth", (req, res) => {
		var user_name = req.body.Email_Address
		var passwordd = req.body.pass
		var userType = req.body.user_type
		var homepage_name=null
		var db_collection = null
		var db = null
		var type = null

		switch(userType)
		{
		case "Company Worker":
			db = client.db("human-resources-workers")
			db_collection = db.collection("humanResourcsesWorkersLogin")
			homepage_name = "CompanyWorkerHomepage"
			type = "Company Worker"
			break
		case "Contractor Worker":
			db =client.db("contractor-workers")
			db_collection = db.collection("contractorWorkersLogin")
			homepage_name = "contractor_worker_home_page"
			type = "Contractor Worker"
			break
		case "Employee":
			db = client.db("employers-workers")
			db_collection = db.collection("employersWorkersLogin")
			homepage_name = "recruiters_home_page"
			type = "Recruiter"
			break
		}

		if(db_collection){
			db_collection.find({"user":user_name , "password":passwordd}).toArray(function (err, users) {
				if (users.length  == 1)
				{
					req.session.user = {
						"id": users[0].id,
						"type": type
					}
					res.redirect("/" + homepage_name)
				}

				else
				{
					console.log("User Not Exist! \n")
					res.redirect("/Login")
				}
			})
		}
		else{res.redirect("/Login")}
	})

	app.post("/add_contractor", (req, res) => {
		var db = client.db("contractor-workers")
		var db_collection = db.collection("contractorWorkers")
		var contractor_id = req.body.id
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
		var password =(Math.floor(1000000 + Math.random() * 9000000)).toString()
		var data = null
		
		if(db_collection){
			// Check if the id belongs to another user
			db_collection.find({"id": contractor_id}).count().then(function(numItems) {
				console.log(numItems)
				if(numItems){
					console.log("There is an existing user with this ID, please try to restore your password if you already have a user")
					
					res.redirect("/add_new_contractor_worker")
				}
				// If there is not a user with that ID
				else {
					// Check if the user name is already taken
					db_collection.find({"first_name": first_name, "last_name": last_name}).count().then(function(numItems) {
						console.log(numItems)
						if(numItems){
							username = first_name + "_" + last_name + numItems + "@contractor.sce"
						}
						data ={
							"id": contractor_id,
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
							"password": password,
							"not_able_to_work":[],
							"hiring":[],
							"ratings":[],
							"shifts":[],
							"job_requests":[],
							"canceled_jobs":[]
						}
						// Add a new contractor worker to "contractorWorkers" collection with all of his information
						db_collection.insertOne(data, function (err, collection) {
							if (err) {
								throw err
							}
							console.log("Record inserted Successfully" + collection.insertedCount)
						})
					})
					// Add a new contractor worker to "contractorWorkersLogin" db with his username and password only
					var db_collection_login = db.collection("contractorWorkersLogin")
					data ={
						"id": contractor_id,
						"user": username,
						"password": password
					}
					db_collection_login.insertOne(data, function (err, collection) {
						if (err) {
							throw err
						}
						console.log("Record inserted Successfully" + collection.insertedCount)
					})
					res.redirect("/CompanyWorkerHomepage")
				}
			})
			
		}
	})

	app.post("/Register_New_Employee", (req, res) => {
		var db = client.db("employers-workers")
		var db_collection = db.collection("employersWorkers")
		var id=req.body.id
		var first_name = req.body.first_name
		var last_name = req.body.last_name
		var gender = req.body.radio
		var email = req.body.email
		var phone_number = req.body.phone
		var company_name = req.body.companyName
		var username = first_name + "_" + last_name + "@" + company_name + ".sce"
		var password = (Math.floor(1000000 + Math.random() * 9000000)).toString()
		var data = null
		// Check if the user name is already taken
		if(db_collection){
			db_collection.find({"first_name": first_name, "last_name": last_name}).count().then(function(numItems) {
				console.log(numItems)
				if(numItems){
					username = first_name + "_" + last_name + numItems + "@" + company_name + ".sce"
				}
				data ={
					"id":id,
					"first_name": first_name,
					"last_name": last_name,
					"gender": gender,
					"email": email,
					"phone_number": phone_number,
					"company_name": company_name,
					"user": username,
					"password": password,
					"hiring":[],
					"job_requests": []
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
		var db_collection_login = db.collection("employersWorkersLogin")
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
		res.redirect("/Login")
	})
		

	// POST function for search in a human resources pages
	app.post("/filter_search", (req, res) => {
		var skill = req.body.skill
		var hourly_pay = req.body.hourly_pay
		var city = req.body.city
		// Connect contractor workers db and collection
		var db =client.db("contractor-workers")
		var db_collection = db.collection("contractorWorkers")
		
		if(db_collection){
			// If the company worker didn't filled any of the filed then show all of the exsiting contractor workers
			if(skill == "" && hourly_pay == "" && city == ""){
				db_collection.find().toArray(function (err, allDetails) {
					if (err) {
						console.log(err)
					}
					else {
						res.render("search_contractor_worker", {details: allDetails})
					}
				})
			}
			// If the company worker filled all 3 criterions then search all the contractor workers that fits
			else if (skill && hourly_pay && city) {
				db_collection.find({"skills": skill, "hourly_pay": hourly_pay, "city": city}).toArray(function (err, allDetails) {
					if (err) {
						console.log(err)
					}
					else {
						res.render("search_contractor_worker", {details: allDetails})
					}
				})
			}
			else {
				res.render("search_contractor_worker", {details: null})
			}
			
		}
	})

	app.post("/filter_monitor_hiring", (req, res) => {
		var recrutier_id = req.body.recrutier_id
		var contractor_name = req.body.contractor_name
		var date = req.body.date
		// Connect contractor workers db and collection
		var db =client.db("contractor-workers")
		var db_collection = db.collection("contractorWorkers")
		
		if(db_collection){
			db_collection.find().toArray(function (err, allDetails) {
				if (err) {
					console.log(err)
				}
				else {
					var all_hiring = []
					var i = 0
					for(i=0; i < allDetails.length; ++i){
						var contractor_hirings = allDetails[i].hiring
						for (var j=0; j<contractor_hirings.length; ++j){
							var one_hire = {
								"contractor_id": allDetails[i].id,
								"full_name": allDetails[i].first_name + " " + allDetails[i].last_name,
								"date": contractor_hirings[j][0],
								"start": contractor_hirings[j][1],
								"end": contractor_hirings[j][2],
								"recrutier_id": contractor_hirings[j][3]
							}
							all_hiring.push(one_hire)
						}
					}
					// If the company worker didn't filled any of the filed then show all of the exsiting contractor workers
					if(recrutier_id != ""){
						for (i=all_hiring.length; i>0; --i){
							if(all_hiring[i-1].recrutier_id != recrutier_id){
								all_hiring.splice(i-1, 1)
							}
						}

					}
					if(contractor_name != ""){
						for (i=all_hiring.length; i>0; --i){
							if(all_hiring[i-1].full_name != contractor_name){
								all_hiring.splice(i-1, 1)
							}
						}
					}
					if(date != ""){
						for (i=all_hiring.length; i>0; --i){
							if(all_hiring[i-1].date != date){
								all_hiring.splice(i-1, 1)
							}
						}
						
					}
					res.render("monitor_of_all_hires", {details: all_hiring})
				}
			})
			
		}
	})

	app.post("/filter_search_by_recruiter", (req, res) => {
		var skill = req.body.skill
		var hourly_pay = req.body.hourly_pay
		var city = req.body.city
		// Connect contractor workers db and collection
		var db =client.db("contractor-workers")
		var db_collection = db.collection("contractorWorkers")
		
		if(db_collection){
			// If the company worker didn't filled any of the filed then show all of the exsiting contractor workers
			if(skill == "" && hourly_pay == "" && city == ""){
				db_collection.find().toArray(function (err, allDetails) {
					if (err) {
						console.log(err)
					}
					else {
						res.render("recruiters_home_page", {details: allDetails})
					}
				})
			}
			// If the company worker filled all 3 criterions then search all the contractor workers that fits
			else if (skill && hourly_pay && city) {
				db_collection.find({"skills": skill, "hourly_pay": hourly_pay, "city": city}).toArray(function (err, allDetails) {
					if (err) {
						console.log(err)
					}
					else {
						res.render("recruiters_home_page", {details: allDetails})
					}
				})
			}
			else {
				res.render("recruiters_home_page", {details: null})
			}
			
		}
	})

	app.post("/hire", (req, res) => {
		var id_of_contractor = req.body.contractor_id
		var id_of_recruiter =  req.session.user.id
		var date = req.body.date_of_hire
		var start = req.body.Start_work
		var end = req.body.end_work

		
		var db =client.db("contractor-workers")
		var db_collection = db.collection("contractorWorkers")
		if(db_collection){
			db_collection.find({"id": id_of_contractor}).toArray(function (err, allDetails) {
				if (err) {
					console.log(err)
				}
				else {
					try {
						var day
						var temp=allDetails[0].not_able_to_work
						for(day of temp)
						{
							if(day[0] == date)
							{
								console.log("cant' hire in this day!")
								res.redirect("back")
							}
						}
						
						var job
						var contractor_hiring = allDetails[0].hiring
						for(job of contractor_hiring)
						{
							if(job[0] == date)
							{
								console.log("cant hire twice by same recruiter!\n")
								res.redirect("back")
							}
						}

						db_collection.updateOne({"id":id_of_contractor},{$push:{job_requests:[date,start,end,id_of_recruiter, "Waiting for approval"]}})

						db =client.db("employers-workers")
						db_collection = db.collection("employersWorkers")
						db_collection.updateOne({"id":id_of_recruiter},{$push:{job_requests:[date,start,end,id_of_contractor, "Waiting for approval"]}})
						res.redirect("/recruiters_home_page")
					} catch (error) {
						console.log("Ad matay????")
					}
				}
			})
		}
	})

	app.post("/add_new_shift", (req, res) => {
		var db =client.db("contractor-workers")
		var db_collection = db.collection("contractorWorkers")
		var date = req.body.date_of_shift
		var start_work = req.body.start_work
		var end_work = req.body.end_work
		var rec_id = req.body.rec_id
		db_collection.updateOne({"id":req.session.user.id},{$push:{shifts:[date,start_work,end_work,rec_id]}})
		res.redirect("/contractor_shifts")
	})

	app.post("/save_new_contractor_information", (req, res) => {
		var enter_contractor_id = req.body.contractor_id
		var enter_first_name = req.body.first_name
		var enter_last_name = req.body.last_name
		var enter_city = req.body.city
		var enter_home_address = req.body.home_address
		var enter_phone = req.body.phone
		var enter_email = req.body.email

		var db =client.db("contractor-workers")
		var db_collection = db.collection("contractorWorkers")
		if(db_collection){
			db_collection.updateOne({"id":enter_contractor_id},{$set:
				{
					first_name: enter_first_name,
					last_name: enter_last_name,
					city: enter_city,
					home: enter_home_address,
					phone_number: enter_phone,
					email: enter_email,
				}
			})
			if(req.session.user.type == "Contractor Worker")
			{
				res.redirect("/contractor_worker_my_profile")
			}
			else{
				res.redirect("/contractor_worker_profile/" + enter_contractor_id)
			}
		}
		else{
			if(req.session.user.type == "Contractor Worker")
			{
				res.redirect("/contractor_worker_my_profile")
			}
			else
			{
				res.redirect("/contractor_worker_profile/" + enter_contractor_id)
			}
		}
	})

	app.post("/save_new_shift", (req, res) => {
		var shift_date = req.body.hiddenDate
		var start_hire = req.body.start_work
		var end_hire = req.body.end_work
		var rec_id = req.body.hiddenID
		
		var db = client.db("contractor-workers")
		var db_collection = db.collection("contractorWorkers")
		db_collection.find({"id": req.session.user.id}).toArray(function (err, allDetails) {
			if (err) {
				console.log(err)
			}
			else {
				var shifts = allDetails[0].shifts
				var old_start = null
				var old_end = null
				for(var i=0; i<shifts.length; ++i){
					if(shifts[i][0] == shift_date){
						old_start = shifts[i][1]
						old_end = shifts[i][2]
						break
					}
				}
				db_collection.updateOne({"id":req.session.user.id, "shifts": { $in : [[shift_date, old_start, old_end, rec_id]]}}, {$set: {"shifts.$": [shift_date, start_hire, end_hire, rec_id]}})
				res.redirect("/contractor_shifts")
			}
		})
	})

	app.post("/add_note_calendar" ,(req,res) => {
		var date= req.body.d
		var title=req.body.t
		var dec=req.body.e
		var db =client.db("contractor-workers")
		var db_collection = db.collection("contractorWorkers")
		if(title == "Work Day")
		{
			var det = dec.split("\n")
			var start_work = det[0]
			var end_work = det[1]
			var rec_id = det[2]
			db_collection.updateOne({"id":req.session.user.id},{$push:{shifts:[date,start_work,end_work,rec_id]}})
			res.render("contractor_worker_home_page")
		}
		else{
			db_collection.updateOne({"id":req.session.user.id},{$push:{not_able_to_work:[date,title,dec]}})
			res.render("contractor_worker_home_page")
		}
	})

	app.post("/delete_note_calendar" ,(req,res) => {
		var date= req.body.d
		var title=req.body.t
		var dec=req.body.e
		var db =client.db("contractor-workers")
		var db_collection = db.collection("contractorWorkers")
		if(title == "Work Day"){
			var det = dec.split("\n")
			var start_work = det[0]
			var end_work = det[1]
			var rec_id = det[2]
			db_collection.updateOne({"id":req.session.user.id},{$pull:{shifts:[date,start_work,end_work,rec_id]}})
			res.render("contractor_worker_home_page")
		}
		else {
			db_collection.updateOne({"id":req.session.user.id},{$pull:{not_able_to_work:[date,title,dec]}})
			res.render("contractor_worker_home_page")
		}
	})

}).catch(console.error)

app.listen(port, () => {
	console.log("Listening to port 3000!!!")
})

//var data = {
//  "user": user_name,
//  "password": passwordd
//}
//console.log(data)
//loginData.insertOne(data, function (err, collection) {
//  if (err) {
//      throw err
//  }
//  console.log("Record inserted Successfully" + collection.insertedCount)
//})




//var dbo = client.db("login-auth")
//dbo.collection("loginData").find({"user":user_name , "password":passwordd}).count().then(function(numItems) {
//  console.log("Number of items:",numItems) // Use this to debug
//  if (numItems  == 1)
//  {
//      res.sendFile(__dirname + "/loggedIn.html")
//  }
//  else
//  {
//      console.log("User Not Exist! \n")
//      res.render("Login")
//  }
//})
