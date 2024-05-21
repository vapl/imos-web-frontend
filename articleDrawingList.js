// Function to render list of articles
function articlesList(data) {
    const articleListParent = document.getElementById('article-list');
    articleListParent.innerHTML = ''; // Clear the existing article list
    let counterId = 0;
    data.forEach(item => {
        const listItem = document.createElement('button');
        listItem.innerHTML = `
            <!-- Button trigger modal -->
            <h5>${item.NAME}</h5>
            <p>${item.DESCRIPT_1}</p>
        `;
        listItem.classList.add('custom-button', 'p-3', 'mb-3', 'btn', 'btn-light');
        listItem.setAttribute('data-item-name', item.NAME);
        listItem.setAttribute('data-bs-target', `#item-open-${counterId}`);
        listItem.setAttribute('type', 'button');
        listItem.setAttribute('data-bs-toggle', 'modal');
        listItem.setAttribute('data-bs-target', '#exampleModal');
        listItem.setAttribute('id', `listButton-${counterId}`);
        
        articleListParent.appendChild(listItem);
        
        counterId++;
    });
}

// Function to filter data based on search input
function filterData(searchText, data) {
    return data.filter(item => {
        const matchesSearch = 
            item.NAME.toLowerCase().includes(searchText) ||
            item.DESCRIPT_1.toLowerCase().includes(searchText)

        return matchesSearch;
    });
}

// Function to fetch data and render articles list
function fetchDataAndRender() {
    fetch('./data/article_data.json')
        .then(response => response.json())
        .then(data => {
            articlesList(data); // Corrected function call
        })
        .catch(error => console.error('Error loading JSON data:', error));
}

// Event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    fetchDataAndRender();

    const modalBody = document.getElementById('modal-img');
    const generateImage = document.createElement('img');
    const modalTitle = document.createElement('h1');
    const modalHeader = document.querySelector('.modal-header');

    const articleList = document.getElementById('article-list');

    articleList.addEventListener('click', (e) => {
        const button = e.target.closest('.custom-button');
        if (button) {
            const itemName = button.getAttribute('data-item-name').trim();
            
            modalTitle.classList.add('modal-title', 'fs-5');
            modalTitle.setAttribute('id', 'exampleModalLabel');
            modalTitle.innerText = itemName;
            
            generateImage.setAttribute('src', `https://3023.testshop.imos3d.com/fileadmin/imosnet/3023/image/img/Article_drawings/${itemName}.png`);
            generateImage.setAttribute('alt', 'article');
            generateImage.setAttribute('width', '100%'); 
            generateImage.setAttribute('height', 'auto');

            // Clear existing title
            const existingTitle = modalHeader.querySelector('h1');
            if (existingTitle) {
                modalHeader.removeChild(existingTitle);
            }

            // Insert new title
            modalHeader.insertBefore(modalTitle, modalHeader.firstChild);

            modalBody.innerHTML = '';
            modalBody.appendChild(generateImage);
        }        
    });

    // Call fetchDataAndRender() when the search input changes
    const searchInput = document.getElementById('article-search');
    searchInput.addEventListener('input', (e) => {
        const searchText = e.target.value.toLowerCase();
        fetch('./data/article_data.json')
            .then(response => response.json())
            .then(data => {
                const filteredData = filterData(searchText, data);
                articlesList(filteredData);
            })
            .catch(error => console.error('Error loading JSON data:', error));
    });
});


