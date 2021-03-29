var expect = require('chai').expect
const express = require("express")
const port = process.env.PORT || 3000
const app = express()
app.set("view engine", "ejs")
app.use(express.static("public"))



describe('WebPages', () => {
    describe('#Home Page Status', () => {
        it('should status 200 that page dileverd as expected', () => {
            expect(app.get('/',function(req,res){
                res.sendStatus(200)
            }))
        })

    })
})
