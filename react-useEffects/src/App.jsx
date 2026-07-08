import './App.css'
import { useState, useEffect } from 'react'

function App() {

  const [posts, setPosts] = useState([]);
  const [isNarrow, setIsNarrow] = useState(window.innerWidth < 800);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
    .then((response) => response.json())
    .then((data) => setPosts(data.slice(0,10)));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsNarrow(window.innerWidth < 800);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      <h1>Top Posts</h1>
      <div className={isNarrow ? "posts column" : "posts row"}>
        {posts.map((post) => (
          <div className="post" key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
