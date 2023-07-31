interface User {
  uid: string
  token: string
  userCreated: number
}

type UsersAPIResponse = ApiErrorResponse | User
