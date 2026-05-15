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
  agent: string
  neighborhood: string
  price_range: string
  created: string
  updated: string
}

export type AgentType = 'chefe' | 'vendas' | 'locacao' | 'juridico'

export interface Agent {
  id: string
  name: string
  type: AgentType
  active: boolean
  created: string
  updated: string
}

export interface AgentConfig {
  id: string
  agent_id: string
  prompt: string
  tone: string
  rules: string[]
  tools: string[]
  created: string
  updated: string
}

export interface MergedAgent extends Agent {
  configId: string
  prompt: string
  tone: string
  rules: string
  tools: string[]
}

export interface Message {
  id: string
  lead_id: string
  sender: 'user' | 'agent'
  text: string
  created: string
}

export interface Metric {
  id: string
  lead_id: string
  agent_id: string
  status: string
  response_time_seconds: number
  conversion_stage: string
  created: string
  updated: string
}
