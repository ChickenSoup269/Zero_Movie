module.exports = {
  getRandomUser: function (userContext, events, done) {
    const randomId = Math.floor(Math.random() * 1000) + 1;
    userContext.vars.email = `testuser${randomId}@example.com`;
    userContext.vars.password = "testpassword";
    return done();
  }
};
