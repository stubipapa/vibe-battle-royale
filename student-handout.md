# 🎮 6 人連線萬物大逃殺：學生課堂實戰小抄

> **歡迎來到 Vibe Coding 課堂！**
> 在這堂課中，我們 6 個人將各自改造一個遊戲外掛模組，最後透過 GitHub 零衝突合併，在 30 秒內自動上線成大家都能一起玩的「盲盒大逃殺」網頁遊戲！

---

## 第一步：檢查電腦環境（約 2 分鐘）

> **注意**：在還沒下載專案資料夾前，專案內的 `.agent/` 規範尚未載入。
> - **若老師已先幫你下載好專案並打開資料夾**：直接在 Antigravity 問 **`github 相關工具是否已經裝好？`**（會自動觸發 `env-check` 檢查）。
> - **若尚未下載專案**：請打開 Antigravity，直接複製以下完整指令貼給 AI 幫你檢查：
>   > 「請幫我在終端機檢查電腦是否具備下載 GitHub 專案與本地測試環境：`git --version`、`git config --global user.name`、`git config --global user.email`、`gh --version`、`gh auth status`、`python3 --version`（Windows 若無則測 `python --version`）、`node --version`，並附上缺失項目的安裝／登入指令（記得含 `gh auth setup-git`）。」

確認以上工具皆已就緒（若缺項目請依 AI 指示安裝或執行 `gh auth login` + `gh auth setup-git`）即可進入下一步。

---

## 第二步：下載遊戲專案並切換專屬分支（約 3 分鐘）

### 1. 下載專案到桌面
在終端機（或請 Antigravity）先切換到桌面再下載（若桌面已有舊的 `vibe-battle-royale` 請先刪除或改名）：
```bash
cd ~/Desktop
git clone https://github.com/stubipapa/vibe-battle-royale.git
```

### 2. 用 Antigravity IDE 開啟專案資料夾
- 在 Antigravity 點選 **Open Folder**，務必選到 **`vibe-battle-royale` 這一層資料夾**（不要開在外層 Desktop）。
- 開啟後，專案內的 `.agent/` 規範就會自動生效！此時你可以問 AI **`github 相關工具是否已經裝好？`** 再雙重確認一次環境。

### 3. 在已開啟的專案視窗中，切換你的專屬分支（依編號擇一）
請在 Antigravity 內建終端機（或請 AI 執行）切換分支，並確認自己**唯一可修改的檔案**：

- **學生 1（角色外觀與體質師）** → 負責 `config/characters.config.js`
  ```bash
  git checkout -b feat/student-1-characters
  ```
- **學生 2（常規攻擊形式師）** → 負責 `modules/attacks_normal.js`
  ```bash
  git checkout -b feat/student-2-normal-attacks
  ```
- **學生 3（特殊攻擊形式師）** → 負責 `modules/attacks_special.js`
  ```bash
  git checkout -b feat/student-3-special-attacks
  ```
- **學生 4（戰場環境與縮圈師）** → 負責 `config/arena.config.js`
  ```bash
  git checkout -b feat/student-4-arena
  ```
- **學生 5（戰場道具師）** → 負責 `modules/items.js`
  ```bash
  git checkout -b feat/student-5-items
  ```
- **學生 6（規則與結算 UI 師）** → 負責 `config/rules.config.js`
  ```bash
  git checkout -b feat/student-6-rules-ui
  ```

---

## 第三步：認領分工與 Vibe Coding 創作（約 35 分鐘）

### 1. 先向 Antigravity 確認你的設計權限（觸發「分工」Skill）
在 Antigravity 對話框輸入你的角色編號，例如：
> **`我是學生 2，我能設計什麼？`**

AI 會自動讀取 `.agent/skills/role-assignment/SKILL.md`，告訴你唯一可修改的檔案與數值護欄。

