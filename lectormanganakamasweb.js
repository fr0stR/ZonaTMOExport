(async function () {
    let allItems = [];
    let page = 1;

    const baseUrl = window.location.href.split('?')[0];
    const seleccionTitulo = document.querySelector("h2.text-primary")?.textContent.trim() || "Mi Lista";

    console.log(`URL: ${baseUrl}`);
    console.log(`TITULO: ${seleccionTitulo}`);

    while (true) {
        console.log(`Páginas: ${page}...`);

        const response = await fetch(`${baseUrl}?page=${page}`);
        if (!response.ok) break;

        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const items = [...doc.querySelectorAll(".card")];

        if (items.length === 0) {
            console.log("No hay más ítems.");
            break;
        }

        items.forEach(item => {
            const title = item.querySelector(".card-header a")?.getAttribute("title")?.trim() || "Sin título";
            const link = item.querySelector(".card-body a")?.getAttribute("href")?.trim() || "#";
            const imageUrl = item.querySelector(".card-body img")?.getAttribute("src") || "Sin imagen";

            allItems.push({ title, link, imageUrl });
        });

        console.log(`Página ${page} procesada.`);
        page++;
    }

    console.log(`Generando HTML...`);

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>${seleccionTitulo}</title>
        <style>
            body { background:#121212; color:#fff; font-family:Arial; text-align:center; }
            table { width:80%; margin:auto; border-collapse:collapse; background:#222; }
            th, td { padding:10px; border:1px solid #444; }
            img { width:60px; }
            a { color:#1e90ff; }
        </style>
    </head>
    <body>
        <h1>${seleccionTitulo}</h1>
        <table>
            <tr><th>Imagen</th><th>Título</th></tr>
            ${allItems.map(i => `
                <tr>
                    <td><img src="${i.imageUrl}"></td>
                    <td><a href="${i.link}" target="_blank">${i.title}</a></td>
                </tr>
            `).join("")}
        </table>
    </body>
    </html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${seleccionTitulo}.html`;
    a.click();

    URL.revokeObjectURL(url);

    console.log("Listo.");
})();
