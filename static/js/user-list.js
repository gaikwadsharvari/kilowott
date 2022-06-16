// jshint esversion:6
$(document).ready(function () {
	//	enable user
	$(".user-list").on('click', '.btn-enable', function () {
		let userId = $(this).attr('id');
		let activity = true; // set is_active to true
		swal({
			title: "Confirm?",
			text: "Are You sure you want to enable user?",
			closeOnClickOutside: false,
			closeOnEsc: false,
			buttons: ["No", "Yes"]
		}).then(function (save) {
			if (save) {
				$.ajax({
					url: '/users/action/' + activity + '/' + userId,
					type: "POST",
					success: function (response) {
						if (response.isSuccess) {
							swal({
								title: "Message",
								text: "User is Enabled successfully.",
								closeOnClickOutside: false,
								closeOnEsc: false,
							}).then(function (save) {
								window.location.reload();
							});
						} else {
							swal({
								title: "Message",
								text: "User could not be enable.",
								closeOnClickOutside: false,
								closeOnEsc: false,
							}).then(function (save) {
								window.location.reload();
							});
						}
					}
				})
			}
		})
	});
	//	disable user
	$(".user-list").on('click', '.btn-disable', function () {
		let userId = $(this).attr('id');
		let activity = false; // set is_active to false
		swal({
			title: "Confirm?",
			text: "Are You sure you want to disable user?",
			closeOnClickOutside: false,
			closeOnEsc: false,
			buttons: ["No", "Yes"]
		}).then(function (save) {
			if (save) {
				$.ajax({
					url: '/users/action/' + activity + '/' + userId,
					type: "POST",
					success: function (response) {
						if (response.isSuccess) {
							swal({
								title: "Message",
								text: "User is Disabled successfully.",
								closeOnClickOutside: false,
								closeOnEsc: false,
							}).then(function (save) {
								window.location.reload();
							});
						} else {
							swal({
								title: "Message",
								text: "User could not be disable.",
								closeOnClickOutside: false,
								closeOnEsc: false,
							}).then(function (save) {
								window.location.reload();
							});
						}
					}
				})
			}
		})
	});
	$(".close-modal").click(function () {
		$(".modal").hide();
	});
});