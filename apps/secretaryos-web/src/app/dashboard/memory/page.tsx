'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Brain,
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  User,
  Briefcase,
  Heart,
  MapPin,
  Clock,
  ChevronRight
} from 'lucide-react'

type MemoryCategory = 'personal' | 'work' | 'family' | 'preferences' | 'location' | 'availability'

interface MemoryItem {
  id: string
  category: MemoryCategory
  content: string
}

const categories: { id: MemoryCategory; label: string; icon: any; color: string }[] = [
  { id: 'personal', label: 'Sobre Mí', icon: User, color: 'bg-blue-100 text-blue-600' },
  { id: 'work', label: 'Trabajo', icon: Briefcase, color: 'bg-purple-100 text-purple-600' },
  { id: 'family', label: 'Familia', icon: Heart, color: 'bg-pink-100 text-pink-600' },
  { id: 'preferences', label: 'Preferencias', icon: Heart, color: 'bg-orange-100 text-orange-600' },
  { id: 'location', label: 'Ubicación', icon: MapPin, color: 'bg-green-100 text-green-600' },
  { id: 'availability', label: 'Disponibilidad', icon: Clock, color: 'bg-indigo-100 text-indigo-600' },
]

const initialMemories: MemoryItem[] = [
  { id: '1', category: 'personal', content: 'Me llamo Juan García, tengo 35 años' },
  { id: '2', category: 'personal', content: 'CEO de TechStart, una startup de SaaS B2B' },
  { id: '3', category: 'work', content: 'Trabajo en Torre Picasso, Madrid centro' },
  { id: '4', category: 'work', content: 'Prefiero reuniones por la mañana' },
  { id: '5', category: 'family', content: 'Mi mujer se llama Ana, trabaja como médica' },
  { id: '6', category: 'family', content: 'Dos hijos: Lucía (8 años) y Pablo (5 años)' },
  { id: '7', category: 'preferences', content: 'No bebo alcohol ni café' },
  { id: '8', category: 'availability', content: 'Ejercicio: Lunes y Miércoles 7:00-8:00' },
  { id: '9', category: 'location', content: 'Vivo en Chamberí, Madrid' },
]

export default function MemoryBankPage() {
  const [memories, setMemories] = useState<MemoryItem[]>(initialMemories)
  const [newContent, setNewContent] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<MemoryCategory>('personal')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [saving, setSaving] = useState(false)

  const addMemory = async () => {
    if (!newContent.trim()) return
    
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const newMemory: MemoryItem = {
      id: Date.now().toString(),
      category: selectedCategory,
      content: newContent.trim()
    }
    
    setMemories([...memories, newMemory])
    setNewContent('')
    setSaving(false)
  }

  const updateMemory = async (id: string) => {
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setMemories(memories.map(m => 
      m.id === id ? { ...m, content: editContent } : m
    ))
    setEditingId(null)
    setEditContent('')
    setSaving(false)
  }

  const deleteMemory = async (id: string) => {
    setMemories(memories.filter(m => m.id !== id))
  }

  const groupedMemories = categories.map(cat => ({
    ...cat,
    items: memories.filter(m => m.category === cat.id)
  }))

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <Brain className="w-8 h-8 text-brand-600" />
          Banco de Memoria
        </h1>
        <p className="text-slate-600 mt-1">
          Cuéntale a Secretary cosas sobre ti para personalizar sus respuestas
        </p>
      </div>

      {/* Add New Memory */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="font-semibold text-slate-900 mb-4">Añadir información</h2>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as MemoryCategory)}
            className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>
          
          <input
            type="text"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Ej: Prefiero reuniones cortas de 30 min"
            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
            onKeyDown={(e) => e.key === 'Enter' && addMemory()}
          />
          
          <button
            onClick={addMemory}
            disabled={!newContent.trim() || saving}
            className="px-6 py-3 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <span className="animate-pulse">Guardando...</span>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Añadir
              </>
            )}
          </button>
        </div>
      </div>

      {/* Memory Groups */}
      <div className="space-y-6">
        {groupedMemories.filter(g => g.items.length > 0).map((group) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm"
          >
            <div className="p-4 border-b flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${group.color}`}>
                <group.icon className="w-5 h-5" />
              </div>
              <h2 className="font-semibold text-slate-900">{group.label}</h2>
              <span className="text-sm text-slate-400">({group.items.length})</span>
            </div>
            
            <div className="divide-y">
              {group.items.map((item) => (
                <div key={item.id} className="p-4 flex items-start gap-4">
                  {editingId === item.id ? (
                    <>
                      <input
                        type="text"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && updateMemory(item.id)}
                      />
                      <button
                        onClick={() => updateMemory(item.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                      >
                        <Save className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="flex-1 text-slate-700">{item.content}</p>
                      <button
                        onClick={() => {
                          setEditingId(item.id)
                          setEditContent(item.content)
                        }}
                        className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteMemory(item.id)}
                        className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {memories.length === 0 && (
        <div className="text-center py-12">
          <Brain className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">Sin memorias todavía</h3>
          <p className="text-slate-500">Añade información sobre ti para que Secretary te conozca mejor</p>
        </div>
      )}
    </div>
  )
}
