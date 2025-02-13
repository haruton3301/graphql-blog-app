import { Link } from "react-router-dom"

export interface Breadcrumb {
  label: string
  path?: string
}

type Props = {
  breadcrumbs?: Array<Breadcrumb>
}

export default function Beadcrumbs({ breadcrumbs }: Props) {
  return (
    <div className="max-w-5xl mx-auto my-2 px-3 breadcrumbs text-sm">
      <ul>
        <li>
          {!!breadcrumbs && breadcrumbs.length > 0 ? (
            <Link to="/">ホーム</Link>
          ) : (
            "ホーム"
          )}
        </li>
        {!!breadcrumbs &&
          breadcrumbs.map((breadcrumb) => (
            <li key={breadcrumb.label}>
              {!!breadcrumb.path ? (
                <Link to={breadcrumb.path}>{breadcrumb.label}</Link>
              ) : (
                breadcrumb.label
              )}
            </li>
          ))}
      </ul>
    </div>
  )
}
