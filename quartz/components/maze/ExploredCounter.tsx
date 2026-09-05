import { QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { classNames } from "../../util/lang"

/**
 * 探索进度：本地记录访客已探索的文章数（localStorage，去重）。
 * 显示在文章日期下方，低调小字："已探索 12"。
 */
const ExploredCounter = (() => {
  const Component = (props: QuartzComponentProps) => {
    return (
      <div class={classNames("maze-explored")}>
        已探索 <span class="maze-explored-count">0</span>
      </div>
    )
  }

  Component.afterDOMLoaded = `(function () {
  var KEY = 'maze-explored'
  function currentSlug() {
    return document.body.getAttribute('data-slug') || 'index'
  }
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch (e) { return [] } }
  function save(a) { localStorage.setItem(KEY, JSON.stringify(a)) }
  function render() {
    var n = load().length
    document.querySelectorAll('.maze-explored-count').forEach(function (el) { el.textContent = String(n) })
  }
  function mark() {
    var a = load(), c = currentSlug()
    if (a.indexOf(c) === -1) { a.push(c); save(a) }
    render()
  }
  document.addEventListener('nav', mark)
  mark()
})()`

  return Component
}) satisfies QuartzComponentConstructor

export default ExploredCounter
