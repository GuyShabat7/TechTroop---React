function Register({reservations}) {
    return (
        <div id="register">
            <h4>You cannot reserve during these times:</h4>
            {reservations.map(r => {
                return <div key={r.name}>{r.day} @ {r.time}</div>
            })}
        </div>
    )
}

export default Register