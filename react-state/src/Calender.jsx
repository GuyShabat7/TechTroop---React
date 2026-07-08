function Calender(props) {
    return (
        <div id="calender">
            <h4>Calender</h4>
            {props.reservations.map(r => {
                return <div key={r.name}>{r.name} has a reservation on {r.day} @ {r.time}</div>
            })}
        </div>
    )
}

export default Calender