import { TodoItem } from "./todoItem.js";
import { JsonTodoCollection } from "./jsonTodoCollection.js";

// Lista inicial de tareas
let todos = [
    new TodoItem(1, "Buy Flowers"),
    new TodoItem(2, "Get Shoes"),
    new TodoItem(3, "Collect Tickets"),
    new TodoItem(4, "Call Joe", true),
];

let collection = new JsonTodoCollection("Adam", todos);
let showCompleted = true;

// Referencias a elementos del DOM
const title = document.getElementById("title")!;
const act_toDo_completes = document.getElementById("act_toDo_completes"!);
const act_toDo_incompletes = document.getElementById("act_toDo_incompletes"!);
const taskInput = document.getElementById("taskInput") as HTMLInputElement;
const addTaskBtn = document.getElementById("addTaskBtn")!;
const todoList = document.getElementById("todoList")!;
const toggleCompletedBtn = document.getElementById("toggleCompleted")!;
const purgeCompletedBtn = document.getElementById("purgeCompleted")!;

function displayTodoList() {
    title.textContent = `${collection.userName}'s Todo List `;
    act_toDo_completes.textContent = `complete: ${collection.getItemCounts().total - collection.getItemCounts().incomplete}`;
    act_toDo_incompletes.textContent = `incomplete: ${collection.getItemCounts().incomplete}`;
    
    todoList.innerHTML = ""; // Limpiar la lista antes de redibujar

    collection.getTodoItems(showCompleted).forEach(item => {
        let cardContainer = document.createElement("div");
        cardContainer.className = "col-12 col-md-6 col-lg-3 col-xl-2 p-1";

        let card = document.createElement("div");
        card.className = `card shadow position-relative rounded-0 ${item.complete ? "complete-btn-complete" : ""}`;
        card.id = `task-${item.id}`;

        let cardBody = document.createElement("div");
        cardBody.className = "card-body";

        let cardTitle = document.createElement("h4");
        cardTitle.className = "card-title";
        cardTitle.textContent = item.task;

        card.dataset.id = item.id.toString();
        
        // Agregar evento al botón de completar
        card.addEventListener("click", (e) => {
            e.preventDefault();
        
            // Alternar el estado de la tarea
            let updatedStatus = !item.complete; // Cambiar el estado actual
            collection.markComplete(item.id, updatedStatus);
            item.complete = updatedStatus; // Asegurar que el objeto refleje el cambio
        
            // Modificar directamente la tarjeta en lugar de redibujar todo
            if (updatedStatus) {
                card.classList.add("complete-btn-complete");
            } else {
                card.classList.remove("complete-btn-complete");
            }

            //reiniciar encabezado
            title.textContent = `${collection.userName}'s Todo List `;
            act_toDo_completes.textContent = `complete: ${collection.getItemCounts().total - collection.getItemCounts().incomplete}`;
            act_toDo_incompletes.textContent = `incomplete: ${collection.getItemCounts().incomplete}`;
        });

        // Construcción de la estructura
        cardBody.appendChild(cardTitle);
        card.appendChild(cardBody);
        cardContainer.appendChild(card);
        todoList.prepend(cardContainer);
    });

    // Botón para agregar nuevas tareas
    let addContainer = document.createElement("div");
    addContainer.className = "col-12 col-md-6 col-lg-3 col-xl-2 p-1";

    let addCard = document.createElement("div");
    addCard.className = "card shadow rounded-0";
    addCard.setAttribute("data-bs-toggle", "modal");
    addCard.setAttribute("data-bs-target", "#addTaskModal");
    addCard.style.cursor = "pointer";

    let addCardBody = document.createElement("div");
    addCardBody.className = "card-body d-flex align-items-center mx-auto";

    let addLink = document.createElement("a");
    addLink.href = "#";
    addLink.className = "card-link";

    let addIcon = document.createElement("span");
    addIcon.className = "material-symbols-outlined fs-1";
    addIcon.textContent = "add";

    // Construcción del botón de agregar tarea
    addLink.appendChild(addIcon);
    addCardBody.appendChild(addLink);
    addCard.appendChild(addCardBody);
    addContainer.appendChild(addCard);
    todoList.appendChild(addContainer);
}

// Agregar una nueva tarea
addTaskBtn.addEventListener("click", () => {
    if (taskInput.value.trim() !== "") {
        collection.addTodo(taskInput.value.trim());
        taskInput.value = ""; // Limpiar input
        displayTodoList();
    }
});

// Alternar la visibilidad de las tareas completadas
toggleCompletedBtn.addEventListener("click", () => {
    showCompleted = !showCompleted;
    displayTodoList();
});

// Eliminar tareas completadas
purgeCompletedBtn.addEventListener("click", () => {
    collection.removeComplete();
    displayTodoList();
});

// Inicializar la lista de tareas
displayTodoList();
