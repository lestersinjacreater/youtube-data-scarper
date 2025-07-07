import React from "react";

// Helper to convert ISO8601 to readable format
const formatDuration = (isoDuration) => {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const [, hours, minutes, seconds] = isoDuration.match(regex) || [];
  const h = hours ? `${hours}h ` : "";
  const m = minutes ? `${minutes}m ` : "";
  const s = seconds ? `${seconds}s` : "";
  return `${h}${m}${s}`.trim();
};

// Helper to convert seconds to readable format
const formatSecondsToReadable = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${remainingSeconds}s`;
  }
};

// Calculate duration statistics
const calculateDurationStats = (videos) => {
  if (videos.length === 0) return null;
  
  const durations = videos.map(video => video.durationSeconds).filter(Boolean);
  const total = durations.reduce((sum, duration) => sum + duration, 0);
  const average = Math.round(total / durations.length);
  const shortest = Math.min(...durations);
  const longest = Math.max(...durations);
  
  return {
    total,
    average,
    shortest,
    longest,
    totalFormatted: formatSecondsToReadable(total),
    averageFormatted: formatSecondsToReadable(average),
    shortestFormatted: formatSecondsToReadable(shortest),
    longestFormatted: formatSecondsToReadable(longest)
  };
};

// CSV export function
const exportToCSV = (videos) => {
  const headers = ["Title", "Published At", "Duration", "Duration (Seconds)"];
  const rows = videos.map((video) => [
    `"${video.title}"`,
    new Date(video.publishedAt).toLocaleDateString(),
    formatDuration(video.duration),
    video.durationSeconds || 0,
  ]);

  const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `youtube_videos_${today}.csv`);
  link.click();
};

const VideoList = ({ videos }) => {
  if (videos.length === 0) return null;

  // Sort videos by newest first
  const sortedVideos = [...videos].sort(
    (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
  );

  // Calculate duration statistics
  const durationStats = calculateDurationStats(sortedVideos);

  return (
    <div style={{ marginTop: '2rem' }}>
      <div className="card">
        {/* Video count header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 600, 
            color: 'var(--text-primary)',
            margin: 0
          }}>
            📹 Video Library ({sortedVideos.length} videos)
          </h2>

          {/* Export CSV button */}
          <button
            className="btn-success"
            onClick={() => exportToCSV(sortedVideos)}
          >
            📥 Export CSV
          </button>
        </div>

        {/* Duration Statistics */}
        {durationStats && (
          <div style={{ 
            marginBottom: '2rem', 
            padding: '1rem',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '8px',
            border: '1px solid var(--border-color)'
          }}>
            <h3 style={{ 
              fontSize: '1.1rem', 
              fontWeight: 600, 
              color: 'var(--text-primary)',
              marginBottom: '1rem'
            }}>
              ⏱️ Duration Statistics
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '1rem' 
            }}>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Total Watch Time</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {durationStats.totalFormatted} ({durationStats.total.toLocaleString()} seconds)
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Average Duration</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {durationStats.averageFormatted} ({durationStats.average.toLocaleString()} seconds)
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Shortest Video</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {durationStats.shortestFormatted} ({durationStats.shortest.toLocaleString()} seconds)
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Longest Video</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {durationStats.longestFormatted} ({durationStats.longest.toLocaleString()} seconds)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Video list */}
        <div>
          {sortedVideos.map((video, index) => (
            <div key={video.id} className="video-item">
              <div className="video-title">
                {index + 1}. {video.title}
              </div>
              <div className="video-meta">
                <span>
                  📅 {new Date(video.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
                <span>
                  ⏱️ {formatDuration(video.duration)}
                  {video.durationSeconds && (
                    <span style={{ color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>
                      ({video.durationSeconds.toLocaleString()} seconds)
                    </span>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoList;
