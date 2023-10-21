const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const userUpdate = async (req, res) => {
   console.log("om")
    const userId = req.params.userId;
    console.log("om", userId);
    try {
        // Retrieve the user from the database
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user details
        if (req.body.name) {
            user.name = req.body.name;
        }

        if (req.body.email) {
            user.email = req.body.email;
        }

        if (req.body.password) {
            // Securely hash the new password before saving it
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            user.password = hashedPassword;
        }

        // Save the updated user
        await user.save();
        console.log("sucess");
        res.status(200).json({ message: 'User details updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating user details' });
    }
}


module.exports = { userUpdate };