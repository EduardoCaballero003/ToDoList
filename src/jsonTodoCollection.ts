import { TodoItem } from "./todoItem.js";
import { TodoCollection } from "./todoCollection.js";

export class JsonTodoCollection extends TodoCollection {
    constructor(public userName: string, todoItems: TodoItem[] = []) {
        super(userName, []);
        
        // Intentar cargar tareas desde localStorage
        const storedTasks = localStorage.getItem("tasks");
        if (storedTasks) {
            let dbItems = JSON.parse(storedTasks);
            dbItems.forEach((item: TodoItem) => 
                this.itemMap.set(item.id, new TodoItem(item.id, item.task, item.complete))
            );
        } else {
            this.storeTasks(todoItems);
            todoItems.forEach(item => this.itemMap.set(item.id, item));
        }
    }

    // Método para guardar las tareas en localStorage
    protected storeTasks(tasks: TodoItem[] = [...this.itemMap.values()]) {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    addTodo(task: string): number {
        let result = super.addTodo(task);
        this.storeTasks();
        return result;
    }

    markComplete(id: number, complete: boolean): void {
        super.markComplete(id, complete);
        this.storeTasks();
    }

    removeComplete(): void {
        super.removeComplete();
        this.storeTasks();
    }
}
