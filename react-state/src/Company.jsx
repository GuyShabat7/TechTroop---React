function Company(props) {
    return (
        <div id="Comapany">
            <h2>{props.name}</h2>
            <p>Revenue: {props.revenue}</p>
        </div>
    )
}

export default Company