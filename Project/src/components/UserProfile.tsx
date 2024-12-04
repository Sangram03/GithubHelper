import { Users, GitFork, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GitHubUser } from '../types/github';

interface UserProfileProps {
  user: GitHubUser;
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="w-full max-w-2xl bg-[var(--bg-secondary)] rounded-lg shadow-sm p-6 border border-[var(--border-color)]">
      <div className="flex items-start gap-6">
        <a
          href={user.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-80 transition-opacity"
        >
          <img
            src={user.avatar_url}
            alt={user.login}
            className="w-24 h-24 rounded-full"
          />
        </a>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl font-bold text-[var(--text-primary)] hover:text-[var(--accent-color)]"
            >
              {user.name || user.login}
            </a>
            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <LinkIcon size={16} />
            </a>
          </div>
          <p className="text-[var(--text-secondary)]">@{user.login}</p>
          {user.bio && <p className="mt-2 text-[var(--text-primary)]">{user.bio}</p>}
          
          <div className="flex gap-6 mt-4">
            <div className="flex items-center gap-1">
              <Users size={16} className="text-[var(--text-secondary)]" />
              <span className="text-sm text-[var(--text-secondary)]">
                <strong className="text-[var(--text-primary)]">{user.followers}</strong> followers ·{' '}
                <strong className="text-[var(--text-primary)]">{user.following}</strong> following
              </span>
            </div>
            <div className="flex items-center gap-1">
              <GitFork size={16} className="text-[var(--text-secondary)]" />
              <span className="text-sm text-[var(--text-secondary)]">
                <strong className="text-[var(--text-primary)]">{user.public_repos}</strong> repositories
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}