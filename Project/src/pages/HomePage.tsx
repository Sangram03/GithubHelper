import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SearchBar } from '../components/SearchBar'
import { Loader2 } from 'lucide-react'

export function HomePage() {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const searchUser = async () => {
    if (!username.trim()) return

    setLoading(true)
    setError('')

    try {
      navigate(`/user/${username}`)
    } catch (err) {
      setError('User not found or error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SearchBar
        username={username}
        setUsername={setUsername}
        onSearch={searchUser}
      />

      {loading && (
        <div className="flex items-center justify-center">
          <Loader2 className="animate-spin text-[var(--accent-color)]" size={24} />
        </div>
      )}

      {error && (
        <div className="text-red-500 text-center">
          {error}
        </div>
      )}
    </>
  )
}