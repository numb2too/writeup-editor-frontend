import { ref, computed, onMounted } from 'vue'
import * as api from '@/api/writeup'
import { useNotification } from './useNotification'

export function useArticles() {
  const articles = ref([])
  const searchText = ref('')
  const activeFilter = ref(null)
  const isLoading = ref(true)
  
  const { showNotification } = useNotification()

  const filteredArticles = computed(() => {
    if (!activeFilter.value) return articles.value
    
    const search = activeFilter.value.toLowerCase()
    return articles.value.filter(article => 
      article.title.toLowerCase().includes(search) ||
      article.folder.toLowerCase().includes(search) ||
      article.tools.some(tool => tool.toLowerCase().includes(search))
    )
  })

  const loadArticles = async () => {
    try {
      const data = await api.getWriteup()
      articles.value = data.sort((a, b) => new Date(b.date) - new Date(a.date))
      isLoading.value = false
    } catch (error) {
      showNotification('載入失敗: ' + error.message, 'error')
      isLoading.value = false
    }
  }

  const detectNewFolders = async () => {
    try {
      const result = await api.detectNewFolders()
      const newFolders = result.newFolders
      
      if (newFolders.length === 0) {
        showNotification('沒有發現新資料夾', 'success')
        return
      }
      
      for (const folderName of newFolders) {
        const newArticle = {
          title: folderName,
          description: folderName,
          tools: ['knowledge', folderName],
          date: getCurrentDate(),
          folder: folderName,
          platform: 'knowledge'
        }
        articles.value.unshift(newArticle)
      }
      
      await api.saveToJson(articles.value)
      showNotification(`成功新增 ${newFolders.length} 個新資料夾`, 'success')
    } catch (error) {
      showNotification('偵測失敗: ' + error.message, 'error')
    }
  }

  const saveArticle = async (article, formData) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/
    if (!dateRegex.test(formData.date)) {
      showNotification('日期格式錯誤', 'error')
      return
    }
    
    try {
      Object.assign(article, formData)
      articles.value.sort((a, b) => new Date(b.date) - new Date(a.date))
      await api.saveToJson(articles.value)
      showNotification('✅ 儲存成功！', 'success')
    } catch (error) {
      showNotification('儲存失敗: ' + error.message, 'error')
    }
  }

  const deleteArticle = async (article) => {
    if (!confirm(`確定要刪除文章「${article.title}」嗎？`)) return
    
    try {
      const index = articles.value.indexOf(article)
      articles.value.splice(index, 1)
      await api.saveToJson(articles.value)
      showNotification('文章已刪除', 'success')
    } catch (error) {
      showNotification('刪除失敗: ' + error.message, 'error')
    }
  }

  const addTagToArticle = async (article, tag) => {
    if (article.tools.includes(tag)) {
      showNotification('此標籤已存在！', 'error')
      return
    }
    
    article.tools.push(tag)
    await api.saveToJson(articles.value)
    showNotification('標籤已新增', 'success')
  }

  const removeTagFromArticle = async (article, tag) => {
    if (!confirm(`確定要刪除標籤「${tag}」嗎？`)) return
    
    article.tools = article.tools.filter(t => t !== tag)
    await api.saveToJson(articles.value)
    showNotification('標籤已刪除', 'success')
  }

  const clearSearch = () => {
    searchText.value = ''
    activeFilter.value = null
  }

  const filterByTag = (tag) => {
    if (activeFilter.value === tag) {
      activeFilter.value = null
      searchText.value = ''
    } else {
      activeFilter.value = tag
      searchText.value = tag
    }
  }

  const getCurrentDate = () => {
    const now = new Date()
    return now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0') + ' ' +
      String(now.getHours()).padStart(2, '0') + ':' +
      String(now.getMinutes()).padStart(2, '0') + ':' +
      String(now.getSeconds()).padStart(2, '0')
  }

  onMounted(loadArticles)

  return {
    articles,
    searchText,
    activeFilter,
    filteredArticles,
    isLoading,
    detectNewFolders,
    saveArticle,
    deleteArticle,
    addTagToArticle,
    removeTagFromArticle,
    clearSearch,
    filterByTag
  }
}