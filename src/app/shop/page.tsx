'use client'

import { Suspense } from 'react'
import Products from '@/components/Products'

const page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Products />
      </Suspense>
    </div>
  )
}

export default page