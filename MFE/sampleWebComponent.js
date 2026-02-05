// Define a class for your custom element, extending HTMLElement
class MyComponent extends HTMLElement {
    constructor() {
        // Always call super() first in the constructor
        super();

        // Attach a shadow DOM to encapsulate the component's styles and markup
        this.attachShadow({ mode: 'open' });

        // Define the inner HTML structure and styles
        this.shadowRoot.innerHTML = `
            <style>
                .container {
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    background-color: #f9f9f9;
                }
                .greeting {
                    color: blue;
                    font-size: 18px;
                }
            </style>
            <div class="container">
                <p class="greeting">Hello, <span id="name">${name}</span>!</p>
            </div>
        `;
    }

    static get observedAttributes() {
     return ['name'];
    }
    
  attributeChangedCallback(name, oldValue, newValue) {
    this.render();
  }

render() {
    const name = this.getAttribute('name') || 'Guest';
        this.shadowRoot.innerHTML = `
            <style>
                .container {
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    background-color: #f9f9f9;
                }
                .greeting {
                    color: blue;
                    font-size: 18px;
                }
            </style>
            <div class="container">
                <p class="greeting">Hello, <span id="name">${name}</span>!</p>
            </div>
        
  }

    // A lifecycle method called when the element is added to the document's DOM
    connectedCallback() {
        this.render();/*
        const nameSpan = this.shadowRoot.querySelector('#name');
        // Get the 'name' attribute from the HTML and set the text content
        const name = this.getAttribute('name') || 'Guest';
        nameSpan.textContent = name;*/
    }
}

// Register your new custom element with the browser
customElements.define('my-component', MyComponent);
