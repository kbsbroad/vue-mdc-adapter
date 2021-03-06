export function BasePlugin (components) { 
  return {
    install: (vm) => {
      for (let key in components) {
        let component = components[key]
          vm.component(component.name,component)
      }
    },
    components
  } 
}

