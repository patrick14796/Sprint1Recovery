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
