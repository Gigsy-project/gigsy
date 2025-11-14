import Image from "next/image"
import Link from "next/link"

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <Image 
        src="/logoGigsy.png" 
        alt="Gigsy" 
        width={150} 
        height={40} 
        className="h-15 w-auto" 
        priority
        loading="eager"
      />
    </Link>
  )
}
