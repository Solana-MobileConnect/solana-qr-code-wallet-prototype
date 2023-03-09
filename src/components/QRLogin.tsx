import { createQR, encodeURL, TransactionRequestURLFields } from '@solana/pay'

import { useRef, useEffect, useState } from 'react'
import useInterval from '../hooks/useInterval'

const POLLING_INTERVAL = 1000

type Props = Readonly<{
  setAccount(account: string): void
}>

export default function QRLogin({ setAccount }: Props) {

  const loginQrRef = useRef<HTMLDivElement>(null)

  const useEffectCalled = useRef(false)
  const currentLoginId = useRef(undefined as string | undefined)
  
  useEffect(() => {

    // TODO: better way to call it only once
    if (useEffectCalled.current) {
      return
    }
      
    useEffectCalled.current = true;
    
    (async () => {

      const responseRaw = await fetch('/api/qr_login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        }
      })
      
      const response = await responseRaw.json()

      console.log(response)
      
      const { login_id } = response as { login_id: string}

      currentLoginId.current = login_id

      const { location } = window
      const url = `${location.protocol}//${location.host}/api/send_account?login_id=${login_id}`

      const urlFields: TransactionRequestURLFields = {
        link: new URL(url),
      }
      const loginUrl = encodeURL(urlFields)
      const loginQr = createQR(loginUrl, 400, 'transparent')

      if (loginQrRef.current) {
        loginQrRef.current.innerHTML = ''
        loginQr.append(loginQrRef.current)
      }
      
    })().then(null, console.error)

  }, [])

  async function poll() {
    if (!currentLoginId.current) {
      return
    }

    console.log("Polling...")

    const responseRaw = await fetch(`/api/qr_login?login_id=${currentLoginId.current}`)

    if (!responseRaw.ok) {
      console.log("Request failed")
      return
    }

    const response = await responseRaw.json()
    console.log(response)

    if (response['account'] != null) {
      console.log("Logged in as:", response['account'])
      setAccount(response['account'])
    }
  }

  useInterval(poll, POLLING_INTERVAL)

  return  (
    <div>
      <div>Scan QR code to log in</div>
      <div ref={loginQrRef} />
    </div>
  )
}
