function Exercise2() {
  // Receives a number temperature, returns a className string.
  const getClassName = (temperature) => {
    if (temperature < 15) return "freezing"
    if (temperature <= 30) return "fair"
    return "hell-scape"
  }

  // Change this value to test: < 15 = aqua, 15-30 = orange, otherwise red
  const temperature = 10

  return (
    <div className="ex-space">
      <h4 className="ex-title">Exercise 2</h4>
      <div className="exercise" id="ex-2">
        <div id="weatherBox" className={getClassName(temperature)}></div>
      </div>
    </div>
  )
}

export default Exercise2
