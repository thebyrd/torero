var torero = require('torero'),
    env = process.env.NODE_ENV || 'development',
    argv = torero.argv,
    config = require('./app/config/' + env),
    app = torero.createApp(__dirname, config, {}),
    port = argv.port || process.env.PORT || 3000;

// Register the torero cache helper.
app.registerHelper('Cache', torero.helpers.CacheHelper);

app.configure(function () {

  app.set('view engine', 'html');
  app.register('.html', torero.engine);

  //use less
  app.use(require('less-middleware')({ src: __dirname + '/public' }));

  // Use the cache helper's no-cache middleware.
  app.use(app.getHelper('Cache').auditHeadersMiddleware);
  app.use(app.getHelper('Cache').noCacheMiddleware);

  app.use(torero.cookieParser());
  app.use(torero.session({secret: 'boosh'}));
  app.use(torero.query());

  app.use(app.requestDecorator());
  app.use(app.preRouter());
  app.use(torero.bodyParser({ uploadDir: process.env.TMP || process.env.TMPDIR || process.env.TEMP || __dirname + 'app/public/images/tmp' || process.cwd() }));
});

app.configure('development', function () {

  app.use(torero.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));

  app.set('soy options', {
    eraseTemporaryFiles: true,
    allowDynamicRecompile: true
  });
  
});

app.configure('production', function () {
  app.use(torero.errorHandler());
});

app.configure(function () {
  app.use(app.router({}));
});

var tester = require('./tests');
tester(app, config);

app.prefetch();
app.mount();
app.listen(port);
console.log('Torero is bullfighting on ' + port);
