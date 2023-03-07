import { NextApiRequest, NextApiResponse } from "next"

const session_pubkey: { [index: string]: string | undefined } = {}

session_pubkey['test'] = 'value'
session_pubkey['test2'] = undefined

type PostResponse = { status: string, message: string | undefined }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PostResponse>
) {

  console.log(req)

  if (req.method === "POST") {

    console.log("POST request")

    console.log("query", req.query)
    console.log("body", req.body)

    return res.status(200).json({ status: "success", message: "Success POST" })

  } else if (req.method == "GET") {
    
    console.log(req.query)

    if ('session_id' in req.query) {
      const session_id = req.query['session_id']

      if (session_id in session_pubkey){
         const value = session_pubkey[session_id] 
          
         if (value === undefined) {
            res.status(404).json({ status: "error", message: "Public key for session not found" })
         } else {
          res.status(200).json({ status: "success", message: value})
         }
      } else {
        res.status(404).json({ status: "error", message: "Session not found" })
      }

    } else {
      res.status(400).json({ status: "error", message: "No session_key" })
    }


  } else {
    res.status(405).json({ status: "error", message: "Method not allowed" })
  }
}

