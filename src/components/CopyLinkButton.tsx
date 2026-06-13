'use client'

export default function CopyLinkButton({ link }: { link: string }) {
  return (
    <button 
      className="btn btn-primary" 
      onClick={() => {
        navigator.clipboard.writeText(link)
        alert('Copied to clipboard!')
      }}
    >
      Copy Link
    </button>
  )
}
