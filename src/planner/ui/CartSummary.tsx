import { useRoomStore } from '../../stores/roomStore'
import { CATALOG } from '../../constants/catalog'
import styles from './CartSummary.module.css'

export const CartSummary = () => {
  const placedItems = useRoomStore((s) => s.placedItems)
  const total = placedItems.reduce((sum, item) => {
    const p = CATALOG.find((c) => c.id === item.productId)
    return sum + (p?.price ?? 0)
  }, 0)

  if (placedItems.length === 0) return null

  return (
    <div className={styles.summary}>
      <span className={styles.count}>{placedItems.length} items</span>
      <span className={styles.total}>${total.toLocaleString()}</span>
    </div>
  )
}
