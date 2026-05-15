import { useState, useMemo } from 'react'
import { mockLeads, mockMessages, statusColors, statusLabels } from '@/data/mock-data'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Search, Send, Bot, User } from 'lucide-react'
import { Lead } from '@/types/types'

export default function Inbox() {
  const [search, setSearch] = useState('')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(mockLeads[0])
  const [messageInput, setMessageInput] = useState('')

  const filteredLeads = useMemo(() => {
    return mockLeads.filter(
      (l) => l.name.toLowerCase().includes(search.toLowerCase()) || l.phone.includes(search),
    )
  }, [search])

  const currentMessages = useMemo(() => {
    if (!selectedLead) return []
    return mockMessages
      .filter((m) => m.leadId === selectedLead.id)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  }, [selectedLead])

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
                      className={`text-[10px] px-1.5 py-0 font-normal ${statusColors[lead.status]}`}
                    >
                      {statusLabels[lead.status]}
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
                    {selectedLead.phone} • {selectedLead.neighborhood}
                  </p>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="space-y-4">
                {currentMessages.length > 0 ? (
                  currentMessages.map((msg) => {
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
                            {new Date(msg.timestamp).toLocaleTimeString([], {
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
              <form className="flex items-end gap-2" onSubmit={(e) => e.preventDefault()}>
                <Textarea
                  placeholder="Digite uma mensagem para intervir no atendimento..."
                  className="min-h-[60px] max-h-[120px] resize-none"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                />
                <Button
                  size="icon"
                  className="shrink-0 h-10 w-10 rounded-full"
                  disabled={!messageInput.trim()}
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
