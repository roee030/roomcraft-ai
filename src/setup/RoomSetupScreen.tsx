import { useState } from 'react'
import { motion } from 'framer-motion'
import { ROOM_PRESETS, WALL_COLORS, FLOOR_MATERIALS } from '../constants/rooms'
import { useRoomStore } from '../stores/roomStore'
import { useUiStore } from '../stores/uiStore'
import type { RoomConfig } from '../types'
import styles from './RoomSetupScreen.module.css'

const ROOM_ICONS: Record<string, string> = {
  'Living Room': '🛋️',
  'Bedroom': '🛏️',
  'Home Office': '💻',
  'Dining Room': '🍽️',
}

const STYLE_OPTIONS = [
  { id: 'modern', label: 'Modern', desc: 'Clean lines, neutral tones' },
  { id: 'scandinavian', label: 'Scandinavian', desc: 'Light, minimal, warm' },
  { id: 'industrial', label: 'Industrial', desc: 'Raw textures, metal accents' },
  { id: 'japandi', label: 'Japandi', desc: 'Zen minimalism meets Nordic' },
  { id: 'bohemian', label: 'Bohemian', desc: 'Eclectic, colorful, layered' },
]

export const RoomSetupScreen = () => {
  const setRoom = useRoomStore((s) => s.setRoom)
  const setScreen = useUiStore((s) => s.setScreen)

  const [selected, setSelected] = useState<RoomConfig>(ROOM_PRESETS[0])
  const [step, setStep] = useState<'room' | 'style' | 'color'>('room')

  const handleStart = () => {
    setRoom(selected)
    setScreen('planner')
  }

  return (
    <div className={styles.screen}>
      {/* Left — branding */}
      <div className={styles.left}>
        <div className={styles.brand}>
          <div className={styles.logo}>RC</div>
          <h1 className={styles.brandName}>RoomCraft AI</h1>
          <p className={styles.tagline}>Design your perfect space in 3D</p>
        </div>

        <div className={styles.steps}>
          {(['room', 'style', 'color'] as const).map((s, i) => (
            <div
              key={s}
              className={`${styles.step} ${step === s ? styles.stepActive : ''} ${
                ['room', 'style', 'color'].indexOf(step) > i ? styles.stepDone : ''
              }`}
              onClick={() => setStep(s)}
            >
              <div className={styles.stepNum}>{i + 1}</div>
              <span>{s === 'room' ? 'Choose room' : s === 'style' ? 'Pick style' : 'Set colors'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — config */}
      <div className={styles.right}>
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className={styles.panel}
        >
          {step === 'room' && (
            <>
              <h2 className={styles.panelTitle}>Which room are you designing?</h2>
              <div className={styles.roomGrid}>
                {ROOM_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    className={`${styles.roomCard} ${selected.name === preset.name ? styles.roomActive : ''}`}
                    onClick={() => setSelected({ ...preset })}
                  >
                    <span className={styles.roomIcon}>{ROOM_ICONS[preset.name] ?? '🏠'}</span>
                    <span className={styles.roomLabel}>{preset.name}</span>
                    <span className={styles.roomDims}>{preset.width}m × {preset.depth}m</span>
                  </button>
                ))}
              </div>
              <h3 className={styles.subTitle}>Room dimensions</h3>
              <div className={styles.dimRow}>
                <label className={styles.dimLabel}>
                  Width (m)
                  <input
                    type="number" min={2} max={12} step={0.5}
                    className={styles.dimInput}
                    value={selected.width}
                    onChange={(e) => setSelected((s) => ({ ...s, width: +e.target.value }))}
                  />
                </label>
                <label className={styles.dimLabel}>
                  Depth (m)
                  <input
                    type="number" min={2} max={12} step={0.5}
                    className={styles.dimInput}
                    value={selected.depth}
                    onChange={(e) => setSelected((s) => ({ ...s, depth: +e.target.value }))}
                  />
                </label>
                <label className={styles.dimLabel}>
                  Height (m)
                  <input
                    type="number" min={2.2} max={4} step={0.1}
                    className={styles.dimInput}
                    value={selected.height}
                    onChange={(e) => setSelected((s) => ({ ...s, height: +e.target.value }))}
                  />
                </label>
              </div>
              <button className={styles.nextBtn} onClick={() => setStep('style')}>
                Next: Pick style →
              </button>
            </>
          )}

          {step === 'style' && (
            <>
              <h2 className={styles.panelTitle}>Choose a design style</h2>
              <div className={styles.styleGrid}>
                {STYLE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    className={`${styles.styleCard} ${selected.style === opt.id ? styles.styleActive : ''}`}
                    onClick={() => setSelected((s) => ({ ...s, style: opt.id as RoomConfig['style'] }))}
                  >
                    <strong>{opt.label}</strong>
                    <span>{opt.desc}</span>
                  </button>
                ))}
              </div>
              <div className={styles.navRow}>
                <button className={styles.backBtn} onClick={() => setStep('room')}>← Back</button>
                <button className={styles.nextBtn} onClick={() => setStep('color')}>
                  Next: Colors →
                </button>
              </div>
            </>
          )}

          {step === 'color' && (
            <>
              <h2 className={styles.panelTitle}>Set your room colors</h2>
              <h3 className={styles.subTitle}>Wall color</h3>
              <div className={styles.colorGrid}>
                {WALL_COLORS.map((c) => (
                  <button
                    key={c.value}
                    className={`${styles.colorSwatch} ${selected.wallColor === c.value ? styles.colorActive : ''}`}
                    style={{ background: c.value }}
                    title={c.name}
                    onClick={() => setSelected((s) => ({ ...s, wallColor: c.value }))}
                  />
                ))}
              </div>

              <h3 className={styles.subTitle}>Floor material</h3>
              <div className={styles.floorGrid}>
                {FLOOR_MATERIALS.map((f) => (
                  <button
                    key={f.id}
                    className={`${styles.floorCard} ${selected.floorType === f.id ? styles.floorActive : ''}`}
                    onClick={() => setSelected((s) => ({ ...s, floorType: f.id as RoomConfig['floorType'] }))}
                  >
                    <div className={styles.floorSwatch} style={{ background: `linear-gradient(135deg, ${f.color} 50%, ${f.color2} 50%)` }} />
                    <span>{f.label}</span>
                  </button>
                ))}
              </div>

              <div className={styles.navRow}>
                <button className={styles.backBtn} onClick={() => setStep('style')}>← Back</button>
                <button className={styles.startBtn} onClick={handleStart}>
                  Start designing →
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}
