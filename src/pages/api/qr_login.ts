import { NextApiRequest, NextApiResponse } from "next"

import { clusterApiUrl, Connection, Keypair, PublicKey, SystemProgram, LAMPORTS_PER_SOL, Transaction } from "@solana/web3.js"

import { login_sessions, saveSessionData } from '../../storage/session_management'

const FUNDED_ACCOUNT = '77Dn6Xm3MjpUyyAh318WtHFvAcLSPrwUChLbpM2Ngnm3'

type InputData = {
  account: string,
}

type GetResponse = {
  login_id: string,
  account: string | undefined,
}

type ErrorResponse = {
  error: string
}

function get(res: NextApiResponse<GetResponse>) {
  const account = login_sessions['test']

  if (account !== undefined) {
    login_sessions['test'] = undefined
    saveSessionData()
  }

  return res.status(200).json({
    login_id: 'test',
    account: account
  })
}

/*
async function post(
  req: NextApiRequest,
  res: NextApiResponse<PostResponse | PostError>
) {
}
*/

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetResponse | ErrorResponse>
) {
  if (req.method === "GET") {
    return get(res)
  } else if (req.method === "POST") {
    return res.status(500)
    //return await post(req, res)
  } else {
    return res.status(405).json({ error: "Method not allowed" })
  }
}
