var expect = require('chai').expect

describe('Login', () => {
    describe('#Email Address', () => {
        it('should return true if get valid email address format', () => {
            var validEmailAddress = 'check@gov.il'
            expect(validateEmail(validEmailAddress)).to.be.eql(true)
        })

		it('should return false if get invalid email address ending format', () => {
            var invalidEmailAddress = 'check@mail'
            expect(validateEmail(invalidEmailAddress)).to.be.eql(false)
        })

		it('should return false if get email address without @', () => {
            var invalidEmailAddress = 'checkmail.il'
            expect(validateEmail(invalidEmailAddress)).to.be.eql(false)
        })

		it('should return false if get empty email address ending', () => {
            var invalidEmailAddress = 'check@'
            expect(validateEmail(invalidEmailAddress)).to.be.eql(false)
        })

		it('should return false if get empty email address', () => {
            var emptyEmailAddress = ''
            expect(validateEmail(emptyEmailAddress)).to.be.eql(false)
        })
    })

    describe('#Password', () => {
        it('should return true if get valid password', () => {
            var validPassword = 'a12'
            expect(validatePassword(validPassword)).to.be.eql(true)
        })

		it('should return false if get invalid password', () => {
            var invalidPassword = ''
            expect(validatePassword(invalidPassword)).to.be.eql(false)
        })
    })
})

function validateEmail (input) {
	const validEmailFormat = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	if(input.trim().match(validEmailFormat) == null){
			return false;
	}
	else if (input.trim() == ''){
			return false;
	}
	return true;
}

function validatePassword (input) {
	if (input.trim() == ''){
			return false;
	}
	return true;
}