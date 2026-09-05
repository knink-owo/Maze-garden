import { QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { classNames } from "../../util/lang"
import { resolveRelative } from "../../util/path"

/**
 * 反向链接（文章底部）：标题 + frontmatter description 摘要。
 * 没有任何文章链接到当前页时不渲染。
 */
export interface BacklinksOptions {
  /** 显示摘要（description） */
  showDescription?: boolean
}

const Backlinks = ((opts?: BacklinksOptions) => {
  const showDescription = opts?.showDescription ?? true

  const Component = (props: QuartzComponentProps) => {
    const { fileData, allFiles } = props
    const backlinks = allFiles.filter(
      (f) => f.slug !== fileData.slug && (f.links ?? []).includes(fileData.slug),
    )
    if (backlinks.length === 0) return null

    return (
      <div class={classNames("maze-backlinks")}>
        <h3>反向链接</h3>
        <ul>
          {backlinks.map((f) => (
            <li>
              <a class="internal" href={resolveRelative(fileData.slug, f.slug)}>
                {f.frontmatter?.title ?? f.slug}
              </a>
              {showDescription && f.frontmatter?.description && (
                <p class="maze-backlinks-desc">{f.frontmatter.description}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return Component
}) satisfies QuartzComponentConstructor

export default Backlinks
