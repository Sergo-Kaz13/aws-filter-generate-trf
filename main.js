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
