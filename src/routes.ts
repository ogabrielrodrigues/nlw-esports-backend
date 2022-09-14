import { Router } from 'express'

const router = Router()

router.get('/', (request, response) => {
  return response.status(200).send({ message: 'Welcome to Nlw E-sports!', path: request.path })
})

export { router }
