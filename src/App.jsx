import React, { useState } from "react"; 
import axios from "axios";
import VideoList from "./components/videoList";

const App = () => {
  const [channelId, setChannelId] = useState("");
  const [videos, setVideos] = useState([]);

  const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

 
 const fetchVideos = async () => {
  try {
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
            maxResults: 50, // max allowed
            playlistId: uploadsPlaylistId,
            pageToken: nextPageToken,
            key: API_KEY,
          },
        }
      );

      const items = playlistItemsRes.data.items;
      const videoIds = items.map((item) => item.contentDetails.videoId);

      // Get durations for this batch
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

      // Check if there's another page
      nextPageToken = playlistItemsRes.data.nextPageToken;
      keepFetching = !!nextPageToken;
    }

    setVideos(allVideos);
  } catch (error) {
    console.error("Error fetching data", error);
  }
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
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={fetchVideos}
      >
        Fetch Videos
      </button>
      <VideoList videos={videos} />
    </div>
  );
};

export default App;
