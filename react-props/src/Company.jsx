import SubComapny from './SubComapany'

function Company(props) {
    return (
        <div id="Comapany">
            <h2>{props.name}</h2>
            <p>Revenue: {props.revenue}</p>
            {/* <SubComapny /> */}
        </div>
    )
}

export default Company