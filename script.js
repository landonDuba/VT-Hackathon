const texts = ["Safer", "Smarter", "Faster", "Better", "Easier"];
let index = 0;
const typewriterText = document.getElementById("typewriter-text");

function typeWriterEffect() {
    const currentText = texts[index]; // Get the current word to display
    typewriterText.textContent = ''; // Clear the text

    // Reset CSS animation
    typewriterText.style.width = '0';
    typewriterText.style.animation = 'none';

    // Set the word and apply typing effect based on its length
    setTimeout(() => {
        typewriterText.textContent = currentText;
        typewriterText.style.width = currentText.length + 'ch'; // Set width dynamically
        typewriterText.style.animation = `typing 2s steps(${currentText.length}) forwards, blink-cursor 0.8s steps(2, start) infinite`; // Apply typing effect letter by letter
    }, 100); // Small delay to restart animation

    // Move to the next word, loop back to the first word when the list is exhausted
    index = (index + 1) % texts.length;
}

// Change the text every 3 seconds
setInterval(typeWriterEffect, 3000);

// Initial call to display the first word
typeWriterEffect();
