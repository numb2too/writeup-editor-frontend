<template>
    <Transition name="slide">
        <div v-if="show" class="notification" :class="type">
            {{ message }}
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
    z-index: 1000;
}

.notification.success {
    border-left: 4px solid #51cf66;
}

.notification.error {
    border-left: 4px solid #ff6b6b;
}

.slide-enter-active,
.slide-leave-active {
    transition: all 0.3s ease;
}

.slide-enter-from {
    transform: translateX(400px);
    opacity: 0;
}

.slide-leave-to {
    opacity: 0;
}
</style>