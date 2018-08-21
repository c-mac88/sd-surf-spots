/* eslint global-require: 0 */
/* eslint no-restricted-syntax: 0 */
/* eslint no-prototype-builtins: 0 */
/* eslint no-console: 0 */

const loopback = require('loopback');
const boot = require('loopback-boot');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const winston = require('winston');
const explorer = require('loopback-component-explorer');

require('winston-loggly-bulk'); // eslint-disable-line no-unused-vars
const loopbackPassport = require('loopback-component-passport');

const app = module.exports = loopback();
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
const socketEvents = require('./utils/socketEvents');

if (!winston.transports.Loggly) {
  winston.add(winston.transports.Loggly, {
    token: process.env.LOGGLY_TOKEN,
    subdomain: 'origindev',
    tags: ['sd-surf-spots'],
    json: true
  });
}

const ensureAdmin = (req, res, next) => {
  next();
};

const ensureEnabled = (req, res, next) => {
  app.models.user.findById(req.user.id)
    .then((user) => {
      if (user.disabled === false) {
        next();
      } else {
        return res.redirect('/');
      }
      return true;
    })
    .catch(errEnabled => console.log(errEnabled));
};

switch (process.env.NODE_ENV) {
  case 'TEST':
    console.log('RUNNING IN TEST MODE!!!');
    break;
  case 'development':
    console.log('RUNNING IN DEVELOPMENT MODE!!!');
    require('../credentials.js');
    break;
  default:
    console.log('RUNNING IN PRODUCTION MODE!!!');
}

// Passport configurators..
const PassportConfigurator = loopbackPassport.PassportConfigurator;
const passportConfigurator = new PassportConfigurator(app);

/*
 * body-parser is a piece of express middleware that
 *   reads a form's input and stores it as a javascript
 *   object accessible through `req.body`
 *
 */
const bodyParser = require('body-parser');


/**
 * Flash messages for passport
 *
 * Setting the failureFlash option to true instructs Passport to flash an
 * error message using the message given by the strategy's verify callback,
 * if any. This is often the best approach, because the verify callback
 * can make the most accurate determination of why authentication failed.
 */
const flash = require('express-flash');

// attempt to build the providers/passport config
let config = {};
try {
  config = require('../providers.js');
} catch (err) {
  console.trace(err);
  process.exit(1); // fatal
}

// -- Add your pre-processing middleware here --

// Setup the view engine (jade)
const path = require('path');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// boot scripts mount components like REST API
boot(app, __dirname);

// to support JSON-encoded bodies
app.middleware('parse', bodyParser.json());
// to support URL-encoded bodies
app.middleware('parse', bodyParser.urlencoded({
  extended: true,
}));

// The access token is only available after boot
app.middleware('auth', loopback.token({
  model: app.models.accessToken,
}));

// app.middleware('session:before', cookieParser(app.get('cookieSecret')));
app.middleware('session:before', cookieParser('super_secret'));

app.middleware('session', session({
  secret: 'super_secret',
  saveUninitialized: true,
  resave: true,
}));
passportConfigurator.init();

// We need flash messages to see passport errors
app.use(flash());

passportConfigurator.setupModels({
  userModel: app.models.user,
  userIdentityModel: app.models.userIdentity,
  userCredentialModel: app.models.userCredential,
});

for (const s in config) {
  if (config.hasOwnProperty(s)) {
    const c = config[s];
    c.session = c.session !== false;
    passportConfigurator.configureProvider(s, c);
  }
}

app.use('/explorer', ensureLoggedIn('/login'), ensureAdmin, explorer.routes(app, { basePath: '/api' }));

app.post('/signin', (req, res) => {
  const user = {
    username: req.body.username,
    password: req.body.password
  };

  req.login(user, (err) => {
    if (err) {
      console.log(`ERROR LOGIN IN::: ${err}`);
      req.flash('error', err.message);
      return res.redirect('back');
    }
    return res.redirect('/auth/account');
  });
});

