const User = require('../model/User')
const bcrypt = require('bcrypt');

// Handling User
const handleNewUser = async (req, res) => {
    const { user, pass } = await req.body;
    // const user = req.body.username;
    // const pwd = req.body.password;
    console.log(user, pass);
    if (!user || !pass) return res.send("Enter Correct Values...");

    // Checking Duplicate 
    const duplicate = await User.fineOne({ "username": user }).exec();// Exec For Await 
    if (duplicate) return res.send("User Already Exists!");
    try {

        // Generate Hash Password
        const hashPass = await bcrypt.hash(pwd, 10);

        // Creating New User 
        // result => record That has been created
        var result = User.create({
            "username": user,
            "password": hashPass
        });

        // -------------- Or ----------------
        // const user1 = new User();
        // user1.username = user;
        // user1.password = hashPass;
        // result = User.save();


        // Storing new user

        
        console.log(userData.users);
        res.status(201).send("New User Added Successfully ....")
    } catch (err) {
        res.send(err)
    }
    
}

module.exports = {handleNewUser};
