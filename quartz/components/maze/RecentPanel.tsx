import { QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { classNames } from "../../util/lang"
import { resolveRelative } from "../../util/path"

/**
 * 最近更新面板：右上角图标召唤的悬浮层。
 * 默认隐藏（CSS），列表按修改时间倒序（默认 10 条），
 * 底部附带全站统计。
 */
export interface RecentPanelOptions {
  limit?: number
}

const dateFmt = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
})

const RecentPanel = ((opts?: RecentPanelOptions) => {
  const limit = opts?.limit ?? 10

  const Component = (props: QuartzComponentProps) => {
    const { fileData, allFiles } = props

    const items = allFiles
      .filter((f) => f.slug !== "index" && !f.slug.endsWith("/index") && f.slug !== "404")
      .sort((a, b) => (b.dates?.modified?.getTime() ?? 0) - (a.dates?.modified?.getTime() ?? 0))
      .slice(0, limit)

    const pages = allFiles.filter((f) => !f.slug.endsWith("/index") && f.slug !== "index")
    const words = allFiles.reduce((n, f) => n + (f.text?.length ?? 0), 0)
    const links = allFiles.reduce((n, f) => n + (f.links?.length ?? 0), 0)
    const wordsText = words >= 10000 ? `${(words / 10000).toFixed(1)} 万字` : `${words} 字`

    return (
      <div class={classNames("maze-recent-overlay")} id="maze-recent-overlay">
        <div class="maze-recent-panel" role="dialog" aria-label="最近更新">
          <div class="maze-recent-head">
            <h3>最近更新</h3>
            <button class="maze-recent-close" aria-label="关闭">
              ✕
            </button>
          </div>
          <ul class="maze-recent-list">
            {items.map((f) => (
              <li key={f.slug}>
                <a class="internal" href={resolveRelative(fileData.slug, f.slug)}>
                  {f.frontmatter?.title ?? f.slug}
                </a>
                {f.frontmatter?.description && <p class="maze-recent-desc">{f.frontmatter.description}</p>}
                {f.dates?.modified && <time>{dateFmt.format(f.dates.modified)}</time>}
              </li>
            ))}
          </ul>
          <p class="maze-stats">
            共 {pages.length} 篇文章 · 约 {wordsText} · {links} 条链接
          </p>
        </div>
      </div>
    )
  }

  Component.afterDOMLoaded = `(function () {
  document.addEventListener('click', function (ev) {
    var ov = document.querySelector('.maze-recent-overlay')
    if (!ov) return
    if (ev.target && ev.target.closest && ev.target.closest('.maze-recent-close')) {
      ov.classList.remove('active')
      return
    }
    if (ev.target === ov) { ov.classList.remove('active') }
  })
})()`

  return Component
}) satisfies QuartzComponentConstructor

export default RecentPanel
