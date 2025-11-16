<template>
    <div class="sidebar">
        <h3>🔍 偵測新文章</h3>
        <div class="detect-section">
            <button class="detect-btn" @click="$emit('detect-folders')" :disabled="isDetecting">
                {{ isDetecting ? '偵測中...' : '🔎 偵測 /writeups 資料夾' }}
            </button>
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
import { ref, computed } from 'vue'

const props = defineProps({
    articles: Array,
    selectedFolder: String,
    isDetecting: Boolean
})

defineEmits(['detect-folders', 'select-folder'])

const folderSearch = ref('')
const sortBy = ref('date')

const filteredFolders = computed(() => {
    let folders = [...props.articles]

    // 搜尋過濾
    if (folderSearch.value.trim()) {
        const search = folderSearch.value.toLowerCase()
        folders = folders.filter(article =>
            article.folder.toLowerCase().includes(search) ||
            article.title.toLowerCase().includes(search)
        )
    }

    // 排序
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
</script>

<style scoped>
.sort-section {
    margin-bottom: 15px;
}

.sort-section label {
    display: block;
    margin-bottom: 5px;
    color: #666;
    font-size: 0.9em;
    font-weight: 600;
}

.sort-select {
    width: 100%;
    padding: 8px;
    border: 2px solid #ddd;
    border-radius: 5px;
    font-size: 0.9em;
    background: white;
    cursor: pointer;
}

.sort-select:focus {
    outline: none;
    border-color: #667eea;
}

.folders-list {
    max-height: calc(100vh - 500px);
    overflow-y: auto;
    margin-top: 15px;
}

.folder-item {
    display: flex;
    align-items: center;
    padding: 12px;
    margin-bottom: 8px;
    background: white;
    border: 2px solid #e7e9fc;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
}

.folder-item:hover {
    border-color: #667eea;
    background: #f8f9ff;
    transform: translateX(5px);
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
    font-size: 1.5em;
    margin-right: 12px;
}

.folder-info {
    flex: 1;
    overflow: hidden;
}

.folder-name {
    font-weight: 600;
    font-size: 0.95em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.folder-date {
    font-size: 0.75em;
    color: #999;
    margin-top: 3px;
}

.no-folders {
    text-align: center;
    padding: 30px 20px;
    color: #999;
    font-size: 0.9em;
}

/* 滾動條樣式 */
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