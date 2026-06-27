import { useState } from 'react'
import { CATALOG } from '../../constants/catalog'
import { useRoomStore } from '../../stores/roomStore'
import { useUiStore } from '../../stores/uiStore'
import { VariantSwatcher } from '../ui/VariantSwatcher'
import styles from './ProductDetail.module.css'

const IconCart = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
  </svg>
)
const IconSwap = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/>
    <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/>
  </svg>
)
const IconGoes = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
)
const IconWarn = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e67e22" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
)
const IconClose = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

const StarRating = ({ rating, count }: { rating: number; count: number }) => (
  <div className={styles.ratingRow}>
    {[1, 2, 3, 4, 5].map((s) => (
      <svg key={s} width="13" height="13" viewBox="0 0 24 24"
        fill={rating >= s ? '#FFC300' : 'none'} stroke="#FFC300" strokeWidth="1.5">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ))}
    <span className={styles.reviewCount}>({count})</span>
  </div>
)

export const ProductDetail = () => {
  const selectedId = useUiStore((s) => s.selectedInstanceId)
  const setSelectedId = useUiStore((s) => s.setSelectedInstanceId)
  const placedItems = useRoomStore((s) => s.placedItems)
  const updateVariant = useRoomStore((s) => s.updateItemVariant)
  const addItem = useRoomStore((s) => s.addItem)
  const [imgIdx, setImgIdx] = useState(0)

  const item = placedItems.find((i) => i.instanceId === selectedId)
  if (!item) return null

  const product = CATALOG.find((p) => p.id === item.productId)
  if (!product) return null

  const similarProducts = CATALOG.filter((p) => product.similarIds.includes(p.id))
  const goesWithProducts = CATALOG.filter((p) => product.goesWithIds.includes(p.id))

  const handleVariantChange = (variantId: string) => {
    updateVariant(item.instanceId, variantId)
  }

  return (
    <div className={styles.panel}>
      <button className={styles.closeBtn} onClick={() => setSelectedId(null)}>
        <IconClose />
      </button>

      {product.mustSecureToWall && (
        <div className={styles.warning}>
          <IconWarn />
          <span>This furniture must be secured to the wall.</span>
        </div>
      )}

      {/* Image gallery */}
      <div className={styles.imgMain}>
        <img
          src={product.images[imgIdx] ?? product.thumbnailUrl}
          alt={product.name}
          className={styles.mainImg}
        />
      </div>

      {product.images.length > 1 && (
        <div className={styles.imgThumbs}>
          {product.images.map((url, i) => (
            <button
              key={i}
              className={`${styles.thumb} ${i === imgIdx ? styles.thumbActive : ''}`}
              onClick={() => setImgIdx(i)}
            >
              <img src={url.replace('w=700', 'w=120')} alt="" />
            </button>
          ))}
        </div>
      )}

      <div className={styles.body}>
        {/* Name + price */}
        <h2 className={styles.name}>{product.name}</h2>
        <p className={styles.subtitle}>{product.subtitle}</p>
        <StarRating rating={product.rating} count={product.reviewCount} />
        <div className={styles.price}>${product.price.toLocaleString()}</div>

        {/* Delivery */}
        <div className={styles.deliveryRow}>
          <span className={styles.deliveryDot} />
          <span>Delivery</span>
          <span className={styles.deliveryDot} style={{ marginLeft: 12 }} />
          <span>Pick up</span>
          <span className={styles.deliveryDot} style={{ marginLeft: 12 }} />
          <span>Store purchase</span>
        </div>

        {/* Colors */}
        <div className={styles.section}>
          <div className={styles.sectionLabel}>
            Color: <strong>{product.variants.find((v) => v.id === item.variantId)?.name ?? product.variants[0].name}</strong>
          </div>
          <VariantSwatcher
            variants={product.variants}
            activeId={item.variantId}
            onChange={handleVariantChange}
          />
        </div>

        {/* Dimensions */}
        <div className={styles.section}>
          <div className={styles.sectionLabel}>Dimensions</div>
          <div className={styles.dims}>
            {product.dimensions.w}W × {product.dimensions.d}D × {product.dimensions.h}H cm
          </div>
        </div>

        {/* Description */}
        <p className={styles.desc}>{product.description}</p>

        {/* Add to bag */}
        <button className={styles.addBtn}>
          <IconCart /> Add to bag
        </button>

        {/* Show More Details link */}
        <a href="#" className={styles.moreLink} onClick={(e) => e.preventDefault()}>
          ↗ Show More Details
        </a>

        {/* Swap with similar */}
        {similarProducts.length > 0 && (
          <div className={styles.section}>
            <button className={styles.swapBtn}><IconSwap /> Swap with similar</button>
            <div className={styles.relatedGrid}>
              {similarProducts.map((p) => (
                <button
                  key={p.id}
                  className={styles.relatedItem}
                  onClick={() => {
                    const newItem = addItem(p.id, p.variants[0].id)
                    setSelectedId(newItem.instanceId)
                  }}
                >
                  <img src={p.thumbnailUrl} alt={p.name} />
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Goes well with */}
        {goesWithProducts.length > 0 && (
          <div className={styles.section}>
            <button className={styles.swapBtn}><IconGoes /> Goes well with</button>
            <div className={styles.relatedGrid}>
              {goesWithProducts.slice(0, 4).map((p) => (
                <button
                  key={p.id}
                  className={styles.relatedItem}
                  onClick={() => {
                    const newItem = addItem(p.id, p.variants[0].id)
                    setSelectedId(newItem.instanceId)
                  }}
                >
                  <img src={p.thumbnailUrl} alt={p.name} />
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
