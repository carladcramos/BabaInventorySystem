// Fetch and display all sales data in the table
async function fetchSalesData() {
    try {
        const response = await fetch('http://localhost:3000/api/sales');
        if (response.ok) {
            const sales = await response.json();
            updateSalesTable(sales);
        } else {
            console.error('Error fetching sales data');
        }
    } catch (error) {
        console.error('Error fetching sales data:', error);
    }
}

// Fetch and display all categories in the dropdown
async function fetchCategories() {
    try {
        const response = await fetch('http://localhost:3000/api/sales/categories');
        if (response.ok) {
            const categories = await response.json();
            updateCategoryDropdown(categories);
        } else {
            console.error('Error fetching categories');
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

// Update the sales table with data
function updateSalesTable(sales) {
    const tableBody = document.querySelector('#salesTable tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    sales.forEach(sale => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sale.productName}</td>
            <td>${sale.productID}</td>
            <td>${sale.productSold}</td>
            <td>${new Date(sale.date).toLocaleDateString()}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Update the category dropdown with options
function updateCategoryDropdown(categories) {
    const categorySelect = document.querySelector('#category');
    if (!categories || categories.length === 0) {
        console.warn('No categories found!');
        return;
    }

    categorySelect.innerHTML = `<option value="" selected>- Select Category -</option>`; // Default option

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });

    console.log('Dropdown updated with categories:', categories); // Debug log
}


// Filter sales based on selected category and date range
async function filterSales() {
    const category = document.querySelector('#category').value;
    const dateRange = document.querySelector('#dateRange').value;

    const params = new URLSearchParams();

    if (category) params.append('category', category);

    if (dateRange) {
        const [startDate, endDate] = dateRange.split(' - ');
        if (startDate && endDate) {
            params.append('startDate', startDate.trim());
            params.append('endDate', endDate.trim());
        }
    }

    try {
        const response = await fetch(`http://localhost:3000/api/sales/filter?${params.toString()}`);
        if (response.ok) {
            const filteredSales = await response.json();
            updateSalesTable(filteredSales);
        } else {
            console.error('Error fetching filtered sales data');
        }
    } catch (error) {
        console.error('Error fetching filtered sales data:', error);
    }
}

// Event listeners for filter changes
document.addEventListener('DOMContentLoaded', () => {
    fetchSalesData(); // Load all sales data on page load
    fetchCategories(); // Load categories on page load

    document.querySelector('#category').addEventListener('change', filterSales);
    document.querySelector('#dateRange').addEventListener('change', filterSales);
});
