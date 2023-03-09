import fs from 'fs'

import path from 'path';

// Login sessions

type LoginSessions = {
  [index: string]: string | undefined
}

const loginSessionsFile = path.join('/tmp', 'login_sessions.json')

if (!fs.existsSync(loginSessionsFile)) {
  fs.writeFileSync(loginSessionsFile, '{}');
}

const loginSessionsFileContent = fs.readFileSync(loginSessionsFile, 'utf-8');

export const login_sessions: LoginSessions = JSON.parse(loginSessionsFileContent)

// Transaction sessions

type TransactionSessions = {
  /*
  [index: string]: {
    tx: string,
    state: string,
    private_tx_id: string
  }
  */
 [index: string]: any
}

const txSessionsFile = path.join('/tmp', 'transaction_sessions.json')

if (!fs.existsSync(txSessionsFile)) {
  fs.writeFileSync(txSessionsFile, '{}');
}

const txSessionsFileContent = fs.readFileSync(txSessionsFile, 'utf-8');

export const transaction_sessions: TransactionSessions = JSON.parse(txSessionsFileContent)

export function saveSessionData() {
    fs.writeFileSync('/tmp/login_sessions.json', JSON.stringify(login_sessions, null, 4));
    fs.writeFileSync('/tmp/transaction_sessions.json', JSON.stringify(transaction_sessions, null, 4));
}
