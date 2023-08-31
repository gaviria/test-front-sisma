document.addEventListener("DOMContentLoaded", function () {
	const taskForm = document.getElementById("taskForm");
	const taskTableBody = document.getElementById("taskTableBody");

	// Cargar tareas al iniciar
	loadTasks();

	taskForm.addEventListener("submit", function (event) {
		event.preventDefault();

		const taskId = document.getElementById("taskId").value;
		const taskName = document.getElementById("taskName").value;
		const completed = document.getElementById("completed").value;

		if (taskId) {
			// Si hay un id
			axios
				.put(`http://localhost:8000/api/tasks/${taskId}`, {
					tarea: taskName,
					completado: completed,
				})
				.then(function () {
					loadTasks();
					taskForm.reset();
				})
				.catch(function (error) {
					console.error(error);
				});
		} else {
			// Si no hay un id
			axios
				.post("http://localhost:8000/api/tasks", {
					tarea: taskName,
					completado: completed,
				})
				.then(function () {
					loadTasks();
					taskForm.reset();
				})
				.catch(function (error) {
					console.error(error);
				});
		}
	});

	function loadTasks() {
		axios
			.get("http://localhost:8000/api/tasks")
			.then(function (response) {
				const tasks = response.data;
				renderTasks(tasks);
			})
			.catch(function (error) {
				console.error(error);
			});
	}

	function editTask(task) {
		document.getElementById("taskId").value = task.id;
		document.getElementById("taskName").value = task.tarea;
		document.getElementById("completed").value = task.completado;
		document.getElementById("submitButton").textContent = "Guardar Cambios";
	}

	function renderTasks(tasks) {
		taskTableBody.innerHTML = "";

		tasks.forEach(function (task) {
			const row = document.createElement("tr");

			const idCell = document.createElement("td");
			idCell.textContent = task.id;
			row.appendChild(idCell);

			const nameCell = document.createElement("td");
			nameCell.textContent = task.tarea;
			row.appendChild(nameCell);

			const completedCell = document.createElement("td");
			completedCell.textContent = task.completado;
			row.appendChild(completedCell);

			const actionsCell = document.createElement("td");

			const editButton = document.createElement("button");
			editButton.textContent = "Editar";
			editButton.addEventListener("click", function () {
				editTask(task);
				console.log("Editar tarea:", task);
			});
			actionsCell.appendChild(editButton);

			const deleteButton = document.createElement("button");
			deleteButton.textContent = "Eliminar";
			deleteButton.addEventListener("click", function () {
				axios
					.delete(`http://localhost:8000/api/tasks/${task.id}`)
					.then(function () {
						loadTasks();
					})
					.catch(function (error) {
						console.error(error);
					});
			});
			actionsCell.appendChild(deleteButton);

			row.appendChild(actionsCell);
			taskTableBody.appendChild(row);
		});
	}
});
