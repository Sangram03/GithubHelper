import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { UserProfile } from '../components/UserProfile'
import { RepoList } from '../components/RepoList'
import { BackButton } from '../components/BackButton'
import { Loader2 } from 'lucide-react'
import { GitHubUser, GitHubRepo } from '../types/github'

export function ProfilePage() {
  const { username } = useParams<{ username: string }>()
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Scroll to top when component mounts or username changes
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
    
    const fetchData = async () => {
      if (!username) return

      setLoading(true)
      setError('')
      setUser(null)
      setRepos([])

      try {
        const [userResponse, reposResponse] = await Promise.all([
          axios.get(`https://api.github.com/users/${username}`),
          axios.get(`https://api.github.com/users/${username}/repos?sort=updated`)
        ])

        setUser(userResponse.data)
        setRepos(reposResponse.data)
      } catch (err) {
        setError('User not found or error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [username])

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full">
        <Loader2 className="animate-spin text-[var(--accent-color)]" size={24} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500 text-center w-full">
        {error}
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      <BackButton />
      {user && <UserProfile user={user} />}
      <h2 className="text-xl font-semibold text-[var(--text-primary)]">Repositories</h2>
      <RepoList repos={repos} />
    </div>
  )
}