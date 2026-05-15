migrate(
  (app) => {
    const admin = app.findAuthRecordByEmail('_pb_users_auth_', 'admin@imobiliaria.com.br')
    const agentsCol = app.findCollectionByNameOrId('agents')
    const agentConfigsCol = app.findCollectionByNameOrId('agent_configs')
    const leadsCol = app.findCollectionByNameOrId('leads')

    const agentData = [
      {
        name: 'Chefe',
        type: 'chefe',
        active: true,
        tone: 'formal',
        rules: ['Redirecionar leads', 'Qualificar interesse'],
        tools: [],
      },
      {
        name: 'Vendas',
        type: 'vendas',
        active: true,
        tone: 'amigavel',
        rules: ['Apresentar imóveis'],
        tools: ['Google Calendar'],
      },
      {
        name: 'Locação',
        type: 'locacao',
        active: true,
        tone: 'formal',
        rules: ['Apresentar opções de locação'],
        tools: ['Google Calendar'],
      },
      {
        name: 'Jurídico',
        type: 'juridico',
        active: true,
        tone: 'formal',
        rules: ['Tirar dúvidas contratuais'],
        tools: [],
      },
    ]

    for (const a of agentData) {
      let agentRecord
      try {
        agentRecord = app.findFirstRecordByData('agents', 'name', a.name)
      } catch (_) {
        agentRecord = new Record(agentsCol)
        agentRecord.set('user_id', admin.id)
        agentRecord.set('name', a.name)
        agentRecord.set('type', a.type)
        agentRecord.set('active', a.active)
        app.save(agentRecord)
      }

      try {
        app.findFirstRecordByData('agent_configs', 'agent_id', agentRecord.id)
      } catch (_) {
        const configRecord = new Record(agentConfigsCol)
        configRecord.set('user_id', admin.id)
        configRecord.set('agent_id', agentRecord.id)
        configRecord.set('tone', a.tone)
        configRecord.set('rules', a.rules)
        configRecord.set('tools', a.tools)
        configRecord.set('prompt', 'Você é um assistente...')
        app.save(configRecord)
      }
    }

    const leadsData = [
      {
        name: 'Ana Silva',
        phone: '11987654321',
        status: 'novo',
        agent: 'vendas',
        neighborhood: 'Ponta da Praia',
      },
      {
        name: 'Carlos Oliveira',
        phone: '21987654321',
        status: 'em_atendimento',
        agent: 'vendas',
        neighborhood: 'Gonzaga',
      },
      {
        name: 'Mariana Santos',
        phone: '85987654321',
        status: 'visita_agendada',
        agent: 'vendas',
        neighborhood: 'Boqueirão',
      },
      {
        name: 'João Pedro',
        phone: '47987654321',
        status: 'novo',
        agent: 'locacao',
        neighborhood: 'Centro',
      },
      {
        name: 'Fernanda Costa',
        phone: '31987654321',
        status: 'em_atendimento',
        agent: 'locacao',
        neighborhood: 'Vila Mathias',
      },
      {
        name: 'Roberto Alves',
        phone: '61987654321',
        status: 'proposta',
        agent: 'vendas',
        neighborhood: 'Embaré',
      },
      {
        name: 'Juliana Rocha',
        phone: '51987654321',
        status: 'negocio_fechado',
        agent: 'vendas',
        neighborhood: 'Aparecida',
      },
      {
        name: 'Lucas Mendes',
        phone: '11987654322',
        status: 'perdido',
        agent: 'vendas',
        neighborhood: 'José Menino',
      },
    ]

    for (const l of leadsData) {
      try {
        app.findFirstRecordByData('leads', 'phone', l.phone)
      } catch (_) {
        const record = new Record(leadsCol)
        record.set('user_id', admin.id)
        record.set('name', l.name)
        record.set('phone', l.phone)
        record.set('status', l.status)
        record.set('agent', l.agent)
        record.set('neighborhood', l.neighborhood)
        app.save(record)
      }
    }
  },
  (app) => {
    app.db().newQuery('DELETE FROM leads').execute()
    app.db().newQuery('DELETE FROM agent_configs').execute()
    app.db().newQuery('DELETE FROM agents').execute()
  },
)
