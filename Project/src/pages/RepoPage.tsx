import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Loader2, Star, GitFork, ExternalLink, GitCommit } from 'lucide-react'
import { BackButton } from '../components/BackButton'
import { LanguagesBreakdown } from '../components/LanguagesBreakdown'
import { fetchRepoLanguages, fetchCommitCount } from '../utils/githubApi'

interface RepoDetails {
  name: string
  full_name: string
  description: string
  html_url: string
  stargazers_count: number
  forks_count: number
  language: string
  owner: {
    login: string
    avatar_url: string
  }
  topics: string[]
  created_at: string
  updated_at: string
}

export function RepoPage() {
  const { owner, repo } = useParams<{ owner: string; repo: string }>()
  const [repoDetails, setRepoDetails] = useState<RepoDetails | null>(null)
  const [languages, setLanguages] = useState<{ [key: string]: number }>({})
  const [commitCount, setCommitCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Scroll to top when component mounts or repo changes
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })

    const fetchData = async () => {
      if (!owner || !repo) return

      setLoading(true)
      setError('')

      try {
        const [repoResponse, languagesData, commits] = await Promise.all([
          axios.get(`https://api.github.com/repos/${owner}/${repo}`),
          fetchRepoLanguages(owner, repo),
          fetchCommitCount(owner, repo)
        ])

        setRepoDetails(repoResponse.data)
        setLanguages(languagesData)
        setCommitCount(commits)
      } catch (err) {
        setError('Repository not found or error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [owner, repo])

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full">
        <Loader2 className="animate-spin text-[var(--accent-color)]" size={24} />
      </div>
    )
  }

  if (error || !repoDetails) {
    return (
      <div className="text-red-500 text-center w-full">
        {error}
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      <BackButton />
      <div className="w-full max-w-2xl bg-[var(--bg-secondary)] rounded-lg shadow p-6 border border-[var(--border-color)]">
        <div className="flex items-start gap-4">
          <img
            src={repoDetails.owner.avatar_url}
            alt={repoDetails.owner.login}
            className="w-16 h-16 rounded-full"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">{repoDetails.name}</h1>
              <a
                href={repoDetails.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <ExternalLink size={20} />
              </a>
            </div>
            <p className="text-[var(--text-secondary)] text-sm">by {repoDetails.owner.login}</p>
            
            {repoDetails.description && (
              <p className="mt-4 text-[var(--text-primary)]">{repoDetails.description}</p>
            )}

            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <Star size={18} className="text-[var(--text-secondary)]" />
                <span className="text-[var(--text-primary)]">
                  {repoDetails.stargazers_count.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <GitFork size={18} className="text-[var(--text-secondary)]" />
                <span className="text-[var(--text-primary)]">
                  {repoDetails.forks_count.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <GitCommit size={18} className="text-[var(--text-secondary)]" />
                <span className="text-[var(--text-primary)]">
                  {commitCount.toLocaleString()} commits
                </span>
              </div>
            </div>

            <div className="mt-6">
              <LanguagesBreakdown languages={languages} />
            </div>

            {repoDetails.topics.length > 0 && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {repoDetails.topics.map((topic) => (
                    <span
                      key={topic}
                      className="px-2 py-1 text-sm rounded-full bg-[var(--accent-color)] bg-opacity-10 text-[var(--accent-color)]"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 text-sm text-[var(--text-secondary)]">
              <p>Created: {new Date(repoDetails.created_at).toLocaleDateString()}</p>
              <p>Last updated: {new Date(repoDetails.updated_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}