interface User {
  uid: string
  token: string
}

type UsersAPIResponse = ApiErrorResponse | User
