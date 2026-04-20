// ==UserScript==
// @name         My Script
// @namespace    https://github.com/YOUR_USERNAME/YOUR_REPO
// @version      1.0.0
// @description  Опис що робить скрипт
// @author       Your Name
// @match        https://example.com/page-one/*
// @match        https://example.com/page-two/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/script.user.js
// @downloadURL  https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/script.user.js
// ==/UserScript==

(function () {
  "use strict";

  const PAGE = {
    ONE: "page-one",
    TWO: "page-two",
  };

  function getCurrentPage() {
    const url = window.location.href;
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
        const data = getIdArticul();
        const rows = [...table.querySelectorAll("tr")].slice(1);
        console.log(["rows"], rows);
        rows.forEach((row) => {
          const cells = [...row.querySelectorAll("td")];
          const articulId = cells[colIndex]?.textContent.trim();

          if (data.includes(articulId)) {
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
        console.log(["data"], data);
        return data;
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

    const articuleId = ["ART-001", "ART-002", "ART-003"]; // Example articule IDs

    filterBtn.addEventListener("click", () => {
      const filterValue = inputFilterData.value;

      inputArticleId.value = ""; // Clear the input field before setting new values
      inputArticleId.value = articuleId.join(", ");
      console.log("Filter value:", filterValue);

      const address = [
        ...document.querySelectorAll(".shelf-head__address b"),
      ].map((el) => el.textContent.trim());

      console.log(["address"], address);
    });

    document.body.appendChild(blockFilter);
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
