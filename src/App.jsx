import React, { useState } from "react";
import axios from "axios";
import VideoList from "./components/videoList";

const App = () => {
  const [channelId, setChannelId] = useState("");
  const [videos, setVideos] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [allVideosCount, setAllVideosCount] = useState(0); // New state

  const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

  const isWithinDateRange = (dateString) => {
    const videoDate = new Date(dateString);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && videoDate < start) return false;
    if (end && videoDate > end) return false;
    return true;
  };

  const fetchVideos = async () => {
    const cacheKey = `youtube_videos_${channelId}`;
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      console.log("💾 Using cached data from localStorage");
      const parsed = JSON.parse(cachedData);
      setAllVideosCount(parsed.length); // Track original total
      const filtered = parsed.filter((video) =>
        isWithinDateRange(video.publishedAt)
      );
      setVideos(filtered);
      return;
    }

    try {
      console.log("🌐 Fetching from YouTube API...");
      const uploadsPlaylistRes = await axios.get(
        `https://www.googleapis.com/youtube/v3/channels`,
        {
          params: {
            part: "contentDetails",
            id: channelId,
            key: API_KEY,
          },
        }
      );

      const uploadsPlaylistId =
        uploadsPlaylistRes.data.items[0].contentDetails.relatedPlaylists.uploads;

      let allVideos = [];
      let nextPageToken = "";
      let keepFetching = true;

      while (keepFetching) {
        const playlistItemsRes = await axios.get(
          `https://www.googleapis.com/youtube/v3/playlistItems`,
          {
            params: {
              part: "snippet,contentDetails",
              maxResults: 50,
              playlistId: uploadsPlaylistId,
              pageToken: nextPageToken,
              key: API_KEY,
            },
          }
        );

        const items = playlistItemsRes.data.items;
        const videoIds = items.map((item) => item.contentDetails.videoId);

        const videoDetailsRes = await axios.get(
          `https://www.googleapis.com/youtube/v3/videos`,
          {
            params: {
              part: "snippet,contentDetails",
              id: videoIds.join(","),
              key: API_KEY,
            },
          }
        );

        const videoData = videoDetailsRes.data.items.map((video) => ({
          id: video.id,
          title: video.snippet.title,
          publishedAt: video.snippet.publishedAt,
          duration: video.contentDetails.duration,
        }));

        allVideos = [...allVideos, ...videoData];

        nextPageToken = playlistItemsRes.data.nextPageToken;
        keepFetching = !!nextPageToken;
      }

      localStorage.setItem(cacheKey, JSON.stringify(allVideos));

      setAllVideosCount(allVideos.length); // track unfiltered count

      const filtered = allVideos.filter((video) =>
        isWithinDateRange(video.publishedAt)
      );

      setVideos(filtered);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const clearCache = () => {
    const cacheKey = `youtube_videos_${channelId}`;
    localStorage.removeItem(cacheKey);
    alert("Cache cleared for this channel!");
  };

  return (
    <div className="p-6 font-sans">
      <h1 className="text-2xl font-bold mb-4">YouTube Channel Video Stats</h1>

      {/* Channel ID */}
      <input
        className="border p-2 mr-2"
        type="text"
        placeholder="Enter Channel ID (e.g. UCj7xVVOm3d3-WyzFdfz2pLQ)"
        value={channelId}
        onChange={(e) => setChannelId(e.target.value)}
      />

      {/* Date filters */}
      <div className="my-4">
        <label className="mr-2 font-medium">Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 mr-4"
        />

        <label className="mr-2 font-medium">End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2"
        />
      </div>

      {/* Action buttons */}
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
        onClick={fetchVideos}
      >
        Fetch Videos
      </button>

      <button
        className="bg-red-600 text-white px-4 py-2 rounded"
        onClick={clearCache}
      >
        🗑️ Clear Cache
      </button>

      {/* Filtered count info */}
      {allVideosCount > 0 && (
        <p className="mt-4 text-green-700 font-medium">
          ✅ Showing {videos.length} of {allVideosCount} videos
        </p>
      )}

      {/* Video List */}
      <VideoList videos={videos} />
    </div>
  );
};

export default App;
