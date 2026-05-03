# Практика 23: Docker Compose + Nginx балансировка

## Запуск

```bash
docker compose up --build
```

## Проверка балансировки

Повторите команду несколько раз:

```bash
curl http://localhost/
```

Ожидаемый результат: ответы по очереди от разных backend-сервисов, например:

```json
{"server":"backend-1"}
{"server":"backend-2"}
```

## Проверка отказоустойчивости

1. Остановите один backend-контейнер:

```bash
docker compose stop backend-2
```

2. Снова выполните несколько запросов:

```bash
curl http://localhost/
```

Ожидаемый результат: ответы приходят только от `backend-1`, Nginx не направляет трафик в остановленный контейнер.
