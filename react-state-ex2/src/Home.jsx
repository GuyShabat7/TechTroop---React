import Item from './Item'

function Home({store, shouldDiscount}) {
    return (
        <div>
            <h3>Store</h3>
            {store.map(product => (
                <Item key={product.item} 
                    item={product.item} 
                    price={product.price} 
                    discount={product.discount}
                    shouldDiscount={shouldDiscount}
                />
            ))}
        </div>
    )
}

export default Home