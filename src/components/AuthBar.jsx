import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { LogIn, LogOut, User } from 'lucide-react'
import { signIn, signOut, watchUser } from '../firebase'

export default function AuthBar() {
  const [user, setUser] = useState(null)
  useEffect(() => watchUser(setUser), [])

  return (
    <div className="flex items-center gap-3 text-white">
      {user ? (
        <>
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
            <User size={16} />
            <div className="text-sm">{user.displayName || user.email}</div>
          </div>
          <button onClick={signOut} className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 hover:bg-white/20">
            <LogOut size={16} />
            Sign out
          </button>
        </>
      ) : (
        <button onClick={signIn} className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 hover:bg-white/20">
          <LogIn size={16} />
          Sign in with Google
        </button>
      )}
    </div>
  )
}
