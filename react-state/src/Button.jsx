function Button() {
    const logHover = () => {
        console.log("I was hovered!");
    }

    return (
        <button onMouseEnter={logHover}>Click me</button>
    );
}

export default Button