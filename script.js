let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

const taskInput = document.getElementById('task-input');
const taskDateTime = document.getElementById('task-datetime');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const filterBtns = document.querySelectorAll('.filter-btn');
const totalTasks = document.getElementById('total-tasks');
const completedTasks = document.getElementById('completed-tasks');

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = '';
    
    let filteredTasks = tasks;
    if (currentFilter === 'pending') {
        filteredTasks = tasks.filter(t =>!t.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(t => t.completed);
    }
    
    filteredTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed? 'completed' : ''}`;
        
        const dateStr = task.datetime? new Date(task.datetime).toLocaleString() : 'No date set';
        
        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed? 'checked' : ''} data-index="${index}">
            <div class="task-content">
                <div class="task-text">${task.text}</div>
                <div class="task-datetime">${dateStr}</div>
            </div>
            <div class="task-actions">
                <button class="edit-btn" data-index="${index}">Edit</button>
                <button class="delete-btn" data-index="${index}">Delete</button>
            </div>
        `;
        taskList.appendChild(li);
    });
    
    updateStats();
}

function updateStats() {
    totalTasks.textContent = tasks.length;
    completedTasks.textContent = tasks.filter(t => t.completed).length;
}

function addTask() {
    const text = taskInput.value.trim();
    const datetime = taskDateTime.value;
    
    if (text === '') {
        alert('Please enter a task');
        return;
    }
    
    tasks.push({
        text: text,
        datetime: datetime,
        completed: false,
        createdAt: new Date().toISOString()
    });
    
    taskInput.value = '';
    taskDateTime.value = '';
    saveTasks();
    renderTasks();
}

function toggleComplete(index) {
    tasks[index].completed =!tasks[index].completed;
    saveTasks();
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

function editTask(index) {
    const taskItem = taskList.children[index];
    const taskContent = taskItem.querySelector('.task-content');
    const currentText = tasks[index].text;
    
    taskContent.innerHTML = `
        <input type="text" class="edit-input" value="${currentText}">
        <button class="save-btn edit-btn">Save</button>
    `;
    
    const editInput = taskContent.querySelector('.edit-input');
    const saveBtn = taskContent.querySelector('.save-btn');
    
    editInput.focus();
    
    saveBtn.addEventListener('click', () => {
        const newText = editInput.value.trim();
        if (newText!== '') {
            tasks[index].text = newText;
            saveTasks();
            renderTasks();
        }
    });
    
    editInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') saveBtn.click();
    });
}

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

taskList.addEventListener('click', (e) => {
    const index = parseInt(e.target.dataset.index);
    if (e.target.classList.contains('task-checkbox')) {
        toggleComplete(index);
    } else if (e.target.classList.contains('delete-btn')) {
        deleteTask(index);
    } else if (e.target.classList.contains('edit-btn')) {
        editTask(index);
    }
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

renderTasks();