import bcrypt from "bcrypt"
async function test(){

    const hashedPassword = await bcrypt.hash("123456", 10);
console.log(hashedPassword)

}

test();