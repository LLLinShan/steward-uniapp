<template>
  <view class="image-cropper" @touchmove.stop="_preventTouchMove" v-show="value">
    <view
      class="main"
      @touchend="_cutTouchEnd"
      @touchstart="_cutTouchStart"
      @touchmove="_cutTouchMove"
    >
      <view class="content">
        <view
          :class="['content_top', 'bg_gray', flag_bright ? '' : 'bg_black']"
          :style="{
            height: cutTop + 'px',
            'transition-property': cut_animation ? '' : 'background'
          }"
        ></view>
        <view class="content_middle" :style="{ height: `${cutHeight}px` }">
          <view
            :class="['content_middle_left', 'bg_gray', flag_bright ? '' : 'bg_black']"
            :style="{
              width: `${cutLeft}px`,
              'transition-property': cut_animation ? '' : 'background'
            }"
          ></view>
          <view
            class="content_middle_middle"
            :style="{
              width: `${cutWidth}px`,
              height: `${cutHeight}px`,
              'transition-duration': '.3s',
              'transition-property': cut_animation ? '' : 'background'
            }"
          >
            <view class="border border-top-left"></view>
            <view class="border border-top-right"></view>
            <view class="border border-right-top"></view>
            <view class="border border-right-bottom"></view>
            <view class="border border-bottom-right"></view>
            <view class="border border-bottom-left"></view>
            <view class="border border-left-bottom"></view>
            <view class="border border-left-top"></view>
          </view>
          <view
            :class="['content_middle_right', 'bg_gray', flag_bright ? '' : 'bg_black']"
            :style="{
              'transition-property': cut_animation ? '' : 'background'
            }"
          ></view>
        </view>
        <view
          :class="['content_bottom', 'bg_gray', flag_bright ? '' : 'bg_black']"
          :style="{ 'transition-property': cut_animation ? '' : 'background' }"
        ></view>
      </view>
      <image
        @load="imageLoad"
        @touchstart="_start"
        @touchmove="_move"
        @touchend="_end"
        :style="{
          width: imgWidth ? imgWidth + 'px' : 'auto',
          height: imgHeight ? imgHeight + 'px' : 'auto',
          transform: `translate3d(${img_left - imgWidth / 2}px,${
            img_top - imgHeight / 2
          }px,0) scale(${imgScale}) rotate(${imgAngle}deg)`,
          'transition-duration': `${cut_animation ? 0.4 : 0}s`
        }"
        class="img"
        :src="imgSrc"
      ></image>
      <view class="operation">
        <view class="operation-cancel btn" @tap="_close">取消</view>
        <view class="operation-confirm btn" :style="{ backgroundColor: confirmColor }" @tap="_cut">
          确定
        </view>
      </view>
    </view>
    <canvas
      canvas-id="image-cropper"
      disable-scroll="true"
      :style="{
        width: `${canvas_width * export_scale}px`,
        height: `${canvas_height * export_scale}px`,
        left: `${canvasLeft}px`,
        top: `${canvasTop}px`
      }"
      class="image-cropper-canvas"
    ></canvas>
  </view>
</template>

<script>
/**
 * 组件引用<image-cropper :src="src" @tapcut="getCutInfo" v-model="show"、>
 */

