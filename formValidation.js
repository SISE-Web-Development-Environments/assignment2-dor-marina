// Wait for the DOM to be ready
    $(function() {
    // Initialize form validation on the registration form.
    // It has the name attribute "registration"
    $("form[name='registration']").validate({
      // Specify validation rules
      rules: {
        // The key name on the left side is the name attribute
        // of an input field. Validation rules are defined
        // on the right side
        firstname:{
            required: true,
            namecheck:true,
        },
        lastname:{
            required: true,
            namecheck:true,
        },
        username: "required",
        email: {
          required: true,
          // Specify that email should be validated
          // by the built-in "email" rule
          email: true,
        },
        password: {
          required: true,
          pwcheck:true,
          minlength: 6,
        }
      },
      // Specify validation error messages
      messages: {
        firstname:{
            required: "Please enter your name",
            namecheck: "Your first name can only include letters"
        },
        lastname:{
            required: "Please enter your name",
            namecheck: "Your last name can only include letters"
        },
        username: "Please enter your username",
        password: {
          required: "Please provide a password",
          minlength: "Your password must be at least 6 characters long",
          pwcheck: "Your Password must include at least one letter and one digit"
        },
        email: "Please enter a valid email address"
      }
    });
    $.validator.addMethod("pwcheck", function(value) {
        return /^[A-Za-z0-9\d=!\-@._*]*$/.test(value) // consists of only these
            && /[a-z]/.test(value) // has a lowercase letter
            && /\d/.test(value) // has a digit
     });
     $.validator.addMethod("namecheck", function(value) {
        return /^[A-Za-z]*$/.test(value) // consists of only these
     });
     $("form[name='properties']").validate({
      rules:{
        time:{
          required: true,
          timecheckDigits:true,
          timecheck:true
        },
        ball5:{
          ball5DupCheck:true
        },
        ball15:{
          ball15DupCheck:true
        },
        ball25:{
          ball25DupCheck:true
        }
      },
      messages: {
        time:{
          required: "Please enter the time limit for the game",
          timecheckDigits: "Must enter digits only",
          timecheck: "The game must be at least 60 seconds"
        },
        ball5:{
          ball5DupCheck:"please chose a diffrent color"
        },
        ball15:{
          ball15DupCheck:"please chose a diffrent color"
        },
        ball25:{
          ball25DupCheck:"please chose a diffrent color"
        }
      }
    });
    $.validator.addMethod("timecheckDigits", function(value) {
      return /^[0-9]*$/.test(value) // consists of only these
   });

   $.validator.addMethod("timecheck", function(value) {
    if(parseInt(value)<60){
      return false;
    }
    return true;
  });

  $.validator.addMethod("ball5DupCheck", function(value) {
    if(value==document.getElementById("ball15").value || value==document.getElementById("ball25").value){
      return false;
    }
    return true;
 });

 $.validator.addMethod("ball15DupCheck", function(value) {
  if(value==document.getElementById("ball5").value || value==document.getElementById("ball25").value){
    return false;
  }
  return true;
});

$.validator.addMethod("ball25DupCheck", function(value) {
  if(value==document.getElementById("ball15").value || value==document.getElementById("ball5").value){
    return false;
  }
  return true;
});
  });