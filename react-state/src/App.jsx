import './App.css'
import Button from './Button'
import {useState} from 'react'
import Company from './Company'
import Regester from './Register'
import Calender from './Calender'
import Hot from './Hot'
import Cold from './Cold'

function App() {
  
  let companiesData = [
    { name: "Tesla", revenue: 140 },
    { name: "Microsoft", revenue: 300 },
    { name: "Google", revenue: 600 }
  ];

  const [reservations, setReservations] = useState([
    { day: "Monday", time: 2000, name: "Earl" },
    { day: "Monday", time: 1845, name: "Ella" },
    { day: "Tuesday", time: 1930, name: "Linda" },
    { day: "Wednesday", time: 2015, name: "Anni" }
  ]);

  const [temp, setTemp] = useState("hot")
  const checkTemp = () => {
    setTemp(temp === "hot" ? "cold" : "hot");
  }


  let [companies, setCompanies] = useState(companiesData)

  return (
    // <div className = "ex-space">
    //   {companies.map(company => <Company name={company.name} revenue={company.revenue}></Company>)}
    // </div>

    // <div className="ex-space">
    //     <h4 className="ex-title">Spotcheck 5</h4>
    //     <div className="exercise" id="spotcheck-5">
    //       <div>
    //         <Calender reservations={reservations} />
    //         <Regester reservations={reservations} />
    //       </div>
    //     </div>
    //   </div>

    <div className="App">
      {temp === "hot" ? <Hot /> : <Cold />}
      <button onClick={checkTemp}>Change Temp!</button>
    </div>
  )
}

export default App
