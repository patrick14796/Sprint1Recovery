
module.exports = function(app) {  //receiving "app" instance
       
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

	app.get("/contractor_worker_edit_profile", (req, res) => {
		res.render("contractor_worker_edit_profile")
	})

}

