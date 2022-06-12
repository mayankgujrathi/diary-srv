const cookieParser = require("cookie-parser")
const csrf = require("csurf")
const bodyParser = require("body-parser")
const express = require("express")
const admin = require("firebase-admin")

const serviceAccount = require("./serviceAccountKey.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://server-auth-41acc.firebaseio.com",
})

const csrfMiddleware = csrf({ cookie: true })

const PORT = process.env.PORT || 3000
const app = express()

app.engine("html", require("ejs").renderFile)
app.use(express.static("public"))

app.use(bodyParser.json())
app.use(cookieParser())
app.use(csrfMiddleware)

app.all("*", (req, res, next) => {
  res.cookie("XSRF-TOKEN", req.csrfToken())
  next()
})

// custom routers
app.use("/auth", require("./routes/auth").router)

// Home
const { loginRequired } = require("./routes/auth")

app.get("/", loginRequired, function (req, res) {
  res.render("cal.html", { user: req.user })
})

// app.get("/cal", loginRequired, function (req, res) {
//   res.render("cal.html", { user: req.user })
// })

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`)
})

const db = admin.firestore()
const dbb = db
  .collection("qnotes")
  .get()
  .then((snap) => {
    snap.forEach(console.log)
  })
