// ==UserScript==
// @name         Show đáp án trắc nghiệm LMS360 
// @namespace    IDK
// @version      2.2
// @description  Show đáp án trắc nghiệm LMS360
// @author       IDK
// @match        https://lms360.edu.vn/*
// @grant        none
// ==/UserScript==

// Lười viết chú thích cho code quá '-'

(function() {
    'use strict';

    let isProcessing = false;

    function processElements() {
        if (isProcessing) return;
        isProcessing = true;

        try {
            document.querySelectorAll('.h5p-sc-is-wrong .h5p-sc-label').forEach(label => {
                if (label.dataset.processed) return;

                let text = label.textContent;
                if (text === '.' || text.trim() === '') {
                    label.dataset.processed = 'true';
                    return;
                }

                if (text.charAt(text.length - 1) === '.') {
                    label.textContent = text.substring(0, text.length - 1);
                }

                label.dataset.processed = 'true';
            });
        } catch (error) {
            console.error('Error in processing:', error);
        }

        isProcessing = false;
    }

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
    
    const debouncedProcess = debounce(processElements, 10);

    const observer = new MutationObserver(debouncedProcess);

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class']
    });

    setTimeout(processElements, 100);
})();
