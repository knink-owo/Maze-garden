import fs from "fs"
import path from "path"
import { styleText } from "util"
import { Repository, Commit } from "@napi-rs/simple-git"
import { QuartzTransformerPluginInstance } from "../types"
import { BuildCtx } from "../../util/ctx"

/**
 * 迷宫花园 · 日期推断转换器
 *
 * 每篇文章的「创建时间 / 修改时间」按以下优先级推断（零维护）：
 *   1. frontmatter —— `created` 或 `date`（创建时间）、`modified`（修改时间）、`published`（发布时间）
 *   2. git 历史    —— 首次包含该文件的提交 ≈ 创建时间；最后一次提交 ≈ 修改时间
 *   3. 文件系统    —— birthtime / mtime 兜底
 *
 * 与设计文档约定一致：「首次提交时间≈创建时间、最后提交≈修改时间」。
 * 结果写入 `file.data.dates`（{created, modified, published}）并设置 defaultDateType，
 * 供底部日期组件、最近更新面板等消费。
 */

const iso8601DateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/

function coerceDate(fp: string, d: unknown): Date {
  let value: unknown = d
  if (typeof value === "string" && iso8601DateOnlyRegex.test(value)) {
    value = `${value}T00:00:00`
  }
  const dt =
    value === undefined
      ? new Date()
      : value === null
        ? new Date(0)
        : new Date(value as string | number)
  const invalidDate = isNaN(dt.getTime()) || dt.getTime() === 0
  if (invalidDate && d !== undefined) {
    console.log(
      styleText(
        "yellow",
        `
Warning: found invalid date "${String(d)}" in \`${fp}\`. Supported formats: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format`,
      ),
    )
  }
  return invalidDate ? new Date() : dt
}

/** 收集仓库全部提交（oid + 提交时间），从 HEAD 沿 parent 链遍历并去重。 */
function collectCommits(repo: Repository): { oid: string; time: number }[] {
  const head = repo.head()
  const headTarget = head.target()
  if (!headTarget) return []
  const root = repo.findCommit(headTarget)
  if (!root) return []

  const out: { oid: string; time: number }[] = []
  const queue: Commit[] = [root]
  const seen = new Set<string>()
  while (queue.length) {
    const c = queue.shift()!
    if (seen.has(c.id())) continue
    seen.add(c.id())
    out.push({ oid: c.id(), time: c.time().getTime() })
    const n = Number(c.parentCount())
    for (let i = 0; i < n; i++) {
      const parent = repo.findCommit(c.parentId(i))
      if (parent) queue.push(parent)
    }
  }
  return out
}

/** 找到最早包含该路径的提交时间（≈ 创建时间）。*/
function firstCommitTime(
  repo: Repository,
  commits: { oid: string; time: number }[],
  relPath: string,
): number | undefined {
  let min = Infinity
  for (const { oid } of commits) {
    const c = repo.findCommit(oid)
    if (!c) continue
    const tree = c.tree()
    if (tree.getPath(relPath)) {
      const t = c.time().getTime()
      if (t < min) min = t
    }
  }
  return min === Infinity ? undefined : min
}

export type MazeDatesOptions = {
  priority?: ("frontmatter" | "git" | "filesystem")[]
  defaultDateType?: "created" | "modified" | "published"
}

export const MazeDates = (opts?: MazeDatesOptions): QuartzTransformerPluginInstance => {
  const options = {
    priority: ["frontmatter", "git", "filesystem"] as const,
    defaultDateType: "modified" as const,
    ...opts,
  }

  return {
    name: "MazeDates",
    markdownPlugins(ctx: BuildCtx) {
      let repo: Repository | undefined
      let repositoryWorkdir: string | undefined
      let commits: { oid: string; time: number }[] | undefined

      if (options.priority.includes("git")) {
        try {
          repo = Repository.discover(ctx.argv.directory)
          repositoryWorkdir = repo.workdir() ?? ctx.argv.directory
          commits = collectCommits(repo)
        } catch {
          console.log(
            styleText(
              "yellow",
              `\nWarning: couldn't find git repository for ${ctx.argv.directory}`,
            ),
          )
        }
      }

      return [
        () => async (_tree: unknown, file: { data: Record<string, any> }) => {
          const data = file.data
          const fp = data.relativePath as string
          const fullFp = data.filePath as string

          let created: unknown
          let modified: unknown
          let published: unknown

          for (const source of options.priority) {
            if (source === "frontmatter" && data.frontmatter) {
              created ||= data.frontmatter.created ?? data.frontmatter.date
              modified ||= data.frontmatter.modified
              published ||= data.frontmatter.published
            } else if (source === "git" && repo && repositoryWorkdir && commits) {
              try {
                const relPath = path.relative(repositoryWorkdir, fullFp).split(path.sep).join("/")
                modified ||= await repo.getFileLatestModifiedDateAsync(relPath)
                created ||= firstCommitTime(repo, commits, relPath)
              } catch {
                console.log(
                  styleText(
                    "yellow",
                    `\nWarning: ${data.filePath} isn't yet tracked by git, dates will be inaccurate`,
                  ),
                )
              }
            } else if (source === "filesystem") {
              try {
                const st = await fs.promises.stat(fullFp)
                created ||= st.birthtimeMs
                modified ||= st.mtimeMs
              } catch {
                /* stat failed: leave empty */
              }
            }
          }

          data.dates = {
            created: coerceDate(fp, created),
            modified: coerceDate(fp, modified),
            published: coerceDate(fp, published),
          }
          data.defaultDateType = options.defaultDateType
        },
      ]
    },
  }
}
