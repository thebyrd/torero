var torero = require('torero')
  , env = process.env.NODE_ENV || 'development'
  , argv = torero.argv
  , config = require('./app/config/' + env)
  , app = torero.createApp(__dirname, config, {})
  , port = argv.port || process.env.PORT || 3000

// Register the torero cache helper.
app.registerHelper('Cache', torero.helpers.CacheHelper)

app.configure(function () {

  app.set('view engine', 'html')
  app.register('.html', torero.engine)

  // Use the cache helper's no-cache middleware.
  app.use(app.getHelper('Cache').auditHeadersMiddleware)
  app.use(app.getHelper('Cache').noCacheMiddleware)

  app.use(torero.cookieParser())
  app.use(torero.session({secret: 'boosh'}))

  // TODO: Add JSON body parser middleware
  app.use(app.requestDecorator())
  app.use(app.preRouter())
})

app.configure('development', function () {
  app.use(torero.errorHandler({ dumpExceptions: true, showStack: true }))
  app.set('soy options', {
    eraseTemporaryFiles: true
    , allowDynamicRecompile: true
  })
})

app.configure('production', function () {
  app.use(torero.errorHandler())
})

app.configure(function () {
  app.use(app.router({}))
})

app.prefetch()
app.mount()
app.listen(port)
console.log('Torero is bullfighting on ' + port)
