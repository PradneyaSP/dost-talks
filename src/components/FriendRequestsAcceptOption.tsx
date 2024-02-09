import Link from 'next/link'
import { FC } from 'react'

interface FriendRequestsAcceptOptionProps {
  
}

const FriendRequestsAcceptOption: FC<FriendRequestsAcceptOptionProps> = ({}) => {
  return <Link href="/dashboard/requests" className='text-primary'></Link>
}

export default FriendRequestsAcceptOption