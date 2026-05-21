import { useState } from "react"

import TipModal from "./TipModal"
import TipPill from "./TipPill"

type TipExperienceProps = {
  creatorName: string
  platform: "youtube" | "twitter"
  sourceUrl: string
}

export function TipExperience({
  creatorName,
  platform,
  sourceUrl
}: TipExperienceProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <TipPill creatorName={creatorName} onClick={() => setOpen(true)} />
      <TipModal
        creatorName={creatorName}
        onClose={() => setOpen(false)}
        open={open}
        platform={platform}
        sourceUrl={sourceUrl}
      />
    </>
  )
}

export default TipExperience
