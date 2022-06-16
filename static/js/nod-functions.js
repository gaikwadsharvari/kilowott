// jshint esversion:6

function isValidPassword(n) {
	var regularExpression = /^(?=.*[0-9])|(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,25}$/;
	if (n.match(regularExpression)) {
		return true;
	} else {
		return false;
	}
}

function passwordLength(n) {
	if (n.length >= 8 && n.length <= 25) {
		return true;
	} else {
		return false;
	}
}


function confirmPassword() {
	let newPassword = $("#newPassword").val();
	let confirmPassword = $("#confirmPassword").val();
	if (newPassword === confirmPassword) {
		return true;
	} else {
		return false;
	}
}

function isBlankText(str) {
	if ((str.trim()).length > 0) {
		return true;
	} else {
		return false;
	}
}