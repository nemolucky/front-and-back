import { Todo } from '../types/todo';
import { TodoItem } from './TodoItem';

type TodoListProps = {
  todos: Todo[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
};

export function TodoList({ todos, onToggle, onRemove }: TodoListProps) {
  return (
    <>
      <ul className="mt-4 space-y-3">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onRemove={onRemove} />
        ))}
      </ul>

      {todos.length === 0 && (
        <p className="mt-5 rounded-2xl border border-dashed border-sky-200 bg-white/70 p-5 text-center text-slate-500">
          Пока пусто. Добавьте первую задачу.
        </p>
      )}
    </>
  );
}
