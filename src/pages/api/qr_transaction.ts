import { NextApiRequest, NextApiResponse } from "next"

import { clusterApiUrl, Connection, Keypair, PublicKey, SystemProgram, LAMPORTS_PER_SOL, Transaction } from "@solana/web3.js"

import { transaction_sessions } from '../../storage/session_management'

const FUNDED_ACCOUNT = '77Dn6Xm3MjpUyyAh318WtHFvAcLSPrwUChLbpM2Ngnm3'

import { v4 as uuid } from "uuid"

type SuccessResponse = {
  tx_id: string,
  tx_state: string,
}

type ErrorResponse = {
  error: string
}

type ApiResponse = SuccessResponse | ErrorResponse

function get(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {

  console.log("Get state of transaction")

  if (!('tx_id' in req.query)) {
    return res.status(400)
  }

  const tx_id = req.query['tx_id'] as string

  const transaction = transaction_sessions[tx_id]

  return res.status(200).json({
    tx_id: tx_id,
    tx_state: transaction.state
  })
}

async function post(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {

  console.log("Register transaction")
  console.log(req.body)

  const tx = req.body['tx']

  const tx_id = uuid()

  console.log("tx_id:", tx_id)
  
  transaction_sessions[tx_id] = {
    'tx': tx,
    'state': 'unconfirmed'
  }
  
  console.log(transaction_sessions)

  return res.status(200).json({ tx_id: tx_id, tx_state: 'unconfirmed' })
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method === "GET") {
    return get(req, res)
  } else if (req.method === "POST") {
    return await post(req, res)
  } else {
    return res.status(405).json({ error: "Method not allowed" })
  }
}