### 2. 全班共同遵守的 3 條鐵則
1. **檔案邊界**：只修改自己負責的那 **1 個檔案**，絕不修改 `index.html`、`.agent/` 或其他組員的檔案。
2. **操作與按鍵限制**：固定操作為 `↑ ↓ ← →` 移動、`Z`/`X` 旋轉瞄準、`Space` 開火；若要新增額外按鍵功能，**最多不超過 3 種**。
3. **碰撞範圍鐵則（學生 2、3 必看）**：攻擊判定半徑 `hitRadius` **最大只能等於武器視覺圖案半徑 `visualRadius`**，不可做隱形超大子彈。

### 3. 各角色 Vibe Coding 開工提示詞範例（複製後修改括號內容）
- **學生 1（`config/characters.config.js`）**：
  > 「我是學生 1，請幫我把 6 個角色設計成【香蕉、原子筆、橡皮擦、珍珠奶茶、西瓜、貓咪】，實作各自的 Canvas 繪圖 `drawCharacter(ctx, player)`（記得自行 `ctx.translate(player.x, player.y)` 與 `ctx.rotate(player.angle)`，繪圖不超過 `48×48` px 以免蓋到頭頂血條）與合理體質（hp 60~160、speed 2~5）。」
- **學生 2（`modules/attacks_normal.js`）**：
  > 「我是學生 2，請幫我把編號 0, 1, 2 設計成【噴發七彩彩虹、橡皮擦屑 3 發散彈、高速連發紅筆芯（透過較短 `cooldown` 實現）】，以 `style` 區分外觀並在 `drawNormalProjectile` 繪製圖案，同時確保 `hitRadius <= visualRadius`。」
- **學生 3（`modules/attacks_special.js`）**：
  > 「我是學生 3，請幫我把編號 3, 4, 5 設計成【飛很慢但超痛的巨型西瓜、視覺上高速旋轉飛行的直尺、閃爍波紋的墨水球】，實作 `onFireSpecial` 與 `drawSpecialProjectile`。注意主引擎僅保留 `style`、`color`、`lifeTime` 等標準欄位，旋轉與閃爍動畫請在 `drawSpecialProjectile` 內用 `bullet.style` 與 `performance.now()` 計算繪製，並遵守 `hitRadius <= visualRadius`（上限 36px）與單發傷害 `<= 45`。」
- **學生 4（`config/arena.config.js`）**：
  > 「我是學生 4，請幫我把背景設計成【綠色切割墊／課桌風格】，並設計漸進式縮圈節奏與圈外紅色電流危險區特效（閃爍動畫可使用 `performance.now()`）。」
- **學生 5（`modules/items.js`）**：
  > 「我是學生 5，請幫我設計 3 種神秘空投箱外觀（問號禮盒造型）與未知 Buff 效果，使用主引擎支援的 `heal`、`shieldMs`、`speedMult`、`speedMs` 回傳格式，並遵守 5 秒與數值上限。」
- **學生 6（`config/rules.config.js`）**：
  > 「我是學生 6，請幫我美化存活人數 HUD（僅使用 `gameState` 現有欄位 `mode, elapsedSec, aliveCount, totalCount, me`，沒有 `killFeed`）、設計淘汰後的極簡觀戰提示（對應主引擎固定的 `1:👍 2:🔥 3:🍉 4:😂`），以及最後吃雞頒獎台結算畫面，且不要擋到畫面中央主戰區。」

---

## 第四步：本地「練習模式」預覽與語法檢查

每次請 AI 修改完程式後，都可以立刻在自己電腦的 Chrome 測試：

1. **檢查 JavaScript 語法是否有錯**（或直接叫 AI 幫你跑）：
   ```bash
   node --check <你負責的檔案路徑>
   ```
2. **啟動本地測試伺服器**（務必在 `vibe-battle-royale` 資料夾內的終端機執行；若 8080 被佔用可改 `8081`）：
   - **macOS**：`python3 -m http.server 8080`
   - **Windows**：`python -m http.server 8080`（若無 `python` 指令可改試 `py -m http.server 8080`）
