import { addToCart, removeFromCart } from '@/redux/slices/cartSlice'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'

export default function CartSidebar() {
  const { loading, cartItems, itemsPrice } = useSelector((state) => state.cart)

  const dispatch = useDispatch()

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }))
  }

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id))
  }

  const pathname = usePathname()

  return (
    <div
      className={
        loading
          ? ''
          : cartItems.length > 0 &&
            (pathname === '/' || pathname.indexOf('/product/') >= 0)
          ? 'fixed top-0 right-0 w-32 h-full shadow-lg border-l border-l-gary-700 overflow-scroll'
          : 'hidden'
      }
    >
      {loading ? (
        <div className="py-5 px-2">Loading...</div>
      ) : cartItems.length === 0 ? (
        <div className="py-5 px-2">No hay artículos en la venta</div>
      ) : (
        <>
          <div className="p-2 flex flex-col items-center border-b border-b-gary-600">
            <div>Subtotal</div>
            <div className="font-bold text-orange-700">${itemsPrice}</div>
            <div>
              <Link
                href="/cart"
                className="w-full text-center p-1  rounded-2xl border-2"
              >
                Proceder
              </Link>
            </div>
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="p-2 flex flex-col items-center border-b border-b-gary-600"
              >
                <Link
                  href={`/product/${item.id}`}
                  className="flex items-center"
                >
                </Link>
                <select
                  value={item.qty}
                  onChange={(e) =>
                    addToCartHandler(item, Number(e.target.value))
                  }
                >
                  {[...Array(item.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
                <button
                  className="default-button mt-2"
                  onClick={() => removeFromCartHandler(item.id)}
                >
                  Borrar
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
