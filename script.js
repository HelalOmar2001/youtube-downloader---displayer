// Replace 'YOUR_API_KEY' with your actual YouTube Data API key
const API_KEY = "AIzaSyCmUDFj5MjJIb1NCx90vzcaPY0HvD3TM2o";

// Replace 'PLAYLIST_ID' with the ID of the YouTube playlist you want to get the duration for
const PLAYLIST_ID = "PLrmLmBdmIlpsHaNTPP_jHHDx_os9ItYXr";

// Function to convert ISO 8601 duration format to seconds
function parseDuration(duration) {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;

  return hours * 3600 + minutes * 60 + seconds;
}

// Function to make the API request and calculate the total duration
function getTotalDuration() {
  const apiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=${PLAYLIST_ID}&maxResults=50&key=${API_KEY}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const videoIds = data.items
        .map((item) => item.contentDetails.videoId)
        .join(",");

      const videoUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${API_KEY}`;

      fetch(videoUrl)
        .then((response) => response.json())
        .then((data) => {
          const durations = data.items.map(
            (item) => item.contentDetails.duration
          );
          const totalDuration = durations.reduce(
            (sum, duration) => sum + parseDuration(duration),
            0
          );

          console.log(
            `Total duration: ${~~(totalDuration / 3600)} Houres & ${~~(
              (totalDuration % 3600) /
              60
            )} minutes & ${totalDuration % 60} seconds`
          );
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));
}

getTotalDuration();
