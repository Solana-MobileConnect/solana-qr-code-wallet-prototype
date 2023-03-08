console.log("session management")

type LoginSessions = {
  [index: string]: string
}

const login_sessions: LoginSessions = {}

type TransactionSessions = {
  [index: string]: {
    tx: string,
    state: string
  }
}

const transaction_sessions: TransactionSessions = {}

export {login_sessions, transaction_sessions}
