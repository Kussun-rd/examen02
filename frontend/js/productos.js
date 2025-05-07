document.addEventListener('DOMContentLoaded', function() {
    const usuarioLogueado = localStorage.getItem('usuario');
    if (!usuarioLogueado) {
        window.location.href = 'index.html';
        return;
    }
    
    const API_URL = 'http://localhost:8000/api';
    
    const alertContainer = document.getElementById('alertContainer');
    const productosContainer = document.getElementById('productosContainer');
    
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    
    function mostrarAlerta(mensaje, tipo) {
        alertContainer.innerHTML = `
            <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
                ${mensaje}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
    }
    
    function mostrarProductos(productos) {
        if (productos.error) {
            mostrarAlerta(productos.error, 'danger');
            return;
        }
        
        if (productos.length === 0) {
            productosContainer.innerHTML = `
                <div class="col-12 text-center">
                    <p>No se encontraron productos</p>
                </div>
            `;
            return;
        }
        
        let html = '';
        productos.forEach(producto => {
            html += `
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${producto.nombre}</h5>
                            <p class="card-text">${producto.descripcion || 'Sin descripción'}</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="badge bg-primary">$${producto.precio.toFixed(2)}</span>
                                <span class="badge bg-secondary">Stock: ${producto.stock}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        productosContainer.innerHTML = html;
    }
    
    function cargarProductos() {
        fetch(`${API_URL}/productos`)
            .then(response => response.json())
            .then(productos => {
                mostrarProductos(productos);
            })
            .catch(error => {
                mostrarAlerta('Error al cargar los productos', 'danger');
                console.error('Error:', error);
            });
    }
    
    function buscarProductos(termino) {
        fetch(`${API_URL}/productos/buscar?termino=${encodeURIComponent(termino)}`)
            .then(response => response.json())
            .then(productos => {
                mostrarProductos(productos);
            })
            .catch(error => {
                mostrarAlerta('Error al buscar productos', 'danger');
                console.error('Error:', error);
            });
    }
    
    document.getElementById('btnLogout').addEventListener('click', function() {
        localStorage.removeItem('usuario');
        window.location.href = 'index.html';
    });
    
    searchButton.addEventListener('click', function() {
        const termino = searchInput.value.trim();
        if (termino) {
            buscarProductos(termino);
        } else {
            cargarProductos();
        }
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchButton.click();
        }
    });
    
    cargarProductos();
});