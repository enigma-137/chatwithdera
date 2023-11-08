"use client"
// trpc.useUtils()
import {Document, Page, pdfjs} from "react-pdf"
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

interface pdfRendererProps{
  url: string
}


const PdfRenderer = ({url}: pdfRendererProps) => {
  return (
    <div className='w-full bg-white shadow rounded-md flex flex-col items-center '>
      <div className='h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2'>
        <div className='flex items-center gap-1.5'>Top bar</div>
      </div>


      {/* PDF RENDERER */}
     <div className='flex-1 max-h-screen w-full  '>
      <div>
        <Document file={url} className='max-h-full '>
          <Page pageNumber={1} />
          
        </Document>
      </div>
     </div>
    </div>
  )
}

export default PdfRenderer