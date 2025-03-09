import { TodoItem } from "./todoItem.js";
export class TodoCollection {
    constructor(userName, todoItems = []) {
        this.userName = userName;
        this.nextId = 1;
        this.itemMap = new Map();
        // Cargar tareas desde localStorage
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
    addTodo(task) {
        while (this.getTodoById(this.nextId)) {
            this.nextId++;
        }
        this.itemMap.set(this.nextId, new TodoItem(this.nextId, task));
        this.storeTasks();
        return this.nextId;
    }
    getTodoById(id) {
        return this.itemMap.get(id);
    }
    getTodoItems(includeComplete) {
        return [...this.itemMap.values()]
            .filter(item => includeComplete || !item.complete);
    }
    markComplete(id, complete) {
        const todoItem = this.getTodoById(id);
        if (todoItem) {
            todoItem.complete = complete;
            this.storeTasks();
        }
    }
    removeComplete() {
        this.itemMap.forEach(item => {
            if (item.complete) {
                this.itemMap.delete(item.id);
            }
        });
        this.storeTasks();
    }
    getItemCounts() {
        return {
            total: this.itemMap.size,
            incomplete: this.getTodoItems(false).length
        };
    }
    storeTasks(tasks = [...this.itemMap.values()]) {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
}
