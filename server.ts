import express from "express"
import { join, resolve } from "path"
require("dotenv").config()
import Datastore from "nedb"
import { json } from "body-parser"
import fetch from "node-fetch"
import { request } from "http"
import createError from "http-errors"

const weatherdb = new Datastore({ filename: resolve(__dirname, "weather.db"), autoload: true })

const app = express()
const port = process.env.PORT || 3001

app.set("view engine", "pug")
app.use(json({ limit: "1mb" }))
app.use(express.static(join(__dirname,"public")))
app.get("/", (_, res) => {
    weatherdb.find({}, (err: Error, docs: Document[]) => {
        if (err) res.render("index", { data: null })
        else res.render("index", { data: docs })
    })
})

app.get('/details', (req, res) => res.render("details"))

app.get("/details/:id", (req, res) => {
    weatherdb.findOne({_id: req.params.id}, (err: Error, docs: Document) => {
        if (err) res.render("index", { data: null })
        else res.render("details", { data: docs })
    })
})

const nodemodulesdir = join(__dirname, "node_modules")
const jquerydir = join(nodemodulesdir, "jquery", "dist")
const popperdir = join(nodemodulesdir, "popper.js", "dist", "umd")
const bootstrapdir = join(nodemodulesdir, "bootstrap", "dist")

const apikey = process.env.WEATHER_API
const weatherURI = `https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&units=imperial&appid=${apikey}`

app.post("/getweather", async (req, res) => {
    let {lat, lon} = req.body
   let uri = weatherURI.replace(/{lat}/, lat).replace(/{lon}/, lon)

    let response = await fetch(uri)
    let data = await response.json()
    weatherdb.insert(data, (err, doc) => {
      if (err) res.render("error")  
      res.send(doc._id)
    })
})

app.get("/jquery", (req, res) => res.sendFile("jquery.js", { root: jquerydir }))
app.get("/popper", (req, res) => res.sendFile("popper.js", { root: popperdir }))
app.get("/bootstrap/:ext", (req, res) => res.sendFile(`bootstrap.${req.params.ext}`, { root: join(bootstrapdir, req.params.ext) }))

interface IError extends Error {status:number}
app.use((req, res, next) => next(createError(404)))
app.use((err:Error, req:express.Request, res:express.Response, next:express.NextFunction) => res.render("error"))

app.listen(port, () => console.log("Server is listening on port ", port))



