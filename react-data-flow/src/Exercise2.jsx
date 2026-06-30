import { useState } from 'react'
import List from './List'
import Conversation from './Conversation'

const Exercise2 = () => {
    const [state, setState] = useState({
            displayConversation: null,
    conversations: [
            {
                with: "Laura", convo: [
                    { text: "Hi", sender: "self" },
                    { text: "You there?", sender: "self" },
                    { text: "Yeah, hi, what's up?", sender: "other" }
                ]
            },
            {
                with: "Dad", convo: [
                    { text: "Have you finished your school work yet?", sender: "other" },
                    { text: "Yes.", sender: "self" },
                    { text: "What do you mean, yes?", sender: "other" },
                    { text: "??", sender: "self" }
                ]
            },
            {
                with: "Shoobert", convo: [
                    { text: "Shoobert!!!", sender: "self" },
                    { text: "Dude!!!!!!!!", sender: "other" },
                    { text: "Shooooooooo BERT!", sender: "self" },
                    { text: "You're my best friend", sender: "other" },
                    { text: "No, *you're* my best friend", sender: "self" },
                ]
            }
        ]
    });

    const displayConvo = (name) => {
        setState({...state, displayConversation: name});
    }

    return (
        <div>
            {state.displayConversation === null ? <List contacts={state.conversations.map(c => c.with)} displayConvo={displayConvo}/> : <Conversation 
            convo={state.conversations.find(c => c.with === state.displayConversation).convo}
            sender={state.displayConversation}
            displayConvo={displayConvo}/>}
        </div>
    )
}

export default Exercise2;