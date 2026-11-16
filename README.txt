玖點茶飲｜手機掃碼點餐模擬網站（期中報告）
========================================

一、開啟方式
1. 解壓縮整個資料夾。
2. 直接雙擊 index.html，即可在電腦瀏覽器操作。
3. 若要用手機現場掃 QR Code，請先將整個網站部署到靜態網站主機（如 GitHub Pages 或 Netlify），
   再把「部署成功後的 HTTPS 網址」製作成 QR Code；光有本機 HTML 檔案無法讓其他手機掃碼連線。
4. 用 Chrome 開發者工具 F12 → 切換裝置工具列，可選手機尺寸展示。

二、檔案說明
- index.html：HTML5 語意結構、搜尋欄、分類導覽、三個操作對話框。
- style.css：米白、淡紫與咖啡色；手機優先排版、RWD、固定底部購物車。
- script.js：飲料資料、分類/搜尋、糖度/冰量/加料、購物車、結帳摘要。

三、可展示流程
分類「奶茶」→ 玖點奶茶 → XL / 半糖 / 少冰 / 珍珠 / 椰果 → 加入購物車 → 再加一杯不同糖冰規格 → 購物車改數量 → 模擬送出 → 查看訂單摘要。

四、對應上課語法
HTML：header、main、section、nav、article、button、input、fieldset、legend
CSS：Flexbox、Grid、position:fixed/sticky、:focus-visible、@media、CSS 變數、border-radius
JavaScript：const/let、array/object、map/filter/find/reduce、箭頭函式、樣板字串、querySelector/getElementById、addEventListener、innerHTML、textContent、事件代理、if 判斷

五、說明與限制
- 本站僅為期中課堂展示，不會真實收款、不會傳送訂單給店家，也沒有後端/資料庫。
- 資料依提供的學餐「玖點茶飲」實體菜單照片整理。菜單有些紅/綠/青合併名稱，網站保留菜單呈現方式；如需單獨選茶底，日後可加選項。
- 甜度、冰量選項依菜單文字；特定飲品是否可調糖/冰未向店家確認，故一律標示模擬。
- 購物車目前保存在頁面記憶體，重新整理就會清空（適合展示）。
- 若老師要求 SCSS，可將 style.css 改寫為 style.scss 再用 Vite/Sass 編譯；本版直接以純 CSS 供零安裝開啟。

更新：首頁改為原生 SVG 淡紫色茶杯線條插圖；飲料卡片裝飾改為 CSS 線條，避免手機 emoji 變色。
