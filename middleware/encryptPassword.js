const CryptoJS = require('crypto-js')

// encrypt password asyncronously using CryptoJS middleware
const encryptPassword = async (req, res, next) => {
    const { password } = req.body
    if (!password) {
        return res.status(400).send('Please enter all fields')
    }
    const hashedPassword = CryptoJS.AES.encrypt(
        password,
        process.env.PASS_SEC
    ).toString()
    req.body.password = hashedPassword
    next()
}

// decrypt password using CryptoJS function
const decryptPassword = (password) => {
    const decryptedPassword = CryptoJS.AES.decrypt(
        password,
        process.env.PASS_SEC
    ).toString(CryptoJS.enc.Utf8)
    return decryptedPassword
}

module.exports = { encryptPassword, decryptPassword }
