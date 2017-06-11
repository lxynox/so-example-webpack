var path = require('path')
var fs = require('fs')
var opn = require('opn')
var express = require("express")

var webpack = require("webpack")
var webpackConfig = require("./webpack.config")
var compiler = webpack(webpackConfig)

var app = express()
var port = process.env.PORT || 3000
var uri = 'http://localhost:' + port
var isProd = process.env.NODE_ENV === 'production'

// Serve static assets
app.use(express.static(path.resolve(__dirname, isProd ? 'public/' : './')))

app.listen(port, function () {
  console.log(`Listening on port ${port}!`)
  opn(uri)
})

if (!isProd) {
  app.get('/', (req, res) => {
    fs.readFile(path.resolve(__dirname, 'index.ejs'), 'utf8', (err, template) => {
      if (err) {
        console.error(err)
        return res.status(502).send(err.message)
      }
      const interpolated = template.replace('</body>', `\t<script src='bundle.js'></script>\n\t</body>`)
      res.end(interpolated)
    })
  })
  
  // Serve in-memory bundles (dev mode)
  app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: true,
    publicPath: "/"
  }))

  app.use(require("webpack-hot-middleware")(compiler))
}

