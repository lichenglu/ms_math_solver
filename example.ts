import 'dotenv/config'
import { initService } from './lib'

(async () => {
    const service = initService({ 
        youtubeAPIKey: process.env.YOUTUBE_DATA_API_KEY,
        fallbackToYoutubeVideos: process.env.FALLBACK_TO_YOUTUBE_SEARCH  === 'true'
    })
    const res = await service.solveFor('3x+4=1')
    if (res.data) {
        // console.log(res.data.answer)
        // console.log(res.data.solveSteps)
        // console.log(res.data.relatedVideos)
        // console.log(res.data.relatedConcepts)
    }
})()