export default {
  props: {
    /**
     * 组件显示
     */
    value: { type: Boolean, default: false },
    /**
     * 图片路径
     */
    src: {
      type: String,
      default: ''
    },
    /**
     * 裁剪框宽度
     */
    width: { type: Number, default: 200 },
    /**
     * 裁剪框高度
     */
    height: { type: Number, default: 200 },
    /**
     * 裁剪框最小尺寸
     */
    min_width: { type: Number, default: 100 },
    min_height: { type: Number, default: 100 },
    /**
     * 裁剪框最大尺寸
     */
    max_width: { type: Number, default: 300 },
    max_height: { type: Number, default: 300 },
    /**
     * 裁剪框禁止拖动
     */
    disable_width: { type: Boolean, default: false },
    disable_height: { type: Boolean, default: false },
    /**
     * 锁定裁剪框比例
     */
    disable_ratio: { type: Boolean, default: false },
    /**
     * 裁剪框上边留空距离
     */
    cut_top: { type: Number, default: null },
    /**
     * 裁剪框左边留空距离
     */
    cut_left: { type: Number, default: null },

    /**
     * 生成的图片尺寸相对剪裁框的比例
     */
    export_scale: { type: Number, default: 3 },
    /**
     * 生成的图片质量0-1
     */
    quality: { type: Number, default: 1 },
    /**
     * canvas上边距（不设置默认不显示）
     */
    canvas_top: { type: Number, default: null },
    /**
     * canvas左边距（不设置默认不显示）
     */
    canvas_left: { type: Number, default: null },

    /**
     * 图片宽度
     */
    img_width: { type: [Number, String], default: null },
    /**
     * 图片高度
     */
    img_height: { type: [Number, String], default: null },
    /**
     * 图片缩放比
     */
    scale: { type: Number, default: 1 },
    /**
     * 图片旋转角度
     */
    angle: { type: Number, default: 0 },
    /**
     * 最小缩放比
     */
    min_scale: { type: Number, default: 0.5 },
    /**
     * 最大缩放比
     */
    max_scale: { type: Number, default: 2 },
    /**
     * 是否禁用旋转
     */
    disable_rotate: { type: Boolean, default: false },
    /**
     * 是否限制移动范围(剪裁框只能在图片内)
     */
    limit_move: { type: Boolean, default: false },
    /**
     * 获取图片信息时的图片类型
     */
    fileType: { type: String, default: 'jpg' },
    /**
     * 关闭点击截图框进行截图-
     */
    disabled_click_cut: { type: Boolean, default: false },
    /**
     * 确认按钮主题色
     */
    confirmColor: { type: String, default: '#00c8cf' }
  },
  emits: ['input', 'load', 'imageload', 'tapcut'],
  data() {
    return {
      el: 'image-cropper', //暂时无用
      info: wx.getSystemInfoSync(),
      MOVE_THROTTLE: null, //触摸移动节流settimeout
      MOVE_THROTTLE_FLAG: true, //节流标识
      INIT_IMGWIDTH: 0, //图片设置尺寸,此值不变（记录最初设定的尺寸）
      INIT_IMGHEIGHT: 0, //图片设置尺寸,此值不变（记录最初设定的尺寸）
      TIME_BG: null, //背景变暗延时函数
      TIME_CUT_CENTER: null,
      CUT_START: {},
      touch_img_relative: [
        {
          x: 0,
          y: 0
        }
      ], //鼠标和图片中心的相对位置
      flag_cut_touch: false, //是否是拖动裁剪框
      hypotenuse_length: 0, //双指触摸时斜边长度
      flag_img_endtouch: false, //是否结束触摸
      flag_bright: true, //背景是否亮
      canvas_overflow: true, //canvas缩略图是否在屏幕外面
      canvas_width: 200,
      canvas_height: 200,
      cut_animation: false, //是否开启图片和裁剪框过渡
      img_top: wx.getSystemInfoSync().windowHeight / 2, //图片上边距
      img_left: wx.getSystemInfoSync().windowWidth / 2, //图片左边距
      // 原入参名修改---描述参见props
      imgSrc: '',
      cutWidth: this.width,
      cutHeight: this.height,
      cutTop: this.cut_top,
      cutLeft: this.cut_left,
      canvasTop: this.canvas_top,
      canvasLeft: this.canvas_left,
      imgWidth: this.img_width,
      imgHeight: this.img_height,
      imgScale: this.scale,
      imgAngle: this.angle,
      limitMove: this.limit_move
    }
  },
  watch: {
    src(val) {
      this.imgSrc = val
    },
    imgSrc() {
      this.pushImg()
    },
    //监听截取框宽高变化
    cutWidth(value) {
      if (value < this.min_width) {
        this.cutWidth = this.min_width
      }
      this._computeCutSize()
    },
    cutHeight(value) {
      if (value < this.min_height) {
        this.cutHeight = this.min_height
      }
      this._computeCutSize()
    },
    imgAngle() {
      //停止居中裁剪框，继续修改图片位置
      this._moveStop()
      if (this.limitMove) {
        if (this.imgAngle % 90) {
          this.imgAngle = Math.round(this.imgAngle / 90) * 90
          return
        }
      }
    },
    cut_animation(value) {
      //开启过渡300毫秒之后自动关闭
      clearTimeout(this.cut_animation_time)
      if (value) {
        this.cut_animation_time = setTimeout(() => {
          this.cut_animation = false
        }, 300)
      }
    },
    limitMove(value) {
      if (value) {
        if (this.imgAngle % 90) {
          this.imgAngle = Math.round(this.imgAngle / 90) * 90
        }
        this._imgMarginDetectionScale()
        !this.canvas_overflow && this._draw()
      }
    },
    canvasTop() {
      this._canvasDetectionPosition()
    },
    canvasLeft() {
      this._canvasDetectionPosition()
    },
    cutTop() {
      this._cutDetectionPosition()
      if (this.limitMove) {
        !this.canvas_overflow && this._draw()
      }
    },
    cutLeft() {
      this._cutDetectionPosition()
      if (this.limitMove) {
        !this.canvas_overflow && this._draw()
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    /**
     * 基础数据初始化
     */
    init() {
      this.info = wx.getSystemInfoSync()
      this.INIT_IMGWIDTH = this.imgWidth
      this.INIT_IMGHEIGHT = this.imgHeight

      this.canvas_height = this.cutHeight
      this.canvas_width = this.cutWidth

      this._initCanvas()
      this.imgSrc = this.src
      //根据开发者设置的图片目标尺寸计算实际尺寸
      this._initImageSize()
      //设置裁剪框大小>设置图片尺寸>绘制canvas
      this._computeCutSize()
      //检查裁剪框是否在范围内
      this._cutDetectionPosition()
      //检查canvas是否在范围内
      this._canvasDetectionPosition()
      //初始化完成
      this.$emit('load', { cropper: this })
    },
    /**
     * 上传图片
     */
    upload() {
      let that = this
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          const tempFilePaths = res.tempFilePaths[0]
          that.pushImg(tempFilePaths)
          wx.showLoading({
            title: '加载中...'
          })
        }
      })
    },
    /**
     * 返回图片信息
     */
    getImg(getCallback) {
      this._draw(() => {
        wx.canvasToTempFilePath(
          {
            width: this.cutWidth * this.export_scale,
            height: Math.round(this.cutHeight * this.export_scale),
            destWidth: this.cutWidth * this.export_scale,
            destHeight: Math.round(this.cutHeight) * this.export_scale,
            fileType: this.fileType,
            quality: this.quality,
            canvasId: this.el,
            success: res => {
              getCallback({
                url: res.tempFilePath,
                width: this.cutWidth * this.export_scale,
                height: this.cutHeight * this.export_scale
              })
            }
          },
          this
        )
      })
    },
    /**
     * 设置图片动画
     * {
     *    x:10,//图片在原有基础上向下移动10px
     *    y:10,//图片在原有基础上向右移动10px
     *    angle:10,//图片在原有基础上旋转10deg
     *    scale:0.5,//图片在原有基础上增加0.5倍
     * }
     */
    setTransform(transform) {
      if (!transform) return
      if (!this.disable_rotate) {
        this.imgAngle = transform.angle ? this.imgAngle + transform.angle : this.imgAngle
      }
      let imgScale = this.imgScale
      if (transform.scale) {
        imgScale = this.imgScale + transform.scale
        imgScale = imgScale <= this.min_scale ? this.min_scale : imgScale
        imgScale = imgScale >= this.max_scale ? this.max_scale : imgScale
      }
      this.imgScale = imgScale
      let cutX = this.cutLeft
      let cutY = this.cutTop
      if (transform.cutX) {
        this.cutLeft = cutX + transform.cutX
      }
      if (transform.cutY) {
        this.cutTop = cutY + transform.cutY
      }
      this.img_top = transform.y ? this.img_top + transform.y : this.img_top
      this.img_left = transform.x ? this.img_left + transform.x : this.img_left
      //图像边缘检测,防止截取到空白
      this._imgMarginDetectionScale()
      //停止居中裁剪框，继续修改图片位置
      this._moveDuring()

      !this.canvas_overflow && this._draw()
      //可以居中裁剪框了
      this._moveStop() //结束操作
    },
    /**
     * 设置剪裁框位置
     */
    setCutXY(x, y) {
      this.cutTop = y
      this.cutLeft = x
    },
    /**
     * 设置剪裁框尺寸
     */
    setCutSize(w, h) {
      this.cutWidth = w
      this.cutHeight = h
      this._computeCutSize()
    },
    /**
     * 设置剪裁框和图片居中
     */
    setCutCenter() {
      let cutTop = (this.info.windowHeight - this.cutHeight) * 0.5
      let cutLeft = (this.info.windowWidth - this.cutWidth) * 0.5
      //顺序不能变
      this.img_top = this.img_top - this.cutTop + cutTop
      this.cutTop = cutTop //截取的框上边距
      this.img_left = this.img_left - this.cutLeft + cutLeft
      this.cutLeft = cutLeft //截取的框左边距
    },
    _setCutCenter() {
      this.cutTop = (this.info.windowHeight - this.cutHeight) * 0.5 //截取的框上边距
      this.cutLeft = (this.info.windowWidth - this.cutWidth) * 0.5
    },
    /**
     * 设置剪裁框宽度-即将废弃
     */
    setWidth(width) {
      this.cutWidth = width
      this._computeCutSize()
    },
    /**
     * 设置剪裁框高度-即将废弃
     */
    setHeight(height) {
      this.cutHeight = height
      this._computeCutSize()
    },
    /**
     * 是否限制移动
     */
    setLimitMove(value) {
      this.cut_animation = true
      this.limitMove = !!value
    },
    /**
     * 初始化图片，包括位置、大小、旋转角度
     */
    imgReset() {
      this.imgScale = 1
      this.imgAngle = 0
      this.img_top = wx.getSystemInfoSync().windowHeight / 2
      this.img_left = wx.getSystemInfoSync().windowWidth / 2
    },
    /**
     * 加载（更换）图片
     */
    pushImg(src) {
      if (src) {
        this.imgSrc = src
        //发现是手动赋值直接返回，交给watch处理
        return
      }

      // getImageInfo接口传入 src: '' 会导致内存泄漏
      if (!this.imgSrc) return
      wx.getImageInfo({
        src: this.imgSrc,
        success: res => {
          this.imageObject = res
          //图片非本地路径需要换成本地路径
          if (this.imgSrc.search(/tmp/) === -1) {
            this.imgSrc = res.path
          }
          //计算最后图片尺寸
          this._imgComputeSize()
          if (this.limitMove) {
            //限制移动，不留空白处理
            this._imgMarginDetectionScale()
          }
          this._draw()
        },
        fail: () => {
          this.imgSrc = ''
        }
      })
    },
    imageLoad() {
      setTimeout(() => {
        this.$emit('imageload', this.imageObject)
      }, 1000)
    },
    /**
     * 设置图片放大缩小
     */
    setScale(imgScale) {
      if (!imgScale) return
      this.imgScale = imgScale
      !this.canvas_overflow && this._draw()
    },
    /**
     * 设置图片旋转角度
     */
    setAngle(imgAngle) {
      if (!imgAngle) return
      this.cut_animation = true
      this.imgAngle = imgAngle
      this._imgMarginDetectionScale()
      !this.canvas_overflow && this._draw()
    },
    _initCanvas() {
      //初始化canvas
      if (!this.ctx) {
        this.ctx = wx.createCanvasContext('image-cropper', this)
      }
    },
    /**
     * 根据开发者设置的图片目标尺寸计算实际尺寸
     */
    _initImageSize() {
      //处理宽高特殊单位 %>px
      if (
        this.INIT_IMGWIDTH &&
        typeof this.INIT_IMGWIDTH === 'string' &&
        this.INIT_IMGWIDTH.indexOf('%') !== -1
      ) {
        let width = this.INIT_IMGWIDTH.replace('%', '')
        this.INIT_IMGWIDTH = this.imgWidth = (this.info.windowWidth / 100) * width
      }
      if (
        this.INIT_IMGHEIGHT &&
        typeof this.INIT_IMGHEIGHT === 'string' &&
        this.INIT_IMGHEIGHT.indexOf('%') !== -1
      ) {
        let height = this.imgHeight.replace('%', '')
        this.INIT_IMGHEIGHT = this.imgHeight = (this.info.windowHeight / 100) * height
      }
    },
    /**
     * 检测剪裁框位置是否在允许的范围内(屏幕内)
     */
    _cutDetectionPosition() {
      let _cutDetectionPositionTop = () => {
          //检测上边距是否在范围内
          if (this.cutTop < 0) {
            this.cutTop = 0
          }
          if (this.cutTop > this.info.windowHeight - this.cutHeight) {
            this.cutTop = this.info.windowHeight - this.cutHeight
          }
        },
        _cutDetectionPositionLeft = () => {
          //检测左边距是否在范围内
          if (this.cutLeft < 0) {
            this.cutLeft = 0
          }
          if (this.cutLeft > this.info.windowWidth - this.cutWidth) {
            this.cutLeft = this.info.windowWidth - this.cutWidth
          }
        }
      //裁剪框坐标处理（如果只写一个参数则另一个默认为0，都不写默认居中）
      if (this.cutTop === null && this.cutLeft === null) {
        this._setCutCenter()
      } else if (this.cutTop !== null && this.cutLeft !== null) {
        _cutDetectionPositionTop()
        _cutDetectionPositionLeft()
      } else if (this.cutTop !== null && this.cutLeft === null) {
        _cutDetectionPositionTop()
        this.cutLeft = (this.info.windowWidth - this.cutWidth) / 2
      } else if (this.cutTop === null && this.cutLeft !== null) {
        _cutDetectionPositionLeft()
        this.cutTop = (this.info.windowHeight - this.cutHeight) / 2
      }
    },
    /**
     * 检测canvas位置是否在允许的范围内(屏幕内)如果在屏幕外则不开启实时渲染
     * 如果只写一个参数则另一个默认为0，都不写默认超出屏幕外
     */
    _canvasDetectionPosition() {
      if (this.canvasTop === null && this.canvasLeft === null) {
        this.canvas_overflow = false
        this.canvasTop = -5000
        this.canvasLeft = -5000
      } else if (this.canvasTop !== null && this.canvasLeft !== null) {
        if (this.canvasTop < -this.cutHeight || this.canvasTop > this.info.windowHeight) {
          this.canvas_overflow = true
        } else {
          this.canvas_overflow = false
        }
      } else if (this.canvasTop !== null && this.canvasLeft === null) {
        this.canvasLeft = 0
      } else if (this.canvasTop === null && this.canvasLeft !== null) {
        this.canvasTop = 0
        if (this.canvasLeft < -this.cutWidth || this.canvasLeft > this.info.windowWidth) {
          this.canvas_overflow = true
        } else {
          this.canvas_overflow = false
        }
      }
    },
    /**
     * 图片边缘检测-位置
     */
    _imgMarginDetectionPosition(imgScale) {
      if (!this.limitMove) return
      let left = this.img_left
      let top = this.img_top
      imgScale = imgScale || this.imgScale
      let imgWidth = this.imgWidth
      let imgHeight = this.imgHeight
      if ((this.imgAngle / 90) % 2) {
        imgWidth = this.imgHeight
        imgHeight = this.imgWidth
      }
      left =
        this.cutLeft + (imgWidth * imgScale) / 2 >= left
          ? left
          : this.cutLeft + (imgWidth * imgScale) / 2
      left =
        this.cutLeft + this.cutWidth - (imgWidth * imgScale) / 2 <= left
          ? left
          : this.cutLeft + this.cutWidth - (imgWidth * imgScale) / 2
      top =
        this.cutTop + (imgHeight * imgScale) / 2 >= top
          ? top
          : this.cutTop + (imgHeight * imgScale) / 2
      top =
        this.cutTop + this.cutHeight - (imgHeight * imgScale) / 2 <= top
          ? top
          : this.cutTop + this.cutHeight - (imgHeight * imgScale) / 2
      this.img_left = left
      this.img_top = top
      this.imgScale = imgScale
    },
    /**
     * 图片边缘检测-缩放
     */
    _imgMarginDetectionScale() {
      if (!this.limitMove) return
      let imgScale = this.imgScale
      let imgWidth = this.imgWidth
      let imgHeight = this.imgHeight
      if ((this.imgAngle / 90) % 2) {
        imgWidth = this.imgHeight
        imgHeight = this.imgWidth
      }
      if (imgWidth * imgScale < this.cutWidth) {
        imgScale = this.cutWidth / imgWidth
      }
      if (imgHeight * imgScale < this.cutHeight) {
        imgScale = Math.max(imgScale, this.cutHeight / imgHeight)
      }
      this._imgMarginDetectionPosition(imgScale)
    },
    /**
     * 计算图片尺寸
     */
    _imgComputeSize() {
      let imgWidth = this.imgWidth,
        imgHeight = this.imgHeight
      if (!this.INIT_IMGHEIGHT && !this.INIT_IMGWIDTH) {
        //默认按图片最小边 = 对应裁剪框尺寸
        imgWidth = this.imageObject.width
        imgHeight = this.imageObject.height
        if (imgWidth / imgHeight > this.cutWidth / this.cutHeight) {
          imgHeight = this.cutHeight
          imgWidth = (this.imageObject.width / this.imageObject.height) * imgHeight
        } else {
          imgWidth = this.cutWidth
          imgHeight = (this.imageObject.height / this.imageObject.width) * imgWidth
        }
      } else if (this.INIT_IMGHEIGHT && !this.INIT_IMGWIDTH) {
        imgWidth = (this.imageObject.width / this.imageObject.height) * this.INIT_IMGHEIGHT
      } else if (!this.INIT_IMGHEIGHT && this.INIT_IMGWIDTH) {
        imgHeight = (this.imageObject.height / this.imageObject.width) * this.INIT_IMGWIDTH
      }
      this.imgWidth = imgWidth
      this.imgHeight = imgHeight
    },
    //改变截取框大小
    _computeCutSize() {
      if (this.cutWidth > this.info.windowWidth) {
        this.cutWidth = this.info.windowWidth
      } else if (this.cutWidth + this.cutLeft > this.info.windowWidth) {
        this.cutLeft = this.info.windowWidth - this.cutLeft
      }
      if (this.cutHeight > this.info.windowHeight) {
        this.cutHeight = this.info.windowHeight
      } else if (this.cutHeight + this.cutTop > this.info.windowHeight) {
        this.cutTop = this.info.windowHeight - this.cutTop
      }
      !this.canvas_overflow && this._draw()
    },
    //开始触摸
    _start(event) {
      this.flag_img_endtouch = false
      if (event.touches.length === 1) {
        //单指拖动
        this.touch_img_relative[0] = {
          x: event.touches[0].clientX - this.img_left,
          y: event.touches[0].clientY - this.img_top
        }
      } else {
        //双指放大
        let width = Math.abs(event.touches[0].clientX - event.touches[1].clientX)
        let height = Math.abs(event.touches[0].clientY - event.touches[1].clientY)
        this.touch_img_relative = [
          {
            x: event.touches[0].clientX - this.img_left,
            y: event.touches[0].clientY - this.img_top
          },
          {
            x: event.touches[1].clientX - this.img_left,
            y: event.touches[1].clientY - this.img_top
          }
        ]
        this.hypotenuse_length = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2))
      }
      !this.canvas_overflow && this._draw()
    },
    _move_throttle() {
      //安卓需要节流
      if (this.info.platform === 'android') {
        clearTimeout(this.MOVE_THROTTLE)
        this.MOVE_THROTTLE = setTimeout(() => {
          this.MOVE_THROTTLE_FLAG = true
        }, 1000 / 40)
        return this.MOVE_THROTTLE_FLAG
      } else {
        this.MOVE_THROTTLE_FLAG = true
      }
    },
    _move(event) {
      if (this.flag_img_endtouch || !this.MOVE_THROTTLE_FLAG) return
      this.MOVE_THROTTLE_FLAG = false
      this._move_throttle()
      this._moveDuring()
      if (event.touches.length === 1) {
        //单指拖动
        let left = event.touches[0].clientX - this.touch_img_relative[0].x,
          top = event.touches[0].clientY - this.touch_img_relative[0].y
        //图像边缘检测,防止截取到空白
        this.img_left = left
        this.img_top = top
        this._imgMarginDetectionPosition()
      } else {
        //双指放大
        let width = Math.abs(event.touches[0].clientX - event.touches[1].clientX),
          height = Math.abs(event.touches[0].clientY - event.touches[1].clientY),
          hypotenuse = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)),
          imgScale = this.imgScale * (hypotenuse / this.hypotenuse_length),
          current_deg = 0
        imgScale = imgScale <= this.min_scale ? this.min_scale : imgScale
        imgScale = imgScale >= this.max_scale ? this.max_scale : imgScale
        //图像边缘检测,防止截取到空白
        this.imgScale = imgScale
        this._imgMarginDetectionScale()
        //双指旋转(如果没禁用旋转)
        let touch_img_relative = [
          {
            x: event.touches[0].clientX - this.img_left,
            y: event.touches[0].clientY - this.img_top
          },
          {
            x: event.touches[1].clientX - this.img_left,
            y: event.touches[1].clientY - this.img_top
          }
        ]
        if (!this.disable_rotate) {
          let first_atan =
            (180 / Math.PI) * Math.atan2(touch_img_relative[0].y, touch_img_relative[0].x)
          let first_atan_old =
            (180 / Math.PI) * Math.atan2(this.touch_img_relative[0].y, this.touch_img_relative[0].x)
          let second_atan =
            (180 / Math.PI) * Math.atan2(touch_img_relative[1].y, touch_img_relative[1].x)
          let second_atan_old =
            (180 / Math.PI) * Math.atan2(this.touch_img_relative[1].y, this.touch_img_relative[1].x)
          //当前旋转的角度
          let first_deg = first_atan - first_atan_old,
            second_deg = second_atan - second_atan_old
          if (first_deg !== 0) {
            current_deg = first_deg
          } else if (second_deg !== 0) {
            current_deg = second_deg
          }
        }
        this.touch_img_relative = touch_img_relative
        this.hypotenuse_length = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2))
        //更新视图
        this.imgAngle = this.imgAngle + current_deg
      }
      !this.canvas_overflow && this._draw()
    },
    //结束操作
    _end() {
      this.flag_img_endtouch = true
      this._moveStop()
    },
    //点击中间剪裁框处理
    _cut() {
      if (this.disabled_click_cut) return
      //调起上传
      if (!this.imgSrc) return this.upload()
      // wx.showLoading({ title: '加载中...', mask: true })
      this._draw(() => {
        // let x = event.detail ? event.detail.x : event.touches[0].clientX
        // let y = event.detail ? event.detail.y : event.touches[0].clientY
        // if (
        //   x >= this.cutLeft &&
        //   x <= this.cutLeft + this.cutWidth &&
        //   y >= this.cutTop &&
        //   y <= this.cutTop + this.cutHeight
        // )
        //生成图片并回调
        wx.canvasToTempFilePath(
          {
            width: this.cutWidth * this.export_scale,
            height: Math.round(this.cutHeight * this.export_scale),
            destWidth: this.cutWidth * this.export_scale,
            destHeight: Math.round(this.cutHeight) * this.export_scale,
            fileType: this.fileType,
            quality: this.quality,
            canvasId: this.el,
            success: res => {
              wx.hideLoading()
              this.$emit('tapcut', {
                url: res.tempFilePath,
                width: this.cutWidth * this.export_scale,
                height: this.cutHeight * this.export_scale
              })
            },
            fail: () => wx.hideLoading()
          },
          this
        )
      })
    },
    //渲染
    _draw(callback) {
      if (!this.imgSrc) return
      let draw = () => {
        //图片实际大小
        let imgWidth = this.imgWidth * this.imgScale * this.export_scale
        let imgHeight = this.imgHeight * this.imgScale * this.export_scale
        //canvas和图片的相对距离
        let xpos = this.img_left - this.cutLeft
        let ypos = this.img_top - this.cutTop
        //旋转画布
        this.ctx.translate(xpos * this.export_scale, ypos * this.export_scale)
        this.ctx.rotate((this.imgAngle * Math.PI) / 180)
        this.ctx.drawImage(this.imgSrc, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight)
        this.ctx.draw(false, () => {
          callback && callback()
        })
      }
      if (this.ctx.width !== this.cutWidth || this.ctx.height !== this.cutHeight) {
        //优化拖动裁剪框，所以必须把宽高设置放在离用户触发渲染最近的地方
        this.canvas_height = this.cutHeight
        this.canvas_width = this.cutWidth
        setTimeout(() => {
          draw()
        }, 40)
      } else {
        draw()
      }
    },
    //裁剪框处理
    _cutTouchMove(e) {
      if (this.flag_cut_touch && this.MOVE_THROTTLE_FLAG) {
        if (this.disable_ratio && (this.disable_width || this.disable_height)) return
        //节流
        this.MOVE_THROTTLE_FLAG = false
        this._move_throttle()
        let width = this.cutWidth,
          height = this.cutHeight,
          cutTop = this.cutTop,
          cutLeft = this.cutLeft,
          size_correct = () => {
            width =
              width <= this.max_width
                ? width >= this.min_width
                  ? width
                  : this.min_width
                : this.max_width
            height =
              height <= this.max_height
                ? height >= this.min_height
                  ? height
                  : this.min_height
                : this.max_height
          },
          size_inspect = () => {
            if (
              (width > this.max_width ||
                width < this.min_width ||
                height > this.max_height ||
                height < this.min_height) &&
              this.disable_ratio
            ) {
              size_correct()
              return false
            } else {
              size_correct()
              return true
            }
          }
        height =
          this.CUT_START.height +
          (this.CUT_START.corner > 1 && this.CUT_START.corner < 4 ? 1 : -1) *
            (this.CUT_START.y - e.touches[0].clientY)
        switch (this.CUT_START.corner) {
          case 1:
            width = this.CUT_START.width + this.CUT_START.x - e.touches[0].clientX
            if (this.disable_ratio) {
              height = width / (this.cutWidth / this.cutHeight)
            }
            if (!size_inspect()) return
            cutLeft = this.CUT_START.cutLeft - (width - this.CUT_START.width)
            break
          case 2:
            width = this.CUT_START.width + this.CUT_START.x - e.touches[0].clientX
            if (this.disable_ratio) {
              height = width / (this.cutWidth / this.cutHeight)
            }
            if (!size_inspect()) return
            cutTop = this.CUT_START.cutTop - (height - this.CUT_START.height)
            cutLeft = this.CUT_START.cutLeft - (width - this.CUT_START.width)
            break
          case 3:
            width = this.CUT_START.width - this.CUT_START.x + e.touches[0].clientX
            if (this.disable_ratio) {
              height = width / (this.cutWidth / this.cutHeight)
            }
            if (!size_inspect()) return
            cutTop = this.CUT_START.cutTop - (height - this.CUT_START.height)
            break
          case 4:
            width = this.CUT_START.width - this.CUT_START.x + e.touches[0].clientX
            if (this.disable_ratio) {
              height = width / (this.cutWidth / this.cutHeight)
            }
            if (!size_inspect()) return
            break
        }
        if (!this.disable_width && !this.disable_height) {
          this.cutWidth = width
          this.cutLeft = cutLeft
          this.cutHeight = height
          this.cutTop = cutTop
        } else if (!this.disable_width) {
          this.cutWidth = width
          this.cutLeft = cutLeft
        } else if (!this.disable_height) {
          this.cutHeight = height
          this.cutTop = cutTop
        }
        this._imgMarginDetectionScale()
      }
    },
    _cutTouchStart(e) {
      let currentX = e.touches[0].clientX
      let currentY = e.touches[0].clientY
      let cutbox_top4 = this.cutTop + this.cutHeight - 30
      let cutbox_bottom4 = this.cutTop + this.cutHeight + 20
      let cutbox_left4 = this.cutLeft + this.cutWidth - 30
      let cutbox_right4 = this.cutLeft + this.cutWidth + 30

      let cutbox_top3 = this.cutTop - 30
      let cutbox_bottom3 = this.cutTop + 30
      let cutbox_left3 = this.cutLeft + this.cutWidth - 30
      let cutbox_right3 = this.cutLeft + this.cutWidth + 30

      let cutbox_top2 = this.cutTop - 30
      let cutbox_bottom2 = this.cutTop + 30
      let cutbox_left2 = this.cutLeft - 30
      let cutbox_right2 = this.cutLeft + 30

      let cutbox_top1 = this.cutTop + this.cutHeight - 30
      let cutbox_bottom1 = this.cutTop + this.cutHeight + 30
      let cutbox_left1 = this.cutLeft - 30
      let cutbox_right1 = this.cutLeft + 30
      if (
        currentX > cutbox_left4 &&
        currentX < cutbox_right4 &&
        currentY > cutbox_top4 &&
        currentY < cutbox_bottom4
      ) {
        this._moveDuring()
        this.flag_cut_touch = true
        this.flag_img_endtouch = true
        this.CUT_START = {
          width: this.cutWidth,
          height: this.cutHeight,
          x: currentX,
          y: currentY,
          corner: 4
        }
      } else if (
        currentX > cutbox_left3 &&
        currentX < cutbox_right3 &&
        currentY > cutbox_top3 &&
        currentY < cutbox_bottom3
      ) {
        this._moveDuring()
        this.flag_cut_touch = true
        this.flag_img_endtouch = true
        this.CUT_START = {
          width: this.cutWidth,
          height: this.cutHeight,
          x: currentX,
          y: currentY,
          cutTop: this.cutTop,
          cutLeft: this.cutLeft,
          corner: 3
        }
      } else if (
        currentX > cutbox_left2 &&
        currentX < cutbox_right2 &&
        currentY > cutbox_top2 &&
        currentY < cutbox_bottom2
      ) {
        this._moveDuring()
        this.flag_cut_touch = true
        this.flag_img_endtouch = true
        this.CUT_START = {
          width: this.cutWidth,
          height: this.cutHeight,
          cutTop: this.cutTop,
          cutLeft: this.cutLeft,
          x: currentX,
          y: currentY,
          corner: 2
        }
      } else if (
        currentX > cutbox_left1 &&
        currentX < cutbox_right1 &&
        currentY > cutbox_top1 &&
        currentY < cutbox_bottom1
      ) {
        this._moveDuring()
        this.flag_cut_touch = true
        this.flag_img_endtouch = true
        this.CUT_START = {
          width: this.cutWidth,
          height: this.cutHeight,
          cutTop: this.cutTop,
          cutLeft: this.cutLeft,
          x: currentX,
          y: currentY,
          corner: 1
        }
      }
    },
    _cutTouchEnd() {
      this._moveStop()
      this.flag_cut_touch = false
    },
    //停止移动时需要做的操作
    _moveStop() {
      //清空之前的自动居中延迟函数并添加最新的
      clearTimeout(this.TIME_CUT_CENTER)
      this.TIME_CUT_CENTER = setTimeout(() => {
        //动画启动
        if (!this.cut_animation) {
          this.cut_animation = true
        }
        this.setCutCenter()
      }, 1000)
      //清空之前的背景变化延迟函数并添加最新的
      clearTimeout(this.TIME_BG)
      this.TIME_BG = setTimeout(() => {
        if (this.flag_bright) {
          this.flag_bright = false
        }
      }, 2000)
    },
    //移动中
    _moveDuring() {
      //清空之前的自动居中延迟函数
      clearTimeout(this.TIME_CUT_CENTER)
      //清空之前的背景变化延迟函数
      clearTimeout(this.TIME_BG)
      //高亮背景
      if (!this.flag_bright) {
        this.flag_bright = true
      }
    },
    _close() {
      this.$emit('input', false)
    },
    _preventTouchMove() {}
  }
}
</script>

