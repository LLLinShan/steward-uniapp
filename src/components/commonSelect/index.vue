<template>
  <u-select
    mode="single-column"
    safe-area-inset-bottom
    :title="title"
    :list="selectOptions"
    v-model="visible"
    @confirm="onConfirm"
  />
</template>
<script>
import { mapState } from 'vuex'
export default {
  props: {
    // 是否显示弹框
    value: {
      type: Boolean,
      default: false
    },
    // 字典类型
    type: {
      type: String,
      default: undefined
    },
    // 非字典静态数据
    options: {
      type: Array,
      default: null
    },
    // 标题
    title: {
      type: String,
      default: ''
    },
    fieldName: {
      type: Array,
      default: undefined
    }
  },
  data() {
    return {
      selectOptions: []
    }
  },

  computed: {
    ...mapState({
      dic: state => state.user.dic
    }),
    visible: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  created() {
    this.init()
  },

  methods: {
    onConfirm(arr) {
      this.visible = false
      this.$emit('confirm', arr)
    },
    setKey(data, label, value) {
      return data.map(item => {
        return { label: item[label], value: item[value] }
      })
    },
    async init() {
      if (this.type) {
        this.selectOptions = this.dic.find(item => item.dataType === this.type)?.labels || []
      } else {
        this.selectOptions = [...this.options]
      }
    }
  }
}
</script>
