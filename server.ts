import express from "express"
import { join, resolve } from "path"
require("dotenv").config()
import Datastore from "nedb"
import { json } from "body-parser"
import fetch from "node-fetch"

const weatherdb = new Datastore({ filename: resolve(__dirname, "weather.db"), autoload: true })

const app = express()
const port = process.env.PORT || 3001

app.set("view engine", "pug")
app.use(json({ limit: "1mb" }))
app.get("/", (_, res) => {
    weatherdb.find({}, (err: Error, docs: Document[]) => {
        if (err) res.render("index", { data: null })
        else res.render("index", { data: docs })
    })
})

const nodemodulesdir = join(__dirname, "node_modules")
const jquerydir = join(nodemodulesdir, "jquery", "dist")
const popperdir = join(nodemodulesdir, "popper.js", "dist", "umd")
const bootstrapdir = join(nodemodulesdir, "bootstrap", "dist")

const apikey = process.env.WEATHER_API
const weatherURI = `https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&units=imperial&appid=${apikey}`

app.post("/getweather", (req, res) => {
    let lat = req.body.lat
    let lon = req.body.lon
    let uri = weatherURI.replace(/{lat}/, lat).replace(/{lon}/, lon)

    fetch(uri)
        .then(resp => resp.json())
        .then(data => weatherdb.insert(data))
        .catch(err => console.error(err))
    res.redirect('/')
})

app.get("/jquery", (req, res) => res.sendFile("jquery.js", { root: jquerydir }))
app.get("/popper", (req, res) => res.sendFile("popper.js", { root: popperdir }))
app.get("/bootstrap/:ext", (req, res) => res.sendFile(`bootstrap.${req.params.ext}`, { root: join(bootstrapdir, req.params.ext) }))

app.listen(port, () => console.log("Server is listening on port ", port))



