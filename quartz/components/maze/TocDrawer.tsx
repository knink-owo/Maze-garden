import { QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { classNames } from "../../util/lang"

/**
 * 左侧目录抽屉：
 * - 屏幕左缘一条竖排"目录"滑块，点击展开/收起
 * - 抽屉内：当前文章的目录（来自 table-of-contents 转换器的 fileData.toc）
 *           + 当前文章字数统计
 * 位置 fixed，覆盖在内容之上，不占布局。
 */

function collectText(node: any): string {
  if (!node) return ""
  if (node.type === "text") return String(node.value ?? "")
  if (Array.isArray(node.children)) return node.children.map(collectText).join("")
  return ""
}

function countWords(tree: any): number {
  const text = collectText(tree)
  const cjk = (text.match(/[\u4e00-\u9fff]/g) ?? []).length
  const latin = (text.match(/[A-Za-z0-9]+/g) ?? []).length
  return cjk + latin
}

const TocDrawer = (() => {
  const Component = (props: QuartzComponentProps) => {
    const { fileData, tree } = props
    const toc = (fileData.toc ?? []) as { depth: number; text: string; slug: string }[]
    const words = countWords(tree)
    const wordsText = words >= 10000 ? `${(words / 10000).toFixed(1)} 万` : String(words)
    const title = fileData.frontmatter?.title ?? fileData.title ?? fileData.slug

    return (
      <div class={classNames("maze-toc")}>
        <button class="maze-toc-tab" aria-label="目录" title="目录">
          目录
        </button>
        <div class="maze-toc-drawer" role="dialog" aria-label="目录">
          <div class="maze-toc-articletitle">{title}</div>
          <div class="maze-toc-head">
            <span class="maze-toc-title">目录</span>
            <span class="maze-toc-meta">{wordsText} 字</span>
          </div>
          {toc.length > 0 ? (
            <ul class="maze-toc-list">
              {toc.map((t) => (
                <li key={t.slug} data-depth={t.depth}>
                  <a href={`#${t.slug}`}>{t.text}</a>
                </li>
              ))}
            </ul>
          ) : (
            <p class="maze-toc-empty">（本文没有小标题）</p>
          )}
        </div>
      </div>
    )
  }

  Component.afterDOMLoaded = `(function () {
  document.addEventListener('click', function (ev) {
    var drawer = document.querySelector('.maze-toc-drawer')
    if (!drawer) return
    var tab = ev.target && ev.target.closest ? ev.target.closest('.maze-toc-tab') : null
    if (tab) { drawer.classList.toggle('active'); return }
    var link = ev.target && ev.target.closest ? ev.target.closest('.maze-toc-drawer a') : null
    if (link) { drawer.classList.remove('active'); return }
    if (!ev.target.closest('.maze-toc-drawer')) { drawer.classList.remove('active') }
  })
  document.addEventListener('nav', function () {
    document.querySelectorAll('.maze-toc-drawer').forEach(function (d) { d.classList.remove('active') })
  })
})()`

  return Component
}) satisfies QuartzComponentConstructor

export default TocDrawer