import { NextApiRequest, NextApiResponse } from "next"

import { clusterApiUrl, Connection, Keypair, PublicKey, SystemProgram, LAMPORTS_PER_SOL, Transaction } from "@solana/web3.js"

import { login_sessions, saveSessionData } from '../../storage/session_management'

import { v4 as uuid } from "uuid"

type InputData = {
  account: string,
}

type GetResponse = {
  login_id: string,
  account: string | undefined,
}

type PostResponse = {
  login_id: string
}

type ErrorResponse = {
  error: string
}

function get(req: NextApiRequest, res: NextApiResponse<GetResponse>) {

  if (!('login_id' in req.query)) {
    return res.status(400)
  }

  const login_id = req.query['login_id'] as string
  const account = login_sessions[login_id]

  return res.status(200).json({
    login_id: login_id,
    account: account
  })
}

async function post(
  req: NextApiRequest,
  res: NextApiResponse<PostResponse>
) {
  console.log("Create new login session")

  const login_id = uuid()

  console.log("Login ID: " + login_id)
  
  login_sessions[login_id] = undefined
  saveSessionData()

  return res.status(200).json({
    login_id: login_id
  })
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetResponse | PostResponse | ErrorResponse>
) {
  if (req.method === "GET") {
    return get(req, res)
  } else if (req.method === "POST") {
    return await post(req, res)
  } else {
    return res.status(405).json({ error: "Method not allowed" })
  }
}
