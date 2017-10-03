const express = require('express')
const app = express()

// app.get('/', function (req, res) {
//   res.send('Hello World!')
// })

app.use(express.static('dist/chrome'))

app.listen(5000, function () {
  console.log('App listening on port 5000!')
})
