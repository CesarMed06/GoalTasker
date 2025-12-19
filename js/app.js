let tasks = [];
let currentFilter = 'all';

function loadTasks() {
    const storedTasks = localStorage.getItem('footballTasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
    renderTasks();
    updateCounter();
}

function saveTasks() {
    localStorage.setItem('footballTasks', JSON.stringify(tasks));
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');
    
    let filteredTasks = tasks;
    
    if (currentFilter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }
    
    if (filteredTasks.length === 0) {
        taskList.style.display = 'none';
        emptyState.style.display = 'block';
    } else {
        taskList.style.display = 'flex';
        emptyState.style.display = 'none';
        taskList.innerHTML = '';
        
        filteredTasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = 'task-item' + (task.completed ? ' completed' : '');
            
            li.innerHTML = `
                <input type="checkbox" ${task.completed ? 'checked' : ''} 
                       onchange="toggleTask(${tasks.indexOf(task)})">
                <span class="task-text">${task.text}</span>
                <button class="btn-delete" onclick="deleteTask(${tasks.indexOf(task)})">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            
            taskList.appendChild(li);
        });
    }
}

function updateCounter() {
    const counter = document.getElementById('taskCounter');
    const pendingTasks = tasks.filter(task => !task.completed).length;
    counter.textContent = `${pendingTasks} tarea${pendingTasks !== 1 ? 's' : ''}`;
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
    updateCounter();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
    updateCounter();
}

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const text = taskInput.value.trim();
        if (text) {
            tasks.push({
                text: text,
                completed: false,
                id: Date.now()
            });
            
            taskInput.value = '';
            saveTasks();
            renderTasks();
            updateCounter();
        }
    });
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.dataset.filter;
            renderTasks();
        });
    });
});
