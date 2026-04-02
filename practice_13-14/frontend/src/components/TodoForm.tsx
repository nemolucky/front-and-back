import { FormEvent } from 'react';

type TodoFormProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function TodoForm({ value, onChange, onSubmit }: TodoFormProps) {
  return (
    <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Добавьте новую заметку"
        className="w-full rounded-2xl border border-sky-200 bg-white px-4 py-3 outline-none ring-sky-200 transition focus:border-sky-500 focus:ring"
        required
      />
      <button
        type="submit"
        className="rounded-2xl bg-sky-700 px-5 py-3 font-medium text-white transition hover:bg-sky-600"
      >
        Добавить
      </button>
    </form>
  );
}
