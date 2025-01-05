// ==UserScript==
// @name         Show đáp án trắc nghiệm LMS360
// @namespace    IDK
// @version      2.1
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
            // Only process wrong answers
            document.querySelectorAll('.h5p-sc-is-wrong .h5p-sc-label').forEach(label => {
                if (label.dataset.processed) return;

                let text = label.textContent;
                // If it's a single dot or empty, don't modify
                if (text === '.' || text.trim() === '') {
                    label.dataset.processed = 'true';
                    return;
                }

                // Only remove the last character if it's a dot
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

    // Debounce function to limit how often the observer callback runs
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

    // Debounced version of processElements
    const debouncedProcess = debounce(processElements, 10);

    // Set up a MutationObserver with more specific options
    const observer = new MutationObserver(debouncedProcess);

    // Start observing with more specific options
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class']
    });

    // Initial call
    setTimeout(processElements, 100);
})();
