# ANGELA 个人作品集

React + Vite 单页网站，PC 版心上限 1700px，包含移动端适配。

## 运行

```sh
pnpm install
pnpm dev
```

生产构建：`pnpm build`。构建产物在 `dist`。
也可使用 npm install / npm run dev；项目当前保留 pnpm 锁文件。

## 内容和素材

- 文案和两段经历来自工作目录中的简历，未虚构任职时间或绩效。
- `src/main.jsx`：页面内容、项目详情和交互。
- `src/style.css`：全局设计与响应式布局。
- `public/resume.pdf`：原始简历。
- `public/assets/central.svg`、`library.svg`：概念系统图，非实际项目截图，可直接替换为作品图片。
- 字母 A 为身份标记；提供真实人物素材后可替换。
- 联系电话按用户提供的掩码形式 `189**6738654` 显示；邮箱 `angela@yueji.com` 提供 mailto 链接。未设置掩码电话的拨号链接。
- 02 / 05 / 01 统计的是核心经历、能力方向和组织建设全流程，不代表业务绩效。
- 首屏视频：首次加载时按视口选择 `public/assets/hero-desktop.mp4`（720p，25.85MB）或 `hero-mobile.mp4`（不超过700px，540p，14.32MB），播放中不随窗口变化切换。保留完整时长、颜色与原AAC音轨；默认静音自动播放一次，不循环，可开启音乐、暂停及重播。使用 `hero-poster.jpg` 作为首帧海报。原文件保留在项目外的上级素材目录，不随网站发布。
- 视频通过双遍H.264编码、两秒关键帧间隔及faststart优化。使用 `pnpm preview` 预览构建版本，确保视频分段请求返回206；不要用不支持Range的普通文件服务器测试视频跳转。`optimize-video.cjs` 可在原素材仍存在时重新生成视频。
- 中文衬线字体使用本机字体，不请求外部字体服务。

已提供导航滚动、项目详情弹窗、视频暂停、简历查看、返回顶部和减少动态效果设置支持。
