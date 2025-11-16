<template>
  <div class="app-container">
    <Notification :message="notification.message" :type="notification.type" :show="notification.show" />

    <div class="container">
      <Header />

      <div class="main-content">
        <Sidebar :articles="articles" :selected-folder="selectedFolder" :is-detecting="isDetecting"
          @detect-folders="detectNewFolders" @select-folder="selectFolder" @add-folder="handleAddFolder" />

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

          <UpdatedArticleCard v-else-if="selectedArticle" :article="selectedArticle" @save="saveArticle"
            @delete="deleteArticle" @close="selectedFolder = null" />
        </div>

        <!-- 新增第三欄：標籤管理區 -->
        <div class="tags-panel" v-if="selectedArticle">
          <h3 class="tags-panel-title">🏷️ 標籤管理</h3>

          <!-- 新增標籤區域 (20% 高度) -->
          <div class="add-tag-section-panel">
            <label class="section-label">新增標籤:</label>
            <TagSuggestions v-model="newTag" :all-tags="allTags" :current-tags="selectedArticle.tools"
              @select="handleSelectTag" />
            <button class="add-tag-btn-panel" @click="handleAddTag">+ 新增標籤</button>
          </div>

          <!-- 當前標籤區域 (80% 高度) -->
          <div class="current-tags-section">
            <label class="section-label">當前標籤 ({{ selectedArticle.tools.length }}) - 點擊刪除:</label>
            <div class="tags-container-scrollable">
              <span v-for="tool in selectedArticle.tools" :key="tool" class="tool-tag"
                @click="removeTagFromArticle(selectedArticle, tool)">
                {{ tool }}
              </span>
            </div>
          </div>
        </div>

        <!-- 當沒有選擇文章時的提示 -->
        <div class="tags-panel" v-else>
          <h3 class="tags-panel-title">🏷️ 標籤管理</h3>
          <div class="empty-state">
            <div class="empty-icon">🏷️</div>
            <p>請先選擇一個資料夾</p>
            <p class="empty-hint">選擇後即可管理標籤</p>
          </div>
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
import TagSuggestions from './components/TagSuggestions.vue'
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
  removeTagFromArticle,
  addNewFolder  // 新增
} = useArticles()

const { allTags } = useTags(articles)
const { notification } = useNotification()

const selectedFolder = ref(null)
const newTag = ref('')

const selectedArticle = computed(() => {
  if (!selectedFolder.value) return null
  return articles.value.find(a => a.folder === selectedFolder.value)
})

const selectFolder = (folder) => {
  selectedFolder.value = folder
}

const handleAddTag = () => {
  if (newTag.value.trim() && selectedArticle.value) {
    addTagToArticle(selectedArticle.value, newTag.value.trim())
    newTag.value = ''
  }
}

const handleSelectTag = (tag) => {
  if (selectedArticle.value) {
    addTagToArticle(selectedArticle.value, tag)
    newTag.value = ''
  }
}

// 新增資料夾處理
const handleAddFolder = async (folderName) => {
  await addNewFolder(folderName)
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
  color: rgb(238, 226, 226);
}

/* Tags Panel Styles */
.tags-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.tags-panel-title {
  color: #667eea;
  font-size: 1.2em;
  margin: 0 0 15px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #e7e9fc;
  flex-shrink: 0;
}

.section-label {
  display: block;
  margin-bottom: 8px;
  color: #666;
  font-size: 0.9em;
  font-weight: 600;
}

/* 新增標籤區域 - 固定高度約 20% */
.add-tag-section-panel {
  padding: 15px;
  background: #f8f9ff;
  border-radius: 8px;
  border: 2px solid #e7e9fc;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-shrink: 0;
  margin-bottom: 15px;
}

.add-tag-btn-panel {
  width: 100%;
  padding: 10px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
  font-weight: 600;
  font-size: 0.9em;
}

.add-tag-btn-panel:hover {
  background: #5568d3;
  transform: translateY(-2px);
}

/* 當前標籤區域 - 佔據剩餘空間約 80% */
.current-tags-section {
  padding: 15px;
  background: #f8f9ff;
  border-radius: 8px;
  border: 2px solid #e7e9fc;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.tags-container-scrollable {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  overflow-y: auto;
  padding-right: 5px;
  align-content: flex-start;
}

.tool-tag {
  display: inline-block;
  background: #e7e9fc;
  color: #667eea;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 0.85em;
  cursor: pointer;
  transition: all 0.3s;
  flex-shrink: 0;
  height: fit-content;
}

.tool-tag:hover {
  background: #ff6b6b;
  color: white;
  transform: translateY(-2px);
}

.tags-container-scrollable::-webkit-scrollbar {
  width: 6px;
}

.tags-container-scrollable::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.tags-container-scrollable::-webkit-scrollbar-thumb {
  background: #667eea;
  border-radius: 3px;
}

.tags-container-scrollable::-webkit-scrollbar-thumb:hover {
  background: #5568d3;
}

/* 空狀態樣式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  text-align: center;
}

.empty-icon {
  font-size: 4em;
  margin-bottom: 15px;
  opacity: 0.5;
}

.empty-state p {
  margin: 5px 0;
  font-size: 1.1em;
}

.empty-hint {
  font-size: 0.9em !important;
  color: #bbb;
}

@media (max-width: 1400px) {
  .main-content {
    grid-template-columns: 280px 1fr 350px;
  }
}

@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr;
  }

  .tags-panel {
    display: none;
  }
}
</style>