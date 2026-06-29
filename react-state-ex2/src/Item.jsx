function Item({item, price, discount, shouldDiscount}) {
    const finalPrice = shouldDiscount ? price * (1 - discount) : price
    
    return (
        <div>{item} - ${finalPrice}</div>
    )
}

export default Item