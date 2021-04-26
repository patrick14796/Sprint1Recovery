function authUser(req, res, next){
	
	if(req.session.user == null){
		res.status(403)
		return res.send("You need to sign in")
	}
	next()
}

function authRole(role){
	return (req, res, next) => {
		console.log(req.session.user.type)
		console.log(role)
		if(req.session.user.type !== role){
			console.log("here")
			res.status(401)
			return res.send("Not allowed")
		}
		console.log("!!")
		next()
	}
}

module.exports = {
	authUser,
	authRole
}
