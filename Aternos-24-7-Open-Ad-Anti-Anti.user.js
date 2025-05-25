// ==UserScript==
// @name         Aternos 24/7 Open (Ad Anti-Anti)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatic server control for Aternos
// @match        https://aternos.org/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    let autoMode = false;
    let lastExtendClick = 0;

    // Add control buttons
    function addControls() {
        // Wait for the restart button to be present
        const restartButton = document.querySelector('#restart');
        if (!restartButton) return;

        const controlDiv = document.createElement('div');
        controlDiv.style.display = 'inline-block';
        controlDiv.style.marginLeft = '10px';

        const autoButton = document.createElement('button');
        autoButton.innerHTML = '<i class="fas fa-robot"></i> Auto Mode: OFF';
        autoButton.className = 'btn btn-huge btn-warning';
        autoButton.onclick = () => toggleAuto(autoButton);

        controlDiv.appendChild(autoButton);
        // Insert after the restart button
        restartButton.parentNode.insertBefore(controlDiv, restartButton.nextSibling);
    }

    function toggleAuto(button) {
        autoMode = !autoMode;
        button.innerHTML = `<i class="fas fa-robot"></i> Auto Mode: ${autoMode ? 'ON' : 'OFF'}`;
        button.className = `btn btn-huge ${autoMode ? 'btn-success' : 'btn-warning'}`;
    }

    // Main control logic
    function controlServer() {
        const status = document.querySelector('.status');
        if (!status) return;

        // Skip if server is in loading state
        if (status.classList.contains('loading')) return;

        if (autoMode) {
            if (status.classList.contains('offline')) {
                const startButton = document.querySelector('#start');
                startButton?.click();
            } else if (status.classList.contains('online')) {
                const extendButton = document.querySelector('.server-extend-end');
                const now = Date.now();

                // Only try to click if button exists and 5 seconds have passed since last click
                if (extendButton &&
                    extendButton.offsetParent !== null && // Check if button is visible
                    now - lastExtendClick > 5000) {
                    extendButton.click();
                    lastExtendClick = now;
                    console.log('Clicked +1 button');
                }
            }
        }
    }

    // Ad bypass logic - updated with confirmation log
    function bypassAd() {
        const hedefMetin = "Yine de reklam engelleyiciyle devam et";
        const butonlar = document.querySelectorAll('div.btn.btn-white.wZDWEUqRUPDi');
        
        console.log('Checking for ad blocker warning...');
        for (const btn of butonlar) {
            if (btn.innerText.trim() === hedefMetin) {
                console.log('Found ad blocker continue button, clicking...');
                btn.click();
                console.log('Ad blocker warning bypassed');
                break;
            }
        }
    }

    // Initialize
    setTimeout(addControls, 2000);

    // Updated main loop to work even when tab is not focused
    let lastCheck = 0;
    function mainLoop(timestamp) {
        // Run checks every second regardless of tab focus
        if (timestamp - lastCheck >= 1000) {
            bypassAd();
            controlServer();
            lastCheck = timestamp;
        }
        requestAnimationFrame(mainLoop);
    }

    // Start the loop
    requestAnimationFrame(mainLoop);
})();
