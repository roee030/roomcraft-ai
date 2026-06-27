import { useState, useRef, useCallback } from 'react'
import { useUiStore } from '../stores/uiStore'
import { useRoomStore } from '../stores/roomStore'
import { analyzeRoomWithGemini, getStoredApiKey, saveApiKey } from '../services/gemini'
import { CATALOG } from '../constants/catalog'
import type { AIDesignResult } from '../services/gemini'
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

// ── Loading steps ─────────────────────────────────────────────────────────────

const STEPS = [
  'Scanning room dimensions…',
  'Analyzing style and atmosphere…',
  'Selecting furniture from catalog…',
  'Creating your 3D design…',
]

// ── Component ─────────────────────────────────────────────────────────────────

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

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload an image file (JPG, PNG, or WEBP).')
      return
    }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setResult(null)
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

  const analyze = async () => {
    if (!imageFile) return
    if (!apiKey) { setShowKeyInput(true); return }

    setStatus('loading')
    setCurrentStep(0)
    setErrorMsg('')

    // Cycle through loading steps visually while Gemini processes
    const interval = setInterval(() => {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1))
    }, 1600)

    try {
      // Convert image to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const url = reader.result as string
          resolve(url.split(',')[1])  // strip the data URL prefix
        }
        reader.onerror = reject
        reader.readAsDataURL(imageFile)
      })

      const aiResult = await analyzeRoomWithGemini(base64, imageFile.type || 'image/jpeg')
      clearInterval(interval)
      setCurrentStep(STEPS.length - 1)
      await new Promise((r) => setTimeout(r, 400))
      setResult(aiResult)
      setStatus('done')
    } catch (err) {
      clearInterval(interval)
      const msg = String(err)
      if (msg.includes('NO_API_KEY')) {
        setShowKeyInput(true)
        setErrorMsg('Please enter your Gemini API key to continue.')
      } else if (msg.includes('API_KEY_INVALID') || msg.includes('401')) {
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

  return (
    <div className={styles.screen}>
      {/* Header */}
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

        {/* API key input */}
        {showKeyInput && (
          <div className={styles.keyBox}>
            <KeyIcon />
            <div className={styles.keyBody}>
              <p className={styles.keyTitle}>
                <IconKey /> Gemini API Key
              </p>
              <p className={styles.keyDesc}>
                Get a free key at{' '}
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer">
                  aistudio.google.com
                </a>
              </p>
              <div className={styles.keyRow}>
                <input
                  className={styles.keyInput}
                  type="password"
                  placeholder="AIza…"
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
            <IconKey /> Gemini API key configured
            <button className={styles.keyChangeBtn} onClick={() => { setShowKeyInput(true); setKeyDraft('') }}>
              Change
            </button>
          </div>
        )}

        {/* Upload area */}
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

        {/* Preview + action */}
        {imagePreview && status !== 'loading' && (
          <div className={styles.previewRow}>
            <div className={styles.previewWrap}>
              <img src={imagePreview} alt="Room to analyze" className={styles.preview} />
              <button
                className={styles.changePhoto}
                onClick={() => { setImagePreview(''); setImageFile(null); setResult(null); setStatus('idle') }}
              >
                Change photo
              </button>
            </div>
            {status !== 'done' && (
              <button className={styles.analyzeBtn} onClick={analyze} disabled={!imageFile}>
                <IconSparkle /> Analyze with Gemini
              </button>
            )}
          </div>
        )}

        {/* Error */}
        {errorMsg && <p className={styles.error}>{errorMsg}</p>}

        {/* Loading state */}
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

        {/* Results */}
        {status === 'done' && result && (
          <div className={styles.results}>
            <div className={styles.resultsHeader}>
              <div className={styles.sparkleTag}><IconSparkle /> AI Design Ready</div>
              <h2 className={styles.roomName}>{result.room.name}</h2>
              <div className={styles.roomMeta}>
                <span>📐 {result.room.width}m × {result.room.depth}m</span>
                <span>🎨 {result.room.floorType} floor</span>
                <span style={{ background: result.room.wallColor, border: '1px solid rgba(0,0,0,0.1)' }}
                      className={styles.wallSwatch} />
              </div>
            </div>

            <div className={styles.itemList}>
              <p className={styles.itemListTitle}>
                {result.placedItems.length} furniture pieces selected
              </p>
              {result.placedItems.map((item) => {
                const product = CATALOG.find((p) => p.id === item.productId)
                const variant = product?.variants.find((v) => v.id === item.variantId)
                return (
                  <div key={item.instanceId} className={styles.itemRow}>
                    <div className={styles.itemSwatch} style={{ background: variant?.color ?? '#ccc' }} />
                    <div className={styles.itemInfo}>
                      <span className={styles.itemName}>{product?.name} — {variant?.name}</span>
                      <span className={styles.itemReason}>{result.reasons[item.instanceId]}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            <button className={styles.openBtn} onClick={openInPlanner}>
              Open in 3D Planner <IconArrow />
            </button>
            <button className={styles.reanalyzeBtn} onClick={() => { setResult(null); setStatus('idle') }}>
              Try again with different photo
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

// tiny helper to satisfy TS — just an empty element (key icon already imported)
const KeyIcon = () => null
