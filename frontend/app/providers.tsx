'use client'

import { Amplify } from 'aws-amplify'
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import { Toaster } from '@/components/ui/toaster'

// Configure Amplify
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || '',
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '',
    }
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Authenticator.Provider>
      {children}
      <Toaster />
    </Authenticator.Provider>
  )
}