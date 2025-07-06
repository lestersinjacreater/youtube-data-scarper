import React, { useState } from "react";
import axios from "axios";
import VideoList from "./components/videoList";

const App = () => {
  const [channelId, setChannelId] = useState("");
  const [videos, setVideos] = useState([]);

  const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

  const fetchVideos = async () => {
    const cacheKey = `youtube_videos_${channelId}`;
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      console.log("💾 Using cached data from localStorage");
      setVideos(JSON.parse(cachedData));
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

      // ✅ Cache the data
      localStorage.setItem(cacheKey, JSON.stringify(allVideos));

      setVideos(allVideos);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  // 🔁 Clear cache button handler (optional)
  const clearCache = () => {
    const cacheKey = `youtube_videos_${channelId}`;
    localStorage.removeItem(cacheKey);
    alert("Cache cleared for this channel!");
  };

  return (
    <div className="p-6 font-sans">
      <h1 className="text-2xl font-bold mb-4">YouTube Channel Video Stats</h1>
      <input
        className="border p-2 mr-2"
        type="text"
        placeholder="Enter Channel ID (e.g. UCj7xVVOm3d3-WyzFdfz2pLQ)"
        value={channelId}
        onChange={(e) => setChannelId(e.target.value)}
      />
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
      <VideoList videos={videos} />
    </div>
  );
};

export default App;
