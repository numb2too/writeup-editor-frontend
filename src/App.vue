<template>
  <div class="app-container">
    <Notification :message="notification.message" :type="notification.type" :show="notification.show" />

    <div class="container">
      <Header />

      <div class="main-content">
        <Sidebar :articles="articles" :filtered-count="displayArticles.length" :total-filtered="filteredArticles.length"
          :search-text="searchText" :all-tags="allTags" :active-filter="activeFilter" :is-detecting="isDetecting"
          @update:search="searchText = $event" @clear-search="clearSearch" @filter-by-tag="filterByTag"
          @detect-folders="detectNewFolders" />

        <div class="articles-grid">
          <ArticleCard v-for="article in displayArticles" :key="article.folder" :article="article" :all-tags="allTags"
            @save="saveArticle" @delete="deleteArticle" @add-tag="addTagToArticle" @remove-tag="removeTagFromArticle" />

          <div v-if="filteredArticles.length === 0" class="no-results">
            <p>😔 沒有找到符合條件的文章</p>
            <button @click="clearSearch" class="btn btn-save">清除搜尋</button>
          </div>

          <div v-else-if="filteredArticles.length > 6" class="load-more-hint">
            <p>📋 還有 {{ filteredArticles.length - 6 }} 筆文章未顯示</p>
            <p class="hint-text">請使用搜尋或標籤篩選來查找特定文章</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'
import ArticleCard from './components/ArticleCard.vue'
import Notification from './components/Notification.vue'
import { useArticles } from './composables/useArticles'
import { useTags } from './composables/useTags'
import { useNotification } from './composables/useNotification'

const {
  articles,
  searchText,
  activeFilter,
  filteredArticles,
  isDetecting,
  detectNewFolders,
  saveArticle,
  deleteArticle,
  addTagToArticle,
  removeTagFromArticle,
  clearSearch,
  filterByTag
} = useArticles()

const { allTags } = useTags(articles)
const { notification } = useNotification()

const displayArticles = computed(() => filteredArticles.value.slice(0, 6))
</script>

<style>
.no-results {
  text-align: center;
  padding: 40px;
  color: #666;
  background: #f8f9fa;
  border-radius: 10px;
  margin-top: 20px;
}

.no-results p {
  font-size: 1.2em;
  margin-bottom: 20px;
}
</style>