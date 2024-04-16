import express from "express"
import feedRoute from "./feedRoute.js"
import messageRoute from "./messageRoute.js"
import videoRoute from "./videoRoute.js"
import eventRoute from "./eventRoute.js"
import pageRoute from "./pageRoute.js"
import groupRoute from "./groupRoute.js"
import marketRoute from "./marketRoute.js"
import blogRoute from "./blogRoute.js"
import gameRoute from "./gameRoute.js"
import fundingRoute from "./fundingRoute.js"
import blog2Route from "./blog2Route.js"
import event2Route from "./event2Route.js"
import group2Route from "./group2Route.js"
import timelineRoute from "./timelineRoute.js"
import mytimelineRoute from "./mytimelineRoute.js"
import timelinev2Route from "./timelinev2Route.js"
import settingRoute from "./settingRoute.js"
import loginRoute from "./loginRoute.js"
import exportRoute from "./exportRoute.js"
import upgradeRoute from "./upgradeRoute.js"
import componentRoute from "./componentRoute.js"
import video_watchRoute from "./video_watchRoute.js"
import timelineGroupRoute from "./timelineGroupRoute.js"
import timelineEventRoute from "./timelineEventRoute.js"
import timelinePageRoute from "./timelinePageRoute.js"
import blogReadRoute from "./blogReadRoute.js"
import productViewRoute from "./productViewRoute.js"
import timelineFundingRoute from "./timelineFundingRoute.js"
import fakedataRoute from "./fakedataRoute.js"
import searchRoute from "./searchRoute.js"
import search2Route from "./search2Route.js"
import settingVulRoute from "./settingvulRoute.js"
import { userAuth } from "../middleware/userAuth.js"

const Route = express.Router()

Route.use("/fakedata",fakedataRoute)

//authen middleware
//Route.use(userAuth)

Route.use("/",feedRoute)
Route.use("/feed",feedRoute)
Route.use("/messages",messageRoute)
Route.use("/video",videoRoute)
Route.use("/event",eventRoute)
Route.use("/pages",pageRoute)
Route.use("/groups",groupRoute)
Route.use("/market",marketRoute)
Route.use("/blog",blogRoute)
Route.use("/games",gameRoute)
Route.use("/funding",fundingRoute)
Route.use("/blog-2",blog2Route)
Route.use("/event-2",event2Route)
Route.use("/groups-2",group2Route)
Route.use("/timeline",timelineRoute)
Route.use("/mytimeline",mytimelineRoute)
Route.use("/timelinev2",timelinev2Route)
Route.use("/setting",settingRoute)
Route.use("/form-login",loginRoute)
Route.use("/export",exportRoute)
Route.use("/upgrade",upgradeRoute)
Route.use("/components",componentRoute)
Route.use("/video-watch",video_watchRoute)
Route.use("/timeline-group",timelineGroupRoute)
Route.use("/timeline-event",timelineEventRoute)
Route.use("/timeline-page",timelinePageRoute)
Route.use("/blog-read",blogReadRoute)
Route.use("/product-view-1",productViewRoute)
Route.use("/timeline-funding",timelineFundingRoute)
Route.use("/search", searchRoute)
Route.use("/search2", search2Route)
Route.use("/settings", settingVulRoute)

export default Route