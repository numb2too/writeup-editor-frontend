import { ref } from 'vue'

// 使用單例模式確保所有組件共享同一個通知狀態
const notification = ref({
    show: false,
    message: '',
    type: 'success'
})

let timeoutId = null

export function useNotification() {
    const showNotification = (message, type = 'success') => {
        // 清除之前的計時器
        if (timeoutId) {
            clearTimeout(timeoutId)
        }

        notification.value = {
            show: true,
            message,
            type
        }

        console.log('顯示通知:', message, type) // Debug 用

        // 3 秒後自動隱藏
        timeoutId = setTimeout(() => {
            notification.value.show = false
        }, 3000)
    }

    return {
        notification,
        showNotification
    }
}