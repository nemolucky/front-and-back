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

function loadNotes(list) {
  const notes = JSON.parse(localStorage.getItem('notes') || '[]');
  list.innerHTML = notes
    .map(
      (note) => `
      <li class="note-item">
        <div>
          <div class="note-text">${escapeHtml(note.text)}</div>
          ${
            note.datetime
              ? `<small class="note-datetime">Срок: ${escapeHtml(normalizeDateTimeDisplay(note.datetime))}</small>`
              : ''
          }
        </div>
        <button class="btn btn-muted" data-id="${note.id}" type="button">Удалить</button>
      </li>`
    )
    .join('');
}

function addNote(text, datetime, list) {
  const notes = JSON.parse(localStorage.getItem('notes') || '[]');
  const newNote = {
    id: Date.now(),
    text,
    datetime: datetime || ''
  };

  notes.push(newNote);
  localStorage.setItem('notes', JSON.stringify(notes));
  loadNotes(list);

  if (socket) {
    socket.emit('newTask', { text, timestamp: Date.now() });
  }
}

function normalizeDateTimeDisplay(value) {
  if (!value) {
    return '';
  }

  if (value.includes('T')) {
    const [datePart, timePart = ''] = value.split('T');
    return `${datePart} ${timePart.slice(0, 5)}`.trim();
  }

  return value;
}

function composeDateTime(dateValue, timeValue) {
  if (dateValue && timeValue) {
    return `${dateValue} ${timeValue}`;
  }

  if (dateValue) {
    return dateValue;
  }

  if (timeValue) {
    return `Время: ${timeValue}`;
  }

  return '';
}

function deleteNote(id, list) {
  const notes = JSON.parse(localStorage.getItem('notes') || '[]');
  const filtered = notes.filter((note) => note.id !== id);
  localStorage.setItem('notes', JSON.stringify(filtered));
  loadNotes(list);
}

function initNotes() {
  const form = document.getElementById('note-form');
  const input = document.getElementById('note-input');
  const dateInput = document.getElementById('note-date');
  const timeInput = document.getElementById('note-time');
  const list = document.getElementById('notes-list');

  loadNotes(list);

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const text = input.value.trim();
    if (!text) {
      return;
    }

    const datetime = composeDateTime(dateInput.value, timeInput.value);
    addNote(text, datetime, list);
    input.value = '';
    dateInput.value = '';
    timeInput.value = '';
  });

  list.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-id]');
    if (!button) {
      return;
    }

    const noteId = Number(button.dataset.id);
    deleteNote(noteId, list);
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
