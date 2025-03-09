import { TodoItem } from "./todoItem.js";
import { TodoCollection } from "./todoCollection.js";
export class JsonTodoCollection extends TodoCollection {
    constructor(userName, todoItems = []) {
        super(userName, []);
        this.userName = userName;
        // Intentar cargar tareas desde localStorage
        const storedTasks = localStorage.getItem("tasks");
        if (storedTasks) {
            let dbItems = JSON.parse(storedTasks);
            dbItems.forEach((item) => this.itemMap.set(item.id, new TodoItem(item.id, item.task, item.complete)));
        }
        else {
            this.storeTasks(todoItems);
            todoItems.forEach(item => this.itemMap.set(item.id, item));
        }
    }
    // Método para guardar las tareas en localStorage
    storeTasks(tasks = [...this.itemMap.values()]) {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    addTodo(task) {
        let result = super.addTodo(task);
        this.storeTasks();
        return result;
    }
    markComplete(id, complete) {
        super.markComplete(id, complete);
        this.storeTasks();
    }
    removeComplete() {
        super.removeComplete();
        this.storeTasks();
    }
}
