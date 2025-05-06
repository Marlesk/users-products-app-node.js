const port = 3000
const { default: mongoose } = require("mongoose")
const app = require("./app")

mongoose.connect(process.env.MONGODB_URI)
   .then(
     () => {
       console.log("Connection to MongoDB established")
       app.listen(port, () => {
         console.log("Server is up")
        })
      },
      err => {
       console.log("Failed to Connect to MongoDB", err)
      }
    )
