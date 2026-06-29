function Landing({user, store}) {
    const hottest = store.find(p => p.hottest === true)

    return (
        <div>
            Welcome, {user}. Our hottest item is {hottest.item}!
        </div>
    )
}

export default Landing