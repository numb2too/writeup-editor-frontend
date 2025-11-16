<template>
    <Transition name="slide">
        <div v-if="show" class="notification" :class="type">
            <div class="notification-content">{{ message }}</div>
        </div>
    </Transition>
</template>

<script setup>
defineProps({
    message: String,
    type: String,
    show: Boolean
})
</script>

<style scoped>
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
    z-index: 9999;
    min-width: 250px;
    max-width: 450px;
    font-weight: 500;
    font-size: 14px;
}

.notification-content {
    white-space: pre-line;
    line-height: 1.6;
}

.notification.success {
    border-left: 4px solid #51cf66;
    color: #2b8a3e;
}

.notification.error {
    border-left: 4px solid #ff6b6b;
    color: #c92a2a;
}

.slide-enter-active {
    animation: slideIn 0.3s ease-out;
}

.slide-leave-active {
    animation: slideOut 0.3s ease-in;
}

@keyframes slideIn {
    from {
        transform: translateX(400px);
        opacity: 0;
    }

    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOut {
    from {
        transform: translateX(0);
        opacity: 1;
    }

    to {
        transform: translateX(400px);
        opacity: 0;
    }
}
</style>