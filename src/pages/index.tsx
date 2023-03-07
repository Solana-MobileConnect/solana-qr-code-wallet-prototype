import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'

import { createQR, encodeURL, TransactionRequestURLFields } from '@solana/pay'

import { useRef, useEffect } from 'react'

export default function Home() {

  const loginQrRef = useRef<HTMLDivElement>()

  useEffect(() => {
    const { location } = window
    const url = `${location.protocol}//${location.host}/api/login`

    const urlFields: TransactionRequestURLFields = {
      link: new URL(url),
    }
    const loginUrl = encodeURL(urlFields)
    const loginQr = createQR(loginUrl, 400, 'transparent')

    if (loginQrRef.current) {
      loginQrRef.current.innerHTML = ''
      loginQr.append(loginQrRef.current)
    }
  }, [])

  return (
    <>
      <Head>
        <title>QR Code Wallet</title>
      </Head>
      <div>
      Scan the QR code to log in
      </div>
      <div ref={loginQrRef} />
      <div>
      Logged in user:
      </div>
    </>
  )
}
