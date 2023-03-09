console.log("session management")

const fs = require('fs');


import path from 'path';

const file = path.join(process.cwd(), 'data', 'test.json');
fs.writeFileSync(file, '{"a":1}');
const fileContent = fs.readFileSync(file, 'utf-8');

console.log(fileContent)



type LoginSessions = {
  [index: string]: string | undefined
}

const login_sessions: LoginSessions = require('data/login_sessions.json')
// const login_sessions: LoginSessions = {}

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

const transaction_sessions: TransactionSessions = require('data/transaction_sessions.json')
//const transaction_sessions: TransactionSessions = {}

export {login_sessions, transaction_sessions}

export function saveSessionData() {
    fs.writeFileSync('data/login_sessions.json', JSON.stringify(login_sessions, null, 4));
    fs.writeFileSync('data/transaction_sessions.json', JSON.stringify(transaction_sessions, null, 4));
}
