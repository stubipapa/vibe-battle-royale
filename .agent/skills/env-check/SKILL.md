---
name: env-check
description: >-
  Use this skill whenever the user or student asks whether GitHub tools, Git,
  or local testing packages are installed or ready (e.g. "github 相關工具是否已經裝好？",
  "我的電腦可以下載/推送專案或本地測試嗎？").
---

# 學生端開發與測試環境檢查流程

當學生詢問 GitHub 相關工具或本地測試環境是否已安裝就緒時，請依序在終端機執行檢查，並以清楚的清單回報狀態與缺少項目的安裝／設定指令。

## 檢查項目

1. **Git 與身分設定**（下載專案與推送分支必備）：
   - `git --version`
   - `git config --global user.name`
   - `git config --global user.email`

2. **GitHub CLI 與登入驗證**（推送分支與發起 PR 必備）：
   - `gh --version`
   - `gh auth status`
   - 提醒確認是否已執行過 `gh auth setup-git`（確保 `git push` HTTPS 可直接使用 `gh` 帳號憑證）。

3. **本地靜態測試與語法檢查套件**（課堂練習模式預覽與 ES6 語法驗證必備）：
   - `python3 --version`（Windows 若無 `python3`，改測 `python --version` 或 `py --version`，用於啟動本地 HTTP 伺服器解決 ES6 Module 無法用 `file://` 開啟的問題）
   - `node --version`（用於執行 `node --check <檔案>` 檢查 JavaScript 語法錯誤）

## 回報格式

- 逐項標示 ✅ 已就緒（含版本號或帳號）或 ❌ 未安裝／未設定。
- 若有缺少任何項目，直接提供該作業系統（macOS / Windows）對應的一行安裝或設定指令（例如 `git config --global user.name "..."`、`gh auth login`）。
