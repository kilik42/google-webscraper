// video donwloader project using yt-dlp and express. This project allows users to download videos from various platforms by sending a POST request with the video URL. The server will then use yt-dlp to download the video and save it to the server's file system.

const express = require("express");
const path = require("path"); // this is required to handle file paths for example, to save the downloaded video in the correct location
const fs = require("fs"); // this is required to read and write files. we need this to save the downloaded video and to read the JSON body of the POST request
const { execFile } = require("child_process"); // this is required to execute the yt-dlp command
const { getJson } = require("body-parser"); // this is required to parse the JSON body of the POST request
const dotenv = require("dotenv");
dotenv.config();

const app = express();

const port = 3000;
const API_KEY = process.env.SERP_API_KEY;

const DOWNLOADS_DIR = path.join(__dirname, "downloads"); // this is the directory where the downloaded videos will be saved

// we need to create the downloads directory if it doesn't exist, otherwise, the yt-dlp command will fail when it tries to save the downloaded video
if (!fs.existsSync(DOWNLOADS_DIR)) {
  fs.mkdirSync(DOWNLOADS_DIR); // create the downloads directory if it doesn't exist
}

app.use(express.json()); // this middleware is required to parse the JSON body of the POST request
app.use(express.static("public")); // this middleware is required to serve the static files in the public directory, such as the HTML form for downloading videos

app.post("/download", (req, res) => {
  const { url } = req.body; // get the video URL from the JSON body of the POST request

  if (!url) {
    return res.status(400).json({ error: "URL is required" }); // return an error if the URL is not provided
  }

  const outputPath = path.join(DOWNLOADS_DIR, "%(title)s.%(ext)s"); // this is the output path for the downloaded video. yt-dlp will replace %(title)s with the title of the video and %(ext)s with the file extension of the video

  // execute the yt-dlp command to download the video
  execFile("yt-dlp", ["-o", outputPath, url], (error, stdout, stderr) => {
    if (error) {
      console.error(`Error downloading video: ${error.message}`);
      return res.status(500).json({ error: "Failed to download video" }); // return an error if the yt-dlp command fails
    }
    console.log(`Video downloaded successfully: ${stdout}`);
    res.json({ message: "Video downloaded successfully" }); // return a success message if the video is downloaded successfully
  });
});

app.use("/downloads", express.static(DOWNLOADS_DIR)); // this middleware is required to serve the downloaded videos from the downloads directory// this allows users to access the downloaded videos by navigating to http://localhost:3000/downloads/filename.ext

app.get("/api/search", (req, res) => {
  const query = req.query.q; // get the search query from the query parameters

  if (!query) {
    const { q, count: countParam = 5 } = req.query; // get the search query and count from the query parameters, with a default count of 5
    if (!q) {
      return res.status(400).json({ error: "Search query is required" }); // return an error if the search query is not provided
    }
    query = q; // assign the query variable to q if query is not provided
    count = countParam; // assign the count variable to countParam if query is not provided
  }
   getJson({
    engine: "google_short_videos",
    q: query,
    api_key: API_KEY,
    count: count
   }, (json) => {
    const videos = (json.short_video_results || []).slice(0, count).map((video) => ({
      title: video.title,
      link: video.link,
      thumbnail: video.thumbnail,
    }));
    res.json({ videos }); // return the search results as JSON
  });

  // Here you would implement the logic to search for videos using the SERP API and return the results as JSON
  // For example, you could use the axios library to make a request to the SERP API and return the search results
  // axios.get(`https://serpapi.com/search?q=${query}&api_key=${API_KEY}`)
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// his code should work as long as you have yt-dlp installed and available in your system's PATH. You can install yt-dlp using pip:

// pip install yt-dlp

// Make sure to run the server using Node.js and send a POST request to http://localhost:3000/download with a JSON body containing the video URL, like this:

// {
//     "url": "https://www.youtube.com/watch?v=example"
// }

// The downloaded video will be saved in the downloads directory with the title of the video as the filename.
