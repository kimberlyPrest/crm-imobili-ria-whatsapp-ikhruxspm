migrate(
  (app) => {
    const leads = new Collection({
      name: 'leads',
      type: 'base',
      listRule: 'user_id = @request.auth.id',
      viewRule: 'user_id = @request.auth.id',
      createRule: 'user_id = @request.auth.id',
      updateRule: 'user_id = @request.auth.id',
      deleteRule: 'user_id = @request.auth.id',
      fields: [
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'phone', type: 'text' },
        { name: 'name', type: 'text' },
        {
          name: 'status',
          type: 'select',
          values: [
            'novo',
            'em_atendimento',
            'tentativa',
            'visita_agendada',
            'proposta',
            'negocio_fechado',
            'perdido',
            'no_show',
          ],
          maxSelect: 1,
        },
        {
          name: 'agent',
          type: 'select',
          values: ['chefe', 'vendas', 'locacao', 'juridico'],
          maxSelect: 1,
        },
        { name: 'property_interest', type: 'text' },
        {
          name: 'property_type',
          type: 'select',
          values: ['residencial', 'comercial', 'terreno'],
          maxSelect: 1,
        },
        {
          name: 'typology',
          type: 'select',
          values: ['casas', 'aptos', 'sobrepostas', 'salas_comerciais'],
          maxSelect: 1,
        },
        { name: 'bedrooms', type: 'number' },
        { name: 'garages', type: 'number' },
        { name: 'area', type: 'number' },
        { name: 'neighborhood', type: 'text' },
        { name: 'price_range', type: 'text' },
        {
          name: 'purpose',
          type: 'select',
          values: ['moradia', 'investimento', 'permuta'],
          maxSelect: 1,
        },
        { name: 'cpf', type: 'text' },
        { name: 'email', type: 'email' },
        { name: 'broker_assigned', type: 'text' },
        {
          name: 'lead_origin',
          type: 'select',
          values: ['zap', 'imovelweb', 'olx', 'direto', 'campanha'],
          maxSelect: 1,
        },
        { name: 'next_followup', type: 'date' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_leads_phone ON leads (phone)'],
    })
    app.save(leads)

    const messages = new Collection({
      name: 'messages',
      type: 'base',
      listRule: 'user_id = @request.auth.id',
      viewRule: 'user_id = @request.auth.id',
      createRule: 'user_id = @request.auth.id',
      updateRule: 'user_id = @request.auth.id',
      deleteRule: 'user_id = @request.auth.id',
      fields: [
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        },
        {
          name: 'lead_id',
          type: 'relation',
          required: true,
          collectionId: leads.id,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'sender', type: 'select', values: ['user', 'agent'], maxSelect: 1 },
        { name: 'text', type: 'text' },
        {
          name: 'agent_type',
          type: 'select',
          values: ['chefe', 'vendas', 'locacao', 'juridico'],
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(messages)

    const agents = new Collection({
      name: 'agents',
      type: 'base',
      listRule: 'user_id = @request.auth.id',
      viewRule: 'user_id = @request.auth.id',
      createRule: 'user_id = @request.auth.id',
      updateRule: 'user_id = @request.auth.id',
      deleteRule: 'user_id = @request.auth.id',
      fields: [
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'name', type: 'text' },
        {
          name: 'type',
          type: 'select',
          values: ['chefe', 'vendas', 'locacao', 'juridico'],
          maxSelect: 1,
        },
        { name: 'active', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(agents)

    const agentConfigs = new Collection({
      name: 'agent_configs',
      type: 'base',
      listRule: 'user_id = @request.auth.id',
      viewRule: 'user_id = @request.auth.id',
      createRule: 'user_id = @request.auth.id',
      updateRule: 'user_id = @request.auth.id',
      deleteRule: 'user_id = @request.auth.id',
      fields: [
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        },
        {
          name: 'agent_id',
          type: 'relation',
          required: true,
          collectionId: agents.id,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'prompt', type: 'text' },
        {
          name: 'tone',
          type: 'select',
          values: ['formal', 'casual', 'tecnico', 'amigavel'],
          maxSelect: 1,
        },
        { name: 'rules', type: 'json' },
        { name: 'tools', type: 'json' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(agentConfigs)

    const metrics = new Collection({
      name: 'metrics',
      type: 'base',
      listRule: 'user_id = @request.auth.id',
      viewRule: 'user_id = @request.auth.id',
      createRule: 'user_id = @request.auth.id',
      updateRule: 'user_id = @request.auth.id',
      deleteRule: 'user_id = @request.auth.id',
      fields: [
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        },
        {
          name: 'lead_id',
          type: 'relation',
          required: true,
          collectionId: leads.id,
          cascadeDelete: true,
          maxSelect: 1,
        },
        {
          name: 'agent_id',
          type: 'relation',
          required: true,
          collectionId: agents.id,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'status', type: 'text' },
        { name: 'response_time_seconds', type: 'number' },
        { name: 'conversion_stage', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(metrics)
  },
  (app) => {
    app.delete(app.findCollectionByNameOrId('metrics'))
    app.delete(app.findCollectionByNameOrId('agent_configs'))
    app.delete(app.findCollectionByNameOrId('agents'))
    app.delete(app.findCollectionByNameOrId('messages'))
    app.delete(app.findCollectionByNameOrId('leads'))
  },
)
