const searchInput = document.getElementById('decor-search');
const filterInput = document.getElementById('filter-group');

// Function to render the accordion items
function renderAccordionItems(data) {
    const accordion = document.getElementById('accordionFlushExample');
    accordion.innerHTML = ''; // Clear existing accordion items

    let renderedItems = new Set(); // Initialize rendered items set

    let counter = 0;
    data.forEach(item => {
        if (!renderedItems.has(item.CODE)) {
            const accordionItem = document.createElement('div');
            accordionItem.classList.add('accordion-item');
            (item.GRAIN === 1) ? item.GRAIN = 'Yes' : item.GRAIN = 'No';

            let thkHTML = '';

            const itemsWithSameCode = data.filter(i => i.CODE === item.CODE);

            itemsWithSameCode.forEach(thkItem => {
                thkHTML += `
                    <tr>
                        <td class="">${thkItem.THK} mm</td>
                        <td class="t-border p-2">${thkItem.COST} €</td>
                        <td class="t-border ps-2">${thkItem.COST2} €</td>
                    </tr>
                `
            })

            accordionItem.innerHTML = `
                <h2 class="accordion-header" id="flush-heading-${counter}">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse-${counter}" aria-expanded="false" aria-controls="flush-collapse-${counter}">
                        <p class="p-0 m-0">${item.PRICE_GROUP} | ${item.CODE} | ${item.NAME}</p> 
                    </button>
                </h2>
                <div id="flush-collapse-${counter}" class="accordion-collapse collapse" aria-labelledby="flush-heading-${counter}" data-bs-parent="#accordionFlushExample">
                    <div class="body-top p-3">
                        <p>Grain: ${item.GRAIN}</p>
                        <p>Maximum sheet size: ${item.SHEET_DIM}</p>
                    </div>
                    <hr>
                    <div class="body-bottom p-3">
                        <table id="table-thk">
                            <tr>
                                <th class="pe-2">Thickness</th>
                                <th class="t-border p-2">Part price</th>
                                <th class="t-border ps-2">Product price</th>
                            </tr>
                            ${thkHTML}
                        </table>
                        <img src="https://3023.testshop.imos3d.com/fileadmin/imosnet/3023/image/img/material/${item.TEXTURE}" alt="decor-${item.TEXTURE}" height="160" width="160">
                    </div>
                </div>
            `;

            accordion.appendChild(accordionItem);
            renderedItems.add(item.CODE); // Mark item as rendered
        }
        counter++;
    });
}

// Function to filter data based on search input
function filterData(searchText, priceGroup, data) {
    return data.filter(item => {
        const matchesSearch = 
            item.PRICE_GROUP.toLowerCase().includes(searchText) ||
            item.CODE.toLowerCase().includes(searchText) ||
            item.NAME.toLowerCase().includes(searchText)
        const matchesGroup = priceGroup === 'All' || item.PRICE_GROUP === priceGroup;

        return matchesSearch && matchesGroup;
    }
    );
}

// Function to fetch data and render accordion items
function fetchDataAndRender() {
    fetch('./data/material_data.json')
        .then(response => response.json())
        .then(data => {
            renderAccordionItems(data);
        })
        .catch(error => console.error('Error loading JSON data:', error));
}

// Call fetchDataAndRender() when the page loads
window.addEventListener('load', fetchDataAndRender);

// Call fetchDataAndRender() when the search input changes
searchInput.addEventListener('input', (e) => {
    const searchText = e.target.value.toLowerCase();
    const priceGroup = filterInput.value;
    fetch('./data/material_data.json')
        .then(response => response.json())
        .then(data => {
            const filteredData = filterData(searchText, priceGroup, data);
            renderAccordionItems(filteredData);
        })
        .catch(error => console.error('Error loading JSON data:', error));
});

// Call fetchDataAndRender() when the search input changes
filterInput.addEventListener('input', (e) => {
    const searchText = searchInput.value.toLowerCase();
    const priceGroup = e.target.value;
    fetch('./data/material_data.json')
        .then(response => response.json())
        .then(data => {
            const filteredData = filterData(searchText, priceGroup, data);
            renderAccordionItems(filteredData);
        })
        .catch(error => console.error('Error loading JSON data:', error));
});
