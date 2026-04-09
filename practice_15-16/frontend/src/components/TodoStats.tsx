type TodoStatsProps = {
  totalCount: number;
  completedCount: number;
};

export function TodoStats({ totalCount, completedCount }: TodoStatsProps) {
  return (
    <div className="mt-6 rounded-2xl border border-sky-100 bg-sky-50/80 p-4 text-sm text-slate-700">
      Всего задач: {totalCount}. Выполнено: {completedCount}.
    </div>
  );
}
