<template>
  <component ref="drawer" class="mdc-drawer"
    :is="type" v-model="open_"
    :toolbar-spacer="toolbarSpacer">
    <slot />
  </component>
</template>

<script>
import mdcPermanentDrawer from './mdc-permanent-drawer.vue'
import mdcPersistentDrawer from './mdc-persistent-drawer.vue'
import mdcTemporaryDrawer from './mdc-temporary-drawer.vue'

const media = new class {
  get mobile () {
    return this._mobile || (this._mobile =
      window.matchMedia('(max-width: 840px)'))
  }

  get xlarge () {
    return this._xlarge || (this._xlarge =
      window.matchMedia('(min-width: 1320px)'))
  }
}()

export default {
  name: 'mdc-drawer',
  props: {
    'permanent': Boolean,
    'persistent': Boolean,
    'temporary': Boolean,
    'drawer-type': {
      type: String,
      validator: (val) => {
        return val in ['temporary', 'persistent', 'permanent']
      }
    },
    'toggle-on': String,
    'toggle-on-source': {type: Object, required: false},
    'toolbar-spacer': Boolean
  },
  provide () {
    return { mdcDrawer: this }
  },
  data () {
    return {
      mobile: false,
      xlarge: false,
      open_: false,
    }
  },
  components: {
    'mdc-permanent-drawer': mdcPermanentDrawer,
    'mdc-persistent-drawer': mdcPersistentDrawer,
    'mdc-temporary-drawer': mdcTemporaryDrawer
  },
  computed: {
    type () {
      if (this.permanent) {
        return 'mdc-permanent-drawer'
      } else if (this.persistent) {
        return 'mdc-persistent-drawer'
      } else if (this.temporary) {
        return 'mdc-temporary-drawer'
      } else {
        switch (this.drawerType) {
          case 'permanent':
            return 'mdc-permanent-drawer';
          case 'persistent':
            return 'mdc-persistent-drawer';
          case 'temporary':
            return 'mdc-temporary-drawer';
          default:
            return this.mobile ? 'mdc-temporary-drawer' : 'mdc-persistent-drawer'
        }
      }  
    },
    isPermanent () {
      return this.permanent || this.type === 'mdc-permanent-drawer'
    },
    isPersistent () {
      return this.persistent || this.type === 'mdc-persistent-drawer'
    },
    isTemporary () {
      return this.temporary || this.type === 'mdc-temporary-drawer'
    }
  },
  methods: {
    open () {
      this.open_ = true
    },
    close () {
      this.isPermanent || (this.open_ = false)
    },
    toggle () {
      this.isPermanent || (this.isOpen() ? this.close() : this.open())
    },
    isOpen () {
      return this.isPermanent|| ( this.open_ )
    },
    refreshMedia () {
      this.mobile = media.mobile.matches
      this.xlarge = media.xlarge.matches
      this.xlarge && this.isPersistent && this.open()
      this.mobile && this.close()
    }
  },
  created () {
    if (window && window.matchMedia) {
      this.mobile = media.mobile.matches
      this.xlarge = media.xlarge.matches
    }
  },
  mounted () {
    if (this.toggleOn) {
      let source = this.toggleOnSource || this.$root
      source.$on(this.toggleOn, () => this.toggle())
    }
    media.mobile.addListener(this.refreshMedia)
    media.xlarge.addListener(this.refreshMedia)
    this.$nextTick(() => this.refreshMedia())
  },
  beforeDestroy () {
    media.mobile.removeListener(this.refreshMedia)
    media.xlarge.removeListener(this.refreshMedia)
  }
}
</script>
