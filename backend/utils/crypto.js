const crypto=require("crypto");
function generateSalt(){
    return crypto.randomBytes(16).toString("hex");
}

function hashPassword(password,salt){
    return crypto.createHash("sha256").update(password+salt).digest("hex");
}

module.exports={generateSalt,hashPassword};