import { Todo } from '../types/todo';

const STORAGE_KEY = 'practice-13-todos';

export function loadTodos(): Todo[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as Todo[];
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((todo) => typeof todo?.id === 'string' && typeof todo?.text === 'string');
  } catch {
    return [];
  }
}

export function saveTodos(todos: Todo[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}
