// Node.js built-in modules

// Third-party libraries
import { type NextFunction, type Request, type Response } from 'express'

// Own modules
import TrackModel, { type ITrack } from '../models/Track.js'
import UserModel from '../models/User.js'
import logger from '../utils/logger.js'

export async function createTrack (req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.silly('Creating track')

    interface TrackRequestBody {
        accessToken: string
        trackName: string
        timeOffset?: number
    }

    const {
        accessToken,
        trackName,
        timeOffset
    } = req.body as TrackRequestBody

    const newTrack = new TrackModel({
        trackName,
        Date: Date.now() + (timeOffset ?? 0)
    })

    const savedTrack = await newTrack.save() as ITrack

    const filter = { accessToken }
    const update = { $push: { tracks: savedTrack } }
    await UserModel.findOneAndUpdate(filter, update).exec()

    res.status(201).json(savedTrack)
}
