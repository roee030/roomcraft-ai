import { useState, useRef, useCallback } from 'react'
import { useUiStore } from '../stores/uiStore'
import { useRoomStore } from '../stores/roomStore'
import { analyzeRoomWithAI, generateEditedRoomPhoto, getStoredApiKey, saveApiKey } from '../services/openai'
import { CATALOG } from '../constants/catalog'
import type { AIDesignResult } from '../services/openai'
import styles from './AIGenerateScreen.module.css'

// ── Icons ─────────────────────────────────────────────────────────────────────

const IconBack = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
)
const IconUpload = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polyline points="16 16 12 12 8 16"/>
    <line x1="12" y1="12" x2="12" y2="21"/>
    <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
  </svg>
)
const IconSparkle = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2z"/>
  </svg>
)
const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)
const IconKey = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
  </svg>
)
const IconX = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)
const Icon3D = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
  </svg>
)
const IconImage = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
)

// ── Loading steps ─────────────────────────────────────────────────────────────

const STEPS = [
  'Scanning room dimensions…',
  'Analyzing style and atmosphere…',
  'Selecting furniture from catalog…',
  'Creating your 3D layout…',
]

// ── Hotspot card ──────────────────────────────────────────────────────────────

interface HotspotInfo {
  instanceId: string
  index: number
  x: number
  y: number
  productId: string
  variantId: string
  reason: string
}

