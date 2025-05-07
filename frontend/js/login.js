document.addEventListener('DOMContentLoaded', function() {
    const usuarioLogueado = localStorage.getItem('usuario');
    if (usuarioLogueado) {
        window.location.href = 'clientes.html';
    }
    
    const API_URL = 'http://3.149.253.205:8000/api';
    
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const alertContainer = document.getElementById('alertContainer');
    
    function mostrarAlerta(mensaje, tipo) {
        alertContainer.innerHTML = `
            <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
                ${mensaje}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
    }
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                mostrarAlerta(data.error, 'danger');
            } else {
                localStorage.setItem('usuario', JSON.stringify({
                    id: data.id,
                    nombre: data.nombre,
                    email: data.email
                }));
                
                window.location.href = 'clientes.html';
            }
        })
        .catch(error => {
            mostrarAlerta('Error en la comunicación con el servidor', 'danger');
            console.error('Error:', error);
        });
    });
    
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nombre = document.getElementById('registerNombre').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        
        fetch(`${API_URL}/registro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                mostrarAlerta(data.error, 'danger');
            } else {
                mostrarAlerta('Registro exitoso. Ahora puede iniciar sesión.', 'success');
                
                registerForm.reset();
                
                const loginTab = document.getElementById('login-tab');
                const bsTab = new bootstrap.Tab(loginTab);
                bsTab.show();
            }
        })
        .catch(error => {
            mostrarAlerta('Error en la comunicación con el servidor', 'danger');
            console.error('Error:', error);
        });
    });
});