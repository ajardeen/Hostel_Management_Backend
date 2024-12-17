const express = require("express");

//Home Page routing function
const homePage = (req,res)=>{
    res.send("Welcome to Home Page");
}



module.exports = {
    homePage
}
