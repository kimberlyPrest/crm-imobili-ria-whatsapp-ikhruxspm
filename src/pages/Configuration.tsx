import { useState } from 'react'
import { mockAgents as initialAgents } from '@/data/mock-data'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Agent } from '@/types/types'
import { useToast } from '@/hooks/use-toast'
import { Bot, Settings2 } from 'lucide-react'

const availableTools = [
  'Qualificação Básica',
  'Redirecionamento',
  'Consultar Imóveis',
  'Agendar Visita',
  'Análise de Crédito',
  'Consultar Contratos',
  'Emitir Boletos',
]

export default function Configuration() {
  const [agents, setAgents] = useState(initialAgents)
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null)
  const [formData, setFormData] = useState<Agent | null>(null)
  const { toast } = useToast()

  const handleEditClick = (agent: Agent) => {
    setEditingAgent(agent)
    setFormData({ ...agent })
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return

    setAgents(agents.map((a) => (a.id === formData.id ? formData : a)))
    toast({ title: 'Sucesso', description: 'Configurações do agente atualizadas.' })
    setEditingAgent(null)
  }

  const handleToolToggle = (tool: string, checked: boolean) => {
    if (!formData) return
    const tools = checked ? [...formData.tools, tool] : formData.tools.filter((t) => t !== tool)
    setFormData({ ...formData, tools })
  }

  const handleActiveToggle = (id: string, active: boolean) => {
    setAgents(agents.map((a) => (a.id === id ? { ...a, active } : a)))
    toast({
      title: active ? 'Agente ativado' : 'Agente desativado',
      description: 'Status atualizado com sucesso.',
    })
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Configuração de Agentes
        </h1>
        <p className="text-muted-foreground">
          Gerencie o comportamento, tom de voz e permissões das IAs.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <Card key={agent.id} className="shadow-sm flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 text-primary rounded-lg">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                    <CardDescription className="uppercase text-[10px] tracking-wider font-bold mt-1">
                      {agent.type}
                    </CardDescription>
                  </div>
                </div>
                <Switch
                  checked={agent.active}
                  onCheckedChange={(v) => handleActiveToggle(agent.id, v)}
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground font-medium">Tom de Voz</span>
                <p className="text-sm font-medium">{agent.tone}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground font-medium">Ferramentas</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {agent.tools.map((tool) => (
                    <Badge key={tool} variant="secondary" className="text-[10px] px-1.5 py-0">
                      {tool}
                    </Badge>
                  ))}
                  {agent.tools.length === 0 && (
                    <span className="text-xs text-muted-foreground">Nenhuma</span>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => handleEditClick(agent)}
              >
                <Settings2 className="h-4 w-4" />
                Configurar Agente
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={!!editingAgent} onOpenChange={(v) => !v && setEditingAgent(null)}>
        <DialogContent className="sm:max-w-[600px] bg-background">
          <DialogHeader>
            <DialogTitle>Editar {editingAgent?.name}</DialogTitle>
            <DialogDescription>
              Ajuste as instruções base e regras para este agente IA.
            </DialogDescription>
          </DialogHeader>

          {formData && (
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="tone">Tom de Voz</Label>
                  <Input
                    id="tone"
                    value={formData.tone}
                    onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                    placeholder="Ex: Profissional e amigável"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="prompt">Instruções do Sistema (Prompt)</Label>
                  <Textarea
                    id="prompt"
                    value={formData.prompt}
                    onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="rules">Regras de Negócio</Label>
                  <Textarea
                    id="rules"
                    value={formData.rules}
                    onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                    className="min-h-[80px]"
                    placeholder="Ex: Sempre pedir email antes de enviar preços."
                  />
                </div>

                <div className="grid gap-3">
                  <Label>Ferramentas Disponíveis</Label>
                  <div className="grid grid-cols-2 gap-2 p-4 border rounded-lg bg-muted/30">
                    {availableTools.map((tool) => (
                      <div key={tool} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tool-${tool}`}
                          checked={formData.tools.includes(tool)}
                          onCheckedChange={(checked) => handleToolToggle(tool, checked as boolean)}
                        />
                        <Label
                          htmlFor={`tool-${tool}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {tool}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setEditingAgent(null)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar Alterações</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
