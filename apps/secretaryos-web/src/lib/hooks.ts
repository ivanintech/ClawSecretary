'use client'

import { useState, useEffect } from 'react'
import type { Activity, DeviceStatus, UserStats } from './types'

interface DashboardData {
  activities: Activity[]
  device: DeviceStatus
  stats: UserStats
  gatewayConnected: boolean
}

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/status')
      const json = await res.json()
      
      if (json.success) {
        setData({
          activities: json.data.activities || [],
          device: json.data.device,
          stats: json.data.stats,
          gatewayConnected: json.data.gateway?.connected || false,
        })
      }
    } catch (err) {
      setError('Error fetching dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return { data, loading, error, refetch: fetchData }
}

export function useMemories() {
  const [memories, setMemories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMemories = async () => {
    try {
      const res = await fetch('/api/memories')
      const json = await res.json()
      if (json.success) {
        setMemories(json.data || [])
      }
    } catch (err) {
      console.error('Error fetching memories:', err)
    } finally {
      setLoading(false)
    }
  }

  const addMemory = async (category: string, content: string) => {
    const res = await fetch('/api/memories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, content }),
    })
    const json = await res.json()
    if (json.success) {
      setMemories(prev => [...prev, json.data])
    }
    return json.success
  }

  const deleteMemory = async (id: string) => {
    const res = await fetch(`/api/memories?id=${id}`, { method: 'DELETE' })
    const json = await res.json()
    if (json.success) {
      setMemories(prev => prev.filter(m => m.id !== id))
    }
    return json.success
  }

  useEffect(() => {
    fetchMemories()
  }, [])

  return { memories, loading, addMemory, deleteMemory, refetch: fetchMemories }
}

export function useRoutines() {
  const [routines, setRoutines] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRoutines = async () => {
    try {
      const res = await fetch('/api/routines')
      const json = await res.json()
      if (json.success) {
        setRoutines(json.data || [])
      }
    } catch (err) {
      console.error('Error fetching routines:', err)
    } finally {
      setLoading(false)
    }
  }

  const addRoutine = async (routine: any) => {
    const res = await fetch('/api/routines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(routine),
    })
    const json = await res.json()
    if (json.success) {
      setRoutines(prev => [...prev, json.data])
    }
    return json.success
  }

  const updateRoutine = async (id: string, updates: any) => {
    const res = await fetch('/api/routines', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
    })
    const json = await res.json()
    if (json.success) {
      setRoutines(prev => prev.map(r => r.id === id ? json.data : r))
    }
    return json.success
  }

  const deleteRoutine = async (id: string) => {
    const res = await fetch(`/api/routines?id=${id}`, { method: 'DELETE' })
    const json = await res.json()
    if (json.success) {
      setRoutines(prev => prev.filter(r => r.id !== id))
    }
    return json.success
  }

  useEffect(() => {
    fetchRoutines()
  }, [])

  return { routines, loading, addRoutine, updateRoutine, deleteRoutine, refetch: fetchRoutines }
}

export function useInstallToken() {
  const [token, setToken] = useState<{ token: string; expiresAt: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const generateToken = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/install/generate', { method: 'POST' })
      const json = await res.json()
      if (json.success) {
        setToken(json.data)
      }
    } catch (err) {
      console.error('Error generating token:', err)
    } finally {
      setLoading(false)
    }
  }

  return { token, loading, generateToken }
}
