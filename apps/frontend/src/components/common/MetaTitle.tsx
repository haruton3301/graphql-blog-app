import site from "@/libs/constants/site"

type Props = {
  title?: string
}

export default function MetaTitle({ title }: Props) {
  return <title>{title ? `${title} - ${site.title}` : site.title}</title>
}
