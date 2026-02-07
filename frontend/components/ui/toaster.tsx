'use client'

import { Toaster as SonnerToaster } from 'sonner'

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            'bg-white border border-gray-200 shadow-lg',
          title: 'text-gray-900',
          description: 'text-gray-500',
          actionButton:
            'bg-primary-600 text-white hover:bg-primary-700',
          cancelButton:
            'bg-gray-100 text-gray-900 hover:bg-gray-200',
        },
      }}
    />
  )
}