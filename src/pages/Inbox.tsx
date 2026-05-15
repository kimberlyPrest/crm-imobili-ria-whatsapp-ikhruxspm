import { useState, useMemo, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Search, Send, Bot, User, Loader2 } from 'lucide-react'
import { Lead, Message } from '@/types/types'
import { api } from '@/services/api'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import { statusColors, statusLabels } from '@/pages/Dashboard'

export default function Inbox() {
  const [search, setSearch] = useState('')
  const [leads, setLeads] = useState<Lead[]>([])
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageInput, setMessageInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const data = await api.getLeads()
        setLeads(data)
        if (data.length > 0) setSelectedLead(data[0])
      } catch (error) {
        toast({ title: 'Erro', description: 'Erro ao carregar leads.', variant: 'destructive' })
      } finally {
        setLoading(false)
      }
    }
    fetchLeads()
  }, [toast])

  useEffect(() => {
    if (!selectedLead) return
    const fetchMessages = async () => {
      try {
        const data = await api.getMessages(selectedLead.id)
        setMessages(data)
      } catch (error) {
        toast({ title: 'Erro', description: 'Erro ao carregar mensagens.', variant: 'destructive' })
      }
    }
    fetchMessages()
  }, [selectedLead, toast])

  const filteredLeads = useMemo(() => {
    return leads.filter(
      (l) => l.name.toLowerCase().includes(search.toLowerCase()) || l.phone.includes(search),
    )
  }, [search, leads])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageInput.trim() || !selectedLead || !user) return

    try {
      setSending(true)
      const newMsg = await api.createMessage({
        lead_id: selectedLead.id,
        user_id: user.id,
        sender: 'agent',
        text: messageInput.trim(),
        agent_type: selectedLead.agent,
      })
      setMessages([...messages, newMsg])
      setMessageInput('')
    } catch (error) {
      toast({ title: 'Erro', description: 'Erro ao enviar mensagem.', variant: 'destructive' })
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-background rounded-xl border shadow-sm overflow-hidden animate-fade-in">
      <div className="grid md:grid-cols-[300px_1fr] lg:grid-cols-[350px_1fr] h-full">
        {/* Left Column: List */}
        <div className="flex flex-col border-r bg-muted/10 h-full">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar leads..."
                className="pl-8 bg-background"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {filteredLeads.map((lead) => (
                <button
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className={`w-full text-left p-3 rounded-lg transition-colors hover:bg-accent ${selectedLead?.id === lead.id ? 'bg-accent' : 'bg-transparent'}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-semibold text-sm truncate">{lead.name}</span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-1.5 py-0 font-normal ${statusColors[lead.status] || 'bg-gray-100 text-gray-800'}`}
                    >
                      {statusLabels[lead.status] || lead.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{lead.phone}</div>
                </button>
              ))}
              {filteredLeads.length === 0 && (
                <div className="text-center p-4 text-sm text-muted-foreground">
                  Nenhum lead encontrado.
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Right Column: Chat */}
        {selectedLead ? (
          <div className="flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between bg-card">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {selectedLead.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold text-sm">{selectedLead.name}</h2>
                  <p className="text-xs text-muted-foreground">
                    {selectedLead.phone} • {selectedLead.neighborhood || 'Sem bairro'}
                  </p>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="space-y-4">
                {messages.length > 0 ? (
                  messages.map((msg) => {
                    const isAgent = msg.sender === 'agent'
                    return (
                      <div
                        key={msg.id}
                        className={`flex items-end gap-2 ${isAgent ? 'flex-row' : 'flex-row-reverse'}`}
                      >
                        <Avatar className="w-8 h-8 shrink-0">
                          <AvatarFallback
                            className={
                              isAgent
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground'
                            }
                          >
                            {isAgent ? <Bot size={16} /> : <User size={16} />}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`rounded-2xl px-4 py-2 max-w-[75%] text-sm shadow-sm ${
                            isAgent
                              ? 'bg-card border text-card-foreground rounded-bl-none'
                              : 'bg-primary text-primary-foreground rounded-br-none'
                          }`}
                        >
                          {msg.text}
                          <div
                            className={`text-[10px] mt-1 opacity-70 ${isAgent ? 'text-left' : 'text-right'}`}
                          >
                            {new Date(msg.created).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center text-muted-foreground text-sm py-8">
                    Nenhuma mensagem registrada.
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t bg-card">
              <form className="flex items-end gap-2" onSubmit={handleSendMessage}>
                <Textarea
                  placeholder="Digite uma mensagem para intervir no atendimento..."
                  className="min-h-[60px] max-h-[120px] resize-none"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  disabled={sending}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage(e)
                    }
                  }}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="shrink-0 h-10 w-10 rounded-full"
                  disabled={!messageInput.trim() || sending}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground flex-col gap-4">
            <Bot className="h-12 w-12 opacity-20" />
            <p>Selecione um lead para ver o histórico de conversa.</p>
          </div>
        )}
      </div>
    </div>
  )
}
