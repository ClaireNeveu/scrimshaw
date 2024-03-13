class ScrimshawP extends HTMLParagraphElement {
   static observedAttributes = ["color", "size"];

   constructor() {
      super();
   }

   connectedCallback() {
      console.log("Custom element added to page.");
   }

   disconnectedCallback() {
      console.log("Custom element removed from page.");
   }

   adoptedCallback() {
      console.log("Custom element moved to new page.");
   }

   attributeChangedCallback(name, oldValue, newValue) {
      console.log(`Attribute ${name} has changed.`);
   }
}

class ScrimshawIf extends HTMLElement {
   static observedAttributes = ["condition", 'id', 'class'];
   condition: boolean
   internals: ElementInternals

   constructor() {
      super();
      this.internals = this.attachInternals();
   }

   connectedCallback() {
      console.log("s-if added to page.");
   }

   disconnectedCallback() {
      console.log("s-if removed from page.");
   }

   adoptedCallback() {
      console.log("s-if moved to new page.");
   }

   set(cond: boolean) {
      this.condition = cond;
      this.setAttribute('condition', `${cond}`)
   }

   toggle() {
      this.condition = !this.condition;
      this.setAttribute('condition', `${this.condition}`)
   }

   attributeChangedCallback(name, oldValue, newValue) {
      switch (name) {
         case 'condition': {
            this.condition = eval(newValue);
            if (this.condition) {
               this.style.display = 'inline-block';
             } else {
               this.style.display = 'none';
             }
             break;
         }
      }
      
   }
}

class ScrimshawFor extends HTMLElement {
   static observedAttributes = ["each"];
   each: Array<Node>

   constructor() {
      super();
   }

   connectedCallback() {
      console.log("s-if added to page.");
   }

   disconnectedCallback() {
      console.log("s-if removed from page.");
   }

   adoptedCallback() {
      console.log("s-if moved to new page.");
   }

   attributeChangedCallback(name, oldValue, newValue) {
      const each = eval(newValue);
      if (!Array.isArray(each)) {
         console.error(`s-if called with non-array: ${each}`)
         return;
      }
      this.each = each;
      const itemTemplate = Array.from(this.childNodes);
      const ret: Array<Node> = [];
      each.forEach(el => {
         const newChildren = itemTemplate.map(n => n.cloneNode(true)).map(template => {
            if (template.nodeName === 'S-ITEM') {
               return el;
            }
            if (template instanceof HTMLElement) {
               template.querySelectorAll('s-item').forEach(item => {
                  item.replaceWith(el);
               });
            }
            return template;
         })
         ret.push(...newChildren)
      });
      this.replaceChildren(...ret)
   }
}

class ScrimshawItem extends HTMLElement {
}

globalThis.vars = {}
customElements.define("scrim-shaw", ScrimshawP, { extends: "p" });
customElements.define("s-if", ScrimshawIf);
customElements.define("s-for", ScrimshawFor);
customElements.define("s-item", ScrimshawItem);