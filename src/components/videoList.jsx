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

// CSV export function
const exportToCSV = (videos) => {
  const headers = ["Title", "Published At", "Duration"];
  const rows = videos.map((video) => [
    `"${video.title}"`,
    new Date(video.publishedAt).toLocaleDateString(),
    formatDuration(video.duration),
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
