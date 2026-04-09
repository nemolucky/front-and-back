const contentDiv = document.getElementById('app-content');
const homeBtn = document.getElementById('home-btn');
const aboutBtn = document.getElementById('about-btn');
const enableBtn = document.getElementById('enable-push');
const disableBtn = document.getElementById('disable-push');

const VAPID_PUBLIC_KEY = 'BLY8MSUd7HpIF3VCMMzgVXalPKfw-55arhGwzgco2ALDdvKlueu7Sy9-2sNq7lUdk2jaDBf76xyAXqUyhaFr02s';
const socket = typeof io === 'function' ? io() : null;

function setActiveButton(activeId) {
  [homeBtn, aboutBtn].forEach((btn) => btn.classList.remove('active'));
  document.getElementById(activeId).classList.add('active');
}

async function loadContent(page) {
  try {
    const response = await fetch(`/content/${page}.html`);
    const html = await response.text();
    contentDiv.innerHTML = html;

    if (page === 'home') {
      initNotes();
    }
  } catch (err) {
    contentDiv.innerHTML = '<p class="error-text">Ошибка загрузки страницы.</p>';
    console.error(err);
  }
}

homeBtn.addEventListener('click', () => {
  setActiveButton('home-btn');
  loadContent('home');
});

aboutBtn.addEventListener('click', () => {
  setActiveButton('about-btn');
  loadContent('about');
});

loadContent('home');

function readNotes() {
  return JSON.parse(localStorage.getItem('notes') || '[]');
}

function writeNotes(notes) {
  localStorage.setItem('notes', JSON.stringify(notes));
}

function loadNotes(list) {
  const notes = readNotes();
  list.innerHTML = notes
    .map((note) => {
      const reminderInfo = note.reminder
        ? `<small class="note-datetime">!!! Напоминание: ${escapeHtml(new Date(note.reminder).toLocaleString())}</small>`
        : '';

      return `
      <li class="note-item">
        <div>
          <div class="note-text">${escapeHtml(note.text)}</div>
          ${reminderInfo}
        </div>
        <button class="btn btn-muted" data-id="${note.id}" type="button">Удалить</button>
      </li>`;
    })
    .join('');
}

function addNote(text, list, reminderTimestamp = null) {
  const notes = readNotes();
  const newNote = {
    id: Date.now(),
    text,
    reminder: reminderTimestamp
  };

  notes.push(newNote);
  writeNotes(notes);
  loadNotes(list);

  if (socket) {
    if (reminderTimestamp) {
      socket.emit('newReminder', {
        id: newNote.id,
        text,
        reminderTime: reminderTimestamp
      });
    } else {
      socket.emit('newTask', { text, timestamp: Date.now() });
    }
  }
}

function deleteNote(id, list) {
  const notes = readNotes().filter((note) => note.id !== id);
  writeNotes(notes);
  loadNotes(list);
}

function updateReminderInStorage(reminderId, reminderTime) {
  if (!Number.isFinite(reminderId) || !Number.isFinite(reminderTime)) {
    return;
  }

  const notes = readNotes();
  const nextNotes = notes.map((note) => {
    if (Number(note.id) !== Number(reminderId)) {
      return note;
    }

    return {
      ...note,
      reminder: reminderTime
    };
  });

  writeNotes(nextNotes);
}

function initNotes() {
  const form = document.getElementById('note-form');
  const input = document.getElementById('note-input');
  const reminderForm = document.getElementById('reminder-form');
  const reminderText = document.getElementById('reminder-text');
  const reminderTime = document.getElementById('reminder-time');
  const list = document.getElementById('notes-list');

  loadNotes(list);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) {
      return;
    }

    addNote(text, list);
    input.value = '';
  });

  reminderForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const text = reminderText.value.trim();
    const datetime = reminderTime.value;

    if (!text || !datetime) {
      return;
    }

    const timestamp = new Date(datetime).getTime();
    if (Number.isNaN(timestamp) || timestamp <= Date.now()) {
      alert('Дата напоминания должна быть в будущем');
      return;
    }

    addNote(text, list, timestamp);
    reminderText.value = '';
    reminderTime.value = '';
  });

  list.addEventListener('click', (event) => {
    const deleteButton = event.target.closest('button[data-id]');
    if (!deleteButton) {
      return;
    }

    deleteNote(Number(deleteButton.dataset.id), list);
  });
}

function showToast(text) {
  const notification = document.createElement('div');
  notification.textContent = text;
  notification.style.cssText =
    'position:fixed;top:16px;right:16px;background:#0369a1;color:#fff;padding:.85rem 1rem;border-radius:12px;z-index:1000;box-shadow:0 10px 24px rgba(15,23,42,.22);';
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

if (socket) {
  socket.on('taskAdded', (task) => {
    showToast(`Новая задача: ${task.text}`);
  });
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

async function subscribeToPush() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    });

    await fetch('/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription)
    });

    console.log('Подписка на push отправлена');
  } catch (err) {
    console.error('Ошибка подписки на push:', err);
  }
}

async function unsubscribeFromPush() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return;
  }

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();

  if (subscription) {
    await fetch('/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoint: subscription.endpoint })
    });

    await subscription.unsubscribe();
    console.log('Отписка выполнена');
  }
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data?.type !== 'REMINDER_SNOOZED') {
      return;
    }

    const reminderId = Number(event.data.reminderId);
    const reminderTime = Number(event.data.reminderTime);
    updateReminderInStorage(reminderId, reminderTime);
    showToast('Напоминание отложено на 5 минут');

    if (homeBtn.classList.contains('active')) {
      loadContent('home');
    }
  });

  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js');
      console.log('SW registered:', reg.scope);

      if (enableBtn && disableBtn) {
        const subscription = await reg.pushManager.getSubscription();
        if (subscription) {
          enableBtn.style.display = 'none';
          disableBtn.style.display = 'inline-block';
        }

        enableBtn.addEventListener('click', async () => {
          if (Notification.permission === 'denied') {
            alert('Уведомления запрещены. Разрешите их в настройках браузера.');
            return;
          }

          if (Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
              alert('Необходимо разрешить уведомления.');
              return;
            }
          }

          await subscribeToPush();
          enableBtn.style.display = 'none';
          disableBtn.style.display = 'inline-block';
        });

        disableBtn.addEventListener('click', async () => {
          await unsubscribeFromPush();
          disableBtn.style.display = 'none';
          enableBtn.style.display = 'inline-block';
        });
      }
    } catch (err) {
      console.log('SW registration failed:', err);
    }
  });
}
