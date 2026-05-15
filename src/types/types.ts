export interface User {
  id: string
  email: string
  role: 'admin'
  name: string
}

export type LeadStatus =
  | 'novo'
  | 'em_atendimento'
  | 'tentativa'
  | 'visita_agendada'
  | 'proposta'
  | 'negocio_fechado'
  | 'perdido'
  | 'no_show'

export interface Lead {
  id: string
  phone: string
  name: string
  status: LeadStatus
  agentId: string
  neighborhood: string
  priceRange: string
  createdAt: string
  updatedAt: string
}

export type AgentType = 'chefe' | 'vendas' | 'locacao' | 'juridico'

export interface Agent {
  id: string
  name: string
  type: AgentType
  prompt: string
  tone: string
  rules: string
  tools: string[]
  active: boolean
}

export interface Message {
  id: string
  leadId: string
  sender: 'user' | 'agent'
  text: string
  timestamp: string
}

export interface Metric {
  leadId: string
  agentId: string
  status: string
  responseTime: number
  conversionRate: number
}
