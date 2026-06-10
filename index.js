const { getJson } = require("serpapi");
require("dotenv").config();



// getJson(
//   {
//     engine: "google_short_videos",
//     q: "lobubu",
  
//     api_key: process.env.SERP_API_KEY,
//   },
//   (json) => {
//     console.log(json);
//   },
// );



// getJson(
//   {
//     engine: "google",
//     q: "Coffee",
//     location: "Austin, Texas, United States",
//     google_domain: "google.com",
//     hl: "en",
//     gl: "us",
//     api_key: process.env.SERP_API_KEY,
//   },
//   (json) => {
//     console.log(json);
//   },
// );

// const search = async () => {
//   const params = {
//     q: "Coffee", // query
//     api_key: process.env.SERP_API_KEY // API key from .env file
//   };

//   const response = await getJson("https://serpapi.com/search", params);
//   console.log(response);

// };

// search();
