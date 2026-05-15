import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Users, PhoneCall, Percent, Clock, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { api } from '@/services/api'
import { Lead } from '@/types/types'

const chartData = [
  { name: 'Seg', leads: 4 },
  { name: 'Ter', leads: 7 },
  { name: 'Qua', leads: 5 },
  { name: 'Qui', leads: 10 },
  { name: 'Sex', leads: 8 },
  { name: 'Sáb', leads: 3 },
  { name: 'Dom', leads: 2 },
]

const chartConfig = {
  leads: {
    label: 'Novos Leads',
    color: 'hsl(var(--primary))',
  },
}

export const statusLabels: Record<string, string> = {
  novo: 'Novo',
  em_atendimento: 'Em Atendimento',
  tentativa: 'Tentativa',
  visita_agendada: 'Visita Agendada',
  proposta: 'Proposta',
  negocio_fechado: 'Negócio Fechado',
  perdido: 'Perdido',
  no_show: 'No Show',
}

export const statusColors: Record<string, string> = {
  novo: 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-none',
  em_atendimento: 'bg-purple-100 text-purple-800 hover:bg-purple-200 border-none',
  tentativa: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-none',
  visita_agendada: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200 border-none',
  proposta: 'bg-orange-100 text-orange-800 hover:bg-orange-200 border-none',
  negocio_fechado: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none',
  perdido: 'bg-red-100 text-red-800 hover:bg-red-200 border-none',
  no_show: 'bg-rose-100 text-rose-800 hover:bg-rose-200 border-none',
}

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const leadsData = await api.getLeads()
        setLeads(leadsData)
      } catch (error) {
        toast({
          title: 'Erro',
          description: 'Erro ao carregar dados do dashboard.',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [toast])

  const totalLeads = leads.length
  const activeLeads = leads.filter((l) => l.status === 'em_atendimento').length
  const conversionRate =
    totalLeads > 0
      ? Math.round((leads.filter((l) => l.status === 'negocio_fechado').length / totalLeads) * 100)
      : 0

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral das suas métricas e atendimentos de hoje.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
            <p className="text-xs text-muted-foreground">Todos os tempos</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atendimentos Ativos</CardTitle>
            <PhoneCall className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeLeads}</div>
            <p className="text-xs text-muted-foreground">Sendo gerenciados pelos agentes</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <p className="text-xs text-muted-foreground">Leads que fecharam negócio</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo de Resposta Médio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2m 15s</div>
            <p className="text-xs text-muted-foreground">Tempo médio da IA</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4 shadow-sm flex flex-col">
          <CardHeader>
            <CardTitle>Aquisição de Leads</CardTitle>
            <CardDescription>Volume de novos contatos nos últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-4">
            <ChartContainer config={chartConfig} className="h-full min-h-[250px] w-full">
              <BarChart data={chartData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  className="text-xs"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                  className="text-xs"
                />
                <ChartTooltip
                  cursor={{ fill: 'var(--muted)' }}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar
                  dataKey="leads"
                  fill="var(--color-leads)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 shadow-sm">
          <CardHeader>
            <CardTitle>Leads Recentes</CardTitle>
            <CardDescription>Últimos contatos capturados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="md:hidden space-y-4">
              {leads.slice(0, 5).map((lead) => (
                <div
                  key={lead.id}
                  className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm flex flex-col gap-2"
                >
                  <div className="flex justify-between items-start">
                    <div className="font-semibold text-sm">{lead.name}</div>
                    <Badge className={statusColors[lead.status] || 'bg-gray-100 text-gray-800'}>
                      {statusLabels[lead.status] || lead.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">{lead.phone}</div>
                  <div className="text-xs capitalize">Agente: {lead.agent}</div>
                </div>
              ))}
            </div>
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lead</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.slice(0, 5).map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium whitespace-nowrap">{lead.name}</TableCell>
                      <TableCell className="text-muted-foreground whitespace-nowrap">
                        {lead.phone}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`whitespace-nowrap ${statusColors[lead.status] || 'bg-gray-100 text-gray-800'}`}
                        >
                          {statusLabels[lead.status] || lead.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
