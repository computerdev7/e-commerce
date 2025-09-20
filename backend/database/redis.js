import { createClient } from "redis";

const client = createClient();

client.on('error',()=> {
    console.log('error while on redis')
})

await client.connect()

export default client