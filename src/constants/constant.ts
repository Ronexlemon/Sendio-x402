import "dotenv/config";

const connectionString = `${process.env.DATABASE_URL}`

const PassWaordHash = `${process.env.PASSWORDHASH}`

export {connectionString,PassWaordHash}