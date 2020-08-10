const User = require('../models/user.model.js');

// Retrieve and return all users from the database.
exports.findAll = (req, res) => {
	User.find()
		.then(users => {
			res.send(users);
		}).catch(err => {
			res.status(500).send({
				message: err.message || "Something went wrong while getting list of users."
			});
		});
};

// Create and Save a new User
exports.create = (req, res) => {
	// Validate request
	if (!req.body) {
		return res.status(400).send({
			message: "Please fill all required field"
		});
	}

	User.findOne({ email: req.body.email }, (err, user) => {
		if (err) {
			//handle error here
			return res.status(500).send({
				message: err.message || "Something went wrong while creating new user."
			});
		}

		//if a user was found, that means the user's email is already in the database
		if (user) {
			var err = new Error('Email Id already Exists!')
			err.status = 400;
			return res.status(400).send({
				code: -2104,
				message: err.message || "Something went wrong while creating new user."
			});
		} else {
			//code if no user with entered email was found
			// Then Create a new User
			let userbody = {
				first_name: req.body.first_name,
				last_name: req.body.last_name,
				email: req.body.email,
				phone: req.body.phone,
				password: req.body.password
			}
			if (req.body.country) {
				userbody['country'] = req.body.country;
			}
			const user = new User(userbody);
			// Save user in the database
			user.save()
				.then(data => {
					res.send({
						id: user.id,
						message: 'User Created Successfully!'
					});
				}).catch(err => {
					res.status(500).send({
						message: err.message || "Something went wrong while creating new user."
					});
				});
		}
	})
};

// Find a single User with a id
exports.findOne = (req, res) => {
	User.findById(req.query.id)
		.then(user => {
			if (!user) {
				return res.status(404).send({
					code: -2204,
					message: "User not found with id " + req.query.id
				});
			}
			res.send(user);
		}).catch(err => {
			if (err.kind === 'ObjectId') {
				return res.status(404).send({
					code: -2204,
					message: "User not found with id " + req.query.id
				});
			}
			return res.status(500).send({
				message: "Error getting user with id " + req.query.id
			});
		});
};

// Update a User identified by the id in the request
exports.update = (req, res) => {
	if (!req.body) {
		return res.status(400).send({
			message: "Please fill all required field"
		});
	}

	let reqBody = {
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email: req.body.email,
		phone: req.body.phone,
		country: req.body.country ? req.body.country : '',
		gender: req.body.gender ? req.body.gender : '',
		profile_image: req.body.profile_image ? req.body.profile_image : '',
		dob: req.body.dob ? req.body.dob : '',
	}

	// Find user and update it with the request body
	User.findByIdAndUpdate(req.query.id, reqBody, { new: true })
		.then(user => {
			if (!user) {
				return res.status(404).send({
					message: "user not found with id " + req.query.id
				});
			}
			res.send(user);
		}).catch(err => {
			if (err.kind === 'ObjectId') {
				return res.status(404).send({
					message: "user not found with id " + req.query.id
				});
			}
			return res.status(500).send({
				code: -2304,
				message: "Error updating user with id " + req.query.id
			});
		});
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
	User.findByIdAndRemove(req.query.id)
		.then(user => {
			if (!user) {
				return res.status(404).send({
					message: "user not found with id " + req.query.id
				});
			}
			res.send({ message: "user deleted successfully!" });
		}).catch(err => {
			if (err.kind === 'ObjectId' || err.name === 'NotFound') {
				return res.status(404).send({
					message: "user not found with id " + req.query.id
				});
			}
			return res.status(500).send({
				message: "Could not delete user with id " + req.query.id
			});
		});
};

exports.login = (req, res) => {
	User.findOne({ email: req.body.email }, (err, user) => {
		if (err) {
			//handle error here
			return res.status(500).send({
				message: err.message || "Something went wrong while logging in."
			});
		}
		if (user) {
			User.findOne({ email: req.body.email, password: req.body.password }, (err1, user1) => {
				if (err) {
					return res.status(500).send({
						message: err.message || "Something went wrong while logging in."
					});
				}
				if (user1) {
					res.send({
						id: user1.id,
						message: 'User Logged in Successfully!'
					})
				} else {
					res.status(500).send({
						code: -2105,
						message: "Invalid Password."
					});
				}
			})
		} else {
			res.status(500).send({
				code: -2104,
				message: "Account does not Exist!"
			});
		}
	})
}