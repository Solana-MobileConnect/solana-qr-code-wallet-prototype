import { NextApiRequest, NextApiResponse } from "next"

type Data = {
  name: string,
  counter: int
}

let counter = 0

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  counter++
  console.log("new counter:", counter)
  res.status(200).json({ name: 'John Doe', counter: counter })
}
