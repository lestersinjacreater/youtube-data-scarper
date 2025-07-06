import React, { useState } from "react";
import axios from "axios";
import VideoList from "./components/videoList";

const App = () => {
  const [channelUrl, setChannelUrl] = useState("");
  const [channelId, setChannelId] = useState("");
  const [videos, setVideos] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [allVideosCount, setAllVideosCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

  const isWithinDateRange = (dateString) => {
    const videoDate = new Date(dateString);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    if (start && videoDate < start) return false;
    if (end && videoDate > end) return false;
    return true;
  };

  const extractChannelId = async (url) => {
    try {
      const channelRegex = /youtube\.com\/channel\/([a-zA-Z0-9_-]+)/;
      const customUrlRegex = /youtube\.com\/(c|@)\/?([a-zA-Z0-9_-]+)/;

      const channelMatch = url.match(channelRegex);
      if (channelMatch) return channelMatch[1];

      const customMatch = url.match(customUrlRegex);
      if (customMatch) {
        const username = customMatch[2];
        const res = await axios.get("https://www.googleapis.com/youtube/v3/search", {
          params: {
            part: "snippet",
            q: username,
            type: "channel",
            key: API_KEY,
          },
        });
        return res.data.items[0]?.snippet?.channelId;
      }

      throw new Error("Unsupported or invalid YouTube channel URL.");
    } catch (err) {
      alert("Failed to extract channel ID. Check the URL.");
      return null;
    }
  };

  const fetchVideos = async () => {
    setIsLoading(true);
    setError("");

    const id = await extractChannelId(channelUrl);
    if (!id) {
      setIsLoading(false);
      return;
    }

    setChannelId(id);
    const cacheKey = `youtube_videos_${id}`;
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      setAllVideosCount(parsed.length);
      const filtered = !startDate && !endDate ? parsed : parsed.filter((video) => isWithinDateRange(video.publishedAt));
      setVideos(filtered);
      setIsLoading(false);
      return;
    }

    try {
      const uploadsPlaylistRes = await axios.get("https://www.googleapis.com/youtube/v3/channels", {
        params: {
          part: "contentDetails",
          id: id,
          key: API_KEY,
        },
      });

      const uploadsPlaylistId = uploadsPlaylistRes.data.items[0].contentDetails.relatedPlaylists.uploads;

      let allVideos = [];
      let nextPageToken = "";

      while (true) {
        const playlistItemsRes = await axios.get("https://www.googleapis.com/youtube/v3/playlistItems", {
          params: {
            part: "snippet,contentDetails",
            maxResults: 50,
            playlistId: uploadsPlaylistId,
            pageToken: nextPageToken,
            key: API_KEY,
          },
        });

        const items = playlistItemsRes.data.items;
        const videoIds = items.map((item) => item.contentDetails.videoId);

        const videoDetailsRes = await axios.get("https://www.googleapis.com/youtube/v3/videos", {
          params: {
            part: "snippet,contentDetails",
            id: videoIds.join(","),
            key: API_KEY,
          },
        });

        const videoData = videoDetailsRes.data.items.map((video) => ({
          id: video.id,
          title: video.snippet.title,
          publishedAt: video.snippet.publishedAt,
          duration: video.contentDetails.duration,
        }));

        allVideos = [...allVideos, ...videoData];
        nextPageToken = playlistItemsRes.data.nextPageToken;
        if (!nextPageToken) break;
      }

      localStorage.setItem(cacheKey, JSON.stringify(allVideos));
      setAllVideosCount(allVideos.length);
      const filtered = !startDate && !endDate ? allVideos : allVideos.filter((video) => isWithinDateRange(video.publishedAt));
      setVideos(filtered);
    } catch (error) {
      setError("Error fetching data. Please try again later.");
      console.error("Error fetching data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCache = () => {
    if (channelId) {
      const cacheKey = `youtube_videos_${channelId}`;
      localStorage.removeItem(cacheKey);
      setVideos([]);
      setAllVideosCount(0);
      setError("");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1>🎥 YouTube Channel Analytics</h1>
          <p className="subtitle">
            Analyze video statistics and trends from any YouTube channel
          </p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <div className="form-group">
            <label className="form-label">YouTube Channel URL</label>
            <input
              type="text"
              placeholder="Paste full YouTube channel URL (e.g. https://www.youtube.com/@channelname)"
              value={channelUrl}
              onChange={(e) => setChannelUrl(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Filter by Date Range (Optional)</label>
            <div className="form-row">
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>
                  Start Date:
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>
                  End Date:
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <button
              onClick={fetchVideos}
              className="btn-primary"
              disabled={!channelUrl.trim() || isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Loading...
                </>
              ) : (
                <>🚀 Fetch Videos</>
              )}
            </button>
            <button
              onClick={clearCache}
              className="btn-danger"
              disabled={!channelId.trim()}
            >
              🗑️ Clear Cache
            </button>
          </div>

          {allVideosCount > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <div className="stats-card">
                <div className="stats-number">{videos.length}</div>
                <div className="stats-label">
                  Videos Found{videos.length !== allVideosCount && ` (of ${allVideosCount} total)`}
                  {startDate || endDate
                    ? ` • Filtered from ${startDate || "beginning"} to ${endDate || "latest"}`
                    : " • No date filters applied"}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}
        </div>
      </div>
      <VideoList videos={videos} />
    </div>
  );
};

export default App;
