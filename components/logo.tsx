import Image from "next/image"
import Link from "next/link"

export function Logo({width = 150, height = 40}) {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <Image 
        src="/logoGigsy.png" 
        alt="Gigsy" 
        width={width} 
        height={height} 
        className="w-auto" 
        priority
        loading="eager"
      />
    </Link>
  )
}
