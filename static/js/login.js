// jshint esversion:6
$(function() {
	// Initialize Nod
	let myNod = nod();

	// nod configuration
	myNod.configure({
		jQuery: $,
		form: ".login-form form",
		submit: ".submit-btn",
		preventSubmit: true
	});
	myNod.add([{
		selector: "#username",
		validate: function(callback, value) {
			callback(isBlankText(value));
		},
		errorMessage: "Username cannot be blank."
	}, {
		selector: "#password",
		validate: [function(callback, value) {
			callback(isBlankText(value));
		  }, function(callback, value) {
			callback(passwordLength(value));
		  }, function(callback, value) {
			callback(isValidPassword(value));
		  }],
		  errorMessage: ["New password cannot be blank.", "Password must be 8-25 characters long.", "Password must contain alphabet, digit or special symbol ($, @, !, %,*, #, ?, &)."]
		}]);

	/*-----nodjs validation----*/
	nod.classes.successClass = "has-success";
	nod.classes.errorClass = "has-error";
});
