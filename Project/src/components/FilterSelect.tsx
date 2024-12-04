interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function FilterSelect({ value, onChange }: FilterSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)]
                focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent"
    >
      <option value="stars">Most Stars</option>
      <option value="forks">Most Forks</option>
      <option value="updated">Latest Commit</option>
    </select>
  );
}