3. **開啟 Chrome 試玩與各角色測試小技巧**：
   - 網址列輸入 **`http://localhost:8080`**，點選 **「🧪 練習模式」**。
   - **重整看新版**：每次修改 `.js` 存檔後，請按**強制重新整理**（macOS：`Cmd + Shift + R`／Windows：`Ctrl + Shift + R`），避免讀到舊快取。
   - **學生 1、2、3**：因開局為盲盒隨機，可多按幾次下方 **「🎲 重新隨機盲盒」** 抽到你想測的編號。
   - **學生 5**：進入練習模式後約 **5 秒** 會出現第一個空投道具。
   - **學生 6**：擊敗 2 個標靶即可看到**吃雞結算畫面**；若想測試**淘汰觀戰畫面**，可故意移動到紅圈外面扣血至歸零！

---

## 第五步：提交修改並發起 Pull Request（約 10 分鐘）

確認本地「練習模式」測試正常且語法無誤後，就可以把你的作品交給老師審核：

1. **檢查是否只改到自己負責的 1 個檔案**：
   ```bash
   git status
   ```
   > 若不小心動到 `index.html` 或其他組員的檔案，請先執行 `git checkout -- <誤改的檔案路徑>` 還原（或請 Antigravity 幫你還原）。
2. **加入檔案並建立提交紀錄（Commit）**：
   ```bash
   git add <你負責的檔案路徑>
   git commit -m "feat(student-X): 完成模組設計"
   ```
3. **推送分支到 GitHub**：
   ```bash
   git push -u origin <你的分支名稱>
   ```
   *(例如學生 2：`git push -u origin feat/student-2-normal-attacks`)*
4. **在 GitHub 發起 Pull Request (PR)**：
   - 用 Chrome 打開 **`https://github.com/stubipapa/vibe-battle-royale`**。
   - 畫面上方會出現黃色提示條 **`Compare & pull request`**，點擊進去。
   - 標題或內文簡單寫上你的名字與設計創意，按下 **`Create pull request`** 即可！
5. **如果老師審核後請你微調怎麼辦？**
   - 不需要重開新 PR！只要在原本的分支繼續修改、存檔，再跑一次 `git add` → `git commit` → `git push`，GitHub 上的同一個 PR 就會自動更新。

---

## 第六步：Vercel 上線與 6 人連線盲盒大亂鬥（約 25 分鐘）

1. 老師使用 `teacher-pr-review` 檢查所有 PR 無誤並依序合併（Merge）進 `main` 分支後，Vercel 會在 **15～30 秒內自動更新**。
2. 全班使用筆電 Chrome 打開老師公布的 **`.vercel.app` 正式網址**。
3. 點選 **「🌐 連線模式」**，等待 **6 位玩家全數到齊** 後由房主按下開始，展開盲盒大亂鬥！
   - **移動**：`↑ ↓ ← →`
   - **瞄準**：`Z`（逆時針）／ `X`（順時針）
   - **開火**：`Space`
   - **淘汰觀戰加油表情**：`1` 👍、`2` 🔥、`3` 🍉、`4` 😂

---

## 常見問題快速排錯（Q&A）

- **Q1：我直接點兩下打開 `index.html`，結果畫面卡住或沒反應？**
  - 本遊戲使用原生 ES6 Modules，不能用 `file://` 開啟。請照第四步啟動本地伺服器，從 **`http://localhost:8080`** 進入。
- **Q2：`git push` 出現 `Permission denied (403)` 或一直要我輸密碼？**
  - 請確認老師已將你的 GitHub 帳號加入專案 Collaborators，並在終端機執行 `gh auth status` 與 `gh auth setup-git`。
- **Q3：我明明改了 `.js` 檔，為什麼 Chrome 畫面還是舊的？**
  - 請按**強制重新整理**（macOS：`Cmd + Shift + R`／Windows：`Ctrl + Shift + R`）清除瀏覽器模組快取。
