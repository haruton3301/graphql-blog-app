export interface RegisterParams {
  name: string
  email: string
  password: string
}

export interface LoginParams {
  email: string
  password: string
}

export interface User {
  id: string
  name: string
  email: string
}

export interface AuthHeaders {
  accessToken: string
  client: string
  expiry: string
  uid: string
}
