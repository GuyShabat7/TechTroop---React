import './App.css'

function LandingPage() {
    return (
      <h1>Welcome</h1>
    )
}
function Nav() {
    return (
        <div id="nav">
            <span>Home</span>
            <span>About</span>
        </div>
    )
}
function App() {
  return (
    <div>
        <Nav />
        <LandingPage />
    </div>
  )
}

export function Sum() {
    const num1 = 9
    const num2 = 3
    return (
        <div>
            The sum is {num1 + num2}
        </div>
    )
}

export default App
