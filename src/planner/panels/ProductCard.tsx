import type { Product } from '../../types'
import { useRoomStore } from '../../stores/roomStore'
import { useUiStore } from '../../stores/uiStore'
import styles from './ProductCard.module.css'

interface Props {
  product: Product
}

const IconCart = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
  </svg>
)
const IconTrash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/>
  </svg>
)
const IconHeart = ({ filled }: { filled: boolean }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
)

const StarRating = ({ rating }: { rating: number }) => (
  <span className={styles.stars}>
    {[1, 2, 3, 4, 5].map((s) => (
      <svg key={s} width="11" height="11" viewBox="0 0 24 24"
        fill={rating >= s ? '#FFC300' : rating >= s - 0.5 ? 'url(#half)' : 'none'}
        stroke="#FFC300" strokeWidth="1.5">
        <defs>
          <linearGradient id="half">
            <stop offset="50%" stopColor="#FFC300"/>
            <stop offset="50%" stopColor="transparent"/>
          </linearGradient>
        </defs>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ))}
  </span>
)

export const ProductCard = ({ product }: Props) => {
  const addItem = useRoomStore((s) => s.addItem)
  const placedItems = useRoomStore((s) => s.placedItems)
  const removeItem = useRoomStore((s) => s.removeItem)
  const favoriteIds = useUiStore((s) => s.favoriteIds)
  const toggleFavorite = useUiStore((s) => s.toggleFavorite)
  const setSelected = useUiStore((s) => s.setSelectedInstanceId)

  const placed = placedItems.filter((i) => i.productId === product.id)
  const isFav = favoriteIds.has(product.id)

  const handleAdd = () => {
    const item = addItem(product.id, product.variants[0].id)
    setSelected(item.instanceId)
  }

  const handleRemoveLast = () => {
    const last = placed[placed.length - 1]
    if (last) removeItem(last.instanceId)
  }

  return (
    <div className={styles.card}>
      <div className={styles.imgWrap}>
        <img src={product.thumbnailUrl} alt={product.name} className={styles.img} loading="lazy" />
        <button
          className={`${styles.favBtn} ${isFav ? styles.favActive : ''}`}
          onClick={() => toggleFavorite(product.id)}
          aria-label="Favorite"
        >
          <IconHeart filled={isFav} />
        </button>
      </div>

      <div className={styles.info}>
        <div className={styles.nameRow}>
          <div>
            <div className={styles.name}>{product.name}</div>
            <div className={styles.subtitle}>{product.subtitle}</div>
          </div>
          <div className={styles.actions}>
            <button className={styles.cartBtn} onClick={handleAdd} title="Add to room">
              <IconCart />
            </button>
            {placed.length > 0 && (
              <button className={styles.removeBtn} onClick={handleRemoveLast} title="Remove from room">
                <IconTrash />
              </button>
            )}
          </div>
        </div>

        <div className={styles.ratingRow}>
          <StarRating rating={product.rating} />
          <span className={styles.reviewCount}>({product.reviewCount})</span>
        </div>

        <div className={styles.priceRow}>
          <span className={styles.price}>${product.price.toLocaleString()}</span>
          {placed.length > 0 && (
            <span className={styles.inRoom}>×{placed.length} in room</span>
          )}
        </div>

        <button className={styles.optionsBtn}>More options</button>
      </div>
    </div>
  )
}
