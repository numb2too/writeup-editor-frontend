<template>
  <div class="app-container">
    <Notification :message="notification.message" :type="notification.type" :show="notification.show" />

    <div class="container">
      <Header />

      <div class="main-content">
        <Sidebar :articles="articles" :selected-folder="selectedFolder" :is-detecting="isDetecting"
          @detect-folders="detectNewFolders" @select-folder="selectFolder" />

        <div class="editor-area">
          <div v-if="!selectedFolder" class="welcome-screen">
            <div class="welcome-icon">📝</div>
            <h2>歡迎使用 Writeups 編輯器</h2>
            <p>請從左側選擇一個資料夾開始編輯</p>
            <div class="welcome-stats">
              <div class="stat-card">
                <div class="stat-number">{{ articles.length }}</div>
                <div class="stat-label">總文章數</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">{{ Object.keys(allTags).length }}</div>
                <div class="stat-label">標籤數量</div>
              </div>
            </div>
          </div>

          <UpdatedArticleCard v-else-if="selectedArticle" :article="selectedArticle" :all-tags="allTags"
            @save="saveArticle" @delete="deleteArticle" @add-tag="addTagToArticle" @remove-tag="removeTagFromArticle"
            @close="selectedFolder = null" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'
import UpdatedArticleCard from './components/ArticleCard.vue'
import Notification from './components/Notification.vue'
import { useArticles } from './composables/useArticles'
import { useTags } from './composables/useTags'
import { useNotification } from './composables/useNotification'

const {
  articles,
  isDetecting,
  detectNewFolders,
  saveArticle,
  deleteArticle,
  addTagToArticle,
  removeTagFromArticle
} = useArticles()

const { allTags } = useTags(articles)
const { notification } = useNotification()

const selectedFolder = ref(null)

const selectedArticle = computed(() => {
  if (!selectedFolder.value) return null
  return articles.value.find(a => a.folder === selectedFolder.value)
})

const selectFolder = (folder) => {
  selectedFolder.value = folder
}
</script>

<style>
.editor-area {
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.welcome-screen {
  text-align: center;
  padding: 60px 40px;
  max-width: 600px;
}

.welcome-icon {
  font-size: 5em;
  margin-bottom: 20px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-20px);
  }
}

.welcome-screen h2 {
  color: #333;
  margin-bottom: 15px;
  font-size: 1.8em;
}

.welcome-screen p {
  color: #666;
  font-size: 1.1em;
  margin-bottom: 40px;
}

.welcome-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 40px;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 30px;
  border-radius: 15px;
  color: white;
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-number {
  font-size: 2.5em;
  font-weight: bold;
  margin-bottom: 10px;
}

.stat-label {
  font-size: 0.9em;
  opacity: 0.9;
}
</style>