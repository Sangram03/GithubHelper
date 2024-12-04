import axios from 'axios';

const TRENDING_CACHE_KEY = 'github_trending_cache';
const TRENDING_TIMESTAMP_KEY = 'github_trending_timestamp';
const INNOVATION_CACHE_KEY = 'github_innovation_cache';
const INNOVATION_TIMESTAMP_KEY = 'github_innovation_timestamp';
const CREATIVE_CACHE_KEY = 'github_creative_cache';
const CREATIVE_TIMESTAMP_KEY = 'github_creative_timestamp';

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface LanguageBreakdown {
  [key: string]: number;
}

export async function fetchRepoLanguages(owner: string, repo: string): Promise<LanguageBreakdown> {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/languages`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching repo languages:', error);
    return {};
  }
}

export async function fetchCommitCount(owner: string, repo: string): Promise<number> {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );
    // Get total count from header
    const linkHeader = response.headers.link || '';
    const match = linkHeader.match(/page=(\d+)>; rel="last"/);
    return match ? parseInt(match[1]) : 1;
  } catch (error) {
    console.error('Error fetching commit count:', error);
    return 0;
  }
}

const isCacheValid = (timestamp: string | null): boolean => {
  if (!timestamp) return false;
  
  const cachedDate = new Date(timestamp);
  const now = new Date();
  
  return cachedDate.getDate() === now.getDate() && 
         cachedDate.getMonth() === now.getMonth() &&
         cachedDate.getFullYear() === now.getFullYear();
};

export async function fetchTrendingRepos(force: boolean = false): Promise<GitHubRepo[]> {
  const cached = localStorage.getItem(TRENDING_CACHE_KEY);
  const timestamp = localStorage.getItem(TRENDING_TIMESTAMP_KEY);
  const now = new Date();
  
  if (!force && cached && isCacheValid(timestamp)) {
    return JSON.parse(cached);
  }

  try {
    const response = await axios.get<{ items: GitHubRepo[] }>(
      'https://api.github.com/search/repositories?q=stars:>1&sort=stars&order=desc&per_page=10',
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    const repos = response.data.items;
    localStorage.setItem(TRENDING_CACHE_KEY, JSON.stringify(repos));
    localStorage.setItem(TRENDING_TIMESTAMP_KEY, now.toISOString());
    
    return repos;
  } catch (error) {
    console.error('Error fetching trending repos:', error);
    return cached ? JSON.parse(cached) : [];
  }
}

export async function fetchInnovationRepos(force: boolean = false): Promise<GitHubRepo[]> {
  const cached = localStorage.getItem(INNOVATION_CACHE_KEY);
  const timestamp = localStorage.getItem(INNOVATION_TIMESTAMP_KEY);
  const now = new Date();
  
  if (!force && cached && isCacheValid(timestamp)) {
    return JSON.parse(cached);
  }

  try {
    const response = await axios.get<{ items: GitHubRepo[] }>(
      'https://api.github.com/search/repositories?q=topic:artificial-intelligence+topic:machine-learning+topic:quantum-computing+topic:blockchain&sort=stars&order=desc&per_page=4',
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    const repos = response.data.items.slice(0, 4);
    localStorage.setItem(INNOVATION_CACHE_KEY, JSON.stringify(repos));
    localStorage.setItem(INNOVATION_TIMESTAMP_KEY, now.toISOString());
    
    return repos;
  } catch (error) {
    console.error('Error fetching innovation repos:', error);
    return cached ? JSON.parse(cached) : [];
  }
}

export async function fetchCreativeRepos(force: boolean = false): Promise<GitHubRepo[]> {
  const cached = localStorage.getItem(CREATIVE_CACHE_KEY);
  const timestamp = localStorage.getItem(CREATIVE_TIMESTAMP_KEY);
  const now = new Date();
  
  if (!force && cached && isCacheValid(timestamp)) {
    return JSON.parse(cached);
  }

  try {
    const response = await axios.get<{ items: GitHubRepo[] }>(
      'https://api.github.com/search/repositories?q=topic:creative-coding+topic:design+topic:art+topic:3d&sort=stars&order=desc&per_page=4',
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    const repos = response.data.items.slice(0, 4);
    localStorage.setItem(CREATIVE_CACHE_KEY, JSON.stringify(repos));
    localStorage.setItem(CREATIVE_TIMESTAMP_KEY, now.toISOString());
    
    return repos;
  } catch (error) {
    console.error('Error fetching creative repos:', error);
    return cached ? JSON.parse(cached) : [];
  }
}