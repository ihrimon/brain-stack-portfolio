import { PrimaryButton } from "@/components/buttons/PrimaryButton"
import { StatusPage } from "@/components/shared/StatusPage"

export default function NotFound() {
  return (
    <StatusPage
      watermark="404"
      badge="404 Error"
      title="Page Not Found"
      description="The page you are looking for does not exist or may have been moved."
    >
      <PrimaryButton href="/">Back to Home</PrimaryButton>
    </StatusPage>
  )
}
