import { useState, useMemo } from 'react';
import { Star, GitFork, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GitHubRepo } from '../types/github';
import { FilterSelect } from './FilterSelect';

interface RepoListProps {
  repos: GitHubRepo[];
}

export function RepoList({ repos }: RepoListProps) {
  const [sortBy, setSortBy] = useState('stars');

  const sortedRepos = useMemo(() => {
    return [...repos].sort((a, b) => {
      switch (sortBy) {
        case 'stars':
          return b.stargazers_count - a.stargazers_count;
        case 'forks':
          return b.forks_count - a.forks_count;
        case 'updated':
          return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();
        default:
          return 0;
      }
    });
  }, [repos, sortBy]);

  return (
    <div className="w-full max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">
          Repositories ({repos.length})
        </h3>
        <FilterSelect value={sortBy} onChange={setSortBy} />
      </div>

      {sortedRepos.map((repo) => (
        <div key={repo.id} className="bg-[var(--bg-secondary)] rounded-lg shadow-sm p-4 border border-[var(--border-color)]">
          <div className="flex items-start justify-between">
            <div>
              <Link
                to={`/repo/${repo.full_name}`}
                className="text-lg font-semibold text-[var(--accent-color)] hover:underline"
              >
                {repo.name}
              </Link>
              {repo.description && (
                <p className="mt-1 text-[var(--text-secondary)] text-sm">{repo.description}</p>
              )}
              <div className="flex items-center gap-4 mt-2">
                {repo.language && (
                  <span className="text-sm text-[var(--text-secondary)]">
                    <span className="inline-block w-2 h-2 rounded-full bg-[var(--accent-color)] mr-1" />
                    {repo.language}
                  </span>
                )}
                <span className="flex items-center gap-1 text-sm text-[var(--text-secondary)]">
                  <Star size={14} />
                  {repo.stargazers_count.toLocaleString()}
                </span>
                <span className="flex items-center gap-1 text-sm text-[var(--text-secondary)]">
                  <GitFork size={14} />
                  {repo.forks_count.toLocaleString()}
                </span>
                {repo.pushed_at && (
                  <span className="flex items-center gap-1 text-sm text-[var(--text-secondary)]">
                    <History size={14} />
                    {new Date(repo.pushed_at).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}