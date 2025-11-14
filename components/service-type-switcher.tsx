"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { SwitchCamera } from "lucide-react"
import { useRouter } from "next/navigation"

export function ServiceTypeSwitcher() {
  const [userType, setUserType] = useState<"demandante" | "oferente">("demandante")
  const router = useRouter()

  const handleSwitchType = () => {
    const newType = userType === "demandante" ? "oferente" : "demandante"
    setUserType(newType)

    // Navigate to the appropriate page
    if (newType === "demandante") {
      router.push("/help")
    } else {
      router.push("/earn")
    }
  }

  return (
    <Button
      onClick={handleSwitchType}
      variant="outline"
      className="flex items-center gap-2 fixed bottom-20 right-6 z-10 shadow-md"
    >
      <SwitchCamera className="h-4 w-4" />
      <span>Cambiar a {userType === "demandante" ? "oferente" : "demandante"}</span>
    </Button>
  )
}
