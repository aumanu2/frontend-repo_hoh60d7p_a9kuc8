import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, History } from 'lucide-react'
import Hero3D from './components/Hero3D'
import Scanner from './components/Scanner'
import MacroCalculator from './components/MacroCalculator'
import AuthBar from './components/AuthBar'
import { saveScan, loadRecentScans, watchUser } from './firebase'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export default function App() {
  const [user, setUser] = useState(null)
  const [parsed, setParsed] = useState(null)
  const [recent, setRecent] = useState([])

  useEffect(() => watchUser(setUser), [])
  useEffect(() => {
    if (user?.uid) {
      loadRecentScans(user.uid).then(setRecent)
    } else {
      setRecent([])
    }
  }, [user])

  async function handleParsed(p) {
    setParsed(p)
    if (user?.uid) {
      const id = await saveScan(user.uid, { parsed: p })
      const list = await loadRecentScans(user.uid, 10)
      setRecent(list)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Sparkles className="text-emerald-400" />
            <div className="text-xl font-semibold">Macro Vision</div>
          </div>
          <AuthBar />
        </div>

        <Hero3D />

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 120 }}>
            <div className="mb-3 text-lg font-semibold text-white">Scan a nutrition/vitals label</div>
            <Scanner onParsed={handleParsed} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 120, delay: 0.05 }}>
            <div className="mb-3 text-lg font-semibold text-white">Dynamic macros per amount</div>
            {parsed ? (
              <MacroCalculator data={parsed} />
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">No item yet. Upload a label photo to parse.</div>
            )}
          </motion.div>
        </div>

        <div className="mt-10">
          <div className="mb-3 flex items-center gap-2 text-white/80">
            <History size={16} />
            <div className="font-semibold">Recent scans</div>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {recent.map((r) => (
              <div key={r.id} className="rounded-xl border border-white/10 bg-white/5 p-4 text-white">
                <div className="text-sm font-medium">{r.parsed?.name || 'Item'}</div>
                <div className="text-xs text-white/60">{Object.keys(r.parsed?.per_100g || {}).slice(0,4).join(' • ')}</div>
              </div>
            ))}
            {recent.length === 0 && (
              <div className="text-white/50">{user ? 'No scans yet' : 'Sign in to save your scans'}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
