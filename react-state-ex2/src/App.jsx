import './App.css'
import {useState} from 'react'
import Landing from './Landing'
import Home from './Home'

function App() {

  const [storeData] = useState({
    user: "Robyn",
    store: [
      { item: "XSPS Pro Player", price: 800, discount: 0.2, hottest: false },
      { item: "Gizem Backwatch", price: 230, discount: 0.6, hottest: false },
      { item: "Surround Sound Pelican", price: 3099, discount: 0.05, hottest: true }
    ],
    shouldDiscount: false,
    currentPage: "Landing"
  })

  const [currentPage, setCurrentPage] = useState("Landing")
  const [shouldDiscount, setShouldDiscount] = useState(false)

  return (
    <div>
      <button onClick={() => setCurrentPage("Landing")}>Landing</button>
      <button onClick={() => setCurrentPage("Home")}>Home</button>
      <button onClick={() => setShouldDiscount(!shouldDiscount)}>
        Toggle Discount ({shouldDiscount ? "ON" : "OFF"})
      </button>

      {currentPage === "Landing"
        ? <Landing user={storeData.user} store={storeData.store} />
        : <Home store={storeData.store} shouldDiscount={shouldDiscount} />}
    </div>
  )
}

export default App
