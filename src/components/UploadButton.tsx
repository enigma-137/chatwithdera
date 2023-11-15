"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Cloud, File,Loader2, UploadCloudIcon } from "lucide-react";
import Dropzone from "react-dropzone"
import { Progress } from "./ui/progress";
import { useUploadThing } from "@/lib/uploadthing";
import { useToast } from "./ui/use-toast";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";

const UploadDropZone = () => {


    const router = useRouter()
    
    const [isUploading, setIsUploading] = useState<boolean>(false)
    const [uploadProgress, setUploadProgress] = useState<number>(0)

    const { toast } = useToast()

    const { startUpload } = useUploadThing("pdfUploader")

  const {mutate: startPolling} = trpc.getFile.useMutation({
    
        onSuccess: (file) => {
          router.push(`/dashboard/${file?.id}`)
        },
        retry: true,
        retryDelay: 500,
      })   

  

    const startSimulatedProgress = () => {

        setUploadProgress(0)

        const interval = setInterval(() => {
            setUploadProgress((prevProgress) => {
                if (prevProgress >= 95) {
                    clearInterval(interval)
                    return prevProgress
                }
                return prevProgress + 5
            })
        }, 500)

        return interval
    }

    return (
        <Dropzone multiple={false} onDrop={async (acceptedFile) => {
            setIsUploading(true)
            const progressInterval = startSimulatedProgress()

            // handle file upload 
            const res = await startUpload(acceptedFile)

            if (!res) {
                return toast({
                    title: "Something went wrong",
                    description: "You can try again",
                    variant: "destructive"

                })
            }

            const [fileResponse] = res

            const key = fileResponse?.key

            if(!key) {
                return toast({
                    title: "Something went wrong",
                    description: "You can try again",
                    variant: "destructive"

                })
            }
            // await new Promise((resolve) => setTimeout(resolve, 10000))

            clearInterval(progressInterval)
            setUploadProgress(100)

            startPolling({key})
        }}>
            {({ getRootProps, getInputProps, acceptedFiles }) => (
                <div {...getRootProps()} className="border h-64 border-dashed border-gray-300 rounded-lg">
                    <div className="flex items-center h-full w-full justify-center">
                        <label htmlFor="dropzone-file" className="flex flex-col w-full h-full rounded-lg items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100">
                            <div className="flex flex-col justify-center items-center pt-5 pb-6  ">
                                <Cloud className="h-6 w-6 text-zinc-500 mb-2 " />
                                <p className="mb-2 text-sm text-zinc-700">
                                    <span className="font-semibold ">Click to upload</span> {' '} or drag and drop
                                </p>
                                <p className=" text-xs text-zinc-500">PDF (up to 4MB)</p>
                            </div>
                            {acceptedFiles && acceptedFiles[0] ? (
                                <div className="max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px]   outline-zinc-200 divide-x divide-zinc-200 ">
                                    <div className="px-3 py-2 h-full grid place-items-center  " >
                                        <File className="h-4 w-4 text-purple-600 " />
                                    </div>
                                    <div className="px-3 py-2 h-full truncate text-sm" > {acceptedFiles[0].name}</div>
                                </div>
                            ) : null}


                            {isUploading ? (
                                <div className="w-full max-w-xs mx-auto mt-4  ">
                                    <Progress className="h-2 w-full bg-zinc-200" value={uploadProgress} />
                               
                               {uploadProgress === 100 ? (
                                <div className="flex gap-1 items-center justify-center text-sm text-zinc-700 text-center pt-2">
                                <Loader2 className="h-3 w-4 animate-spin"/>
                                Redirecting...
                            </div>
                               ) : null}
                                </div>
                                
                            ) : null}
                            <input {...getInputProps} type="file" id="dropzone-file" className="hidden" />
                        </label>
                    </div>
                </div>
            )}
        </Dropzone>
    )
}

const UploadButton = () => {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={(v) => {
            if (!v) {
                setIsOpen(v)
            }
        }}>
            <DialogTrigger onClick={() => setIsOpen(true)} asChild>
                <Button>Upload PDF <UploadCloudIcon className="h-5 w-5 ml-4 text-white animate-bounce" /></Button>
            </DialogTrigger>
            <DialogContent >
                <UploadDropZone />
            </DialogContent>
        </Dialog>
    )
}

export default UploadButton