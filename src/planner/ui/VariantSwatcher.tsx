import styles from './VariantSwatcher.module.css'
import type { ProductVariant } from '../../types'

interface Props {
  variants: ProductVariant[]
  activeId: string
  onChange: (variantId: string) => void
}

export const VariantSwatcher = ({ variants, activeId, onChange }: Props) => (
  <div className={styles.wrap}>
    {variants.map((v) => (
      <button
        key={v.id}
        className={`${styles.swatch} ${v.id === activeId ? styles.active : ''}`}
        style={{ '--color': v.color } as React.CSSProperties}
        title={v.name}
        onClick={() => onChange(v.id)}
      />
    ))}
  </div>
)
