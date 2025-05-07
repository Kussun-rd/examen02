CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio NUMERIC(10, 2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0
);

INSERT INTO clientes (nombre, email, password) VALUES
('Juan Pérez', 'juan@email.com', 'password123'),
('María García', 'maria@email.com', 'password123'),
('Carlos López', 'carlos@email.com', 'password123');

INSERT INTO productos (nombre, descripcion, precio, stock) VALUES
('Laptop HP', 'Laptop HP 15.6" con 8GB RAM', 799.99, 10),
('Monitor LG', 'Monitor LG 24" Full HD', 199.99, 15),
('Mouse Logitech', 'Mouse inalámbrico Logitech', 29.99, 30),
('Teclado Mecánico', 'Teclado mecánico con luz RGB', 59.99, 12),
('Disco Duro Externo', 'Disco duro externo 1TB', 79.99, 8),
('Impresora HP', 'Impresora multifuncional HP', 149.99, 5),
('Audífonos Bluetooth', 'Audífonos inalámbricos con cancelación de ruido', 89.99, 20);