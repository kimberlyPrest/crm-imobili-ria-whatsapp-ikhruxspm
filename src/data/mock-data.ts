import { Agent, Lead, LeadStatus, Message } from '@/types/types'

export const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'Chefe SDR',
    type: 'chefe',
    prompt: 'Você é o primeiro contato. Qualifique o lead identificando bairro e faixa de preço.',
    tone: 'Profissional e acolhedor',
    rules:
      'Sempre responda em menos de 1 minuto. Redirecione para Vendas ou Locação conforme o caso.',
    tools: ['Qualificação Básica', 'Redirecionamento'],
    active: true,
  },
  {
    id: '2',
    name: 'Agente Vendas',
    type: 'vendas',
    prompt: 'Você é especialista em vendas de imóveis.',
    tone: 'Persuasivo e atencioso',
    rules: 'Destaque valorização da região. Ofereça visita agendada.',
    tools: ['Consultar Imóveis', 'Agendar Visita'],
    active: true,
  },
  {
    id: '3',
    name: 'Agente Locação',
    type: 'locacao',
    prompt: 'Você é especialista em aluguéis rápidos.',
    tone: 'Dinâmico e prático',
    rules: 'Pergunte sobre garantias locatícias.',
    tools: ['Consultar Imóveis', 'Análise de Crédito'],
    active: false,
  },
  {
    id: '4',
    name: 'Jurídico',
    type: 'juridico',
    prompt: 'Você tira dúvidas contratuais.',
    tone: 'Sério e claro',
    rules: 'Não forneça aconselhamento jurídico, apenas oriente sobre contratos da imobiliária.',
    tools: ['Consultar Contratos', 'Emitir Boletos'],
    active: true,
  },
]

export const mockLeads: Lead[] = [
  {
    id: 'l1',
    phone: '11987654321',
    name: 'Ana Silva',
    status: 'em_atendimento',
    agentId: '1',
    neighborhood: 'Ponta da Praia',
    priceRange: 'R$ 500K-800K',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'l2',
    phone: '21987654321',
    name: 'Carlos Oliveira',
    status: 'novo',
    agentId: '1',
    neighborhood: 'Gonzaga',
    priceRange: 'R$ 300K-500K',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'l3',
    phone: '85987654321',
    name: 'Mariana Santos',
    status: 'negocio_fechado',
    agentId: '2',
    neighborhood: 'Boqueirão',
    priceRange: 'R$ 800K-1.2M',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
  {
    id: 'l4',
    phone: '11977777777',
    name: 'Roberto Almeida',
    status: 'perdido',
    agentId: '2',
    neighborhood: 'Vila Mathias',
    priceRange: 'R$ 200K-400K',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
]

export const mockMessages: Message[] = [
  {
    id: 'm1',
    leadId: 'l1',
    sender: 'user',
    text: 'Olá, gostaria de saber mais sobre apartamentos na Ponta da Praia.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: 'm2',
    leadId: 'l1',
    sender: 'agent',
    text: 'Olá Ana! Tudo bem? Sou o assistente da imobiliária. Temos ótimas opções na Ponta da Praia. Você busca algo até R$ 800 mil?',
    timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
  },
  {
    id: 'm3',
    leadId: 'l2',
    sender: 'user',
    text: 'Bom dia, vi um anúncio no Gonzaga.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
]

export const statusLabels: Record<LeadStatus, string> = {
  novo: 'Novo',
  em_atendimento: 'Em Atendimento',
  tentativa: 'Tentativa',
  visita_agendada: 'Visita Agendada',
  proposta: 'Proposta',
  negocio_fechado: 'Negócio Fechado',
  perdido: 'Perdido',
  no_show: 'No Show',
}

export const statusColors: Record<LeadStatus, string> = {
  novo: 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-none',
  em_atendimento: 'bg-purple-100 text-purple-800 hover:bg-purple-200 border-none',
  tentativa: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-none',
  visita_agendada: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200 border-none',
  proposta: 'bg-orange-100 text-orange-800 hover:bg-orange-200 border-none',
  negocio_fechado: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none',
  perdido: 'bg-red-100 text-red-800 hover:bg-red-200 border-none',
  no_show: 'bg-rose-100 text-rose-800 hover:bg-rose-200 border-none',
}
