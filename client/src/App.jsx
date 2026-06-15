import { useState, useEffect } from 'react'
import './App.css'

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

function App() {
  const [ news, setNews ] = useState([]);
  const [ searchTerm, setSearchTerm ] = useState("");
  const [ summaries, setSummaries ] = useState({});

  const fetchNews = async (query = "") => {
    try {
      setSummaries({}); //clear old summaries

      let url = "";

      if (query) {
        url = `${API_BASE_URL}/news?q=${query}`;
      } else {
        url = `${API_BASE_URL}/news`;
      }

      const response = await axios.get(url);
      setNews(response.data.articles);

    } catch (error) {
      console.error(error);
    }
  }

  const handleSearch = () => {
    fetchNews(searchTerm.trim());
  };

  const getSummary = async (article, index) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/summarise`, {

        title: article.title,
        description: article.description

      });

      setSummaries((prev) => ({
        ...prev,
        [article.url]: res.data.summary
      }))

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {

    fetchNews()
  }, []);

  return (
    <div>
      <h1>
        NovaNews
      </h1>

      <input
        type="text"
        placeholder="Search news..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
      />

      <button onClick={handleSearch}>
        Search
      </button>

      {news.map((article) => {
          return (
            <div key={article.url}>

              {/* Comment: showing the image */}

              {article.urlToImage && (
                <img src={article.urlToImage} alt={article.title} style={{width: "250px", height: "auto"}} loading="lazy" />
              )}

              {/* Comment: making the title into a button to go to full article */}

              <a href={article.url} target="_blank" rel="noopener noreferrer">
                <h3>{article.title}</h3>
              </a>

              {/* Comment: just showing the desription of the article */}

              <p>{article.description}</p>

              {/* Comment: AI Summary button and showing the summary */}

              <button onClick={() => getSummary(article)}>
                Get AI Summary
              </button>

              {summaries[article.url] && (
                <p>AI Summary: {summaries[article.url]}</p>
              )}

            </div>
          );
        })}
    </div>
  )
}

export default App
