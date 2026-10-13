import React from "react"

const CartSimple = React.lazy(() => import('./Carts/CartSimple'))
const CartKuchara = React.lazy(() => import('./Carts/CartKuchara'))

const Cart = ({ which, data, cart, setCart }) => {
  const getCart = () => {
    switch (which) {
      case 'CartSimple':
        return <CartSimple data={data} cart={cart} setCart={setCart} />
        case 'CartKuchara':
        return <CartKuchara data={data} cart={cart} setCart={setCart} />
      default:
        return <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
    }
  }
  return getCart()
}

export default Cart