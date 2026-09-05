import { QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { classNames } from "../../util/lang"

/**
 * 全站统计：文章数、总字数、链接数。
 * 仅渲染在主页（index）文章末尾，其他页面自隐藏。
 */
const SiteStats = (() => {
  const Component = (props: QuartzComponentProps) => {
    const { fileData, allFiles } = props
    if (fileData.slug !== "index") return null

    const pages = allFiles.filter((f) => !f.slug.endsWith("/index") && f.slug !== "index")
    const words = allFiles.reduce((n, f) => n + (f.text?.length ?? 0), 0)
    const links = allFiles.reduce((n, f) => n + (f.links?.length ?? 0), 0)

    const wordsText = words >= 10000 ? `${(words / 10000).toFixed(1)} 万字` : `${words} 字`

    return (
      <p class={classNames("maze-stats")}>
        共 {pages.length} 篇文章 · 约 {wordsText} · {links} 条链接
      </p>
    )
  }

  return Component
}) satisfies QuartzComponentConstructor

export default SiteStats
