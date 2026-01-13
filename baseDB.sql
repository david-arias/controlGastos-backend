-- 1. Tabla de Usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL, -- Guardaremos el hash, no la clave real
    currency VARCHAR(5) DEFAULT 'USD', -- Para que elijas $, COP, MXN, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Categorías (Globales o por Usuario)
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    icon VARCHAR(20),
    color_hex VARCHAR(7) -- Para que cada categoría tenga su color en la gráfica
);

-- 3. Tabla de Presupuesto Mensual (Sueldo)
CREATE TABLE monthly_budgets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    month INTEGER NOT NULL, -- 1 al 12
    year INTEGER NOT NULL,
    UNIQUE(user_id, month, year) -- Evita tener dos sueldos el mismo mes
);

-- 4. Tabla de Gastos (El detalle)
CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id),
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    is_fixed BOOLEAN DEFAULT false, -- Para diferenciar Fijos de Hormiga
    is_paid BOOLEAN DEFAULT false, -- Para el dashboard de "Pendientes"
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);