import express from "express"
import { userRoutes } from "./users/user-routes" 
import "./shared/translate/TranslationsYup"

const app = express()

app.use(express.json())
app.use(userRoutes)

export { app }