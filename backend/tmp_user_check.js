const mongoose = require('mongoose');
const User = require('./models/User');
(async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/rural-health-ai', { useNewUrlParser: true, useUnifiedTopology: true });
    const users = await User.find().select('email name').limit(20).lean();
    console.log('users:', users);
    process.exit(0);
  } catch (err) {
    console.error('err', err.message);
    process.exit(1);
  }
})();
