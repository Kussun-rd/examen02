from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import os
import time

app = Flask(__name__)
CORS(app)  

def wait_for_db():
    max_retries = 10
    retries = 0
    while retries < max_retries:
        try:
            conn = psycopg2.connect(
                host=os.environ.get("DB_HOST", "db"),
                database=os.environ.get("DB_NAME", "postgres"),
                user=os.environ.get("DB_USER", "postgres"),
                password=os.environ.get("DB_PASSWORD", "postgres"),
                port=os.environ.get("DB_PORT", "5432")
            )
            conn.close()
            return True
        except psycopg2.OperationalError:
            retries += 1
            print(f"Esperando a que la base de datos esté lista... {retries}/{max_retries}")
            time.sleep(2)
    
    return False

def get_db_connection():
    conn = psycopg2.connect(
        host=os.environ.get("DB_HOST", "db"),
        database=os.environ.get("DB_NAME", "postgres"),
        user=os.environ.get("DB_USER", "postgres"),
        password=os.environ.get("DB_PASSWORD", "postgres"),
        port=os.environ.get("DB_PORT", "5432")
    )
    conn.autocommit = True
    return conn

@app.route("/")
def home():
    return jsonify({"message": "API funcionando correctamente"})

@app.route("/api/registro", methods=["POST"])
def registro():
    data = request.json
    nombre = data.get("nombre")
    email = data.get("email")
    password = data.get("password")
    
    if not nombre or not email or not password:
        return jsonify({"error": "Faltan datos requeridos"}), 400
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute("SELECT id FROM clientes WHERE email = %s", (email,))
        if cur.fetchone():
            cur.close()
            conn.close()
            return jsonify({"error": "El email ya está registrado"}), 400
        
        cur.execute(
            "INSERT INTO clientes (nombre, email, password) VALUES (%s, %s, %s) RETURNING id",
            (nombre, email, password)
        )
        
        id_cliente = cur.fetchone()[0]
        
        cur.close()
        conn.close()
        
        return jsonify({
            "id": id_cliente,
            "nombre": nombre,
            "email": email,
            "mensaje": "Cliente registrado exitosamente"
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    
    if not email or not password:
        return jsonify({"error": "Email y contraseña son requeridos"}), 400
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute(
            "SELECT id, nombre, email FROM clientes WHERE email = %s AND password = %s",
            (email, password)
        )
        
        cliente = cur.fetchone()
        
        cur.close()
        conn.close()
        
        if cliente:
            return jsonify({
                "id": cliente[0],
                "nombre": cliente[1],
                "email": cliente[2],
                "mensaje": "Inicio de sesión exitoso"
            })
        else:
            return jsonify({"error": "Credenciales inválidas"}), 401
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/clientes")
def get_clientes():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute("SELECT id, nombre, email, fecha_registro FROM clientes")
        clientes = []
        
        for row in cur.fetchall():
            clientes.append({
                "id": row[0],
                "nombre": row[1],
                "email": row[2],
                "fecha_registro": row[3].strftime("%Y-%m-%d %H:%M:%S") if row[3] else None
            })
            
        cur.close()
        conn.close()
        
        return jsonify(clientes)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/productos")
def get_productos():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute("SELECT id, nombre, descripcion, precio, stock FROM productos")
        productos = []
        
        for row in cur.fetchall():
            productos.append({
                "id": row[0],
                "nombre": row[1],
                "descripcion": row[2],
                "precio": float(row[3]),
                "stock": row[4]
            })
            
        cur.close()
        conn.close()
        
        return jsonify(productos)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/productos/buscar")
def buscar_productos():
    termino = request.args.get("termino", "")
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute(
            "SELECT id, nombre, descripcion, precio, stock FROM productos WHERE nombre ILIKE %s OR descripcion ILIKE %s",
            (f"%{termino}%", f"%{termino}%")
        )
        
        productos = []
        
        for row in cur.fetchall():
            productos.append({
                "id": row[0],
                "nombre": row[1],
                "descripcion": row[2],
                "precio": float(row[3]),
                "stock": row[4]
            })
            
        cur.close()
        conn.close()
        
        return jsonify(productos)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    if wait_for_db():
        print("Base de datos lista, iniciando API...")
        app.run(host="0.0.0.0", port=8000, debug=True)
    else:
        print("No se pudo conectar a la base de datos después de varios intentos.")