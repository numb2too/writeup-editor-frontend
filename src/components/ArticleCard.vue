<template>
    <div class="article-card">
        <div class="card-header">
            <h2 class="card-title">📝 編輯文章</h2>
            <button class="close-btn" @click="$emit('close')" title="關閉">✕</button>
        </div>

        <div class="article-header">
            <div>
                <div class="article-title-display">{{ article.title }}</div>
                <span v-if="article.platform" class="platform-badge">
                    {{ article.platform }}
                </span>
            </div>
            <div class="article-meta">
                <div>📅 {{ displayDate }}</div>
                <div>📁 {{ article.folder }}</div>
            </div>
        </div>

        <!-- 可滾動的內容區域 -->
        <div class="article-card-content">
            <!-- 第一行：標題 + 資料夾 -->
            <div class="fields-row">
                <div class="edit-field">
                    <label>標題:</label>
                    <input v-model="formData.title" type="text">
                </div>
                <div class="edit-field">
                    <label>資料夾名稱:</label>
                    <input v-model="formData.folder" type="text">
                </div>
            </div>

            <!-- 第二行：平台 + 日期時間 -->
            <div class="fields-row">
                <div class="edit-field">
                    <label>平台:</label>
                    <input v-model="formData.platform" type="text">
                </div>
                <div class="edit-field">
                    <label>日期時間 (格式: YYYY-MM-DD HH:MM:SS):</label>
                    <input v-model="formData.date" type="text" placeholder="2025-11-16 14:30:00">
                </div>
            </div>

            <!-- 第三行：描述（全寬） -->
            <div class="edit-field field-full">
                <label>描述:</label>
                <textarea v-model="formData.description" rows="6"></textarea>
            </div>
        </div>

        <div class="action-buttons">
            <button class="btn btn-save" @click="handleSave">💾 儲存修改</button>
            <button class="btn btn-delete" @click="handleDelete">🗑️ 刪除</button>
        </div>
    </div>
</template>

<script setup>
import { reactive, computed, watch } from 'vue'

const props = defineProps({
    article: Object
})

const emit = defineEmits(['save', 'delete', 'close'])

const formData = reactive({
    title: props.article.title,
    folder: props.article.folder,
    description: props.article.description,
    platform: props.article.platform || '',
    date: props.article.date
})

// 監聽 article 變化，同步更新 formData
watch(() => props.article, (newArticle) => {
    if (newArticle) {
        formData.title = newArticle.title
        formData.folder = newArticle.folder
        formData.description = newArticle.description
        formData.platform = newArticle.platform || ''
        formData.date = newArticle.date
    }
}, { immediate: true })

const displayDate = computed(() => {
    return props.article.date.split(' ')[0]
})

const handleSave = () => {
    emit('save', props.article, formData)
}

const handleDelete = () => {
    emit('delete', props.article)
}
</script>

<style scoped>
/* 保持原有的樣式，只需移除 article-tools 相關的樣式 */
.article-card {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.card-header,
.article-header,
.action-buttons {
    flex-shrink: 0;
}

.article-card-content {
    flex: 1;
    overflow-y: auto;
    padding-right: 5px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 12px;
    border-bottom: 2px solid #e7e9fc;
}

.card-title {
    color: #667eea;
    font-size: 1.3em;
    margin: 0;
}

.close-btn {
    background: #ff6b6b;
    color: white;
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    font-size: 1.2em;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
}

.close-btn:hover {
    background: #ff5252;
    transform: rotate(90deg);
}

.article-header {
    display: flex;
    justify-content: space-between;
    align-items: start;
    margin-bottom: 15px;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 8px;
}

.article-title-display {
    font-size: 1.2em;
    color: #333;
    font-weight: 600;
    margin-bottom: 5px;
}

.article-meta {
    text-align: right;
    font-size: 0.85em;
    color: #666;
}

.platform-badge {
    display: inline-block;
    background: #764ba2;
    color: white;
    padding: 3px 10px;
    border-radius: 12px;
    font-size: 0.75em;
}

.fields-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-bottom: 15px;
}

.edit-field {
    display: flex;
    flex-direction: column;
}

.field-full {
    grid-column: 1 / -1;
}

.edit-field label {
    display: block;
    margin-bottom: 5px;
    color: #666;
    font-size: 0.85em;
    font-weight: 600;
}

.edit-field input,
.edit-field textarea {
    width: 100%;
    padding: 8px 10px;
    border: 2px solid #ddd;
    border-radius: 5px;
    font-size: 0.9em;
    transition: border-color 0.3s;
}

.edit-field textarea {
    resize: vertical;
    min-height: 60px;
    font-family: inherit;
}

.edit-field input:focus,
.edit-field textarea:focus {
    outline: none;
    border-color: #667eea;
}

.article-tools {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 2px solid #eee;
}

.tools-label {
    display: block;
    margin-bottom: 10px;
    color: #666;
    font-weight: 600;
    font-size: 0.9em;
}

.tool-tag {
    display: inline-block;
    background: #e7e9fc;
    color: #667eea;
    padding: 5px 10px;
    margin: 4px;
    border-radius: 15px;
    font-size: 0.85em;
    cursor: pointer;
    transition: all 0.3s;
}

.tool-tag:hover {
    background: #ff6b6b;
    color: white;
    transform: translateY(-2px);
}

.add-tag-section {
    margin-top: 12px;
    display: flex;
    gap: 10px;
}

.add-tag-btn {
    padding: 8px 16px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: 0.3s;
    white-space: nowrap;
    font-weight: 600;
    font-size: 0.9em;
}

.add-tag-btn:hover {
    background: #5568d3;
}

.action-buttons {
    display: flex;
    gap: 12px;
    margin-top: 15px;
    padding-top: 15px;
    border-top: 2px solid #eee;
}

.btn {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.95em;
    transition: all 0.3s;
    font-weight: 600;
}

.btn-save {
    background: #51cf66;
    color: white;
    flex: 1;
}

.btn-save:hover {
    background: #40c057;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(81, 207, 102, 0.3);
}

.btn-delete {
    background: #ff6b6b;
    color: white;
}

.btn-delete:hover {
    background: #ff5252;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 107, 107, 0.3);
}
</style>