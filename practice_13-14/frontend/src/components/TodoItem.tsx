import { Todo } from '../types/todo';

type TodoItemProps = {
  todo: Todo;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
};

export function TodoItem({ todo, onToggle, onRemove }: TodoItemProps) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <button
        type="button"
        onClick={() => onToggle(todo.id)}
        className="text-left transition hover:opacity-80"
        aria-label={`Переключить статус задачи ${todo.text}`}
      >
        <span className={todo.done ? 'text-slate-400 line-through' : 'text-slate-900'}>{todo.text}</span>
      </button>

      <button
        type="button"
        onClick={() => onRemove(todo.id)}
        className="rounded-xl border border-slate-300 px-3 py-1 text-sm transition hover:bg-slate-100"
      >
        Удалить
      </button>
    </li>
  );
}
