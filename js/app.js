const i18n = {
    es: {
        progress: 'Progreso',
        placeholder: '¿Qué quieres conseguir hoy?',
        category: 'Categoría',
        priority: 'Prioridad',
        search: 'Buscar...',
        all: 'Todas',
        pending: 'Pendientes',
        completed: 'Completadas',
        noTasks: 'No hay tareas todavía',
        noResults: 'Sin resultados',
        deleted: 'Tarea eliminada',
        undo: 'Deshacer',
        editPlaceholder: 'Editar tarea...',
        overdue: 'Vencida',
        markDone: 'Marcar completada',
        markUndone: 'Marcar pendiente',
        editTask: 'Editar tarea',
        cancel: 'Cancelar',
        save: 'Guardar',
        switchTo: 'Cambiar a inglés',
        export: 'Exportar',
        import: 'Importar',
        exportSuccess: 'Tareas exportadas',
        importSuccess: 'Tareas importadas',
        importError: 'Archivo no válido',
        importConfirm: '¿Sobrescribir con {n} tareas?'
    },
    en: {
        progress: 'Progress',
        placeholder: 'What do you want to achieve today?',
        category: 'Category',
        priority: 'Priority',
        search: 'Search...',
        all: 'All',
        pending: 'Pending',
        completed: 'Completed',
        noTasks: 'No tasks yet',
        noResults: 'No results',
        deleted: 'Task deleted',
        undo: 'Undo',
        editPlaceholder: 'Edit task...',
        overdue: 'Overdue',
        markDone: 'Mark completed',
        markUndone: 'Mark pending',
        editTask: 'Edit task',
        cancel: 'Cancel',
        save: 'Save',
        switchTo: 'Switch to Spanish',
        export: 'Export',
        import: 'Import',
        exportSuccess: 'Tasks exported',
        importSuccess: 'Tasks imported',
        importError: 'Invalid file',
        importConfirm: 'Overwrite with {n} tasks?'
    }
};

let lang = localStorage.getItem('lang') || 'es';
let theme = localStorage.getItem('theme') || 'light';
let tasks = JSON.parse(localStorage.getItem('gt_tasks') || '[]');
let currentFilter = 'all';
let searchQuery = '';
let deletedTask = null;
let editingId = null;

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function t(key) {
    return i18n[lang][key] || key;
}

function setLang(l) {
    lang = l;
    localStorage.setItem('lang', l);
    document.documentElement.lang = l;

    const flagBtn = $('#langToggle');
    if (l === 'es') {
        flagBtn.innerHTML = '<svg viewBox="0 0 60 40" width="22" height="15" aria-hidden="true"><rect width="60" height="40" fill="#012169"/><path d="M0 0l60 40M60 0L0 40" stroke="#fff" stroke-width="8"/><path d="M0 0l60 40M60 0L0 40" stroke="#C8102E" stroke-width="4"/><path d="M30 0v40M0 20h60" stroke="#fff" stroke-width="12"/><path d="M30 0v40M0 20h60" stroke="#C8102E" stroke-width="6"/></svg>';
        flagBtn.setAttribute('aria-label', t('switchTo'));
    } else {
        flagBtn.innerHTML = '<svg viewBox="0 0 60 40" width="22" height="15" aria-hidden="true"><rect y="8" width="60" height="24" fill="#FFC400"/><rect width="60" height="8" fill="#C60B1E"/><rect y="32" width="60" height="8" fill="#C60B1E"/></svg>';
        flagBtn.setAttribute('aria-label', t('switchTo'));
    }

    flagBtn.classList.add('flip');
    setTimeout(() => flagBtn.classList.remove('flip'), 300);

    $$('[data-i18n]').forEach(el => el.textContent = t(el.dataset.i18n));
    $$('[data-i18n-placeholder]').forEach(el => el.placeholder = t(el.dataset.i18nPlaceholder));
    $('#taskInput').placeholder = t('placeholder');
    rebuildSelects();
    renderAll();
}

