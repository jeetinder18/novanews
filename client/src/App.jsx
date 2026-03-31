import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [news, setNews] = useState([])

  useEffect(() => {
    fetch("http://localhost:5000/news")
      .then((res) => res.json())
      .then((data) => {
        setNews(data.articles);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>
        NovaNews
      </h1>
      {news.map((article, index) => {
          return (
            <div key={index}>
              {article.urlToImage && (
                <img src={article.urlToImage} alt="news" style={{width: "250px", height: "auto"}} />
              )}
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                <h3>{article.title}</h3>
              </a>
              <p>{article.description}</p>
            </div>
          );
        })}
    </div>
  )
}

export default App
