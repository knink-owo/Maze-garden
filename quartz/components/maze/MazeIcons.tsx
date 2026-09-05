import fs from "fs"
import path from "path"
import { QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { classNames } from "../../util/lang"

/**
 * 迷宫图标簇（右上角）：
 * 🎵 音乐 · 🎲 随机漫步 · 🕘 最近更新 · 🕸 关系图谱
 * 音乐按钮仅当 quartz/static/music/ 下存在音频文件时才渲染。
 */
export interface MazeIconsOptions {
  /** 随机漫步排除当前页 */
  excludeCurrent?: boolean
}

const musicDir = path.join(process.cwd(), "quartz", "static", "music")
const musicFiles = fs.existsSync(musicDir)
  ? fs.readdirSync(musicDir).filter((f) => /\.(mp3|ogg|wav|m4a)$/i.test(f))
  : []

const MazeIcons = ((opts?: MazeIconsOptions) => {
  const excludeCurrent = opts?.excludeCurrent ?? true

  const Component = (props: QuartzComponentProps) => {
    const { fileData, allFiles } = props
    const slugs = allFiles
      .map((f) => f.slug)
      .filter(
        (s) =>
          s !== "404" &&
          s !== "index" &&
          !s.endsWith("/index") &&
          (excludeCurrent ? s !== fileData.slug : true),
      )
    return (
      <div class={classNames("maze-icons")}>
        {musicFiles.length > 0 && (
          <button class="maze-icon" data-action="music" aria-label="音乐" title="音乐">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </button>
        )}
        <button class="maze-icon" data-action="random" aria-label="随机漫步" title="随机漫步">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M16 3h5v5" />
            <path d="M4 20L21 3" />
            <path d="M21 16v5h-5" />
            <path d="M15 15l6 6" />
            <path d="M4 4l5 5" />
          </svg>
        </button>
        <button class="maze-icon" data-action="recent" aria-label="最近更新" title="最近更新">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </button>
        <button class="maze-icon" data-action="graph" aria-label="关系图谱" title="关系图谱">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="5" cy="6" r="2.5" />
            <circle cx="19" cy="6" r="2.5" />
            <circle cx="12" cy="18" r="2.5" />
            <path d="M7 7.5L10.5 16" />
            <path d="M17 7.5L13.5 16" />
            <path d="M7.5 6h9" />
          </svg>
        </button>
        <script
          type="application/json"
          class="maze-data"
          data-key="slugs"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(slugs) }}
        />
        {musicFiles.length > 0 && (
          <script
            type="application/json"
            class="maze-data"
            data-key="music"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(musicFiles) }}
          />
        )}
      </div>
    )
  }

  Component.afterDOMLoaded = `(function () {
  // ------------------------------------------------------------------
  // 迷宫花园 · 子路径修正：GitHub Pages 项目站点（/Maze-garden）下，
  // 相对链接（./... ../...）依赖当前 URL 的目录形态，进入 URL 异常时
  // 会解析错位、丢失子路径导致 404。这里在页面加载时把所有内部相对
  // 链接转成"带子路径的绝对链接"，之后不再受当前 URL 影响。
  function normalizeInternalLinks() {
    var base = document.body.getAttribute('data-basepath') || ''
    var sel = 'a.internal, a[href^="./"], a[href^="../"], [src^="./"], [src^="../"]'
    document.querySelectorAll(sel).forEach(function (el) {
      var attr = el.tagName === 'A' ? 'href' : 'src'
      var href = el.getAttribute(attr)
      if (!href) return
      if (/^(https?:|mailto:|tel:|#|\\/)/i.test(href)) return
      var u
      try { u = new URL(href, window.location.href) } catch (e) { return }
      var p = u.pathname
      if (base && p.indexOf(base) !== 0) return
      el.setAttribute(attr, p + u.hash)
    })
  }
  document.addEventListener('nav', normalizeInternalLinks)
  normalizeInternalLinks()
  // ------------------------------------------------------------------
  function getData(key) {
    var el = document.querySelector('.maze-data[data-key="' + key + '"]')
    if (!el) return null
    try { return JSON.parse(el.textContent) } catch (e) { return null }
  }
  function currentSlug() {
    return document.body.getAttribute('data-slug') || 'index'
  }
  function go(slug) {
    var base = document.body.getAttribute('data-basepath') || ''
    var url = base + '/' + slug
    if (window.spaNavigate) { window.spaNavigate(new URL(url, window.location.origin)) } else { window.location.assign(url) }
  }
  var audio = null
  function toggleMusic() {
    if (!audio) {
      var tracks = getData('music')
      if (!tracks || !tracks.length) { console.info('[迷宫花园] 未找到音乐，请把音频放到 quartz/static/music/') ; return }
      audio = document.createElement('audio')
      var base = document.body.getAttribute('data-basepath') || ''
      audio.src = base + '/static/music/' + tracks[0]
      audio.loop = true
      audio.volume = 0.35
      audio.preload = 'none'
      document.body.appendChild(audio)
    }
    if (audio.paused) { audio.play().catch(function (e) { console.info('[迷宫花园] 播放失败', e) }) } else { audio.pause() }
  }
  document.addEventListener('click', function (ev) {
    var btn = ev.target && ev.target.closest ? ev.target.closest('.maze-icon') : null
    if (!btn) return
    var action = btn.getAttribute('data-action')
    if (!action) return
    if (action === 'random') {
      var slugs = getData('slugs') || []
      var cur = currentSlug()
      var pool = slugs.filter(function (s) { return s !== cur })
      if (pool.length) { go(pool[Math.floor(Math.random() * pool.length)]) }
    } else if (action === 'recent') {
      var ov = document.querySelector('.maze-recent-overlay')
      if (ov) ov.classList.toggle('active')
    } else if (action === 'graph') {
      // 图谱脚本在事件派发中同步 click 会失效，延迟一拍再触发
      setTimeout(function () {
        var icon = document.querySelector('.global-graph-icon')
        if (icon) icon.click()
      }, 0)
    } else if (action === 'music') {
      toggleMusic()
    }
  }, true)
})()`

  return Component
}) satisfies QuartzComponentConstructor

export default MazeIcons