function rebuildSelects() {
    const cats = { entreno: '🏋️', partido: '⚽', tactica: '📋', fisico: '💪', nutricion: '🥗', otro: '📌' };
    const catLabels = lang === 'es'
        ? { entreno: 'Entreno', partido: 'Partido', tactica: 'Táctica', fisico: 'Físico', nutricion: 'Nutrición', otro: 'Otro' }
        : { entreno: 'Training', partido: 'Match', tactica: 'Tactics', fisico: 'Physical', nutricion: 'Nutrition', otro: 'Other' };
    const priLabels = lang === 'es'
        ? { alta: 'Alta', media: 'Media', baja: 'Baja' }
        : { alta: 'High', media: 'Medium', baja: 'Low' };

    ['#categorySelect', '#modalCategory'].forEach(sel => {
        const select = $(sel);
        if (!select) return;
        const saved = select.value;
        select.querySelectorAll('option:not([value=""])').forEach(o => o.remove());
        Object.entries(cats).forEach(([val, emoji]) => {
            const opt = document.createElement('option');
            opt.value = val;
            opt.textContent = `${emoji} ${catLabels[val]}`;
            select.appendChild(opt);
        });
        select.value = saved;
    });

    ['#prioritySelect', '#modalPriority'].forEach(sel => {
        const select = $(sel);
        if (!select) return;
        const saved = select.value;
        select.querySelectorAll('option:not([value=""])').forEach(o => o.remove());
        ['alta', 'media', 'baja'].forEach(val => {
            const opt = document.createElement('option');
            opt.value = val;
            const emoji = val === 'alta' ? '🔴' : val === 'media' ? '🟡' : '🟢';
            opt.textContent = `${emoji} ${priLabels[val]}`;
            select.appendChild(opt);
        });
        select.value = saved;
    });
}

function setTheme(th) {
    theme = th;
    localStorage.setItem('theme', th);
    document.documentElement.setAttribute('data-theme', th);
    const btn = $('#themeToggle');
    btn.classList.add('spin');
    setTimeout(() => btn.classList.remove('spin'), 500);
    const icon = btn.querySelector('i');
    icon.className = th === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

function save() {
    localStorage.setItem('gt_tasks', JSON.stringify(tasks));
}

function addTask(text, category, priority, dueDate) {
    tasks.unshift({
        id: Date.now(),
        text,
        completed: false,
        category: category || '',
        priority: priority || '',
        dueDate: dueDate || '',
        createdAt: new Date().toISOString()
    });
    save();
}

function deleteTask(id) {
    const idx = tasks.findIndex(t => t.id === id);
    if (idx === -1) return;
    deletedTask = tasks[idx];
    tasks.splice(idx, 1);
    save();
    showToast(t('deleted'), true);
}

function undoDelete() {
    if (!deletedTask) return;
    tasks.unshift(deletedTask);
    deletedTask = null;
    save();
    renderAll();
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    task.completed = !task.completed;
    save();
    if (task.completed) spawnConfetti();
    renderAll();
}

function updateTask(id, data) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    if (data.text !== undefined && data.text.trim()) task.text = data.text.trim();
    if (data.category !== undefined) task.category = data.category;
    if (data.priority !== undefined) task.priority = data.priority;
    if (data.dueDate !== undefined) task.dueDate = data.dueDate;
    save();
    renderAll();
}

function openEditModal(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    $('#modalText').value = task.text;
    $('#modalCategory').value = task.category || '';
    $('#modalPriority').value = task.priority || '';
    $('#modalDate').value = task.dueDate || '';

    const modal = $('#editModal');
    modal.dataset.editId = id;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    $('#modalText').focus();
    $('#modalText').select();
}

function closeEditModal() {
    const modal = $('#editModal');
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    delete modal.dataset.editId;
}

function saveEditModal() {
    const modal = $('#editModal');
    const id = Number(modal.dataset.editId);
    if (!id) return;

    const text = $('#modalText').value;
    if (!text.trim()) {
        $('#modalText').focus();
        return;
    }

    updateTask(id, {
        text,
        category: $('#modalCategory').value,
        priority: $('#modalPriority').value,
        dueDate: $('#modalDate').value
    });
    closeEditModal();
}

function getFilteredTasks() {
    let filtered = [...tasks];
    if (currentFilter === 'pending') filtered = filtered.filter(t => !t.completed);
    if (currentFilter === 'completed') filtered = filtered.filter(t => t.completed);
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(t => t.text.toLowerCase().includes(q));
    }
    return filtered;
}

function getProgress() {
    if (tasks.length === 0) return 0;
    const done = tasks.filter(t => t.completed).length;
    return Math.round((done / tasks.length) * 100);
}

function fmtDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-GB', { day: 'numeric', month: 'short' });
}

function isOverdue(dateStr) {
    if (!dateStr) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dateStr + 'T00:00:00') < today;
}

function categoryLabel(cat) {
    const map = { entreno: '🏋️', partido: '⚽', tactica: '📋', fisico: '💪', nutricion: '🥗', otro: '📌' };
    return map[cat] || cat;
}

function priorityLabel(pri) {
    const map = { alta: '🔴', media: '🟡', baja: '🟢' };
    return map[pri] || pri;
}

function buildTaskHTML(task) {
    let badges = '';
    if (task.category) {
        badges += `<span class="task-badge badge-category">${categoryLabel(task.category)}</span>`;
    }
    if (task.priority) {
        badges += `<span class="task-badge badge-priority-${task.priority}">${priorityLabel(task.priority)}</span>`;
    }
    if (task.dueDate) {
        const over = isOverdue(task.dueDate) && !task.completed;
        badges += `<span class="task-badge badge-date${over ? ' overdue' : ''}">
            <i class="far fa-calendar-alt"></i> ${fmtDate(task.dueDate)}${over ? ' ' + t('overdue') : ''}
        </span>`;
    }

    return `
        <input type="checkbox" class="task-check" ${task.completed ? 'checked' : ''} 
            aria-label="${task.completed ? t('markUndone') : t('markDone')}: ${task.text}">
        <div class="task-content">
            <span class="task-text" title="${task.text}">${task.text}</span>
            ${badges ? `<div class="task-meta">${badges}</div>` : ''}
        </div>
        <div class="task-actions">
            <button class="task-btn edit" aria-label="Editar tarea"><i class="fas fa-pen"></i></button>
            <button class="task-btn delete" aria-label="Eliminar tarea"><i class="fas fa-trash"></i></button>
        </div>
    `;
}

function renderTasks() {
    if (editingId) return;
    const list = $('#taskList');
    const empty = $('#emptyState');
    const filtered = getFilteredTasks();

    if (filtered.length === 0) {
        list.innerHTML = '';
        list.style.display = 'none';
        empty.classList.add('visible');
        const msg = searchQuery ? 'noResults' : 'noTasks';
        empty.querySelector('p').textContent = t(msg);
    } else {
        empty.classList.remove('visible');
        list.style.display = 'flex';
        list.innerHTML = '';

        filtered.forEach(task => {
            const li = document.createElement('li');
            li.className = 'task-item' + (task.completed ? ' completed' : '');
            li.dataset.id = task.id;
            li.innerHTML = buildTaskHTML(task);
            list.appendChild(li);
        });
    }
}

function renderProgress() {
    const pct = getProgress();
    $('#progressPercent').textContent = pct + '%';
    $('#progressFill').style.width = pct + '%';
    $('#progressFill').setAttribute('aria-valuenow', pct);
}

function renderAll() {
    renderTasks();
    renderProgress();
}

function showToast(msg, withUndo) {
    const toast = $('#toast');
    toast.innerHTML = withUndo
        ? `${msg} <button class="toast-undo" id="toastUndo">${t('undo')}</button>`
        : msg;
    toast.classList.add('visible');

    if (withUndo) {
        $('#toastUndo').onclick = () => {
            undoDelete();
            hideToast();
        };
    }

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(hideToast, 4000);
}

function hideToast() {
    $('#toast').classList.remove('visible');
}

function exportTasks() {
    const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'goaltasker-backup.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast(t('exportSuccess'));
}

function importTasks(file) {
    const reader = new FileReader();
    reader.onload = e => {
        try {
            const data = JSON.parse(e.target.result);
            if (!Array.isArray(data)) throw new Error();
            const valid = data.filter(t => t && typeof t.text === 'string' && t.text.trim());
            if (!valid.length) throw new Error();
            if (!confirm(t('importConfirm').replace('{n}', valid.length))) return;
            tasks = valid.map(t => ({
                id: t.id || Date.now() + Math.random(),
                text: t.text.trim(),
                completed: !!t.completed,
                category: t.category || '',
                priority: t.priority || '',
                dueDate: t.dueDate || '',
                createdAt: t.createdAt || new Date().toISOString()
            }));
            save();
            renderAll();
            showToast(t('importSuccess'));
        } catch {
            showToast(t('importError'));
        }
    };
    reader.readAsText(file);
}

