<template>
    <div class="sidebar">
        <h3>🔍 管理文章</h3>
        <div class="detect-section">
            <button class="detect-btn" @click="$emit('detect-folders')" :disabled="isDetecting">
                {{ isDetecting ? '偵測中...' : '🔎 偵測資料夾' }}
            </button>
            <button class="add-folder-btn" @click="showAddFolderDialog">
                ➕ 新增資料夾
            </button>
        </div>

        <!-- 新增資料夾對話框 -->
        <div v-if="showDialog" class="dialog-overlay" @click.self="closeDialog">
            <div class="dialog-box">
                <h3>新增資料夾</h3>
                <p class="dialog-hint">將在 /writeups 目錄下建立新資料夾</p>
                <input v-model="newFolderName" type="text" class="folder-input" placeholder="請輸入資料夾名稱..."
                    @keyup.enter="handleAddFolder" ref="folderInput">
                <div class="dialog-actions">
                    <button class="btn-cancel" @click="closeDialog">取消</button>
                    <button class="btn-confirm" @click="handleAddFolder" :disabled="!newFolderName.trim()">
                        確認新增
                    </button>
                </div>
            </div>
        </div>

        <h3>📁 資料夾目錄</h3>
        <div class="search-section">
            <input type="text" class="search-input" placeholder="快速搜尋資料夾..." v-model="folderSearch">
        </div>

        <div class="sort-section">
            <label>排序方式:</label>
            <select v-model="sortBy" class="sort-select">
                <option value="name">📝 名稱排序</option>
                <option value="date">📅 時間排序 (新→舊)</option>
                <option value="date-asc">📅 時間排序 (舊→新)</option>
            </select>
        </div>

        <div class="stats">
            <div class="stat-item">
                <span class="stat-label">文章總數:</span>
                <span class="stat-value">{{ articles.length }}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">顯示資料夾:</span>
                <span class="stat-value">{{ filteredFolders.length }}</span>
            </div>
        </div>

        <div class="folders-list">
            <div v-for="article in filteredFolders" :key="article.folder" class="folder-item"
                :class="{ active: selectedFolder === article.folder }" @click="$emit('select-folder', article.folder)">
                <div class="folder-icon">📁</div>
                <div class="folder-info">
                    <div class="folder-name">{{ article.folder }}</div>
                    <div class="folder-date">{{ formatDate(article.date) }}</div>
                </div>
            </div>

            <div v-if="filteredFolders.length === 0" class="no-folders">
                <p>😔 沒有找到符合的資料夾</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'

const props = defineProps({
    articles: Array,
    selectedFolder: String,
    isDetecting: Boolean
})

const emit = defineEmits(['detect-folders', 'select-folder', 'add-folder'])

const folderSearch = ref('')
const sortBy = ref('date')
const showDialog = ref(false)
const newFolderName = ref('')
const folderInput = ref(null)

const filteredFolders = computed(() => {
    let folders = [...props.articles]

    if (folderSearch.value.trim()) {
        const search = folderSearch.value.toLowerCase()
        folders = folders.filter(article =>
            article.folder.toLowerCase().includes(search) ||
            article.title.toLowerCase().includes(search)
        )
    }

    switch (sortBy.value) {
        case 'name':
            folders.sort((a, b) => a.folder.localeCompare(b.folder))
            break
        case 'date':
            folders.sort((a, b) => new Date(b.date) - new Date(a.date))
            break
        case 'date-asc':
            folders.sort((a, b) => new Date(a.date) - new Date(b.date))
            break
    }

    return folders
})

const formatDate = (dateStr) => {
    return dateStr.split(' ')[0]
}

const showAddFolderDialog = () => {
    showDialog.value = true
    nextTick(() => {
        folderInput.value?.focus()
    })
}

const closeDialog = () => {
    showDialog.value = false
    newFolderName.value = ''
}

const handleAddFolder = () => {
    if (newFolderName.value.trim()) {
        emit('add-folder', newFolderName.value.trim())
        closeDialog()
    }
}
</script>

<style scoped>
/* 原有樣式保持不變 */

/* 對話框樣式 */
.dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    animation: fadeIn 0.2s;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.dialog-box {
    background: white;
    border-radius: 12px;
    padding: 25px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    animation: slideUp 0.3s;
}

@keyframes slideUp {
    from {
        transform: translateY(20px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.dialog-box h3 {
    color: #667eea;
    margin: 0 0 10px 0;
    font-size: 1.3em;
}

.dialog-hint {
    color: #999;
    font-size: 0.85em;
    margin-bottom: 15px;
}

.folder-input {
    width: 100%;
    padding: 12px;
    border: 2px solid #ddd;
    border-radius: 6px;
    font-size: 0.95em;
    margin-bottom: 20px;
    transition: border-color 0.3s;
}

.folder-input:focus {
    outline: none;
    border-color: #667eea;
}

.dialog-actions {
    display: flex;
    gap: 10px;
}

.btn-cancel,
.btn-confirm {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 6px;
    font-size: 0.9em;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-cancel {
    background: #f1f3f5;
    color: #666;
}

.btn-cancel:hover {
    background: #e9ecef;
}

.btn-confirm {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.btn-confirm:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

.btn-confirm:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* 其他原有樣式... */
.sort-section {
    margin-bottom: 10px;
}

.sort-section label {
    display: block;
    margin-bottom: 4px;
    color: #666;
    font-size: 0.85em;
    font-weight: 600;
}

.sort-select {
    width: 100%;
    padding: 6px 8px;
    border: 2px solid #ddd;
    border-radius: 5px;
    font-size: 0.85em;
    background: white;
    cursor: pointer;
}

.sort-select:focus {
    outline: none;
    border-color: #667eea;
}

.folders-list {
    max-height: calc(100vh - 380px);
    overflow-y: auto;
    margin-top: 10px;
}

.folder-item {
    display: flex;
    align-items: center;
    padding: 8px 10px;
    margin-bottom: 6px;
    background: white;
    border: 2px solid #e7e9fc;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s;
}

.folder-item:hover {
    border-color: #667eea;
    background: #f8f9ff;
    transform: translateX(3px);
}

.folder-item.active {
    border-color: #667eea;
    background: #667eea;
    color: white;
}

.folder-item.active .folder-date {
    color: rgba(255, 255, 255, 0.8);
}

.folder-icon {
    font-size: 1.3em;
    margin-right: 10px;
}

.folder-info {
    flex: 1;
    overflow: hidden;
}

.folder-name {
    font-weight: 600;
    font-size: 0.9em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.folder-date {
    font-size: 0.7em;
    color: #999;
    margin-top: 2px;
}

.no-folders {
    text-align: center;
    padding: 20px;
    color: #999;
    font-size: 0.85em;
}

.folders-list::-webkit-scrollbar {
    width: 6px;
}

.folders-list::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
}

.folders-list::-webkit-scrollbar-thumb {
    background: #667eea;
    border-radius: 3px;
}

.folders-list::-webkit-scrollbar-thumb:hover {
    background: #5568d3;
}
</style>