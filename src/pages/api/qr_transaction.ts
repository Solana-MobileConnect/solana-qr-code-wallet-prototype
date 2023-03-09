import { NextApiRequest, NextApiResponse } from "next"

import { clusterApiUrl, Connection, Keypair, PublicKey, SystemProgram, LAMPORTS_PER_SOL, Transaction, TransactionInstruction } from "@solana/web3.js"

import { transaction_sessions, saveSessionData } from '../../storage/session_management'

const MEMO_PROGRAM_ID = 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'

import { v4 as uuid } from "uuid"

type SuccessResponse = {
  tx_id: string,
  tx_state: string,
  tx_sig?: string
}

type ErrorResponse = {
  error: string
}

type ApiResponse = SuccessResponse | ErrorResponse

async function get(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {

  console.log("Get state of transaction")

  if (!('tx_id' in req.query)) {
    return res.status(400)
  }

  const tx_id = req.query['tx_id'] as string

  const transaction = transaction_sessions[tx_id]
  
  const private_tx_id = transaction.private_tx_id

  const connection = new Connection(clusterApiUrl('devnet'))

  const sigs = await connection.getSignaturesForAddress(new PublicKey(transaction.fee_payer))
  
  let found = false
  let found_sig = undefined

  for (const sig of sigs) {
    if (sig.memo?.includes(private_tx_id)) {
      console.log("Transaction found!")
      console.log(sig)
      
      found = true
      found_sig = sig.signature
      break
      
    }
  }

  if (found) {

    //delete transaction_sessions[tx_id]

    return res.status(200).json({
      tx_id: tx_id,
      tx_state: 'confirmed',
      tx_sig: found_sig
    })

  } else {
    return res.status(200).json({
      tx_id: tx_id,
      tx_state: 'unconfirmed'
    })
  }
  
}

async function post(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {

  console.log("Register transaction")
  console.log(req.body)

  const tx_data = req.body['tx']

  // An id so that the client can refer to it
  const public_tx_id = uuid()

  // For security, separate id that will be used in the memo
  const private_tx_id = uuid()

  // Add memo instruction
  const tx_recov = Transaction.from(Buffer.from(tx_data, 'base64'))

  const memo_ix = new TransactionInstruction({
    keys: [],
    data: Buffer.from(private_tx_id, "utf-8"),
    programId: new PublicKey(MEMO_PROGRAM_ID)
  })

  tx_recov.add(memo_ix)

  // Serialize

  const tx_data_with_memo = tx_recov.serialize({requireAllSignatures:false}).toString('base64')

  console.log("public / private tx_id:", public_tx_id, private_tx_id)
  
  transaction_sessions[public_tx_id] = {
    'tx': tx_data_with_memo,
    'state': 'unconfirmed',
    'private_tx_id': private_tx_id,
    'fee_payer': tx_recov.feePayer?.toString()
  }

  saveSessionData()

  return res.status(200).json({ tx_id: public_tx_id, tx_state: 'unconfirmed' })
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method === "GET") {
    return await get(req, res)
  } else if (req.method === "POST") {
    return await post(req, res)
  } else {
    return res.status(405).json({ error: "Method not allowed" })
  }
}
