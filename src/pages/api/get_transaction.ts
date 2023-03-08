import { NextApiRequest, NextApiResponse } from "next"

import { clusterApiUrl, Connection, Keypair, PublicKey, SystemProgram, LAMPORTS_PER_SOL, Transaction } from "@solana/web3.js"

import { transaction_sessions } from '../../storage/session_management'

type InputData = {
  account: string,
}

type GetResponse = {
  label: string,
  icon: string,
}

export type PostResponse = {
  transaction: string,
  message: string,
}

export type PostError = {
  error: string
}

function get(res: NextApiResponse<GetResponse>) {
  return res.status(200).json({
    label: "My Store",
    icon: "https://solana.com/src/img/branding/solanaLogoMark.svg",
  })
}


async function post(
  req: NextApiRequest,
  res: NextApiResponse<PostResponse | PostError>
) {
  console.log("get_transaction", req.body, req.query)

  const { account } = req.body as InputData

  if (!account) {
    res.status(400).json({ error: "No account provided" })
    return
  }
  // We could check whether this pubkey has created the transaction
  
  // Retrieve encoded transaction

  const tx_id = req.query['tx_id'] as string | undefined

  console.log(transaction_sessions)

  if (tx_id === undefined || (!(tx_id in transaction_sessions)) ) {
    console.log("Invalid request")
    return res.status(400)
  } else {

    const encodedTransaction = transaction_sessions[tx_id]['tx']
    
    // only if state is unconfirmed

    return res.status(200).json({
      transaction: encodedTransaction,
      message: "Transfer 0.01 SOL on devnet"
    })
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetResponse | PostResponse | PostError>
) {
  if (req.method === "GET") {
    return get(res)
  } else if (req.method === "POST") {
    return await post(req, res)
  } else {
    return res.status(405).json({ error: "Method not allowed" })
  }
}
