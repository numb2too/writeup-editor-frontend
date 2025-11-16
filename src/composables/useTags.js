import { computed } from 'vue'

export function useTags(articles) {
    const allTags = computed(() => {
        const tagsMap = {}
        articles.value.forEach(article => {
            article.tools.forEach(tool => {
                tagsMap[tool] = (tagsMap[tool] || 0) + 1
            })
        })
        return tagsMap
    })

    return { allTags }
}