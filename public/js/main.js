document.addEventListener('DOMContentLoaded', () => { 
    const paragraphs = document.querySelectorAll('.limit-one-lines'); 
    paragraphs.forEach(paragraph => { 
        const words = paragraph.textContent.split(' '); 
        if (words.length > 3) { 
            paragraph.textContent = words.slice(0, 3).join(' ') + '...'; 
        } 
    }); 
});