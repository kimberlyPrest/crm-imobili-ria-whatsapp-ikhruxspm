import pb from '@/lib/pocketbase/client'
import { Lead, Agent, AgentConfig, Message } from '@/types/types'

export const api = {
  getLeads: () => pb.collection('leads').getFullList<Lead>({ sort: '-created' }),
  getAgents: () => pb.collection('agents').getFullList<Agent>({ sort: 'created' }),
  getAgentConfigs: () => pb.collection('agent_configs').getFullList<AgentConfig>(),
  updateAgent: (id: string, data: Partial<Agent>) => pb.collection('agents').update(id, data),
  updateAgentConfig: (id: string, data: Partial<AgentConfig>) =>
    pb.collection('agent_configs').update(id, data),
  getMessages: (leadId: string) =>
    pb.collection('messages').getFullList<Message>({
      filter: pb.filter('lead_id = {:leadId}', { leadId }),
      sort: 'created',
    }),
  createMessage: (data: Partial<Message>) => pb.collection('messages').create(data),
}
