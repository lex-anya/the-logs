document.addEventListener('DOMContentLoaded', () => {
    const accessLogsBtn1 = document.getElementById('accessLogsBtn1');
    const accessLogsBtn2 = document.getElementById('accessLogsBtn2');
    const screen1 = document.getElementById('screen1');
    const screen2 = document.getElementById('screen2');
    const screen3 = document.getElementById('screen3');
    const screen4 = document.getElementById('screen4');
    const draggableList = document.getElementById('draggableList');
    const errorMessage = document.getElementById('errorMessage');
    const hintIcon = document.getElementById('hintIcon');
    const hintMessage = document.getElementById('hintMessage');
    const processingAudio = document.getElementById('processingAudio');
    const typingAudio = document.getElementById('typingAudio');
    const logsContainer = document.getElementById('logs');
    const finalMessage = document.getElementById('finalMessage');
    const correctOrder = ['A', 'B', 'C', 'D']; // Correct order for validation

    const timestamps = ['1606543200', '1606575600', '1606600800', '1606608000']; // Log timestamps
    const displayOrder = ['B', 'D', 'A', 'C']; // Desired display order

    const logs = [
        "Day 4831 : Log Entry 13\nTimestamp : November 28, 2020, 06:00:00 UTC\nCycle stability normal. Anomaly behavior follows projected oscillation patterns. Predictive accuracy at 99.7%.",
        "Day 4831 : Log Entry 31\nTimestamp : November 28, 2020, 15:00:00 UTC\nDrift detected. Minor phase misalignment observed. No immediate action required, but monitoring recommended.",
        "Day 4831 : Log Entry 45\nTimestamp : November 28, 2020, 22:00:00 UTC\nFailure in synchronization algorithms. Repeating intervals now unpredictable. Data corruption increasing.",
        "Day 4832 : Log Entry 1\nTimestamp : November 29, 2020, 00:00:00 UTC\nImminent system-wide desynchronization. ASTRA emergency protocol engaged. Manual correction required."
    ];

    function encodeTimestamp(timestamp) {
        const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const reverseAlphanumeric = 'ZYXWVUTSRQPONMLKJIHGFEDCBA';
        
        let encoded = '';
        for (let i = 0; i < timestamp.length; i++) {
            let digit = parseInt(timestamp[i]);
            if (i % 2 === 0) {
                // Use alphanumeric encoding
                encoded += alphanumeric[digit];
            } else {
                // Use reverse alphanumeric encoding
                encoded += reverseAlphanumeric[digit];
            }
        }
        return encoded;
    }

    function populateDraggableList() {
        const encodedTimestamps = timestamps.map(encodeTimestamp);
        const orderedEncodedTimestamps = displayOrder.map(letter => {
            const index = correctOrder.indexOf(letter);
            return encodedTimestamps[index];
        });

        orderedEncodedTimestamps.forEach(encodedTimestamp => {
            const listItem = document.createElement('li');
            listItem.className = 'draggable';
            listItem.draggable = true;
            listItem.textContent = encodedTimestamp;
            draggableList.appendChild(listItem);
        });
    }

    function typeWriterEffect(text, container, callback) {
        let index = 0;
        const speed = 15; // Speed of typing in milliseconds

        function type() {
            if (index < text.length) {
                container.innerHTML += text.charAt(index);
                index++;
                setTimeout(type, speed);
            } else {
                callback();
            }
        }

        type();
    }

    function displayLogs() {
        let logIndex = 0;
        const logsTitle = "<b>Recovered System Logs – Monitoring Terminal</b>\n\n";

        function printNextLog() {
            if (logIndex < logs.length) {
                typingAudio.play();
                typeWriterEffect(logs[logIndex] + "\n\n", logsContainer, () => {
                    typingAudio.pause();
                    typingAudio.currentTime = 0;
                    logIndex++;
                    printNextLog();
                });
            } else {
                finalMessage.style.display = 'block';
            }
        }

        logsContainer.innerHTML = logsTitle;
        printNextLog();
    }

    accessLogsBtn1.addEventListener('click', () => {
        screen1.style.display = 'none';
        screen2.style.display = 'block';
        populateDraggableList(); // Populate the list when screen2 is displayed
    });

    accessLogsBtn2.addEventListener('click', () => {
        const currentOrder = Array.from(draggableList.children).map(item => item.textContent);
        const correctEncodedOrder = correctOrder.map(letter => {
            const index = correctOrder.indexOf(letter);
            return encodeTimestamp(timestamps[index]);
        });

        if (JSON.stringify(currentOrder) === JSON.stringify(correctEncodedOrder)) {
            screen2.style.display = 'none';
            screen3.style.display = 'flex';
            processingAudio.load(); // Ensure the audio is loaded
            console.log("Attempting to play audio");
            processingAudio.play().then(() => {
                console.log("Audio is playing");
            }).catch(error => {
                console.error("Error playing audio:", error);
            });
            processingAudio.addEventListener('ended', () => {
                screen3.style.display = 'none';
                screen4.style.display = 'block';
                displayLogs();
            });
        } else {
            errorMessage.style.display = 'block';
        }
    });

    hintIcon.addEventListener('mouseover', () => {
        hintMessage.style.visibility = 'visible';
        hintMessage.style.opacity = '1';
    });

    hintIcon.addEventListener('mouseout', () => {
        hintMessage.style.visibility = 'hidden';
        hintMessage.style.opacity = '0';
    });

    // Drag and Drop functionality
    let draggedItem = null;

    draggableList.addEventListener('dragstart', (e) => {
        draggedItem = e.target;
        setTimeout(() => {
            e.target.style.display = 'none';
        }, 0);
    });

    draggableList.addEventListener('dragend', (e) => {
        setTimeout(() => {
            draggedItem.style.display = 'block';
            draggedItem = null;
        }, 0);
    });

    draggableList.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    draggableList.addEventListener('dragenter', (e) => {
        e.preventDefault();
        if (e.target.className === 'draggable') {
            e.target.style.border = '2px dashed #00ff00';
        }
    });

    draggableList.addEventListener('dragleave', (e) => {
        if (e.target.className === 'draggable') {
            e.target.style.border = '2px solid #00ff00';
        }
    });

    draggableList.addEventListener('drop', (e) => {
        if (e.target.className === 'draggable') {
            e.target.style.border = '2px solid #00ff00';
            draggableList.insertBefore(draggedItem, e.target.nextSibling);
        }
    });
});
