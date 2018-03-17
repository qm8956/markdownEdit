<template>
  <div class="">
    <mavon-editor v-model="content" ref="md" :toolbars="toolbars" @save="saveFile"></mavon-editor>
    <button class="burger add btn-po-bo-add" @click="add()" title="添加新文章"></button>
    <button class="burger  btn-po-bo-list" @click="openList()" title="展开文章列表"></button>
    <Aside :show="show" placement="right" header="Title" :width="400" @close="closeList()" @modify="modify"></ASide>
  </div>
</template>

<script>
import Aside from './Aside'
export default {
  title: 'markdown-edit',
  data () {
    return {
      content: '',
      show: false,
      id: null,
      biblioid: '',
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: true, // 标记
        superscript: true, // 上角标
        subscript: true, // 下角标
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        code: true, // code
        table: true, // 表格
        fullscreen: true, // 全屏编辑
        readmodel: true, // 沉浸式阅读
        htmlcode: true, // 展示html源码
        help: true, // 帮助
        /* 1.3.5 */
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        save: true, // 保存（触发events中的save事件）
        /* 1.4.2 */
        navigation: true, // 导航目录
        /* 2.1.8 */
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        /* 2.2.1 */
        subfield: true, // 单双栏模式
        preview: true // 预览
      }
    }
  },
  mounted () {
    this.$refs.md.s_fullScreen = true
  },
  methods: {
    saveFile (content, html) {
      this.downloadFile('blog.md', this.value)
    },
    downloadFile (filename, text) {
      var pom = document.createElement('a')
      pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
      pom.setAttribute('download', filename)
      if (document.createEvent) {
        var event = document.createEvent('MouseEvents')
        event.initEvent('click', true, true)
        pom.dispatchEvent(event)
      } else {
        pom.click()
      }
    },
    openList () {
      // console.log('关闭/打开')
      this.show = true
    },
    closeList () {
      // console.log('guanci')
      this.show = false
    },
    // 延时保存
    debounce (func, wait, self) {
      if (!self.timestamp) {
        self.timestamp = 0
      }
      let last = new Date().getTime() - self.timestamp
      if (last < wait && self.settimeout) {
        clearTimeout(self.settimeout)
      }
      self.timestamp = new Date().getTime()
      self.settimeout = setTimeout(() => {
        func()
      }, wait)
    },
    add () {
      this.content = ''
      this.id = null
      this.biblioid = null
    },
    save () {
      this.$dbAdd(this.id, this.content.substring(0, 10), this.content, this.biblioid).then((id, biblioid) => {
        this.id = id
        this.biblioid = biblioid
      })
    },
    modify (row) {
      this.show = false
      this.id = row.id
      this.content = row.content
      this.biblioid = row.biblioid
    }
  },
  watch: {
    'content' () {
      if (this.content && this.content.length > 25) {
        this.debounce(this.save, 5000, this)
      }
    }
  },
  components: { Aside }
}
</script>
<style>

  .burger {
    z-index: 9999;
    border: 0;
    background: none;
    outline: 0;
    padding: 0;
    cursor: pointer;
    border-bottom: 3px solid currentColor;
    width: 20px;
    transition: border-bottom 1s ease-in-out;
    -webkit-transition: border-bottom 1s ease-in-out;
  }
  .burger::-moz-focus-inner {
    border: 0;
    padding: 0;
  }
  .burger:before {
    content: "";
    display: block;
    border-bottom: 3px solid currentColor;
    width: 100%;
    margin-bottom: 3px;
    transition: transform 0.5s ease-in-out;
    -webkit-transition: -webkit-transform 0.5s ease-in-out;
  }
  .burger:after {
    content: "";
    display: block;
    border-bottom: 3px solid currentColor;
    width: 100%;
    margin-bottom: 3px;
    transition: transform 0.5s ease-in-out;
    -webkit-transition: -webkit-transform 0.5s ease-in-out;
  }
  .burger.open {
    border-bottom: 3px solid transparent;
    transition: border-bottom 0.8s ease-in-out;
    -webkit-transition: border-bottom 0.8s ease-in-out;
  }
  .burger.open:before {
    transform: rotate(-405deg) translateY(1px) translateX(-1px);
    -webkit-transform: rotate(-405deg) translateY(1px) translateX(-1px);
    transition: transform 0.5s ease-in-out;
    -webkit-transition: -webkit-transform 0.5s ease-in-out;
  }
  .burger.open:after {
    transform: rotate(405deg) translateY(-4px) translateX(-3px);
    -webkit-transform: rotate(405deg) translateY(-4px) translateX(-3px);
    transition: transform 0.5s ease-in-out;
    -webkit-transition: -webkit-transform 0.5s ease-in-out;
  }
  .burger.add {
    border-bottom: 3px solid transparent;
    transition: border-bottom 0.8s ease-in-out;
    -webkit-transition: border-bottom 0.8s ease-in-out;
  }
  .burger.add:before {
    transform: rotate(-90deg) translateY(0px) translateX(-1px);
    -webkit-transform: rotate(-90deg) translateY(0px) translateX(-1px);
    transition: transform 0.5s ease-in-out;
    -webkit-transition: -webkit-transform 0.5s ease-in-out;
  }
  .burger.add:after {
    transform: rotate(90deg) translateY(-5px) translateX(-0px);
    -webkit-transform: rotate(0deg) translateY(-5px) translateX(0px);
    transition: transform 0.5s ease-in-out;
    -webkit-transition: -webkit-transform 0.5s ease-in-out;
  }
  .burger-w:before {
    border-color: #FFF;
  }
  .burger-w:after {
    border-color: #FFF;
  }
  .btn-po-bo-add {
    position: absolute;
    bottom: 78px;
    right: 50px;
  }
  .btn-po-bo-add:before {
    border-color: #747474;
  }
  .btn-po-bo-add:after {
    border-color: #747474;
  }
  .btn-po-bo-list {
    position: absolute;
    border-color: #747474;
    bottom: 50px;
    right: 50px;
  }
  .btn-po-bo-list:before {
    border-color: #747474;
  }
  .btn-po-bo-list:after {
    border-color: #747474;
  }

</style>
