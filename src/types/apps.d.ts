interface App {
  name: string
  aid: string
}

type AppsAPIResponse = ApiErrorResponse | App
