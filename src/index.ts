const isEmptyNode = (node: Node): boolean => node?.nodeValue?.replace(/\u00a0/g, "x").trim().length == 0

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

class ScrimshawLet extends HTMLElement {
   static observedAttributes = ['name', 'value'];
   name: string
   value: any
   initialized: boolean
   usingChildren: boolean

   constructor() {
      super();
   }
   connectedCallback() {
      this.attachShadow({mode: 'closed'});
   }

   attributeChangedCallback(name, oldValue, newValue) {
      if (!this.hasAttribute('value')) {
         let value = this.childNodes;
         // Trim leading whitespace
         if (value[0].nodeType === 3 && isEmptyNode(value[0])) {
            value[0].remove()
         }
         // Trim trailing whitespace
         if (value[value.length - 1].nodeType === 3 && isEmptyNode(value[value.length - 1])) {
            value[value.length - 1].remove()
         }
         this.value = value.length === 1 ? value[0] : value;
         this.initialized = true;
      }
      switch (name) {
         case 'name': {
            this.name = newValue;
            if (oldValue === null && this.initialized) {
               globalThis.vars[this.name] = this.value;
            } else if (oldValue !== newValue && this.initialized) {
               delete globalThis.vars[oldValue];
               globalThis.vars[newValue] = this.value;
            }
            break;
         }
         case 'value': {
            this.value = eval(newValue);
            this.initialized = true
            if (this.name) {
               globalThis.vars[this.name] = this.value;
            }
            break;
         }
      }
   }
}

// class ScrimshawTemplate extends HTMLElement
// class ScrimshawUseTemplate extends HTMLElement
// class ScrimshawUse extends HTMLElement lets you insert a js expression into HTML

class ScrimshawItem extends HTMLElement {
   connectedCallback() {
      this.attachShadow({mode: 'closed'});
   }
}

globalThis.vars = {}
customElements.define("scrim-shaw", ScrimshawP, { extends: "p" });
customElements.define("s-if", ScrimshawIf);
customElements.define("s-for", ScrimshawFor);
customElements.define("s-item", ScrimshawItem);
customElements.define("s-let", ScrimshawLet);