import { useState } from 'react'
import { CATALOG } from '../../constants/catalog'
import { useUiStore } from '../../stores/uiStore'
import { useRoomStore } from '../../stores/roomStore'
import { ProductCard } from './ProductCard'
import styles from './ProductList.module.css'

const IconCart = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
  </svg>
)

export const ProductList = () => {
  const tab = useUiStore((s) => s.panelTab)
  const setTab = useUiStore((s) => s.setPanelTab)
  const favoriteIds = useUiStore((s) => s.favoriteIds)
  const placedItems = useRoomStore((s) => s.placedItems)
  const [search, setSearch] = useState('')

  const products = tab === 'favorites'
    ? CATALOG.filter((p) => favoriteIds.has(p.id))
    : CATALOG.filter((p) =>
        !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.subtitle.toLowerCase().includes(search.toLowerCase())
      )

  const total = placedItems.reduce((sum, item) => {
    const p = CATALOG.find((c) => c.id === item.productId)
    return sum + (p?.price ?? 0)
  }, 0)

  return (
    <div className={styles.panel}>
      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'list' ? styles.activeTab : ''}`}
          onClick={() => setTab('list')}
        >
          List
        </button>
        <button
          className={`${styles.tab} ${tab === 'favorites' ? styles.activeTab : ''}`}
          onClick={() => setTab('favorites')}
        >
          Favorites
          {favoriteIds.size > 0 && <span className={styles.badge}>{favoriteIds.size}</span>}
        </button>
      </div>

      {/* Search */}
      {tab === 'list' && (
        <div className={styles.searchWrap}>
          <svg className={styles.searchIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            className={styles.search}
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {/* Products */}
      <div className={styles.list}>
        {products.length === 0 ? (
          <div className={styles.empty}>
            {tab === 'favorites' ? 'No favorites yet. Click ♥ to save products.' : 'No products found.'}
          </div>
        ) : (
          products.map((p) => <ProductCard key={p.id} product={p} />)
        )}
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        {placedItems.length > 0 ? (
          <>
            <div className={styles.footerMeta}>
              <span className={styles.footerCount}>{placedItems.length} items in room</span>
              <span className={styles.footerTotal}>${total.toLocaleString()}</span>
            </div>
            <button className={styles.addAllBtn}>
              <IconCart />
              Add all to shopping bag
            </button>
          </>
        ) : (
          <p className={styles.emptyHint}>Click <strong>+</strong> on any product to place it in the room.</p>
        )}
      </div>
    </div>
  )
}
