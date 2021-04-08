function validate() {
	if( document.add_form.full_name.value == "" ) {
	 alert( "Please provide your name!" );
	 document.add_form.full_name.focus() ;
	 console.log("inside");
	 return false;
	}
	if( document.add_form.email.value == "" ) {
	 alert( "Please provide your Email!" );
	 document.add_form.EMemailail.focus() ;
	 return false;
	}
	return( true );
}

(function ($) {
    "use strict";


    /*==================================================================
    [ Focus input ]*/
    $('[name="full_name"').each(function(){
        $(this).on('blur', function(){
            if($(this).val().trim() != "") {
                $(this).addClass('has-val');
            }
            else {
				alert("this is an alert")
                $(this).removeClass('has-val');
            }
        })    
    })
  
  
    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    validate(input)

})(jQuery);