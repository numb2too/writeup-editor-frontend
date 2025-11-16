<template>
    <div class="sidebar">
        <h3>🔍 偵測新文章</h3>
        <div class="detect-section">
            <button class="detect-btn" @click="$emit('detect-folders')" :disabled="isDetecting">
                {{ isDetecting ? '偵測中...' : '🔎 偵測 /writeups 資料夾' }}
            </button>
        </div>

        <h3>🔎 搜尋篩選</h3>
        <div class="search-section">
            <input type="text" class="search-input" placeholder="搜尋標題或標籤..." :value="searchText"
                @input="$emit('update:search', $event.target.value)">
            <button class="clear-search" @click="$emit('clear-search')">
                清除搜尋
            </button>
        </div>

        <div class="stats">
            <div class="stat-item">
                <span class="stat-label">文章總數:</span>
                <span class="stat-value">{{ articles.length }}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">顯示文章:</span>
                <span class="stat-value">{{ filteredCount }}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">標籤總數:</span>
                <span class="stat-value">{{ Object.keys(allTags).length }}</span>
            </div>
        </div>

        <div class="all-tags">
            <h3>🏷️ 所有標籤</h3>
            <div class="tags-list">
                <span v-for="[tag, count] in sortedTags" :key="tag" class="tag-item"
                    :class="{ active: activeFilter === tag }" @click="$emit('filter-by-tag', tag)">
                    {{ tag }}
                    <span class="tag-count">{{ count }}</span>
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    articles: Array,
    filteredCount: Number,
    searchText: String,
    allTags: Object,
    activeFilter: String,
    isDetecting: Boolean
})

defineEmits(['update:search', 'clear-search', 'filter-by-tag', 'detect-folders'])

const sortedTags = computed(() => {
    return Object.entries(props.allTags).sort((a, b) => b[1] - a[1])
})
</script>