module.exports = () =>
  (err, req, res, next) => {
    if (err.message === 'login failed as the email has not been verified') {
      return res.redirect('/emailNotVerified');
    }
    return next(err);
  };
