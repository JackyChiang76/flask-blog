// static/js/script.js

document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('.search-form');

    forms.forEach(form => {
        form.addEventListener('submit', function () {
            const button = this.querySelector('.search-btn');
            if (!button) return;

            // 改成 loading 狀態，防止重複送出
            button.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Searching...';
            button.classList.add('opacity-75', 'cursor-not-allowed', 'bg-blue-600', 'text-white');
            button.classList.remove('bg-blue-50', 'text-blue-600');
            button.disabled = true;
        });
    });
});
