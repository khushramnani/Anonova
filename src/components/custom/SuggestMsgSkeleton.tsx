import React from 'react'
import { Skeleton } from '../ui/skeleton'

const SuggestMsgSkeleton = () => {
  return (

    <div className="flex items-center space-x-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
 

  )
}

export default SuggestMsgSkeleton
