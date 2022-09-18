import { Ad, PrismaClient } from '@prisma/client'
import { Router } from 'express'

import { convertHourStringToMinutes } from './utils/convertHourStringToMinutes'
import { convertMinutesToHourString } from './utils/convertMinutesToHourString'

const router = Router()

const prisma = new PrismaClient()

router.get('/games', async (request, response) => {
  const games = await prisma.game.findMany({
    include: {
      _count: {
        select: {
          ads: true
        }
      }
    }
  })

  return response.status(200).json(games)
})

router.post('/games/:id/ads', async (request, response) => {
  const gameId = request.params.id
  const { name, yearsPlaying, discord, weekDays, hourStart, hourEnd, useVoiceChannel } = request.body

  await prisma.ad.create({
    data: {
      gameId,
      name,
      yearsPlaying,
      discord,
      weekDays: weekDays.join(','),
      hourStart: convertHourStringToMinutes(hourStart),
      hourEnd: convertHourStringToMinutes(hourEnd),
      useVoiceChannel
    }
  })

  return response.sendStatus(201)
})

router.get('/games/:id/ads', async (request, response) => {
  const gameId = request.params.id

  const ads = await prisma.ad.findMany({
    where: {
      gameId
    },
    select: {
      id: true,
      name: true,
      weekDays: true,
      useVoiceChannel: true,
      yearsPlaying: true,
      hourStart: true,
      hourEnd: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return response.status(200).json(
    ads.map((ad: Ad) => {
      return {
        ...ad,
        weekDays: ad.weekDays.split(','),
        hourStart: convertMinutesToHourString(ad.hourStart),
        hourEnd: convertMinutesToHourString(ad.hourEnd)
      }
    })
  )
})

router.get('/ads/:id/discord', async (request, response) => {
  const adId = request.params.id

  const ad = await prisma.ad.findUniqueOrThrow({
    where: {
      id: adId
    },
    select: {
      discord: true
    }
  })

  return response.status(200).json({ discord: ad.discord })
})

export { router }
