import './App.css'
import Company from "./Company"

const App = () => {
  const upperCase = name => name.toUpperCase()

  let companies = [
    {name: "Tesla", revenue: 140},
    {name: "Microsoft", revenue: 300},
    {name: "Google", revenue: 600}
  ]

  return (
    <div>
      {companies.map(c => <Company name={upperCase(c.name)} revenue={c.revenue} upperCase = {upperCase}/>)}
    </div>
  )
}

export default App
