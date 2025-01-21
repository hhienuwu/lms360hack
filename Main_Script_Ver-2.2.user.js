// ==UserScript==
// @name           Show đáp án trắc nghiệm LMS360
// @name:en        Reveal multiple choice answer on LMS360
// @name:vi        Show đáp án trắc nghiệm LMS360
// @namespace      HiennNek/lms360hack
// @version        2.2
// @description:en Reveal multiple choice answer on LMS360
// @description:vi Show đáp án trắc nghiệm LMS360
// @author         HiennNek
// @match          https://lms360.edu.vn/*
// @grant          none
// ==/UserScript==

//⚠️ CHỈ PHỤC VỤ MỤC ĐÍNH NGHIÊN CỨU VÀ PHÁT HIỂN LỖ HỔNG BẢO MẬT
//KHÔNG ĐƯỢC SỬ DỤNG CHO CÁC BÀI TẬP HOẶC BÀI KIỂM TRA TRÊN LMS360
//TÔI SẼ KHÔNG CHỊU TRÁCH NHIỆM CHO CÁC HÀNH VI GIAN LẬN HAY BỊ PHÁT HIỆN, KỈ LUẬT DO SỬ DỤNG SCRIPT NÀY! ⚠️

//⚠️ FOR RESEARCHING AND FINDING VULNERABILITY PURPOSES ONLY
//DO NOT USE IT FOR HOMEWORK, ASSIGNMENT OR EXAM ON LMS360
//I WILL NOT BE RESPONSIBLE FOR CHEATING OR BEING CAUGHT, DISCIPLINE FOR USING THIS SCRIPT! ⚠️

// Lười viết chú thích cho code quá '-'
// I'm so lazy to write down code comment '-'

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
                if (text.match(/[a-zA-Z0-9\u00C0-\u024F\u1E00-\u1EFF\s]\.$/) || text.match(/\s\.$/)) {
                    text = text.slice(0, -1);
                    label.textContent = text;
                }
                label.dataset.processed = 'true';
            });

            document.querySelectorAll('.h5p-sc-is-correct .h5p-sc-label').forEach(label => {
                if (label.dataset.processed) return;
                let text = label.textContent;
                if (text.match(/[a-zA-Z0-9\u00C0-\u024F\u1E00-\u1EFF\s]$/)) {
                    if (!text.endsWith('.')) {
                        label.textContent = text + '.';
                    }
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
