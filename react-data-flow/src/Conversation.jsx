function Conversation({convo, sender, displayConvo}) {
    return (
        <div>
            <button className="back" onClick={() => displayConvo(null)}>Back</button>
            {convo.map((message, index) => (
                <div key={index}>
                    <span className="sender">
                        {message.sender === "self" ? "Me" : sender}
                    </span>
                    : {message.text}
                </div>
            ))}
        </div>
    )
}

export default Conversation