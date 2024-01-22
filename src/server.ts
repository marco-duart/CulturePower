import express from "express"
import "./shared/translate/TranslationsYup"
import { userRoutes } from "./users/user-routes" 
import { adminRoutes } from "./admins/admin-routes"
import { productRoutes } from "./products/product-routes"

const app = express()

app.use(express.json())
app.use(userRoutes)
app.use(adminRoutes)
app.use(productRoutes)

export { app }