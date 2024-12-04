import { Search } from 'lucide-react';

interface SearchBarProps {
  username: string;
  setUsername: (username: string) => void;
  onSearch: () => void;
}

export function SearchBar({ username, setUsername, onSearch }: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="relative flex items-center">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter GitHub username"
          className="w-full px-4 py-2 pr-10 border border-[var(--border-color)] rounded-lg 
                   bg-[var(--bg-secondary)] text-[var(--text-primary)]
                   focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent
                   placeholder-[var(--text-secondary)]"
        />
        <button
          type="submit"
          className="absolute right-2 p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          <Search size={20} />
        </button>
      </div>
    </form>
  );
}