# 🎯 《上課現場教師實戰主持手冊（Runbook）》— 5 位實作學員專屬版
> **適用課程**：5 人連線萬物大逃殺（Vibe Coding 協作開發）  
> **正式網址**：`https://vibe-battle-royale.vercel.app/`  
> **GitHub Repo**：`https://github.com/stubipapa/vibe-battle-royale`

---

## 課前 5 分鐘教師準備檢查表

- [ ] 確認投影機電腦 Chrome 可開啟 `https://vibe-battle-royale.vercel.app/` 且「練習模式」正常。
- [ ] 將 **給學生的課堂小抄**（[student-handout.md](./student-handout.md)）傳送到課堂群組／白板（其餘 `.agent/`、`index.html`、`config/`、`modules/` 學生會在步驟 2 `git clone` 時自動全部拉下來）。
- [ ] 請 **5 位學員**先登入自己的 GitHub 帳號，並報上 GitHub ID。

---

## 階段 1：開場介紹與粗糙原型展示（10～15 分鐘）

### 教師講台操作步驟
1. 用 Chrome 打開 `https://vibe-battle-royale.vercel.app/`，點擊 **「🧪 練習模式（單人示範／測試）」**。
2. 現場示範操作：`↑ ↓ ← →` 移動、`Z / X` 逆順時針旋轉、`Space` 開火、點擊下方 **`🎲 重新隨機盲盒`**。
3. 說明今日任務：
   - 現在畫面只是最粗糙的「方塊互射」，等一下 **5 位學員**每人各自負責改造 **1 個外掛模組**（不能動到核心引擎 `index.html` 與別人的檔案）。
   - 專案內建 `.agent/` 規範，會引導大家的 AI 遵守合約、又不限制創意。
4. **現場加入 GitHub 協作者（重要！）**：
   - 進入 `https://github.com/stubipapa/vibe-battle-royale/settings/access` → 點 **`Add people`** → 依序輸入 **5 位學員**的 GitHub ID。
   - **立刻請 5 位學員收信（或開啟 GitHub 通知）點擊 `Accept Invitation`**，權限才會生效！

---

## 階段 2：學員檢查環境並把專案拉下來（5～10 分鐘）

> 💡 以下每個步驟皆提供 **「方式 A：指令操作」** 與 **「方式 B：直接下 Prompt 給 Antigravity 2.0」**，可依學員程度自由選用。

### 步驟 2-1：檢查電腦是否裝好 GitHub 與本地測試工具
- **方式 A（終端機指令）**：依序執行確認版本與登入狀態：
  ```bash
  git --version
  git config --global user.name
  git config --global user.email
  gh --version
  gh auth status
  python3 --version   # Windows 若無則執行 python --version
  node --version
  ```
- **方式 B（直接 Prompt 給 Antigravity 2.0）**：開啟 **Antigravity 2.0**，複製貼上以下文字：
  > 「請幫我在終端機檢查我的電腦是否具備下載 GitHub 專案與本地測試環境：`git --version`、`git config --global user.name`、`git config --global user.email`、`gh --version`、`gh auth status`、`python3 --version`（Windows 若無則測 `python --version`）、`node --version`。若有缺少任何項目或還沒設定 `gh auth setup-git`，請直接給我安裝或登入指令。」

### 步驟 2-2：把專案下載到桌面並用 Antigravity 2.0 開啟
- **方式 A（終端機指令）**：
  ```bash
  cd ~/Desktop
  git clone https://github.com/stubipapa/vibe-battle-royale.git
  ```
- **方式 B（直接 Prompt 給 Antigravity 2.0）**：
  > 「請幫我把 `https://github.com/stubipapa/vibe-battle-royale.git` 下載（`git clone`）到我的桌面 `~/Desktop/vibe-battle-royale`（如果桌面已有舊的同名資料夾請先提醒我）。」
- **⚠️ 必做確認（關鍵！）**：
  1. 下載完成後，請學員在 **Antigravity 2.0** 選取並開啟 **`vibe-battle-royale` 這一層資料夾**作為工作區（不可開在外層 Desktop，否則 `.agent/` 規範不會載入）。
  2. 開好資料夾後，可問 AI 一句：**「`github 相關工具是否已經裝好？`」**（測試專案內的 `env-check` Skill 已成功載入）。

---

## 階段 3：認領 5 人分工、確認可改內容與開分支（5～10 分鐘）