<style>
.image-cropper {
  background: rgba(14, 13, 13, 0.8);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
}

.image-cropper .main {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.image-cropper .content {
  z-index: 9;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  pointer-events: none;
}

.image-cropper .bg_black {
  background: rgba(0, 0, 0, 0.8) !important;
}

.image-cropper .bg_gray {
  background: rgba(0, 0, 0, 0.45);
  transition-duration: 0.35s;
}

.image-cropper .content > .content_top {
  pointer-events: none;
}

.image-cropper .content > .content_middle {
  display: flex;
  height: 200px;
  width: 100%;
}

.image-cropper .content_middle_middle {
  width: 200px;
  box-sizing: border-box;
  position: relative;
  transition-duration: 0.3s;
}

.image-cropper .content_middle_right {
  flex: auto;
}

.image-cropper .content > .content_bottom {
  flex: auto;
}

.image-cropper .img {
  z-index: 2;
  top: 0;
  left: 0;
  position: absolute;
  border: none;
  width: 100%;
  backface-visibility: hidden;
  transform-origin: center;
}
.image-cropper .operation {
  position: absolute;
  z-index: 10;
  bottom: 40rpx;
  width: 100%;
  display: flex;
  text-align: center;
  justify-content: space-around;
}
.image-cropper .btn {
  display: inline-block;
  width: 160rpx;
  height: 60rpx;
  line-height: 60rpx;
  text-align: center;
  font-size: 28rpx;
  border-radius: 10rpx;
}
.image-cropper .operation-cancel {
  color: #fff;
  border: 1px solid #fff;
}
.image-cropper .operation-confirm {
  color: #fff;
}

.image-cropper .image-cropper-canvas {
  position: fixed;
  background: white;
  width: 150px;
  height: 150px;
  z-index: 10;
  top: -200%;
  pointer-events: none;
}

.image-cropper .border {
  background: white;
  pointer-events: auto;
  position: absolute;
}

.image-cropper .border-top-left {
  left: -2.5px;
  top: -2.5px;
  height: 2.5px;
  width: 33rpx;
}

.image-cropper .border-top-right {
  right: -2.5px;
  top: -2.5px;
  height: 2.5px;
  width: 33rpx;
}

.image-cropper .border-right-top {
  top: -1px;
  width: 2.5px;
  height: 30rpx;
  right: -2.5px;
}

.image-cropper .border-right-bottom {
  width: 2.5px;
  height: 30rpx;
  right: -2.5px;
  bottom: -1px;
}

.image-cropper .border-bottom-left {
  height: 2.5px;
  width: 33rpx;
  bottom: -2.5px;
  left: -2.5px;
}

.image-cropper .border-bottom-right {
  height: 2.5px;
  width: 33rpx;
  bottom: -2.5px;
  right: -2.5px;
}

.image-cropper .border-left-top {
  top: -1px;
  width: 2.5px;
  height: 30rpx;
  left: -2.5px;
}

.image-cropper .border-left-bottom {
  width: 2.5px;
  height: 30rpx;
  left: -2.5px;
  bottom: -1px;
}
</style>
