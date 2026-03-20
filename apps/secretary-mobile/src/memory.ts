import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

export interface MemoryEntry {
  id: string
  type: 'fact' | 'preference' | 'contact' | 'routine' | 'note'
  content: string
  key?: string
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt: string
  confidence: number
}

export interface MemorySearchResult {
  entry: MemoryEntry
  score: number
}

export class MemoryManager {
  private memoryPath: string
  private memories: Map<string, MemoryEntry> = new Map()
  private isDirty = false

  constructor(dataDir?: string) {
    const baseDir = dataDir || join(process.env.HOME || '/tmp', '.secretary-mobile')
    const memDir = join(baseDir, 'memory')
    
    if (!existsSync(memDir)) {
      mkdirSync(memDir, { recursive: true })
    }
    
    this.memoryPath = join(memDir, 'memories.json')
    this.load()
  }

  private load(): void {
    try {
      if (existsSync(this.memoryPath)) {
        const data = readFileSync(this.memoryPath, 'utf-8')
        const entries: MemoryEntry[] = JSON.parse(data)
        this.memories.clear()
        entries.forEach(entry => {
          this.memories.set(entry.id, entry)
        })
      }
    } catch (error) {
      console.error('Failed to load memories:', error)
    }
  }

  private save(): void {
    if (!this.isDirty) return
    
    try {
      const entries = Array.from(this.memories.values())
      writeFileSync(this.memoryPath, JSON.stringify(entries, null, 2))
      this.isDirty = false
    } catch (error) {
      console.error('Failed to save memories:', error)
    }
  }

  add(type: MemoryEntry['type'], content: string, metadata?: Record<string, unknown>): MemoryEntry {
    const now = new Date().toISOString()
    const id = `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const entry: MemoryEntry = {
      id,
      type,
      content,
      metadata,
      createdAt: now,
      updatedAt: now,
      confidence: 1.0
    }
    
    this.memories.set(id, entry)
    this.isDirty = true
    this.save()
    
    return entry
  }

  update(id: string, content: string): boolean {
    const entry = this.memories.get(id)
    if (!entry) return false
    
    entry.content = content
    entry.updatedAt = new Date().toISOString()
    entry.confidence = Math.min(entry.confidence + 0.1, 1.0)
    
    this.isDirty = true
    this.save()
    
    return true
  }

  delete(id: string): boolean {
    const deleted = this.memories.delete(id)
    if (deleted) {
      this.isDirty = true
      this.save()
    }
    return deleted
  }

  get(id: string): MemoryEntry | undefined {
    return this.memories.get(id)
  }

  getAll(type?: MemoryEntry['type']): MemoryEntry[] {
    const entries = Array.from(this.memories.values())
    
    if (type) {
      return entries.filter(e => e.type === type)
    }
    
    return entries
  }

  search(query: string, limit = 5): MemorySearchResult[] {
    const queryLower = query.toLowerCase()
    const results: MemorySearchResult[] = []
    
    for (const entry of this.memories.values()) {
      const contentLower = entry.content.toLowerCase()
      
      let score = 0
      if (contentLower.includes(queryLower)) {
        score = queryLower.length / contentLower.length
      }
      
      if (entry.key && entry.key.toLowerCase().includes(queryLower)) {
        score = Math.max(score, 0.8)
      }
      
      if (score > 0) {
        results.push({ entry, score })
      }
    }
    
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
  }

  getFacts(): MemoryEntry[] {
    return this.getAll('fact')
  }

  getPreferences(): MemoryEntry[] {
    return this.getAll('preference')
  }

  getContacts(): MemoryEntry[] {
    return this.getAll('contact')
  }

  getContact(name: string): MemoryEntry | undefined {
    return this.getAll('contact').find(
      c => c.content.toLowerCase().includes(name.toLowerCase())
    )
  }

  addContact(name: string, details: string, metadata?: Record<string, unknown>): MemoryEntry {
    return this.add('contact', `${name}: ${details}`, metadata)
  }

  addPreference(key: string, value: string): MemoryEntry {
    const entry = this.add('preference', value, { key })
    return entry
  }

  getPreference(key: string): string | undefined {
    const pref = this.getAll('preference').find(p => p.metadata?.key === key)
    return pref?.content
  }

  addFact(fact: string, metadata?: Record<string, unknown>): MemoryEntry {
    return this.add('fact', fact, metadata)
  }

  addRoutine(name: string, schedule: string, actions: string): MemoryEntry {
    return this.add('routine', `${name} (${schedule}): ${actions}`)
  }

  addNote(content: string): MemoryEntry {
    return this.add('note', content)
  }

  exportMemory(): string {
    return JSON.stringify(Array.from(this.memories.values()), null, 2)
  }

  importMemory(data: string): number {
    try {
      const entries: MemoryEntry[] = JSON.parse(data)
      let imported = 0
      
      for (const entry of entries) {
        if (!this.memories.has(entry.id)) {
          this.memories.set(entry.id, entry)
          imported++
        }
      }
      
      if (imported > 0) {
        this.isDirty = true
        this.save()
      }
      
      return imported
    } catch (error) {
      console.error('Failed to import memories:', error)
      return 0
    }
  }

  clear(): void {
    this.memories.clear()
    this.isDirty = true
    this.save()
  }

  getStats(): { total: number; byType: Record<string, number> } {
    const stats = {
      total: this.memories.size,
      byType: {} as Record<string, number>
    }
    
    for (const entry of this.memories.values()) {
      stats.byType[entry.type] = (stats.byType[entry.type] || 0) + 1
    }
    
    return stats
  }
}
