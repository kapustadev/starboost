'use client'
import { toast } from 'react-hot-toast'

export default function CopyLinkButton({ link }: { link: string }) {
  return (
    <button 
      className="btn btn-primary" 
      onClick={() => {
        navigator.clipboard.writeText(link)
        toast.success('Copied to clipboard!')
      }}
    >
      Copy Link
    </button>
  )
}
