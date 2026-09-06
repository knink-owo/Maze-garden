import { JSX } from "preact"
import { QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { classNames } from "../../util/lang"

/**
 * 文章底部日期：创建时间 + 更新时间，低调小字。
 * 替代社区 content-meta（后者只显示一个日期，且空文章不渲染）。
 * 日期数据由 mazeDates 转换器从 frontmatter / git 历史 / 文件系统推断。
 */
const ArticleDates = (() => {
  const Component = (props: QuartzComponentProps) => {
    const { fileData, cfg, displayClass } = props
    const dates = fileData.dates
    if (!dates) return null

    const locale = cfg.locale || "en-US"
    const fmt = (d: Date) =>
      d.toLocaleDateString(locale, { year: "numeric", month: "short", day: "2-digit" })

    const parts: (JSX.Element | null)[] = []
    if (dates.created) {
      parts.push(
        <span class="maze-date-created">
          创建于 <time datetime={dates.created.toISOString()}>{fmt(dates.created)}</time>
        </span>,
      )
    }
    if (dates.modified) {
      parts.push(
        <span class="maze-date-modified">
          更新于 <time datetime={dates.modified.toISOString()}>{fmt(dates.modified)}</time>
        </span>,
      )
    }
    if (parts.length === 0) return null

    return <p class={classNames(displayClass, "maze-article-dates")}>{parts}</p>
  }

  Component.css = `
.maze-article-dates {
  margin: 0.75rem 0 0 0;
  color: var(--darkgray);
  font-size: 0.85rem;
  line-height: 1.5;
}
.maze-article-dates > span {
  display: inline-block;
}
.maze-article-dates > span + span {
  margin-left: 0.9rem;
}
`

  return Component
}) satisfies QuartzComponentConstructor

export default ArticleDates
