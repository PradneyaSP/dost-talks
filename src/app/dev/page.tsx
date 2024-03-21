import SignOutButton from '@/components/SignOutButton'
import { Button } from '@/components/ui/button'
import { FC } from 'react'

interface pageProps {
  
}

const page: FC<pageProps> = ({}) => {
  return <SignOutButton className="h-full aspect-square" />
}

export default page