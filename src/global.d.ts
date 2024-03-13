declare global {
    interface CustomStateSet {
       size: number
       add(value: string): undefined
       clear(): undefined
       delete(value: string): boolean
       entries(): Iterator<[string, string]>
       forEach(fn: (value: string, key: string, set: CustomStateSet) => undefined): undefined
       has(value: string): boolean
       keys(): Iterator<string>
       values(): Iterator<string>
    }
    
    interface ElementInternals extends ARIAMixin {
       states: CustomStateSet
    }
}

export {}