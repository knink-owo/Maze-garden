import fs from "fs"
import path from "path"
import { QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { classNames } from "../../util/lang"
import { pathToRoot } from "../../util/path"

/**
 * 迷宫图标簇（右上角）：
 * 🎵 音乐 · 🎲 随机漫步 · 🕘 最近更新 · 🕸 关系图谱 · 📡 RSS
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
    const rssHref = `${pathToRoot(fileData.slug)}index.xml`

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
        <a class="maze-icon" href={rssHref} aria-label="RSS 订阅" title="RSS 订阅">
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
            <path d="M4 11a9 9 0 0 1 9 9" />
            <path d="M4 4a16 16 0 0 1 16 16" />
            <circle cx="5" cy="19" r="1.5" fill="currentColor" stroke="none" />
          </svg>
        </a>
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
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(musicFiles.map((f) => `static/music/${f}`)),
            }}
          />
        )}
      </div>
    )
  }

  Component.afterDOMLoaded = `(function () {
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
      audio.src = tracks[0]
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
