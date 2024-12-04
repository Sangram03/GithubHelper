interface LanguagesBreakdownProps {
  languages: { [key: string]: number };
}

// Language colors mapping (common languages)
const languageColors: { [key: string]: string } = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  Ruby: '#701516',
  Go: '#00ADD8',
  Rust: '#dea584',
  PHP: '#4F5D95',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Swift: '#ffac45',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Shell: '#89e051',
  Vue: '#41b883',
  // Add more as needed
};

export function LanguagesBreakdown({ languages }: LanguagesBreakdownProps) {
  if (!languages || Object.keys(languages).length === 0) {
    return null;
  }

  // Calculate total bytes
  const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0);

  // Sort languages by bytes (descending)
  const sortedLanguages = Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .map(([name, bytes]) => ({
      name,
      percentage: (bytes / totalBytes) * 100,
      color: languageColors[name] || '#8b949e', // Default color for unknown languages
    }));

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-[var(--text-secondary)]">Languages</h3>
      
      {/* Progress bar */}
      <div className="h-2 w-full rounded-full overflow-hidden flex">
        {sortedLanguages.map((lang, index) => (
          <div
            key={lang.name}
            style={{
              width: `${lang.percentage}%`,
              backgroundColor: lang.color,
            }}
            className="h-full first:rounded-l-full last:rounded-r-full"
            title={`${lang.name}: ${lang.percentage.toFixed(1)}%`}
          />
        ))}
      </div>

      {/* Language details */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
        {sortedLanguages.map((lang) => (
          <div key={lang.name} className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: lang.color }}
            />
            <span className="text-[var(--text-primary)]">{lang.name}</span>
            <span className="text-[var(--text-secondary)]">
              {lang.percentage.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}