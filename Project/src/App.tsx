import { Routes, Route } from 'react-router-dom'
import './index.css'
import { ThemeToggle } from './components/ThemeToggle'
import { SearchBar } from './components/SearchBar'
import { TrendingSection } from './components/TrendingSection'
import { InnovationSection } from './components/InnovationSection'
import { CreativeSection } from './components/CreativeSection'
import { HomePage } from './pages/HomePage'
import { ProfilePage } from './pages/ProfilePage'
import { RepoPage } from './pages/RepoPage'

function App() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] transition-colors">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-8">
          <div className="w-full flex items-center justify-between">
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">
              GitHub Profile Viewer
            </h1>
            <ThemeToggle />
          </div>

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/user/:username" element={<ProfilePage />} />
            <Route path="/repo/:owner/:repo" element={<RepoPage />} />
          </Routes>

          <div className="w-full border-t border-[var(--border-color)] my-4"></div>
          
          <InnovationSection />
          
          <div className="w-full border-t border-[var(--border-color)] my-4"></div>
          
          <CreativeSection />
          
          <div className="w-full border-t border-[var(--border-color)] my-4"></div>
          
          <TrendingSection />
        </div>
      </div>
    </div>
  )
}

export default App