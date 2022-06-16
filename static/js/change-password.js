$(function() {
  // Initialize Nod
  let myNod = nod();
  // $("#closeModal").click(function() {
  // });
  // nod configuration
  myNod.configure({
    jQuery: $,
    submit: ".submit",
    form: ".change-password-form",
    preventSubmit: true,
    delay: 0
  });
  myNod.add([{
      selector: "#oldPassword",
      validate: function(callback, value) {
        callback(isBlankText(value));
      },
      errorMessage: "Old password cannot be blank."
    },
    {
      selector: "#newPassword",
      validate: [function(callback, value) {
        callback(isBlankText(value));
      }, function(callback, value) {
        callback(passwordLength(value));
      }, function(callback, value) {
        callback(isValidPassword(value));
      }],
      errorMessage: ["New password cannot be blank.", "Password must be 8-15 characters long.", "Password must contain alphabet, digit or special symbol ($, @, !, %,*, #, ?, &)."]
    },
    {
      selector: "#confirmPassword",
      validate: [function(callback, value) {
        callback(isBlankText(value));
      }, function(callback, value) {
        callback(confirmPassword(value));
      }],
      errorMessage: ["Confirm password cannot be blank.", "Confirm password cannot match."]
    }
  ]);
  /*-----nodjs validation----*/
  nod.classes.successClass = "has-success";
  nod.classes.errorClass = "has-error";
});

