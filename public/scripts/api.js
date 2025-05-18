const BASE = window._env_.API_BASE;

export async function fetchTasks() {
	const res = await fetch(BASE);
	if (!res.ok) throw new Error(`Error al cargar tareas: ${res.status}`);
	
	return await res.json();
}

export async function createTask(task) {
	const res = await fetch(BASE, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(task),
	});
	if (!res.ok) throw new Error(`Error al crear tarea: ${res.status}`);
	return await res.json();
}

export async function updateTask(id, changes) {
	const res = await fetch(`${BASE}/${id}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(changes),
	});
	if (!res.ok)
		throw new Error(`Error al actualizar tarea ${id}: ${res.status}`);
	return await res.json();
}

export async function deleteTask(id) {
	const res = await fetch(`${BASE}/${id}`, {
		method: "DELETE",
	});

	if (!res.ok && res.status !== 204) {
		throw new Error(`Error al borrar tarea ${id}: ${res.status}`);
	}
}
