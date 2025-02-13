import Breadcrumbs from "@/components/common/Breadcrumbs"
import MetaTitle from "@/components/common/MetaTitle"

export default function HomePage() {
  return (
    <>
      <MetaTitle />
      <Breadcrumbs />
      <div className="mt-6 flex justify-center">Home</div>{" "}
    </>
  )
}
