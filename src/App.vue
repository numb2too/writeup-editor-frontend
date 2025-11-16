<template>
  <div class="app-container">
    <Notification :message="notification.message" :type="notification.type" :show="notification.show" />

    <div class="container">
      <Header />

      <div class="main-content">
        <Sidebar :articles="articles" :filtered-count="filteredArticles.length" :search-text="searchText"
          :all-tags="allTags" :active-filter="activeFilter" @update:search="searchText = $event"
          @clear-search="clearSearch" @filter-by-tag="filterByTag" @detect-folders="detectNewFolders" />

        <div class="articles-grid">
          <ArticleCard v-for="article in displayArticles" :key="article.folder" :article="article" :all-tags="allTags"
            @save="saveArticle" @delete="deleteArticle" @add-tag="addTagToArticle" @remove-tag="removeTagFromArticle" />
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