app.post('/signup', (req, res) => {
  const User = app.models.user;

  const newUser = {};
  newUser.email = req.body.email;
  newUser.username = req.body.username.trim();
  newUser.password = req.body.password;

  User.create(newUser, (err, user) => {
    if (err) {
      console.log(`ERROR CREATING USER::: ${err}`);
      req.flash('error', err.message);
      return res.redirect('back');
    }
    // send verification email
    const options = {
      type: 'email',
      to: user.email,
      from: process.env.ADMIN_EMAIL,
      host: process.env.HOST_NAME,
      protocol: 'https',
      port: 443,
      headers: { 'Mime-Version': '1.0' },
      subject: 'Thanks for signing up!',
      redirect: '/',
      user
    };

    return user.verify(options, (error, response, next) => {
      if (err) return next(error);

      // Passport exposes a login() function on req (also aliased as logIn())
      // that can be used to establish a login session. This function is
      // primarily used when users sign up, during which req.login() can
      // be invoked to log in the newly registered user.
      req.login(user, (errLogin) => {
        if (errLogin) {
          console.log(`ERROR LOGIN IN::: ${errLogin}`);
          req.flash('error', err.message);
          return res.redirect('back');
        }
        return res.redirect('/auth/account');
      });
      return null;
    });
  });
});

app.get('/auth/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.get('/auth/logout', (req, res, next) => {
  if (!req.accessToken) return res.sendStatus(401); // return 401:unauthorized if accessToken is not present
  app.models.person.logout(req.accessToken.id, (err) => {
    if (err) return next(err);
    // Clear the session cookies
    res.clearCookie('access_token');
    res.clearCookie('userId');
    res.redirect('/'); // on successful logout, redirect
    return null;
  });
  return null;
});

app.get('/auth/*', ensureLoggedIn('/login'), ensureEnabled, (req, res) => {
  res.render('pages/app', {
    user,
    url: req.url
  });
});

app.get('/local', (req, res) => {
  res.render('pages/local', {
    user: req.user,
    url: req.url,
  });
});

app.get('/login', (req, res) => {
  res.render('pages/login');
});

app.get('/signup', (req, res) => {
  res.render('pages/signup');
});

app.get('/', (req, res) => {
  res.render('pages/index', {
    user: req.user,
    url: req.url,
  });
});

app.get('/emailNotVerified', (req, res) => {
  res.render('pages/prep/notVerified', {
    user: req.user,
    url: req.url,
  });
});


/**
Password Recovery
******************************/

app.get('/forgotPassword', (req, res, next) => {
  res.render('pages/passwordForgot', {});
});

app.post('/requestPasswordReset', (req, res, next) => {
  app.models.user.resetPassword({
    email: req.body.email
  }, (err) => {
    if (err) {
      if (err.statusCode === 404) {
        return res.render('pages/passwordRecoveryEmailNotFound');
      }
      return res.status(401).send(err);
    }
    return res.render('pages/passwordRecoveryEmailSent', {});
  });
});

// show password reset form
app.get('/resetPassword', (req, res, next) => {
  if (!req.accessToken) {
    return res.render('pages/passwordRecoveryOldLink');
  }
  return res.render('pages/passwordReset', {
    accessToken: req.accessToken
  });
});

app.post('/submitPasswordReset', (req, res, next) => {
  // check if the passwords match, otherwise flash error message
  if (req.body.password !== req.body.passwordConfirm) {
    req.flash('error', 'passwords do not match');
    return res.redirect('back');
  }
  // use token to find user and update password
  app.models.user.findById(req.body.userId, (err, user) => {
    if (err) return res.sendStatus(404);
    user.updateAttribute('password', req.body.password, (err, user) => {
      if (err) return res.sendStatus(404);
      res.render('pages/passwordResetSuccess', {});
    });
  });
});

/**
End Password Recovery
******************************/


app.start = () => app.listen(() => {
  app.emit('started');
  const baseUrl = app.get('url').replace(/\/$/, '');
});

// start the server if `$ node server.js`
if (require.main === module) {
  // set an authObject that can be used to authenticate different namespaces
  const authObject = {
    authenticate: (socket, value, callback) => {
      const { AccessToken } = app.models;
      // get credentials sent by the client
      AccessToken.find({
        where: {
          and: [{ userId: value.userId }, { id: value.id }]
        }
      }, (err, tokenDetail) => {
        if (err) throw err;
        if (tokenDetail.length) {
          callback(null, true);
        } else {
          callback(null, false);
        }
      });
    }
  };
  // wrap the loopback application with socket.io
  app.io = require('socket.io')(app.start(), {
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false
  });
  // authenticate socket and namespaces
  require('socketio-auth')(app.io, authObject);

  app.io.on('connection', (socket) => {
    socket.on('event', (event) => {
      socketEvents.eventHandler(socket, event);
    });
    socket.on('action', (action) => {
      socketEvents.actionHandler(socket, action);
    });
    socket.on('disconnect', () => {
      console.log('socket disconnected:::::', socket);
    });
  });
}
