<template>
    <div class="article-card" :class="{ editing: isEditing }">
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

        <div class="edit-field">
            <label>標題:</label>
            <input v-model="formData.title" type="text">
        </div>

        <div class="edit-field">
            <label>資料夾名稱:</label>
            <input v-model="formData.folder" type="text">
        </div>

        <div class="edit-field">
            <label>描述:</label>
            <textarea v-model="formData.description"></textarea>
        </div>

        <div class="edit-field">
            <label>平台:</label>
            <input v-model="formData.platform" type="text">
        </div>

        <div class="edit-field">
            <label>日期時間 (格式: YYYY-MM-DD HH:MM:SS):</label>
            <input v-model="formData.date" type="text" placeholder="2025-11-16 14:30:00">
        </div>

        <div class="article-tools">
            <label class="tools-label">🏷️ 標籤 (點擊刪除):</label>
            <span v-for="tool in article.tools" :key="tool" class="tool-tag"
                @click="$emit('remove-tag', article, tool)">
                {{ tool }}
            </span>

            <div class="add-tag-section">
                <TagSuggestions v-model="newTag" :all-tags="allTags" :current-tags="article.tools"
                    @select="handleSelectTag" />
                <button class="add-tag-btn" @click="handleAddTag">+ 新增</button>
            </div>
        </div>

        <div class="action-buttons">
            <button class="btn btn-save" @click="handleSave">💾 儲存修改</button>
            <button class="btn btn-delete" @click="handleDelete">🗑️ 刪除</button>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import TagSuggestions from './TagSuggestions.vue'

const props = defineProps({
    article: Object,
    allTags: Object
})

const emit = defineEmits(['save', 'delete', 'add-tag', 'remove-tag'])

const isEditing = ref(false)
const newTag = ref('')

const formData = reactive({
    title: props.article.title,
    folder: props.article.folder,
    description: props.article.description,
    platform: props.article.platform || '',
    date: props.article.date
})

const displayDate = computed(() => {
    return props.article.date.split(' ')[0]
})

const handleSave = () => {
    emit('save', props.article, formData)
}

const handleDelete = () => {
    emit('delete', props.article)
}

const handleAddTag = () => {
    if (newTag.value.trim()) {
        emit('add-tag', props.article, newTag.value.trim())
        newTag.value = ''
    }
}

const handleSelectTag = (tag) => {
    emit('add-tag', props.article, tag)
    newTag.value = ''
}
</script>