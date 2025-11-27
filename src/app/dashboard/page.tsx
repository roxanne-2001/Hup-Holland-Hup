'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../components/Navbar'

interface UserData {
  id?: number
  email?: string
  company_name?: string
  industry?: string
}

interface SavedOpportunity {
  id: number
  funding_name: string
  funding_type: string
  funding_amount: string | null
  description: string | null
  match_score: number | null
  saved_at: string
}

interface ChatMessage {
  id: number
  message: string
  response: string
  created_at: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'saved' | 'chat'>('overview')
  
  // Saved opportunities state
  const [savedOpportunities, setSavedOpportunities] = useState<SavedOpportunity[]>([])
  const [loadingSaved, setLoadingSaved] = useState(false)
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/me', { method: 'GET' })
        if (!response.ok) {
          router.push('/login')
          return
        }
        const userData = await response.json()
        setUser(userData)
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  useEffect(() => {
    if (activeTab === 'saved') {
      loadSavedOpportunities()
    } else if (activeTab === 'chat') {
      loadChatHistory()
    }
  }, [activeTab])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  async function loadSavedOpportunities() {
    setLoadingSaved(true)
    try {
      const response = await fetch('/api/saved-opportunities')
      if (response.ok) {
        const data = await response.json()
        setSavedOpportunities(data.opportunities || [])
      }
    } catch (error) {
      console.error('Error loading saved opportunities:', error)
    } finally {
      setLoadingSaved(false)
    }
  }

  async function deleteSavedOpportunity(id: number) {
    try {
      const response = await fetch(`/api/saved-opportunities?id=${id}`, { method: 'DELETE' })
      if (response.ok) {
        setSavedOpportunities(prev => prev.filter(opp => opp.id !== id))
      }
    } catch (error) {
      console.error('Error deleting opportunity:', error)
    }
  }

  async function loadChatHistory() {
    try {
      const response = await fetch('/api/chat')
      if (response.ok) {
        const data = await response.json()
        setChatMessages(data.messages || [])
      }
    } catch (error) {
      console.error('Error loading chat history:', error)
    }
  }

  async function sendChatMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!chatInput.trim() || sendingMessage) return

    const userMessage = chatInput.trim()
    setChatInput('')
    setSendingMessage(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      })

      if (response.ok) {
        const data = await response.json()
        setChatMessages(prev => [...prev, {
          id: data.id,
          message: data.message,
          response: data.response,
          created_at: new Date().toISOString(),
        }])
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSendingMessage(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4">
            <svg className="animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-gray-600 text-lg">Aan het laden...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Welkom, {user.company_name}
          </h1>
          <p className="text-gray-600 text-lg">Beheer je startup profiel en funding mogelijkheden</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-4 px-6 font-semibold transition ${
              activeTab === 'overview'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-600 hover:text-indigo-600'
            }`}
          >
            Overzicht
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`pb-4 px-6 font-semibold transition ${
              activeTab === 'saved'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-600 hover:text-indigo-600'
            }`}
          >
            Opgeslagen ({savedOpportunities.length})
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`pb-4 px-6 font-semibold transition ${
              activeTab === 'chat'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-600 hover:text-indigo-600'
            }`}
          >
            AI Assistent
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-indigo-600 hover:shadow-xl transition">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Profiel</h3>
                <p className="text-gray-600 mb-2">{user.email}</p>
                <p className="text-sm text-gray-500">Sector: {user.industry || 'Niet ingesteld'}</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-purple-600 hover:shadow-xl transition">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Opgeslagen</h3>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  {savedOpportunities.length}
                </div>
                <p className="text-gray-600 text-sm">Funding opportunities</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-green-600 hover:shadow-xl transition">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-600 to-teal-600 rounded-xl mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Chat Berichten</h3>
                <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-2">
                  {chatMessages.length}
                </div>
                <p className="text-gray-600 text-sm">AI gesprekken</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Snelle Acties</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Link href="/recommendations">
                  <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition transform hover:scale-105">
                    Vind Nieuwe Matches
                  </button>
                </Link>
                <Link href="/funding">
                  <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition transform hover:scale-105">
                    Browse Alle Funding
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Saved Opportunities Tab */}
        {activeTab === 'saved' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Opgeslagen Funding Opportunities</h2>
            
            {loadingSaved ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 mx-auto mb-4">
                  <svg className="animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <p className="text-gray-600">Aan het laden...</p>
              </div>
            ) : savedOpportunities.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
                <p className="text-gray-600 text-lg mb-4">Je hebt nog geen opportunities opgeslagen</p>
                <Link href="/funding">
                  <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition">
                    Browse Funding Opportunities
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {savedOpportunities.map((opp) => (
                  <div key={opp.id} className="border-l-4 border-indigo-600 p-6 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-xl hover:shadow-lg transition">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900">{opp.funding_name}</h3>
                        <p className="text-sm text-indigo-600 font-semibold mt-2">{opp.funding_type}</p>
                        {opp.funding_amount && (
                          <p className="text-sm text-gray-600 mt-1">Bedrag: {opp.funding_amount}</p>
                        )}
                        {opp.description && (
                          <p className="text-sm text-gray-600 mt-2">{opp.description}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-3">
                          Opgeslagen: {new Date(opp.saved_at).toLocaleDateString('nl-NL')}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 ml-4">
                        {opp.match_score && (
                          <div className="text-right bg-indigo-100 rounded-lg p-4">
                            <div className="text-2xl font-bold text-indigo-600">{opp.match_score}%</div>
                            <p className="text-xs text-gray-600">Match</p>
                          </div>
                        )}
                        <button
                          onClick={() => deleteSavedOpportunity(opp.id)}
                          className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition"
                          title="Verwijder"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AI Chat Tab */}
        {activeTab === 'chat' && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
              <h2 className="text-2xl font-bold text-white mb-2">AI Funding Assistent</h2>
              <p className="text-indigo-100">Stel vragen over funding, pitch tips, en meer!</p>
            </div>
            
            <div className="h-[500px] overflow-y-auto p-6 bg-gray-50">
              {chatMessages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 text-lg mb-2">Start een gesprek!</p>
                  <p className="text-gray-500 text-sm">Stel me vragen over funding, pitch tips, of het aanvraag proces</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {chatMessages.map((msg) => (
                    <div key={msg.id}>
                      {/* User message */}
                      <div className="flex justify-end mb-2">
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl rounded-tr-none px-6 py-3 max-w-[70%]">
                          <p>{msg.message}</p>
                        </div>
                      </div>
                      {/* AI response */}
                      <div className="flex justify-start">
                        <div className="bg-white border-2 border-gray-200 rounded-2xl rounded-tl-none px-6 py-3 max-w-[70%]">
                          <p className="text-gray-800">{msg.response}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              )}
            </div>

            <form onSubmit={sendChatMessage} className="p-6 bg-white border-t border-gray-200">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Stel een vraag over funding..."
                  className="flex-1 border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-indigo-600 focus:outline-none"
                  disabled={sendingMessage}
                />
                <button
                  type="submit"
                  disabled={sendingMessage || !chatInput.trim()}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sendingMessage ? 'Verzenden...' : 'Verstuur'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
