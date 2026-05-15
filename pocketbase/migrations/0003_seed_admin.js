migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    try {
      app.findAuthRecordByEmail('_pb_users_auth_', 'admin@imobiliaria.com.br')
      return
    } catch (_) {}

    const record = new Record(users)
    record.setEmail('admin@imobiliaria.com.br')
    record.setPassword('Admin@123456')
    record.setVerified(true)
    record.set('name', 'Admin')
    record.set('role', 'admin')
    app.save(record)
  },
  (app) => {
    try {
      const record = app.findAuthRecordByEmail('_pb_users_auth_', 'admin@imobiliaria.com.br')
      app.delete(record)
    } catch (_) {}
  },
)
