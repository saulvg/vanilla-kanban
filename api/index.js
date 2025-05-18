// 📚 Fundamentos de REST
// Resources: cada endpoint expone un recurso (aquí “tasks”).
// Verbs: GET, POST, PATCH, DELETE para listar, crear, actualizar y borrar.
// Stateless: cada petición incluye toda la info necesaria; el servidor no guarda estado de sesión.
// Representations: usamos JSON como formato de intercambio.
// Uniform Interface: URLs y respuestas coherentes y predecibles.

require("dotenv").config(); // Carga variables de .env en process.env
const express = require("express"); // Framework web minimalista para Node.js
const cors = require("cors"); // Middleware para habilitar CORS
const fs = require("node:fs").promises; // Promises API para leer/escribir archivos
const path = require("node:path"); // Para componer rutas de forma segura
const crypto = require("node:crypto"); // Para generar UUIDs
const { z } = require("zod"); // Validación de esquemas

const app = express();

// 🔧 Configuración básica
const PORT = process.env.PORT || 3000;
const PREFIX = process.env.API_PREFIX || "/api";
const BASE_URL = process.env.BASE_URL || "http://localhost:";
const DATA_FILE = path.join(__dirname, "tasks.json");

// ─── Esquemas de validación (Zod) ─────────────────────────────────────────
// Crear tarea (POST)
const createTaskSchema = z.object({
	title: z
		.string({
			required_error: "Title is required",
			invalid_type_error: "Title must be a string",
		})
		.min(1, "Title cannot be empty"),
	description: z
		.string({
			invalid_type_error: "Description must be a string",
		})
		.optional(),
	state: z
		.enum(["todo", "in-progress", "done"], {
			invalid_type_error: "State must be one of: todo, in-progress, done",
		})
		.optional(),
	done: z.boolean().optional(),
	important: z.boolean().optional(),
});

// Actualización parcial (PATCH)
const updateTaskSchema = createTaskSchema.partial();

// Middlewares globales
app.use(cors()); // Permite llamadas desde cualquier origen (configurable)
app.use(express.json()); // Traduce JSON del body a req.body
app.disable("x-powered-by"); // Oculta que usamos Express

// ─── Helpers para persistencia ──────────────────────────────────────────────

// Lee el array de tareas de tasks.json, creando o inicializando si hace falta
async function readTasks() {
	try {
		const raw = await fs.readFile(DATA_FILE, "utf-8");
		if (!raw.trim()) {
			// Fichero vacío: escribe un array vacío y devuélvelo
			await writeTasks([]);
			return [];
		}
		return JSON.parse(raw);
	} catch (err) {
		if (err.code === "ENOENT") {
			// Si no existe el fichero, créalo con []
			await writeTasks([]);
			return [];
		}
		throw err; // Otro error, propágalo
	}
}

// Escribe el array de tareas en tasks.json con indentación legible
async function writeTasks(tasks) {
	await fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2));
}

// ─── Endpoints REST ─────────────────────────────────────────────────────────

// GET /api/tasks
// Lista todas las tareas
app.get(`${PREFIX}/tasks`, async (req, res, next) => {
	try {
		const tasks = await readTasks();
		res.json(tasks); // 200 OK + JSON array
	} catch (error) {
		next(error);
	}
});

// POST /api/tasks
// Crea una nueva tarea. Se espera req.body con { title, state?, done?, important? }
app.post(`${PREFIX}/tasks`, async (req, res, next) => {
	try {
		const result = createTaskSchema.safeParse(req.body);
		if (!result.success) {
			return res.status(400).json({ errors: result.error.format() });
		}

		const {
			title,
			description = "",
			state = "todo",
			done = false,
			important = false,
		} = result.data;
		if (typeof title !== "string" || !title.trim()) {
			return res.status(400).json({ error: "El titulo es obligatorio" });
		}

		const tasks = await readTasks();
		const newTask = {
			id: crypto.randomUUID(), // ID único alfanumérico
			title: title.trim(),
			description: description.trim(),
			state,
			done,
			important,
		};
		tasks.push(newTask);
		await writeTasks(tasks);

		// 201 Created + devuelve el recurso creado
		res.status(201).json(newTask);
	} catch (error) {
		next(error);
	}
});

// PATCH /api/tasks/:id
// Actualiza parcialmente los campos de una tarea existente
app.patch(`${PREFIX}/tasks/:id`, async (req, res, next) => {
	try {
		const parseResult = updateTaskSchema.safeParse(req.body);
		if (!parseResult.success) {
			return res.status(400).json({ errors: parseResult.error.format() });
		}

		const tasks = await readTasks();
		const { id } = req.params;

		const idx = tasks.findIndex((t) => t.id === id);
		if (idx === -1) {
			return res.status(404).json({ error: "Task not found" });
		}

		// Mezclamos los cambios recibidos (req.body) con la tarea actual
		tasks[idx] = { ...tasks[idx], ...parseResult.data };
		await writeTasks(tasks);

		res.json(tasks[idx]); // 200 OK + recurso actualizado
	} catch (error) {
		next(error);
	}
});

// DELETE /api/tasks/:id
// Borra la tarea indicada
app.delete(`${PREFIX}/tasks/:id`, async (req, res, next) => {
	try {
		const tasks = await readTasks();
		const { id } = req.params;

		const filtered = tasks.filter((task) => task.id !== id);
		if (filtered.length === tasks.length) {
			return res.status(404).json({ error: "Task not found" });
		}

		await writeTasks(filtered);
		res.status(204).end();
	} catch (error) {
		next(error);
	}
});

// Manejador de errores (debe definirse tras todas las rutas)
app.use((err, req, res, next) => {
	console.error(err);
	res.status(500).json({ error: err.message });
});

// ─── Inicio del servidor ────────────────────────────────────────────────────
app.listen(PORT, () => {
	console.log(`API Express corriendo en ${BASE_URL}${PORT}${PREFIX}/tasks`);
});
