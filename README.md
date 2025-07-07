# 📊 YouTube Channel Video Statistics Tool

<div align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/YouTube_API-FF0000?style=for-the-badge&logo=youtube&logoColor=white" alt="YouTube API">
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="Axios">
</div>

<div align="center">
  <h3>🎯 A powerful and intuitive tool for analyzing YouTube channel performance and video statistics</h3>
</div>

---

## 🌟 Features

### 🔍 **Smart Channel Detection**
- **Multiple URL Support**: Works with channel URLs, custom URLs (@username), and direct channel IDs
- **Automatic ID Extraction**: Intelligently parses different YouTube URL formats
- **Error Handling**: Comprehensive validation and user-friendly error messages

### 📅 **Advanced Date Filtering**
- **Custom Date Ranges**: Filter videos by publication date
- **Flexible Filtering**: Set start date, end date, or both
- **Real-time Updates**: Instantly see filtered results

### 🚀 **Performance Optimized**
- **Smart Caching**: Stores fetched data locally to minimize API calls
- **Batch Processing**: Efficiently handles channels with thousands of videos
- **Progressive Loading**: Fetches all videos using pagination
- **Cache Management**: Easy cache clearing for fresh data

### 📊 **Comprehensive Analytics**
- **Video Statistics**: Title, publication date, and duration
- **Count Tracking**: Shows filtered vs. total video counts
- **Chronological Sorting**: Videos sorted by newest first
- **Export Functionality**: Download results as CSV files

### 🎨 **Modern UI/UX**
- **Professional Design**: Clean, YouTube-inspired interface
- **Responsive Layout**: Works on all device sizes
- **Loading States**: Visual feedback during data fetching
- **Error Notifications**: Clear error messages and recovery options

---

## 🛠️ Technology Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | Frontend Framework | ^19.1.0 |
| **Vite** | Build Tool & Dev Server | ^7.0.0 |
| **Axios** | HTTP Client | ^1.10.0 |
| **YouTube Data API v3** | Video Data Source | Latest |
| **Modern CSS** | Styling & Layout | CSS3 |

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- YouTube Data API v3 key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my-react-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_YOUTUBE_API_KEY=your_youtube_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

---

## 🔑 Getting a YouTube API Key

1. **Visit Google Cloud Console**: [console.cloud.google.com](https://console.cloud.google.com)
2. **Create a new project** or select an existing one
3. **Enable YouTube Data API v3**:
   - Go to "APIs & Services" → "Library"
   - Search for "YouTube Data API v3"
   - Click "Enable"
4. **Create credentials**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy your API key
5. **Restrict your API key** (recommended):
   - Click on your API key
   - Under "API restrictions", select "YouTube Data API v3"

---

## 📖 How to Use

### 1. **Enter Channel Information**
- Paste any YouTube channel URL or enter a channel ID directly
- Supported formats:
  - `https://www.youtube.com/channel/UCxxxxxxxxx`
  - `https://www.youtube.com/c/channelname`
  - `https://www.youtube.com/@username`
  - Direct channel ID: `UCxxxxxxxxx`

### 2. **Set Date Filters (Optional)**
- Choose start date to see videos from that date onwards
- Choose end date to see videos up to that date
- Leave blank to see all videos

### 3. **Fetch Videos**
- Click "Fetch Videos" to start analysis
- First fetch will take longer as it downloads all video data
- Subsequent fetches use cached data for faster loading

### 4. **Analyze Results**
- View video count and publication statistics
- Sort through chronologically ordered video list
- Export data as CSV for further analysis

### 5. **Manage Cache**
- Use "Clear Cache" to refresh data
- Cache is stored per channel for efficiency

---

## 🎯 Use Cases

### 🎬 **Content Creators**
- Analyze your upload consistency
- Track video publication patterns
- Monitor channel growth over time

### 📈 **Marketing Teams**
- Research competitor content strategies
- Analyze posting frequency trends
- Export data for presentations

### 🔬 **Researchers**
- Study YouTube channel behaviors
- Analyze content publication patterns
- Gather data for academic research

### 📊 **Data Analysts**
- Extract channel statistics
- Perform temporal analysis
- Create content calendars

---

## 📁 Project Structure

```
my-react-app/
├── 📁 public/
│   └── vite.svg
├── 📁 src/
│   ├── 📁 components/
│   │   └── videoList.jsx          # Video display component
│   ├── App.jsx                    # Main application component
│   ├── App.css                    # Application styles
│   ├── index.css                  # Global styles
│   └── main.jsx                   # Entry point
├── .env                           # Environment variables
├── package.json                   # Dependencies and scripts
├── vite.config.js                 # Vite configuration
└── README.md                      # This file
```

---

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 🎨 Features in Detail

### 📊 **Video Statistics Display**
- **Title**: Full video title with proper formatting
- **Publication Date**: Human-readable date format
- **Duration**: Converted from ISO 8601 to readable format (e.g., "5m 30s")
- **Count Information**: Shows filtered results vs. total videos

### 💾 **Smart Caching System**
- **Local Storage**: Stores video data in browser storage
- **Per-Channel Caching**: Each channel has its own cache
- **Cache Invalidation**: Manual cache clearing when needed
- **Performance**: Dramatically reduces API calls and loading times

### 📤 **CSV Export**
- **Comprehensive Data**: Includes all video information
- **Date-stamped Files**: Automatic filename with current date
- **Filtered Results**: Exports only currently visible videos
- **Standard Format**: Compatible with Excel, Google Sheets, etc.

---

## 🔒 Privacy & Security

- **No Data Collection**: All data processing happens locally
- **Secure API Usage**: API keys stored in environment variables
- **Local Storage Only**: Cache data stays in your browser
- **No Third-party Tracking**: Pure client-side application

---

## 🚨 Troubleshooting

### Common Issues

**🔑 API Key Issues**
- Ensure your API key is valid and active
- Check that YouTube Data API v3 is enabled
- Verify the API key is properly set in `.env`

**🌐 Network Errors**
- Check your internet connection
- Verify the channel URL is correct
- Try clearing the cache and fetching again

**📊 No Videos Showing**
- Check if date filters are too restrictive
- Ensure the channel has public videos
- Try a different channel to test

**⚡ Slow Loading**
- Large channels may take time on first fetch
- Use the cache for subsequent requests
- Consider narrowing date ranges for faster results

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🌟 Support

If you find this tool helpful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 🤝 Contributing code

---

## 📞 Contact

For questions, suggestions, or support:
- 📧 Email: [your-email@example.com]
- 🐦 Twitter: [@yourusername]
- 💼 LinkedIn: [Your LinkedIn Profile]

---

<div align="center">
  <p>Made with ❤️ for the YouTube creator community</p>
  <p>⭐ Star this repo if you found it useful!</p>
</div>
