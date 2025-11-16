import { reactive } from 'vue'

const notification = reactive({
    show: false,
    message: '',
    type: 'success'
})

let timeoutId = null

export function useNotification() {
    const showNotification = (message, type = 'success', duration = 5000) => {
        if (timeoutId) {
            clearTimeout(timeoutId)
        }

        notification.show = true
        notification.message = message
        notification.type = type

        console.log('顯示通知:', message, type)

        // 錯誤訊息顯示更久
        const displayDuration = type === 'error' ? duration : 3000

        timeoutId = setTimeout(() => {
            notification.show = false
        }, displayDuration)
    }

    return {
        notification,
        showNotification
    }
}