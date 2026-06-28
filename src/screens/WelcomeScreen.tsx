import { useUiStore } from '../stores/uiStore'
import styles from './WelcomeScreen.module.css'

const IconScratch = () => (
  <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="6" width="36" height="36" rx="4" stroke="white" strokeWidth="3" fill="none"/>
    <path d="M6 20h36M20 6v36" stroke="white" strokeWidth="3"/>
    <rect x="22" y="22" width="10" height="8" rx="1" fill="white" opacity="0.8"/>
    <rect x="13" y="28" width="7" height="8" rx="1" fill="white" opacity="0.8"/>
  </svg>
)

const IconAI = () => (
  <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 4 L28 18 L42 24 L28 30 L24 44 L20 30 L6 24 L20 18 Z" fill="white" opacity="0.9"/>
    <circle cx="38" cy="10" r="3" fill="white" opacity="0.7"/>
    <circle cx="12" cy="36" r="2" fill="white" opacity="0.5"/>
  </svg>
)

const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
)

const CheckItem = ({ children }: { children: string }) => (
  <li className={styles.checkItem}>
    <span className={styles.checkMark}>✓</span>
    {children}
  </li>
)

export const WelcomeScreen = () => {
  const setScreen = useUiStore((s) => s.setScreen)

  return (
    <div className={styles.screen}>
      {/* Background decoration */}
      <div className={styles.bgDecor} aria-hidden />

      {/* Hero */}
      <header className={styles.hero}>
        <div className={styles.logoRow}>
          <div className={styles.logoMark} />
          <span className={styles.logoText}>RoomCraft AI</span>
        </div>
        <h1 className={styles.headline}>Design your perfect space</h1>
        <p className={styles.subline}>Start from scratch or let AI transform your room photo into a 3D layout</p>
      </header>

      {/* Cards */}
      <div className={styles.cards}>

        {/* Scratch card */}
        <div className={`${styles.card} ${styles.scratchCard}`} onClick={() => setScreen('setup')}>
          <div className={`${styles.cardIcon} ${styles.scratchIcon}`}>
            <IconScratch />
          </div>
          <h2 className={styles.cardTitle}>Plan from Scratch</h2>
          <p className={styles.cardDesc}>
            Choose your room size, pick furniture from the catalog, and arrange everything
            in a live 3D view — just like IKEA Kreativ.
          </p>
          <ul className={styles.features}>
            <CheckItem>Full 3D dollhouse view</CheckItem>
            <CheckItem>16+ furniture pieces</CheckItem>
            <CheckItem>Drag, rotate & customize</CheckItem>
          </ul>
          <button className={`${styles.btn} ${styles.scratchBtn}`}>
            Get Started <IconArrow />
          </button>
        </div>

        {/* Divider */}
        <div className={styles.divider}>
          <span>or</span>
        </div>

        {/* AI card */}
        <div className={`${styles.card} ${styles.aiCard}`} onClick={() => setScreen('ai-generate')}>
          <div className={`${styles.cardIcon} ${styles.aiIcon}`}>
            <IconAI />
          </div>
          <h2 className={styles.cardTitle}>Generate with AI</h2>
          <p className={styles.cardDesc}>
            Upload a photo of your empty room. Gemini AI analyzes the space, picks
            matching furniture, and arranges everything — ready to explore in 3D.
          </p>
          <ul className={styles.features}>
            <CheckItem>AI reads room dimensions</CheckItem>
            <CheckItem>Auto-selects furniture</CheckItem>
            <CheckItem>Powered by Gemini 1.5 Flash</CheckItem>
          </ul>
          <button className={`${styles.btn} ${styles.aiBtn}`}>
            Upload Photo <IconArrow />
          </button>
        </div>

      </div>

      <footer className={styles.footer}>
        Built with React Three Fiber · Gemini Vision · Open catalog
      </footer>
    </div>
  )
}
