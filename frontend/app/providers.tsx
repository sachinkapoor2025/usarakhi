'use client'

import { Amplify } from 'aws-amplify'
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import { Toaster } from '@/components/ui/toaster'

// Configure Amplify
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || 'us-east-1_3l64ld774pbq2u3sj2cikvhrp2',
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '3l64ld774pbq2u3sj2cikvhrp2',
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