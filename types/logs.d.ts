interface LogsDatabaseEntry {
  uid: string
  aid: string

  level: number
  trace: string

  ipAddress?: string

  timestamp: number
}

type LogsAPIResponse = ApiErrorResponse | void
