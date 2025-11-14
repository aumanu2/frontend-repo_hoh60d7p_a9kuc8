import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'

function round(v) { return Math.round((v + Number.EPSILON) * 100) / 100 }

export default function MacroCalculator({ data = {}, onAmountChange }) {
  const [amount, setAmount] = useState(100)

  const per100 = data?.per_100g || {}
  const name = data?.name || 'Unknown item'

  const scaled = useMemo(() => {
    const factor = (amount || 0) / 100
    const out = {}
    Object.entries(per100).forEach(([k, v]) => {
      if (typeof v === 'number') out[k] = round(v * factor)
    })
    return out
  }, [per100, amount])

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-white/60">Item</div>
          <div className="text-lg font-semibold">{name}</div>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-widest text-white/60">Amount (g)</div>
          <input
            type="number"
            min={0}
            className="mt-1 w-28 rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-right outline-none backdrop-blur"
            value={amount}
            onChange={e => { const v = Number(e.target.value); setAmount(v); onAmountChange?.(v) }}
          />
        </div>
      </div>

      <motion.div layout className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Object.entries(scaled).map(([k, v]) => (
          <motion.div key={k} layout className="rounded-xl bg-black/20 p-3">
            <div className="text-xs uppercase tracking-widest text-white/60">{labelMap[k] || k}</div>
            <div className="text-lg font-semibold">{v}</div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

const labelMap = {
  calories_kcal: 'Calories (kcal)',
  protein_g: 'Protein (g)',
  carbs_g: 'Carbs (g)',
  sugar_g: 'Sugar (g)',
  fiber_g: 'Fiber (g)',
  fat_g: 'Fat (g)',
  saturated_fat_g: 'Sat Fat (g)',
  sodium_mg: 'Sodium (mg)',
  potassium_mg: 'Potassium (mg)',
  cholesterol_mg: 'Cholesterol (mg)',
  calcium_mg: 'Calcium (mg)',
  iron_mg: 'Iron (mg)',
}
