<template>
  <div class="upload">
    <u-upload
      ref="upload"
      width="144"
      height="144"
      :action="action"
      :max-count="maxCount"
      :deletable="!disabled"
      :header="header"
      :file-list="files"
      :max-size="maxSize"
      :show-progress="false"
      :limitType="['png', 'jpg', 'jpeg']"
      upload-text="上传照片"
      :before-upload="beforeUpload"
      @on-uploaded="uploaded"
      @on-remove="remove"
      :form-data="{ seq: 1, systemType: 1, neighNo: $store.state.user.neighNo }"
    />
    <div class="upload-name" v-if="name && name.length">{{ name }}</div>
    <l-image-cropper :src="cutSrc" @tapcut="getCutInfo" v-model="showCut" />
  </div>
</template>

<script>
import { BASE_URL, apiConfig } from '@/config'
import LImageCropper from '_c/leelen-image-cropper'
export default {
  components: { LImageCropper },
  options: { styleIsolation: 'shared' },
  props: {
    maxSize: {
      type: Number,
      default: Number.MAX_VALUE
    },
    name: {
      type: String,
      default: ''
    },
    maxCount: {
      type: Number,
      default: 1
    },
    value: {
      type: Array,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    needCut: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    header() {
      return {
        ...apiConfig,
        'Content-Type': 'multipart/form-data',
        accesstoken: this.$store.state.user.accessToken,
        companyNo: this.$store.state.user.companyNo,
        neighNo: this.$store.state.user.neighNo
      }
    },
    files() {
      const files = this.value.map(item => {
        item.uid = item.uid || this.$utils.uniqueID()
        return item
      })
      return files
    }
  },
  data() {
    return {
      action: BASE_URL + '/wx/fs/resource/fileUpload',
      showCut: false,
      cutSrc: '',
      cutResult: ''
    }
  },
  watch: {
    value() {
      this.$refs?.upload?.clear()
    }
  },
  methods: {
    async beforeUpload(index, list) {
      if (this.needCut) {
        this.cutSrc = list[0].url
        this.showCut = true
        while (this.showCut) {
          await new Promise(resolve => {
            setTimeout(() => {
              console.log('等待用户切图', this.cutResult, this.showCut)
              resolve(this.cutResult)
            }, 300)
          })
        }
        if (this.cutResult) {
          list[0].url = this.cutResult
          list[0].path = this.cutResult
          this.cutResult = ''
          return Promise.resolve()
        } else return Promise.reject()
      } else return Promise.resolve()
    },
    getCutInfo({ url }) {
      this.cutResult = url
      this.showCut = false
    },
    uploaded(lists) {
      const fileList = [...this.files]
      lists.forEach(item => {
        if (item.response) {
          if (item.response.result === '1') {
            fileList.push({
              ...item.response.data[0],
              uid: this.$utils.uniqueID()
            })
          } else {
            uni.showToast({
              icon: 'none',
              title: item.response.message
            })
          }
        }
      })
      this.$refs.upload.lists = [...fileList]
      this.$emit('input', fileList)
    },
    remove(index) {
      const deleteItem = this.files[index]
      const files = this.value.filter(item => item.uid !== deleteItem.uid)
      this.$emit('input', files)
    },
    clear() {
      this.$emit('input', [])
      this.$refs.upload?.clear()
    }
  }
}
</script>

<style lang="scss" scoped>
.upload {
  position: relative;
  ::v-deep .u-upload {
    .u-add-wrap {
      border: 2px dashed $u-light-color;
      border-radius: 16rpx;
      .uicon-plus::before {
        content: '';
        width: 56rpx;
        height: 56rpx;
        background: url('~img/icon/upload.png') no-repeat center center;
        background-size: 100% 100%;
      }
    }
    .u-add-tips {
      color: $u-tips-color;
      font-size: 24rpx;
      margin-top: 10rpx !important;
    }
    .u-delete-icon {
      background-color: rgba(0, 0, 0, 0.5) !important;
      top: 0;
      right: 0;
    }
  }
  &-name {
    width: 144rpx;
    text-align: center;
    color: $u-tips-color;
    font-size: 24rpx;
    margin: 0 10rpx;
  }
}
</style>
