<template>
    <div class="tag-input-wrapper">
        <input type="text" class="add-tag-input" placeholder="輸入標籤（模糊搜尋）..." :value="modelValue" @input="handleInput"
            @focus="showSuggestions = true" autocomplete="off">
        <div v-if="showSuggestions && filteredTags.length > 0" class="tag-suggestions show">
            <div v-for="[tag, count] in filteredTags" :key="tag" class="tag-suggestion-item" @click="selectTag(tag)">
                <span>{{ tag }}</span>
                <span class="tag-suggestion-count">{{ count }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
    modelValue: String,
    allTags: Object,
    currentTags: Array
})

const emit = defineEmits(['update:modelValue', 'select'])

const showSuggestions = ref(false)

const handleInput = (e) => {
    emit('update:modelValue', e.target.value)
    showSuggestions.value = true
}

const filteredTags = computed(() => {
    const search = props.modelValue?.toLowerCase().trim() || ''
    if (!search) return []

    return Object.entries(props.allTags)
        .filter(([tag]) =>
            tag.toLowerCase().includes(search) &&
            !props.currentTags.includes(tag)
        )
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
})

const selectTag = (tag) => {
    emit('select', tag)
    showSuggestions.value = false
}

const handleClickOutside = (e) => {
    if (!e.target.closest('.tag-input-wrapper')) {
        showSuggestions.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>