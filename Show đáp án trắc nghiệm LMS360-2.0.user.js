// ==UserScript==
// @name         Show đáp án trắc nghiệm LMS360
// @namespace    IDK
// @version      2.0
// @description  Show đáp án trắc nghiệm LMS360
// @author       IDK
// @match        https://lms360.edu.vn/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let isProcessing = false;

    function processElements() {
        if (isProcessing) return;
        isProcessing = true;

        try {
            // Xử lý những answer sai (h5p-sc-is-wrong)
            document.querySelectorAll('.h5p-sc-is-wrong').forEach(element => {
                if (element.dataset.processed) return;
                element.classList.remove('h5p-sc-is-wrong');
                const label = element.querySelector('.h5p-sc-label');
                if (label) {
                    label.textContent = label.textContent.replace(/\./g, '');
                }
                element.dataset.processed = 'true';
            });

            // Xử lý những answer đúng (h5p-sc-is-corect)
            document.querySelectorAll('.h5p-sc-is-correct .h5p-sc-label').forEach(label => {
                if (label.dataset.processed) return;
                let text = label.textContent.replace(/\.+$/, '');
                if (!text.endsWith('.')) {
                    label.textContent = text + '.';
                }
                label.dataset.processed = 'true';
            });
        } catch (error) {
            console.error('Error in processing:', error);
        }

        isProcessing = false;
    }

    // Debounce lại cái function để limit khi mà observer callback chạy lại
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Debounce lại processElements
    const debouncedProcess = debounce(processElements, 100);

    // Setup cái MutationObserver
    const observer = new MutationObserver(debouncedProcess);

    // Bắt đầu kiểm tra line code
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class']
    });

    // Delay để tránh webpage bị crash
    setTimeout(processElements, 200);
})();
