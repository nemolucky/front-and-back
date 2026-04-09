const express = require('express');
const fs = require('fs');
const https = require('https');
const socketIo = require('socket.io');
const webpush = require('web-push');
const cors = require('cors');
const path = require('path');

const vapidKeys = {
  publicKey: 'BLY8MSUd7HpIF3VCMMzgVXalPKfw-55arhGwzgco2ALDdvKlueu7Sy9-2sNq7lUdk2jaDBf76xyAXqUyhaFr02s',
  privateKey: 'xohzFqzff6Q8uQjJeYApiQpCPJTLlfnE9NX9flg0A4w'
};

webpush.setVapidDetails('mailto:student@example.com', vapidKeys.publicKey, vapidKeys.privateKey);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

const subscriptions = new Map();
const reminders = new Map();

function sendPushToAll(payload) {
  for (const [endpoint, subscription] of subscriptions.entries()) {
    webpush.sendNotification(subscription, JSON.stringify(payload)).catch((err) => {
      console.error('Push error:', err.message);
      if (err.statusCode === 404 || err.statusCode === 410) {
        subscriptions.delete(endpoint);
      }
    });
  }
}

function scheduleReminder(reminderId, text, delayMs, title = '!!! Напоминание') {
  const timeoutId = setTimeout(() => {
    sendPushToAll({
      title,
      body: text,
      reminderId,
      actions: [
        {
          action: 'snooze',
          title: 'Отложить на 5 минут'
        }
      ]
    });

    reminders.delete(reminderId);
  }, delayMs);

  reminders.set(reminderId, {
    timeoutId,
    text,
    reminderTime: Date.now() + delayMs
  });
}

const certPath = process.env.HTTPS_CERT || path.join(__dirname, 'localhost+2.pem');
const keyPath = process.env.HTTPS_KEY || path.join(__dirname, 'localhost+2-key.pem');

if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
  throw new Error(`HTTPS сертификаты не найдены. Проверьте пути:\nCERT: ${certPath}\nKEY: ${keyPath}`);
}

const httpsServer = https.createServer(
  {
    cert: fs.readFileSync(certPath),
    key: fs.readFileSync(keyPath)
  },
  app
);

const io = socketIo(httpsServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

io.on('connection', (socket) => {
  console.log('Клиент подключен:', socket.id);

  socket.on('newTask', (task) => {
    io.emit('taskAdded', task);
    sendPushToAll({
      title: 'Новая задача',
      body: task.text,
      reminderId: null
    });
  });

  socket.on('newReminder', (reminder) => {
    const reminderId = Number(reminder.id);
    const reminderTime = Number(reminder.reminderTime);
    const text = String(reminder.text || '').trim();

    if (!reminderId || !text || !reminderTime) {
      return;
    }

    const delay = reminderTime - Date.now();
    if (delay <= 0) {
      return;
    }

    if (reminders.has(reminderId)) {
      clearTimeout(reminders.get(reminderId).timeoutId);
      reminders.delete(reminderId);
    }

    scheduleReminder(reminderId, text, delay, '!!! Напоминание');
  });

  socket.on('disconnect', () => {
    console.log('Клиент отключен:', socket.id);
  });
});

app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  if (!subscription || !subscription.endpoint) {
    res.status(400).json({ message: 'Некорректная подписка' });
    return;
  }

  subscriptions.set(subscription.endpoint, subscription);
  res.status(201).json({ message: 'Подписка сохранена' });
});

app.post('/unsubscribe', (req, res) => {
  const { endpoint } = req.body;
  if (!endpoint) {
    res.status(400).json({ message: 'Endpoint обязателен' });
    return;
  }

  subscriptions.delete(endpoint);
  res.status(200).json({ message: 'Подписка удалена' });
});

app.post('/snooze', (req, res) => {
  const reminderId = Number.parseInt(String(req.query.reminderId || ''), 10);
  if (!reminderId || !reminders.has(reminderId)) {
    res.status(404).json({ error: 'Reminder not found' });
    return;
  }

  const reminder = reminders.get(reminderId);
  clearTimeout(reminder.timeoutId);

  const newDelay = 5 * 60 * 1000;
  const newReminderTime = Date.now() + newDelay;
  scheduleReminder(reminderId, reminder.text, newDelay, 'Напоминание отложено');

  res.status(200).json({
    message: 'Reminder snoozed for 5 minutes',
    reminderId,
    reminderTime: newReminderTime
  });
});

const PORT = process.env.PORT || 3001;
httpsServer.listen(PORT, () => {
  console.log(`Сервер запущен: https://localhost:${PORT}`);
  console.log('Frontend доступен на главной странице сервера.');
});
