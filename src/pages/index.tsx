import Head from 'next/head'

import QRLogin from '../components/QRLogin'
import QRTransaction from '../components/QRTransaction'

import { useState } from 'react'

export default function Home() {

  const [account, setAccount] = useState<string | undefined>(undefined)

  console.log(account)

  return (
    <>
      <Head>
        <title>QR Code Wallet</title>
      </Head>
      {
        account === undefined?
          <QRLogin setAccount={setAccount} /> :
          <QRTransaction account={account} />
      }
    </>
  )
}
