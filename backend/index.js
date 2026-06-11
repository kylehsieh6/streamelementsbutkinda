require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { Server } = require('socket.io');

const authRoutes = require('./routes/auth');
const alertRoutes = require('./routes/alerts');
const overlayRoutes = require('./routes/overlays');
const commandRoutes = require('./routes/commands');
const loyaltyRoutes = require('./routes/loyalty');
const webhookRoutes = require('./routes/webhooks');
const errorHandler = require('./middleware/errorHandler');
const { authLimiter, apiLimiter } = require('./middleware/rateLimit');
const SocketManager = require('./ws/SocketManager');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
});

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

app.use('/auth', authLimiter, authRoutes);
app.use('/api/alerts', apiLimiter, alertRoutes);
app.use('/api/overlays', apiLimiter, overlayRoutes);
app.use('/api/commands', apiLimiter, commandRoutes);
app.use('/api/loyalty', apiLimiter, loyaltyRoutes);
app.use('/webhooks', webhookRoutes);

SocketManager.init(io);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));