const HotspotCard = ({
  info,
  onClose,
  onOpenPlanner,
}: {
  info: HotspotInfo
  onClose: () => void
  onOpenPlanner: () => void
}) => {
  const product = CATALOG.find((p) => p.id === info.productId)
  const variant = product?.variants.find((v) => v.id === info.variantId)
  if (!product || !variant) return null

  const cardStyle: React.CSSProperties = {
    position: 'absolute',
    zIndex: 30,
    ...(info.x > 0.55
      ? { right: `calc(${(1 - info.x) * 100}% + 18px)` }
      : { left: `calc(${info.x * 100}% + 18px)` }),
    ...(info.y > 0.5
      ? { bottom: `calc(${(1 - info.y) * 100}% + 8px)` }
      : { top: `calc(${info.y * 100}% + 8px)` }),
  }

  return (
    <div style={cardStyle} className={styles.hotspotCard}>
      {/* Product photo */}
      <div className={styles.hotspotCardImgWrap}>
        <img
          src={product.thumbnailUrl}
          alt={product.name}
          className={styles.hotspotCardImgEl}
        />
        <div className={styles.hotspotCardImgVariant}>
          <span className={styles.hotspotCardColorDot} style={{ background: variant.color }} />
          {variant.name}
        </div>
        <button className={styles.hotspotCardClose} onClick={onClose}><IconX /></button>
      </div>

      <div className={styles.hotspotCardBody}>
        <div className={styles.hotspotCardHeader}>
          <div>
            <div className={styles.hotspotCardName}>{product.name}</div>
            <div className={styles.hotspotCardSubtitle}>{product.subtitle}</div>
          </div>
          <div className={styles.hotspotCardNum}>{info.index + 1}</div>
        </div>

        <div className={styles.hotspotCardReason}>"{info.reason}"</div>

        <div className={styles.hotspotCardFooter}>
          <span className={styles.hotspotCardPrice}>${product.price.toLocaleString()}</span>
          <button className={styles.hotspotCardCta} onClick={onOpenPlanner}>
            <Icon3D /> View in 3D
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Photo with hotspot overlay ────────────────────────────────────────────────

const PhotoHotspots = ({
  src,
  isGenerating,
  result,
  onOpenPlanner,
  onChangePhoto,
}: {
  src: string
  isGenerating: boolean
  result: AIDesignResult
  onOpenPlanner: () => void
  onChangePhoto: () => void
}) => {
  const [activeId, setActiveId] = useState<string | null>(null)

  const hotspots: HotspotInfo[] = result.placedItems.map((item, index) => ({
    instanceId: item.instanceId,
    index,
    x: result.photoPositions[item.instanceId]?.x ?? 0.5,
    y: result.photoPositions[item.instanceId]?.y ?? 0.5,
    productId: item.productId,
    variantId: item.variantId,
    reason: result.reasons[item.instanceId] ?? '',
  }))

  const activeInfo = hotspots.find((h) => h.instanceId === activeId) ?? null

  return (
    <div className={styles.photoOverlayWrap}>
      <img
        src={src}
        alt="Room design"
        className={`${styles.overlayPhoto} ${isGenerating ? styles.photoGenerating : ''}`}
      />

      <button className={styles.changePhoto} onClick={onChangePhoto}>Change photo</button>

      {/* Generating overlay */}
      {isGenerating && (
        <div className={styles.generatingOverlay}>
          <div className={styles.genSpinner} />
          <div className={styles.genText}>
            <span className={styles.genTitle}>AI is staging your room…</span>
            <span className={styles.genSub}>Placing furniture into the photo</span>
          </div>
          <div className={styles.genBar}>
            <div className={styles.genBarFill} />
          </div>
        </div>
      )}

      {/* Hotspot dots — always visible */}
      {!isGenerating && hotspots.map((h) => (
        <button
          key={h.instanceId}
          className={`${styles.hotspot} ${activeId === h.instanceId ? styles.hotspotActive : ''}`}
          style={{ left: `${h.x * 100}%`, top: `${h.y * 100}%` }}
          onClick={() => setActiveId(activeId === h.instanceId ? null : h.instanceId)}
        >
          <span className={styles.hotspotRing} />
          <span className={styles.hotspotRing2} />
          <span className={styles.hotspotDot}>
            <span className={styles.hotspotNum}>{h.index + 1}</span>
          </span>
        </button>
      ))}

      {activeInfo && (
        <HotspotCard
          info={activeInfo}
          onClose={() => setActiveId(null)}
          onOpenPlanner={onOpenPlanner}
        />
      )}

      {/* Bottom hint */}
      {!isGenerating && (
        <div className={styles.hotspotHint}>
          <IconSparkle /> Tap the dots to explore furniture
        </div>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

type Status = 'idle' | 'loading' | 'done' | 'error'

export const AIGenerateScreen = () => {
  const setScreen = useUiStore((s) => s.setScreen)
  const loadAIDesign = useRoomStore((s) => s.loadAIDesign)

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [isDragOver, setIsDragOver] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [currentStep, setCurrentStep] = useState(0)
  const [result, setResult] = useState<AIDesignResult | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [apiKey, setApiKey] = useState(getStoredApiKey())
  const [showKeyInput, setShowKeyInput] = useState(!getStoredApiKey())
  const [keyDraft, setKeyDraft] = useState('')
  const [generatedPhoto, setGeneratedPhoto] = useState<string | null>(null)
  const [isGeneratingPhoto, setIsGeneratingPhoto] = useState(false)
  // store base64 so Phase 2 can use it
  const base64Ref = useRef<string>('')
  const mimeRef = useRef<string>('image/jpeg')

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload an image file (JPG, PNG, or WEBP).')
      return
    }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setResult(null)
    setGeneratedPhoto(null)
    setStatus('idle')
    setErrorMsg('')
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }, [])

  const saveKey = () => {
    if (!keyDraft.trim()) return
    saveApiKey(keyDraft)
    setApiKey(keyDraft.trim())
    setShowKeyInput(false)
    setKeyDraft('')
  }

  const fileInputRef = useRef<HTMLInputElement>(null)

  const analyze = async () => {
    if (!imageFile) return
    if (!apiKey) { setShowKeyInput(true); return }

    setStatus('loading')
    setCurrentStep(0)
    setErrorMsg('')
    setGeneratedPhoto(null)

    const interval = setInterval(() => {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1))
    }, 1800)

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve((reader.result as string).split(',')[1])
        reader.onerror = reject
        reader.readAsDataURL(imageFile)
      })
      base64Ref.current = base64
      mimeRef.current = imageFile.type || 'image/jpeg'

      // ── Phase 1: analyze ──────────────────────────────────────────────────
      const aiResult = await analyzeRoomWithAI(base64, mimeRef.current)
      clearInterval(interval)
      setCurrentStep(STEPS.length - 1)
      await new Promise((r) => setTimeout(r, 300))
      setResult(aiResult)
      setStatus('done')

      // ── Phase 2: edit the photo (non-blocking) ────────────────────────────
      setIsGeneratingPhoto(true)
      generateEditedRoomPhoto(base64, mimeRef.current, aiResult)
        .then((b64) => setGeneratedPhoto(`data:image/png;base64,${b64}`))
        .catch((err) => console.warn('Photo edit skipped:', err))
        .finally(() => setIsGeneratingPhoto(false))

    } catch (err) {
      clearInterval(interval)
      const msg = String(err)
      if (msg.includes('NO_API_KEY')) {
        setShowKeyInput(true)
        setErrorMsg('Please enter your OpenAI API key to continue.')
      } else if (msg.includes('401') || msg.includes('Incorrect API key')) {
        setShowKeyInput(true)
        setErrorMsg('Invalid API key. Please check and try again.')
      } else {
        setErrorMsg(msg.replace('Error: ', ''))
      }
      setStatus('error')
    }
  }

  const openInPlanner = () => {
    if (!result) return
    loadAIDesign(result.room, result.placedItems)
    setScreen('planner')
  }

  const resetToUpload = () => {
    setImagePreview('')
    setImageFile(null)
    setResult(null)
    setGeneratedPhoto(null)
    setIsGeneratingPhoto(false)
    setStatus('idle')
    setErrorMsg('')
  }

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => setScreen('welcome')}>
          <IconBack /> Back
        </button>
        <div className={styles.headerTitle}>
          <IconSparkle />
          <span>Generate with AI</span>
        </div>
        <div style={{ width: 80 }} />
      </header>

      <div className={styles.content}>

        {/* API key */}
        {showKeyInput && (
          <div className={styles.keyBox}>
            <div className={styles.keyBody}>
              <p className={styles.keyTitle}><IconKey /> OpenAI API Key</p>
              <p className={styles.keyDesc}>
                Get a key at{' '}
                <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer">
                  platform.openai.com
                </a>
              </p>
              <div className={styles.keyRow}>
                <input
                  className={styles.keyInput}
                  type="password"
                  placeholder="sk-proj-…"
                  value={keyDraft}
                  onChange={(e) => setKeyDraft(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveKey()}
                />
                <button className={styles.keySaveBtn} onClick={saveKey}>Save</button>
              </div>
            </div>
          </div>
        )}

        {!showKeyInput && apiKey && (
          <div className={styles.keyStatus}>
            <IconKey /> OpenAI API key configured
            <button className={styles.keyChangeBtn} onClick={() => { setShowKeyInput(true); setKeyDraft('') }}>
              Change
            </button>
          </div>
        )}

        {/* Upload */}
        {!imagePreview && (
          <div
            className={`${styles.dropZone} ${isDragOver ? styles.dragOver : ''}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={onDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              style={{ display: 'none' }}
              onChange={onFileChange}
            />
            <div className={styles.dropIcon}><IconUpload /></div>
            <p className={styles.dropTitle}>Drop your room photo here</p>
            <p className={styles.dropSub}>or click to browse · JPG, PNG, WEBP</p>
          </div>
        )}

        {/* Preview before analyze */}
        {imagePreview && status === 'idle' && (
          <div className={styles.previewRow}>
            <div className={styles.previewWrap}>
              <img src={imagePreview} alt="Room" className={styles.preview} />
              <button className={styles.changePhoto} onClick={resetToUpload}>Change photo</button>
            </div>
            <button className={styles.analyzeBtn} onClick={analyze} disabled={!imageFile}>
              <IconSparkle /> Analyze &amp; Design with AI
            </button>
          </div>
        )}

        {/* Error */}
        {errorMsg && <p className={styles.error}>{errorMsg}</p>}

        {/* Loading Phase 1 */}
        {status === 'loading' && (
          <div className={styles.loadingBox}>
            <div className={styles.loadingSpinner} />
            <div className={styles.steps}>
              {STEPS.map((step, i) => (
                <div
                  key={step}
                  className={`${styles.step} ${i < currentStep ? styles.stepDone : ''} ${i === currentStep ? styles.stepActive : ''}`}
                >
                  <div className={styles.stepDot} />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Result */}
        {status === 'done' && result && (
          <div className={styles.resultWrap}>

            <div className={styles.resultHeader}>
              <div className={styles.sparkleTag}><IconSparkle /> AI Design Ready</div>
              <h2 className={styles.roomName}>{result.room.name}</h2>
              <div className={styles.roomMeta}>
                <span>📐 {result.room.width}m × {result.room.depth}m</span>
                <span>🎨 {result.room.floorType} floor</span>
                <span
                  className={styles.wallSwatch}
                  style={{ background: result.room.wallColor, border: '1px solid rgba(0,0,0,0.1)' }}
                />
              </div>
            </div>

            {/* Phase tag */}
            {isGeneratingPhoto ? (
              <div className={styles.phaseTag}>
                <div className={styles.phaseDot} />
                Phase 2 — AI is editing the photo with your furniture…
              </div>
            ) : generatedPhoto ? (
              <div className={styles.phaseTagDone}>
                <IconImage /> Room staged! Tap dots to explore items.
              </div>
            ) : null}

            {/* Photo with hotspot overlay */}
            <PhotoHotspots
              src={generatedPhoto || imagePreview}
              isGenerating={isGeneratingPhoto}
              result={result}
              onOpenPlanner={openInPlanner}
              onChangePhoto={resetToUpload}
            />

            {/* Legend */}
            <div className={styles.legend}>
              {result.placedItems.map((item, index) => {
                const product = CATALOG.find((p) => p.id === item.productId)
                const variant = product?.variants.find((v) => v.id === item.variantId)
                return (
                  <div key={item.instanceId} className={styles.legendRow}>
                    <div className={styles.legendNum}>{index + 1}</div>
                    <div className={styles.legendSwatch} style={{ background: variant?.color ?? '#ccc' }} />
                    <div className={styles.legendInfo}>
                      <span className={styles.legendName}>{product?.name} — {variant?.name}</span>
                    </div>
                    <span className={styles.legendPrice}>${product?.price.toLocaleString()}</span>
                  </div>
                )
              })}
            </div>

            <button className={styles.openBtn} onClick={openInPlanner}>
              Open in 3D Planner <IconArrow />
            </button>
            <button className={styles.reanalyzeBtn} onClick={resetToUpload}>
              Try with a different photo
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