### 步驟 3-1：學員確認自己能設計與準備的內容
請教師分配 **1～5 號角色**，學員直接在開啟的 `vibe-battle-royale` 視窗問 AI（自動觸發 `role-assignment` 分工 Skill）：
> **「我是學生 X，我能設計什麼？我可以準備哪些素材、修改哪些內容？」** *(將 X 換成 1～5)*

AI 會回覆該學員**負責的檔案**、**可準備的創意素材**（如 5～6 種萬物造型／圖片、3 種攻擊特效、戰場主題、空投箱與選配頒獎台），以及 **3 條安全底線**。

### 步驟 3-2：建立並切換到自己的專屬分支（5 人分工對照）
- **方式 A（終端機指令，依學員編號 1～5 擇一執行）**：
  - 學生 1（`config/characters.config.js` — 角色外觀與體質師）：`git checkout -b feat/student-1-characters`
  - 學生 2（`modules/attacks_normal.js` — 常規攻擊形式師）：`git checkout -b feat/student-2-normal-attacks`
  - 學生 3（`modules/attacks_special.js` — 特殊攻擊形式師）：`git checkout -b feat/student-3-special-attacks`
  - 學生 4（`config/arena.config.js` — 戰場環境與縮圈師）：`git checkout -b feat/student-4-arena`
  - 學生 5（`modules/items.js` 主責 ＋ 可選配美化 `config/rules.config.js` — 戰場道具與決戰 UI 師）：`git checkout -b feat/student-5-items`
- **方式 B（直接 Prompt 給 Antigravity 2.0）**：
  > 「我是學生 X，請幫我確認目前在專案目錄中，並建立切換到我的專屬 Git 分支 `feat/student-X-...`。」

---

## 階段 4：Vibe Coding 創作與在自己電腦測試（30 分鐘）

### 步驟 4-1：請 AI 改造模組（學員發揮創意）
學員可參考 [student-handout.md](./student-handout.md) 第三步的範例，或自由用自然語言請 AI 設計。例如：
- 學生 1：> 「我是學生 1，請幫我把角色改成【香蕉、原子筆、橡皮擦、珍奶、西瓜、貓咪】，畫出各自造型並調整合理速度與血量。」
- 學生 2：> 「我是學生 2，請幫我把編號 0, 1, 2 武器改成【噴發七彩彩虹、橡皮擦屑散彈、高速紅筆芯】，畫出圖案並遵守 `hitRadius <= visualRadius`。」
- 學生 3：> 「我是學生 3，請幫我把編號 3, 4, 5 武器改成【飛很慢的巨型西瓜、旋轉直尺、波紋墨水球】，畫出動態圖案並遵守 `hitRadius <= visualRadius`。」
- 學生 4：> 「我是學生 4，請幫我把背景改成【綠色課桌切割墊】，並設計有警示特效的縮圈。」
- 學生 5：> 「我是學生 5，請幫我把空投箱改成【發光問號神秘禮盒】與 3 種驚喜 Buff（若完成後也想美化吃雞頒獎台，可再請 AI 一併美化 `config/rules.config.js`）。」

### 步驟 4-2：語法檢查與本機 Chrome「練習模式」試玩
- **方式 A（終端機指令）**：
  ```bash
  # 1. 語法檢查
  node --check <你負責的檔案路徑>

  # 2. 啟動本地 HTTP 伺服器（不可直接雙擊 index.html）
  python3 -m http.server 8080     # Windows 若無 python3 可改試 python 或 py
  ```
- **方式 B（直接 Prompt 給 Antigravity 2.0）**：
  > 「請幫我用 `node --check` 檢查我修改的模組語法有沒有錯，並幫我在 8080 port 啟動本地靜態伺服器，讓我可以用 Chrome 預覽。」
- **Chrome 預覽步驟**：
  1. 打開筆電 Chrome，網址輸入 **`http://localhost:8080`**，點選 **「🧪 練習模式」**。
  2. 每次請 AI 修改存檔後，在 Chrome 按 **強制重新整理**（macOS：`Cmd + Shift + R`／Windows：`Ctrl + Shift + R`）。
  3. 測試小技巧：學生 1～3 可多按下方 **`🎲 重新隨機盲盒`**；學生 5 等 5 秒看空投（若選配改結算畫面，擊敗 2 個標靶看結算、走到紅圈外扣血歸零看觀戰畫面）。

---

