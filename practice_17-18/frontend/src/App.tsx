import { FormEvent, useMemo, useState } from 'react';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { TodoStats } from './components/TodoStats';
import { Todo } from './types/todo';
import { loadTodos, saveTodos } from './utils/todoStorage';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(() => loadTodos());
  const [text, setText] = useState('');

  const completedCount = useMemo(() => todos.filter((todo) => todo.done).length, [todos]);

  const updateTodos = (updater: (prev: Todo[]) => Todo[]) => {
    setTodos((prev) => {
      const next = updater(prev);
      saveTodos(next);
      return next;
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedText = text.trim();
    if (!normalizedText) {
      return;
    }

    updateTodos((prev) => [
      {
        id: crypto.randomUUID(),
        text: normalizedText,
        done: false,
        createdAt: Date.now()
      },
      ...prev
    ]);
    setText('');
  };

  const toggleTodo = (id: string) => {
    updateTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo)));
  };

  const removeTodo = (id: string) => {
    updateTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-slate-100 to-cyan-100 p-4 text-slate-900 sm:p-8">
      <section className="mx-auto w-full max-w-2xl rounded-3xl border border-white/60 bg-white/90 p-6 shadow-xl backdrop-blur sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Мои заметки</h1>

        <TodoForm value={text} onChange={setText} onSubmit={handleSubmit} />
        <TodoStats totalCount={todos.length} completedCount={completedCount} />
        <TodoList todos={todos} onToggle={toggleTodo} onRemove={removeTodo} />
      </section>
    </main>
  );
}
