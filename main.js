(function () {
  "use strict";

  const PAGE = {
   ONE:"/store/transfer/waiting",
    TWO: "/admin-panel/operational-info/stock-shelves",
  };

  console.log("Script loaded, current URL:", window.location.href);

function getBasePath() {
  return window.location.pathname;
}

  function getCurrentPage() {
    const url = getBasePath()
    if (url.includes(PAGE.ONE)) return PAGE.ONE;
    if (url.includes(PAGE.TWO)) return PAGE.TWO;
    return null;
  }

  function initPageOne() {
    console.log("Page One logic");
    const button = document.createElement("button");
    button.textContent = "Get ID Articul";
    button.addEventListener("click", getIdArticul);
    document.body.appendChild(button);

    const filterBtn = document.createElement("button");
    filterBtn.textContent = "Filter";
    document.body.appendChild(filterBtn);
    filterBtn.addEventListener("click", () => {
      const { colIndex, table } = getIndexCol("id artykułu");

      if (colIndex === -1) {
        console.error("Column not found");
      } else {
        const ids = JSON.parse(GM_getValue("articulIds", "[]"));
        console.log("Retrieved:", ids);
        const rows = [...table.querySelectorAll("tr")].slice(1);
        console.log(["rows"], rows);
        rows.forEach((row) => {
          const cells = [...row.querySelectorAll("td")];
          const articulId = cells[colIndex]?.textContent.trim();

          if (ids.includes(articulId)) {
            const checkbox = row.querySelector('input[type="checkbox"]');
            console.log(["checkbox"], checkbox);

            if (checkbox) checkbox.checked = true;
          }
        });
      }
    });

    function getIdArticul() {
      const { colIndex, table } = getIndexCol("id artykułu");

      if (colIndex === -1) {
        console.error("Column not found");
      } else {
        const rows = [...table.querySelectorAll("tr")].slice(1);
        const data = rows
          .map((row) => {
            const cells = [...row.querySelectorAll("td")];
            return cells[colIndex].textContent.trim() ?? null;
          })
          .filter(Boolean);
        console.log("GM:", GM);
        GM_setValue("articulIds", JSON.stringify(data)); // 💾 зберігаємо
        console.log("Saved:", data);
        // return data;
      }
    }

    function getIndexCol(name) {
      const table = document.querySelector("table");
      const header = [...table.querySelectorAll("th")].map((th) =>
        th.textContent.trim().toLowerCase(),
      );

      const colIndex = header.findIndex((h) => h === name);

      return { colIndex, table };
    }
  }

  function initPageTwo() {
    console.log("Page Two logic");
    const inputArticleId = document.querySelector("input[name='articleId']");
    const submitBtn = document.querySelector("button[type='submit']");

    console.log(["submitBtn"], submitBtn);

    console.log(["inputArticleId"], inputArticleId);

    const blockFilter = document.createElement("div");
    const inputFilterData = document.createElement("input");
    blockFilter.appendChild(inputFilterData);

    const filterBtn = document.createElement("button");
    filterBtn.textContent = "Filter";
    blockFilter.appendChild(filterBtn);

    filterBtn.addEventListener("click", async () => {
      const ids = JSON.parse(GM_getValue("articulIds", "[]"));
      console.log(["ids"], ids);

      const locations = inputFilterData.value?.split(" ").filter(Boolean) || [];

      console.log(["filterValue"], locations);

      if (locations.length === 0) {
        alert("Please enter filter values separated by space");
        return;
      }

      const filteredIds = await filterIds(ids, locations);
      console.log("Filtered IDs:", filteredIds);
      GM_setValue("articulIds", JSON.stringify(filteredIds)); // ✅ перезаписуємо відфільтрованими
      alert(`Done! Found ${filteredIds.length} of ${ids.length}`);
    });

    function waitForAddress(timeout = 10000, interval = 100) {
      return new Promise((resolve, reject) => {
        const start = Date.now();

        const timer = setInterval(() => {
          const el = document.querySelector(".shelf-head__address b");
          const value = el?.textContent?.trim();

          if (value) {
            clearInterval(timer);
            resolve(value);
          }

          if (Date.now() - start > timeout) {
            clearInterval(timer);
            reject(new Error("Timeout"));
          }
        }, interval);
      });
    }

    async function filterIds(ids, locations) {
      const filtered = [];
      console.log(["filtered"], filtered);

      for (const id of ids) {
        console.log("Processing id:", id); // ✅
        inputArticleId.value = id;
        submitBtn.click();

        try {
          console.log("Before waitForUpdate"); // ✅
          // await waitForUpdate(); // селектор елемента який оновлюється
          const addressValue = await waitForAddress();
          console.log("After waitForUpdate"); // ✅

          const address = [
            ...document.querySelectorAll(".shelf-head__address b"),
          ].map((el) => el.textContent.trim());

          console.log("address:", address); // ✅

          if (!hasMatch(locations, address)) {
            console.log(["id"], id);

            filtered.push(id);
          }
        } catch (e) {
          console.error(`Timeout for id: ${id}`, e.message);
        }
      }

      return filtered;
    }

    document.body.appendChild(blockFilter);
  }

  function hasMatch(a, b) {
    console.log(["hasMatch"], a, b);

    return a.some((aVal) =>
      b.some((bVal) => bVal.slice(0, aVal.length) === aVal),
    );
  }

  function init() {
    const page = getCurrentPage();
    if (page === PAGE.ONE) initPageOne();
    if (page === PAGE.TWO) initPageTwo();
  }

  // Якщо сторінка динамічна (SPA) — чекаємо завантаження DOM
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
