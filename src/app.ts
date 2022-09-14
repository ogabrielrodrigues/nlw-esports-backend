import cors from 'cors'
import express from 'express'

import { router } from './routes'

const app = express()

app.use(express.json())
app.use(
  cors({
    origin: '*'
  })
)
app.use(router)

export { app }
