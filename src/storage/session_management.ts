console.log("session management")

const fs = require('fs');

type LoginSessions = {
  [index: string]: string
}

const login_sessions: LoginSessions = require('data/login_sessions.json')

type TransactionSessions = {
  [index: string]: {
    tx: string,
    state: string
  }
}

const transaction_sessions: TransactionSessions = require('data/transaction_sessions.json')

export {login_sessions, transaction_sessions}

export function saveSessionData() {
    fs.writeFileSync('data/login_sessions.json', JSON.stringify(login_sessions, null, 4));
    fs.writeFileSync('data/transaction_sessions.json', JSON.stringify(transaction_sessions, null, 4));
}
