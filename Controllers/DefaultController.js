const express = require("express");

//Home Page routing function
const homePage = (req,res)=>{
    res.send("Backend server is up and running");
}



module.exports = {
    homePage
}
