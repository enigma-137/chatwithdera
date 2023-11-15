"use client"

import React from 'react'
import Messages from './Messages'
import ChatInput from './ChatInput'
import { trpc } from '@/app/_trpc/client'
import { ChevronLeft, Loader2, XCircle } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '../ui/button'
import { ChatContextProvider } from './ChatContext'

interface ChatWrapperProps {
  fileId: string
}

const ChatWrapper = ({ fileId }: ChatWrapperProps) => {

  const { data, isLoading } = trpc.getFileUploadStatus.useQuery({
    fileId,
  }, {
    refetchInterval: (data) =>
      data?.status === "SUCCESS" || data?.status === "FAILED" ? false : 500

  })

  // https://github.com/joschan21/quill/blob/master/COPY-PASTE-LIST.md

  if (isLoading) return (
    <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2  ">
      <div className="flex flex-1 justify-center flex-col items-center mb-28">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className='h-8 w-8 text-purple-600 animate-spin' />
          <h3 className="font-semibold text-xl"> Loading...</h3>
          <p className="text-zinc-500 text-sm"> Hold on while we prepare your chat.</p>

        </div>
      </div>
      <ChatInput isDisabled />
    </div>
  )

  if (data?.status === "PROCESSING") return (
    <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2  ">
      <div className="flex flex-1 justify-center flex-col items-center mb-28">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className='h-8 w-8 text-purple-600 animate-spin' />
          <h3 className="font-semibold text-xl"> Now Processing...</h3>
          <p className="text-zinc-500 text-sm"> This won&apos;t take long.</p>

        </div>
      </div>
      <ChatInput isDisabled />
    </div>
  )

  if(data?.status === "FAILED") return (
    <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2  ">
    <div className="flex flex-1 justify-center flex-col items-center mb-28">
      <div className="flex flex-col items-center gap-2">
        <XCircle className='h-8 w-8 text-red-500' />
        <h3 className="font-semibold text-xl"> Error! Too many pages in PDF</h3>
        <p className="text-zinc-500 text-sm"> Your <span className="font-medium">Free</span> plan only supports up to 5 pages per PDF</p>
<Link href='/dashboard' className={
  buttonVariants({
    variant: "secondary",
    className: "mt-4"
  })
} ><ChevronLeft className='h-3 w-3 mr-1.5 animate-pulse' /> Back</Link>
      </div>
    </div>
    <ChatInput isDisabled />
  </div>
  )
  return (

    <ChatContextProvider fileId={fileId}>
   <div className=' relative min-h-full bg-zinc-50 flex divide-y gap-2 divide-zinc-200 flex-col justify-between  '>
      <div className="flex-1 justify-between flex-col flex mb-28 ">
        <Messages />
      </div>
      <ChatInput />
    </div>
    </ChatContextProvider>
    
  )
}

export default ChatWrapper