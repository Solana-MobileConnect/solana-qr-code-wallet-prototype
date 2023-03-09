import { NextApiRequest, NextApiResponse } from "next"

import { clusterApiUrl, Connection, Keypair, PublicKey, SystemProgram, LAMPORTS_PER_SOL, Transaction } from "@solana/web3.js"

import { login_sessions, saveSessionData } from '../../storage/session_management'

const FUNDED_ACCOUNT = '77Dn6Xm3MjpUyyAh318WtHFvAcLSPrwUChLbpM2Ngnm3'

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
  res.status(200).json({
    label: "My Store",
    icon: "https://solana.com/src/img/branding/solanaLogoMark.svg",
  })
}


async function post(
  req: NextApiRequest,
  res: NextApiResponse<PostResponse | PostError>
) {

  // Ensure valid Solana Pay request
  
  const { account } = req.body as InputData
  console.log(req.body)
  if (!account) {
    res.status(400).json({ error: "No account provided" })
    return
  }

  console.log("Account:", account)
  
  // Get login_id from query string
  
  if (!('login_id' in req.query)) {
    return res.status(400)
  }

  const login_id = req.query['login_id'] as string
  
  // Associate account with login_id
  
  login_sessions[login_id] = account

  saveSessionData()
  
  // Create dummy transaction

  const connection = new Connection(clusterApiUrl('devnet'))

  const publicKey = new PublicKey(FUNDED_ACCOUNT)

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: publicKey,
      lamports: 1
    })
  )

  transaction.feePayer = publicKey

  const latestBlockhash = await connection.getLatestBlockhash()
  transaction.recentBlockhash = latestBlockhash.blockhash

  // Don't sign the transaction

  const serializedTransaction = transaction.serialize({
    requireAllSignatures: false
  })
  const encodedTransaction = serializedTransaction.toString('base64')

  // Options for dummy transactions
  // '': crashes Phantom
  // self-transfer of account: user may mistakenly sign it
  // self-transfer of randomly generated account without funds: "Can't simulate it" message on Phantom
  // transfer from funded account to itself: works well!

  res.status(200).json({
    transaction: encodedTransaction,
    message: "Logged in! (Ignore this transaction)"
    //message: "Ignore this transaction"
    //message: "Logged in!"
    //message: "Successfully logged in! (Ignore this transaction)"
  })
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
