document.addEventListener('DOMContentLoaded', () => {
    // Tab functionality
    const tabs = document.querySelectorAll('.tabs a');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            
            const tabId = tab.getAttribute('href');
            const tabContent = document.querySelector(tabId);
            
            // Remove active class from all tabs and content
            tabs.forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.tab-content > div').forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and its content
            tab.classList.add('active');
            if (tabContent) tabContent.classList.add('active');
        });
    });

    // Code copy functionality
    const codeBlocks = document.querySelectorAll('.code-block pre');
    
    codeBlocks.forEach(block => {
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.textContent = 'Copy';
        
        block.parentNode.style.position = 'relative';
        block.parentNode.appendChild(copyButton);
        
        copyButton.addEventListener('click', () => {
            const code = block.textContent;
            navigator.clipboard.writeText(code);
            
            copyButton.textContent = 'Copied!';
            setTimeout(() => {
                copyButton.textContent = 'Copy';
            }, 2000);
        });
    });

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');
    
    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', () => {
            nav.classList.toggle('open');
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL without page reload
                history.pushState(null, null, href);
            }
        });
    });

    // Add copy buttons to code blocks in CSS
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .code-block {
                position: relative;
            }
            
            .copy-button {
                position: absolute;
                top: 0.5rem;
                right: 0.5rem;
                padding: 0.25rem 0.5rem;
                font-size: 0.8rem;
                background-color: rgba(255, 255, 255, 0.9);
                border: 1px solid var(--border-color);
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .copy-button:hover {
                background-color: var(--primary-color);
                color: white;
                border-color: var(--primary-color);
            }
        </style>
    `);
});