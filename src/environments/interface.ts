export interface Environment {
  production: boolean
  apiKey: string
}

export interface FireBaseAuthResponse {
  idToken: string
  expiresIn: string
}