## 階段 5：學員自我健檢 → 開分支丟上 GitHub 給老師審核（10 分鐘）

### 步驟 5-1：上傳前先自我合規健檢（觸發 `verify-tank-game` Skill）
請學員在 Antigravity 2.0 對話框輸入以下 Prompt：
> **「幫我檢查我的修改合不合規，我可以推送分支了嗎？」**

AI 會自動檢查：是否只改自己負責的檔案、語法有無錯誤、匯出是否完整、`hitRadius <= visualRadius` 與護欄上限、額外按鍵 ≤ 3 種，並給予優化建議。

### 步驟 5-2：提交並推送到 GitHub
- **方式 A（終端機指令）**：
  ```bash
  git status                                # 確認只有自己負責的檔案被修改
  # （若誤改到 index.html 或他人檔案，執行 git checkout -- <誤改檔案> 還原）
  git add <你負責的檔案路徑>
  git commit -m "feat(student-X): 完成模組設計"
  git push -u origin <你的分支名稱>
  ```
- **方式 B（直接 Prompt 給 Antigravity 2.0）**：
  > 「請幫我檢查 `git status` 確認我只改了我負責的檔案（若有誤改其他檔案請幫我還原），然後幫我 `git add`、`git commit` 並 `git push` 到我目前的遠端分支。」

### 步驟 5-3：發起 Pull Request (PR)
- **方式 A（網頁手動）**：打開 `https://github.com/stubipapa/vibe-battle-royale` → 點擊上方黃色 **`Compare & pull request`** → 填寫名字與設計亮點 → 點 **`Create pull request`**。
- **方式 B（直接 Prompt 給 Antigravity 2.0）**：
  > 「請幫我用 `gh pr create` 建立一個合併到 `main` 的 Pull Request，標題寫上我的編號與設計重點。」

---

## 階段 6：教師用 AI 審核 5 份 PR → 合併上線 → 教師觀戰 5 人開打（15～20 分鐘）

### 步驟 6-1：教師下指令讓 Antigravity 審查所有 PR（觸發 `teacher-pr-review` Skill）
在您自己的電腦打開本專案的 Antigravity，直接輸入以下 Prompt：
> **「請幫我用 `teacher-pr-review` 檢查目前 GitHub 上所有開啟中的學生 PR，確認他們是否只改到自己負責的檔案、有無語法錯誤、是否符合數值護欄與 `hitRadius <= visualRadius`，全部沒問題再告訴我可以合併！」**

*(若只想審核單一 PR，可說：「請幫我用 `teacher-pr-review` 檢查 GitHub PR #X 是否合規。」)*

### 步驟 6-2：處理退回或放心合併
- **若 AI 回報 `❌ 暫不可合併`**：將錯誤原因投影給該學員，請學員在**原本的分支**對自己的 AI 說：「老師審查說有這些問題：……，請幫我修正後重新 `git add`、`commit`、`push`。」（同一個 PR 會自動更新，**不需重開 PR**），教師再請 AI 重審即可。
- **若 AI 回報 `✅ 審核通過，可以合併（Ready to Merge）`**：到 GitHub PR 頁面安心點擊 **`Merge pull request`**（5 位學員改各自負責的檔案，完全零衝突）。

### 步驟 6-3：Vercel 自動上線 ＋ 教師開房純觀戰 5 人大亂鬥
1. 5 個 PR 全部合併進 `main` 後，等待 **15～30 秒**讓 Vercel 自動建置完成。
2. 教師在投影機開啟 `https://vibe-battle-royale.vercel.app/`（按一次 `Cmd+Shift+R` 確保載入最新整合版）。
3. 點 **「🌐 連線模式（須滿 5 人開戰）」→ 輸入教師名稱 → 點「🏠 教師開房（建立房間並觀戰轉播）」**。
4. 點 **「📋 複製邀請連結」** 貼到課堂群組（或直接唸出畫面上的 **6 碼房號**）。
5. **5 位學員**各自用筆電 Chrome 進入邀請連結（或網址點「🌐 連線模式」輸入暱稱與房號 →「🚪 學生加入房間」）。
6. 大廳顯示 **`5 / 5`** 後，教師點擊 **`🚀 5 位學生已到齊！啟動盲盒大逃殺`**（若臨時缺人，下方有 **`⚠️ 緊急以目前人數開戰`** 備援按鈕），全班在投影大螢幕展開盲盒大逃殺！
