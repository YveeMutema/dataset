const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const authRoutes = require('./routes/auth');
const predictRoutes = require('./routes/predict');
const historyRoutes = require('./routes/history');
const statsRoutes = require('./routes/stats');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ status: 'Rural Health AI Backend', timestamp: new Date() }));
app.use('/api/auth', authRoutes);
app.use('/api/predict', predictRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/stats', statsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
