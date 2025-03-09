import { TodoItem } from "./todoItem.js";

type ItemCounts = {
    total: number,
    incomplete: number
};

export class TodoCollection {
    private nextId: number = 1;
    protected itemMap = new Map<number, TodoItem>();

    constructor(public userName: string, todoItems: TodoItem[] = []) {
        // Cargar tareas desde localStorage
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

    addTodo(task: string): number {
        while (this.getTodoById(this.nextId)) {
            this.nextId++;
        }
        this.itemMap.set(this.nextId, new TodoItem(this.nextId, task));
        this.storeTasks();
        return this.nextId;
    }

    getTodoById(id: number): TodoItem | undefined {
        return this.itemMap.get(id);
    }

    getTodoItems(includeComplete: boolean): TodoItem[] {
        return [...this.itemMap.values()]
            .filter(item => includeComplete || !item.complete);
    }

    markComplete(id: number, complete: boolean): void {
        const todoItem = this.getTodoById(id);
        if (todoItem) {
            todoItem.complete = complete;
            this.storeTasks();
        }
    }

    removeComplete(): void {
        this.itemMap.forEach(item => {
            if (item.complete) {
                this.itemMap.delete(item.id);
            }
        });
        this.storeTasks();
    }

    getItemCounts(): ItemCounts {
        return {
            total: this.itemMap.size,
            incomplete: this.getTodoItems(false).length
        };
    }

    protected storeTasks(tasks: TodoItem[] = [...this.itemMap.values()]): void {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
}
