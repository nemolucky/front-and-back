# Practice 13-14 Frontend

React + Tailwind приложение для практик по Service Worker и Web App Manifest.

## Что реализовано

- просмотр задач;
- добавление задач;
- хранение данных в `localStorage`;
- регистрация Service Worker;
- кэширование статики и офлайн-загрузка интерфейса;
- Web App Manifest и иконки для установки PWA.

## Запуск

```bash
npm install
npm run dev
```

## Проверка офлайна

1. Откройте приложение в браузере.
2. Убедитесь, что Service Worker зарегистрирован (DevTools -> Application -> Service Workers).
3. Перейдите в режим Offline в DevTools -> Network.
4. Обновите страницу: интерфейс должен загрузиться из кэша и продолжить работать.

## Проверка PWA (Практика 14)

1. Откройте `DevTools -> Application -> Manifest` и проверьте, что манифест читается без ошибок.
2. Убедитесь, что активен Service Worker и в `Cache Storage` есть `manifest.json` и иконки.
3. В Chrome нажмите кнопку установки приложения в адресной строке.
4. После установки приложение должно запускаться отдельным окном в режиме `standalone`.
