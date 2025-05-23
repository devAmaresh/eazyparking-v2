import { useContext, useEffect } from 'react';
import { ThemeContext } from '@/context/ThemeContext';

/**
 * Component that fixes dark mode issues with Radix UI components
 * This works by directly injecting CSS and applying styles to elements
 */
export function DarkModeFix() {
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';
  
  useEffect(() => {
    // Create a style element for our fixes if it doesn't exist
    let styleEl = document.getElementById('dark-mode-fixes');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'dark-mode-fixes';
      document.head.appendChild(styleEl);
    }
    
    // Add very specific CSS to override any other styles
    styleEl.textContent = `
      /* Dark mode fixes for Radix components */
      .dark [data-radix-popper-content-wrapper] > div,
      .dark [data-radix-select-content],
      .dark [role="listbox"],
      .dark [role="dialog"] {
        background-color: #1e1e1e !important;
        color: #ffffff !important;
        border-color: #333333 !important;
      }
      
      .dark [data-radix-select-viewport] [role="option"],
      .dark [role="option"] {
        color: #ffffff !important;
      }
      
      .dark [data-radix-select-item][data-highlighted],
      .dark [data-radix-select-viewport] [role="option"][data-highlighted],
      .dark [role="option"]:hover,
      .dark [role="option"]:focus {
        background-color: #2a2a2a !important;
        color: #ffffff !important;
      }
      
      .dark [data-radix-select-item][data-state="checked"] {
        background-color: #3a3a3a !important;
      }
      
      .dark [data-radix-dialog-overlay] {
        background-color: rgba(0, 0, 0, 0.7) !important;
      }
      
      .dark [data-radix-dialog-content] {
        background-color: #1e1e1e !important;
        border-color: #333333 !important;
        color: #ffffff !important;
      }
      
      .dark [data-radix-dialog-title],
      .dark [role="dialog"] h2 {
        color: #ffffff !important;
      }
      
      .dark [data-radix-dialog-description],
      .dark [role="dialog"] p {
        color: #a0a0a0 !important;
      }
    `;
    
    // Also apply a MutationObserver to dynamically fix elements as they're added to the DOM
    const observer = new MutationObserver((mutations) => {
      if (!isDarkMode) return;
      
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach(node => {
            // Check if it's a select or dialog element
            if (node.nodeType === 1) { // Element node
              const element = node as HTMLElement;
              
              // Apply styles to Select components
              if (element.hasAttribute('data-radix-select-content') || 
                  element.getAttribute('role') === 'listbox') {
                element.style.backgroundColor = '#1e1e1e';
                element.style.borderColor = '#333333';
                element.style.color = '#ffffff';
                
                // Apply to children
                const options = element.querySelectorAll('[role="option"]');
                options.forEach(option => {
                  (option as HTMLElement).style.color = '#ffffff';
                });
              }
              
              // Apply styles to Dialog components
              if (element.hasAttribute('data-radix-dialog-content') || 
                  element.getAttribute('role') === 'dialog') {
                element.style.backgroundColor = '#1e1e1e';
                element.style.borderColor = '#333333';
                element.style.color = '#ffffff';
              }
            }
          });
        }
      });
    });
    
    // Start observing
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Cleanup
    return () => {
      observer.disconnect();
      if (styleEl && styleEl.parentNode) {
        styleEl.parentNode.removeChild(styleEl);
      }
    };
  }, [isDarkMode]);
  
  // Direct fix on mount for any existing elements
  useEffect(() => {
    if (!isDarkMode) return;
    
    const fixExistingElements = () => {
      // Fix Select components
      document.querySelectorAll('[data-radix-select-content], [role="listbox"]').forEach(element => {
        (element as HTMLElement).style.backgroundColor = '#1e1e1e';
        (element as HTMLElement).style.borderColor = '#333333';
        (element as HTMLElement).style.color = '#ffffff';
      });
      
      // Fix options
      document.querySelectorAll('[role="option"]').forEach(element => {
        (element as HTMLElement).style.color = '#ffffff';
      });
      
      // Fix Dialog components
      document.querySelectorAll('[data-radix-dialog-content], [role="dialog"]').forEach(element => {
        (element as HTMLElement).style.backgroundColor = '#1e1e1e';
        (element as HTMLElement).style.borderColor = '#333333';
        (element as HTMLElement).style.color = '#ffffff';
      });
    };
    
    // Run initial fix
    fixExistingElements();
    
    // Also run after a short delay to catch any elements that might be rendered after initial mount
    const timeoutId = setTimeout(fixExistingElements, 500);
    
    return () => clearTimeout(timeoutId);
  }, [isDarkMode]);
  
  return null;
}
