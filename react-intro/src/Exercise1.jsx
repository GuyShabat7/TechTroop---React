// Data lives OUTSIDE the return
let companies = [
  { name: "Tesla", revenue: 140 },
  { name: "Microsoft", revenue: 300 },
  { name: "Google", revenue: 600 }
]

function Exercise1() {
  // Receives a string name and a number revenue, returns a JSX div.
  // The `key` is needed because we render these inside a .map().
  const showCompany = (name, revenue) => {
    return (
      <div id={name} key={name}>
        {name} makes {revenue} every year
      </div>
    )
  }

  return (
    <div className="ex-space">
      <h4 className="ex-title">Exercise 1</h4>
      <div className="exercise" id="ex-1">
        {companies.map((company) => showCompany(company.name, company.revenue))}
      </div>
    </div>
  )
}

export default Exercise1
