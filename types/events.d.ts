interface EventsDatabaseEntry {
  uid: string
  aid: string
  eventCategory: string
  eventAction: string
  eventStatus?: string
  eventLabel?: string
  eventData?: Record<string, unknown>
  timestamp: number
}

type EventsAPIResponse = ApiErrorResponse | void
