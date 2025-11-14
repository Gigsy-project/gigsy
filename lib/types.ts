import type React from "react"
export type HelpCategory = {
  id: string
  title: string
  icon: React.ReactNode // Keep as ReactNode if icons are components
  description: string
  articles: HelpArticle[]
}

export type HelpArticle = {
  id: string
  title: string
  content: string
  tags: string[]
  helpful: number
  views: number
  categoryTitle?: string // Added for search results
}

export type FAQ = {
  id: string
  question: string
  answer: string
  category: string
}

export type Message = {
  id: number
  sender: "user" | "other" | "support"
  text: string
  timestamp: string
  hasAttachment?: boolean
}

export type Conversation = {
  id: number
  name: string
  lastMessage: string
  timestamp: string
  unread: boolean
  avatar?: string
  serviceId: number
}

export type Service = {
  id: number
  title: string
  date: string
  time: string
  location: string
  price: string
  status: "pending" | "confirmed" | "completed"
  description: string
}

// Provider type for ServiceBookingModal and ProviderProfileModal
export type Provider = {
  id: number
  name: string
  avatar: string
  rating?: number // Optional as not in all uses
  reviews?: number // Optional
  services: string[]
  location: string
  lastService?: string // Optional
  lastServiceDate?: string // Optional
  description?: string
  languages?: string[]
  experience?: string
  verified?: boolean
  joinDate?: string
}
