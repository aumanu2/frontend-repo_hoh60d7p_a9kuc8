import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Image as ImageIcon, Loader2, ScanLine, Trash2 } from 'lucide-react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || ''

export default function Scanner({ onParsed }) {
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef()

  useEffect(() => {
    if (!image) return
    const url = URL.createObjectURL(image)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [image])

  const handlePick = () => inputRef.current?.click()

  async function parse() {
    if (!image) return
    setLoading(true)
    const b64 = await fileToBase64(image)
    const clean = b64.replace(/^data:[^;]+;base64,/, '')
    const res = await fetch(`${BACKEND_URL}/api/parse-label`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_base64: clean, label_type: 'nutrition' })
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) {
      alert(data.detail || 'Failed to parse')
      return
    }
    onParsed?.(data)
  }

  return (
    <div className="space-y-4">
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => setImage(e.target.files?.[0] || null)} />

      <div className="flex items-center gap-3">
        <button onClick={handlePick} className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-white backdrop-blur hover:bg-white/20 transition">
          <Camera size={18} />
          Upload Label Photo
        </button>
        {image && (
          <button onClick={() => setImage(null)} className="rounded-xl bg-red-500/80 px-3 py-2 text-white hover:bg-red-500 flex items-center gap-2">
            <Trash2 size={16} />
            Clear
          </button>
        )}
        <button disabled={!image || loading} onClick={parse} className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-white disabled:opacity-50">
          {loading ? <Loader2 className="animate-spin" size={16} /> : <ScanLine size={18} />}
          Parse
        </button>
      </div>

      <AnimatePresence>
        {preview && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <div className="grid grid-cols-2 gap-0">
              <img src={preview} alt="preview" className="h-full w-full object-cover" />
              <div className="p-4 text-white">
                <div className="mb-1 text-xs uppercase tracking-widest text-white/60">Status</div>
                <div className="text-sm text-white/90">Ready to parse with Gemini</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
