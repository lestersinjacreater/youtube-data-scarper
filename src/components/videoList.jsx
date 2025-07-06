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

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "youtube_video_data.csv");
  link.click();
};

const VideoList = ({ videos }) => {
  if (videos.length === 0) return null;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Fetched Videos:</h2>
      <button
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded"
        onClick={() => exportToCSV(videos)}
      >
        📥 Export CSV
      </button>
      <ul>
        {videos.map((video) => (
          <li key={video.id} className="mb-3 border-b pb-2">
            <p className="font-medium">{video.title}</p>
            <p>Published: {new Date(video.publishedAt).toLocaleDateString()}</p>
            <p>Duration: {formatDuration(video.duration)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VideoList;
