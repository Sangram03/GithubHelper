import { useEffect, useState } from 'react';
import { Star, GitFork, ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchTrendingRepos } from '../utils/githubApi';

// Time constants
const ONE_HOUR = 60 * 60 * 1000;
const ONE_DAY = 24 * ONE_HOUR;

export function TrendingSection() {
  const [trending, setTrending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [nextUpdate, setNextUpdate] = useState<Date | null>(null);

  const loadTrending = async (force: boolean = false) => {
    try {
      setLoading(true);
      const repos = await fetchTrendingRepos(force);
      setTrending(repos);
      
      const now = new Date();
      setLastUpdate(now);
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      setNextUpdate(tomorrow);
    } catch (err) {
      setError('Failed to load trending repositories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrending();

    const checkForUpdate = () => {
      const now = new Date();
      if (nextUpdate && now >= nextUpdate) {
        loadTrending(true);
      }
    };

    const interval = setInterval(checkForUpdate, 60000);

    return () => clearInterval(interval);
  }, [nextUpdate]);

  const formatTimeUntilNextUpdate = () => {
    if (!nextUpdate) return '';
    
    const now = new Date();
    const diff = nextUpdate.getTime() - now.getTime();
    
    if (diff <= 0) return 'Updating...';
    
    const hours = Math.floor(diff / ONE_HOUR);
    const minutes = Math.floor((diff % ONE_HOUR) / (60 * 1000));
    
    return `Next update in ${hours}h ${minutes}m`;
  };

  const handleManualRefresh = () => {
    loadTrending(true);
  };

  if (loading && !trending.length) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="animate-spin text-[var(--text-secondary)]" size={24} />
      </div>
    );
  }

  if (error && !trending.length) {
    return (
      <div className="text-red-500 text-center py-4">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Trending Today</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[var(--text-secondary)]">
            {formatTimeUntilNextUpdate()}
          </span>
          <button 
            onClick={handleManualRefresh}
            className="p-1 rounded hover:bg-[var(--hover-color)] text-[var(--text-secondary)]"
            title="Refresh now"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trending.slice(0, 6).map((repo) => (
          <Link
            key={repo.id}
            to={`/repo/${repo.owner.login}/${repo.name}`}
            className="block bg-[var(--bg-secondary)] rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow border border-[var(--border-color)]"
          >
            <div className="flex items-start gap-3">
              <img
                src={repo.owner.avatar_url}
                alt={repo.owner.login}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[var(--text-primary)] font-medium truncate">
                      {repo.owner.login}
                    </span>
                    <span className="text-[var(--text-secondary)]">/</span>
                    <span className="text-[var(--accent-color)] font-semibold truncate">
                      {repo.name}
                    </span>
                  </div>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex-shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
                {repo.description && (
                  <p className="text-sm text-[var(--text-secondary)] mt-1 line-clamp-2">
                    {repo.description}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-3">
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
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}