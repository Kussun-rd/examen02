document.addEventListener('DOMContentLoaded', function() {
    const usuarioLogueado = localStorage.getItem('usuario');
    if (!usuarioLogueado) {
        window.location.href = 'index.html';
        return;
    }
    
    const API_URL = 'http://localhost:8000/api';
    
    const alertContainer = document.getElementById('alertContainer');
    
    const clientesTable = document.getElementById('clientesTable');
    
    function mostrarAlerta(mensaje, tipo) {
        alertContainer.innerHTML = `
            <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
                ${mensaje}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
    }
    
    function cargarClientes() {
        fetch(`${API_URL}/clientes`)
            .then(response => response.json())
            .then(clientes => {
                if (clientes.error) {
                    mostrarAlerta(clientes.error, 'danger');
                    return;
                }
                
                if (clientes.length === 0) {
                    clientesTable.innerHTML = `
                        <tr>
                            <td colspan="4" class="text-center">No hay clientes registrados</td>
                        </tr>
                    `;
                    return;
                }
                
                let html = '';
                clientes.forEach(cliente => {
                    html += `
                        <tr>
                            <td>${cliente.id}</td>
                            <td>${cliente.nombre}</td>
                            <td>${cliente.email}</td>
                            <td>${cliente.fecha_registro || 'N/A'}</td>
                        </tr>
                    `;
                });
                
                clientesTable.innerHTML = html;
            })
            .catch(error => {
                mostrarAlerta('Error al cargar los clientes', 'danger');
                console.error('Error:', error);
            });
    }
    
    document.getElementById('btnLogout').addEventListener('click', function() {
        localStorage.removeItem('usuario');
        window.location.href = 'index.html';
    });
    
    cargarClientes();
});