import { ref } from 'vue'

const notification = ref({
    show: false,
    message: '',
    type: 'success'
})

export function useNotification() {
    const showNotification = (message, type = 'success') => {
        notification.value = {
            show: true,
            message,
            type
        }

        setTimeout(() => {
            notification.value.show = false
        }, 3000)
    }

    return {
        notification,
        showNotification
    }
}