function spawnConfetti() {
    const canvas = $('#confetti');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#00a86b', '#00d68f', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899'];
    const particles = [];

    for (let i = 0; i < 80; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height * .5 - canvas.height * .5,
            w: Math.random() * 8 + 4,
            h: Math.random() * 4 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: (Math.random() - .5) * 4,
            vy: Math.random() * 3 + 2,
            rotation: Math.random() * 360,
            rv: (Math.random() - .5) * 10,
            opacity: 1
        });
    }

    let frame = 0;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = false;

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += .05;
            p.rotation += p.rv;
            p.opacity -= .008;

            if (p.opacity > 0 && p.y < canvas.height + 20) {
                alive = true;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.globalAlpha = Math.max(0, p.opacity);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                ctx.restore();
            }
        });

        if (alive && frame < 120) {
            frame++;
            requestAnimationFrame(draw);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    requestAnimationFrame(draw);
}

function setupEvents() {
    $('#taskForm').addEventListener('submit', e => {
        e.preventDefault();
        const text = $('#taskInput').value.trim();
        if (!text) return;
        addTask(
            text,
            $('#categorySelect').value,
            $('#prioritySelect').value,
            $('#dueDate').value
        );
        $('#taskInput').value = '';
        $('#categorySelect').value = '';
        $('#prioritySelect').value = '';
        $('#dueDate').value = '';
        $('#taskInput').focus();
        renderAll();
    });

    $$('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            $$('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderAll();
        });
    });

    $('#searchInput').addEventListener('input', e => {
        searchQuery = e.target.value.trim();
        $('#searchClear').style.display = searchQuery ? 'block' : 'none';
        renderAll();
    });

    $('#searchClear').addEventListener('click', () => {
        $('#searchInput').value = '';
        searchQuery = '';
        $('#searchClear').style.display = 'none';
        $('#searchInput').focus();
        renderAll();
    });

    $('#taskList').addEventListener('click', e => {
        const item = e.target.closest('.task-item');
        if (!item) return;
        const id = Number(item.dataset.id);

        if (e.target.closest('.delete')) {
            item.classList.add('removing');
            setTimeout(() => {
                deleteTask(id);
                renderAll();
            }, 200);
            return;
        }

        if (e.target.closest('.edit')) {
            if (editingId) return;
            openEditModal(id);
            return;
        }

        if (e.target.closest('.task-check')) {
            toggleTask(id);
            return;
        }
    });

    $('#exportBtn').addEventListener('click', exportTasks);

    $('#importBtn').addEventListener('click', () => $('#importFile').click());

    $('#importFile').addEventListener('change', e => {
        if (e.target.files[0]) importTasks(e.target.files[0]);
        e.target.value = '';
    });

    $('#langToggle').addEventListener('click', () => {
        setLang(lang === 'es' ? 'en' : 'es');
    });

    $('#themeToggle').addEventListener('click', () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    });

    $('#modalClose').addEventListener('click', closeEditModal);
    $('#modalCancel').addEventListener('click', closeEditModal);
    $('#modalSave').addEventListener('click', saveEditModal);

    $('#editModal').addEventListener('click', e => {
        if (e.target === $('#editModal')) closeEditModal();
    });

    $('#editModal').addEventListener('keydown', e => {
        if (e.key === 'Escape') closeEditModal();
        if (e.key === 'Enter' && document.activeElement !== $('#modalText').closest('.modal-body')) {
            saveEditModal();
        }
    });

    document.addEventListener('keydown', e => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            $('#searchInput').focus();
        }
        if (e.key === 'Escape') {
            const modal = $('#editModal');
            if (modal.classList.contains('open')) {
                closeEditModal();
                return;
            }
            if (document.activeElement === $('#searchInput')) {
                $('#searchInput').value = '';
                searchQuery = '';
                $('#searchClear').style.display = 'none';
                $('#searchInput').blur();
                renderAll();
            }
        }
    });
}

function init() {
    document.documentElement.lang = lang;
    setTheme(theme);
    setLang(lang);
    $('#currentYear').textContent = new Date().getFullYear();
    setupEvents();
    renderAll();
    $('#taskInput').focus();
}

document.addEventListener('DOMContentLoaded', init);
