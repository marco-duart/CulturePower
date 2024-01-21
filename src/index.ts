import 'dotenv/config'
import { app } from "./server"
import { MongoConnection } from "./configs/database"
import { env } from "./configs/env"

MongoConnection.initialize()

app.listen(env.PORT, () => console.log(`Server is running on port ${env.PORT} 🚀`))