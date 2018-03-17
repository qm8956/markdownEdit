<template>
  <transition :name="'slide' + placement">
    <div class="aside" v-if="show" :style="{width:width+'px'}" :class="placement">
      <div class="aside-dialog" style="height: 100%">
        <div class="aside-content flex" style="height: 100%">
          <div class="aside-header" style="display: flex;">
            <button type="button" name="button" class="burger open burger-w" @click="trigger_close()" style="margin-top: 8px;" title="展开文档列表"></button>
            <span style="margin-left: 10px;">文章列表</span>
            <img src="../assets/clear.png" alt="" class="aside-header-img" title="清空所有数据" @click="deleteAll()">
          </div>
          <input type="text" class="form-control" placeholder="快速搜索文章" v-model="keywords" @keyup.enter="query()">
          <div class="aside-body span">
            <ul class="list-group">
              <li class="list-group-item" v-for="(blog, index) in blogs" :key="index" @dblclick="modify(blog)">
                <span>{{blog.title ? blog.title : '未设置标题'}}</span>
                <div class="">
                  <button type="button" name="button" class="btn btn-link" @click="modify(blog)">修改</button>
                  <button type="button" name="button" class="btn btn-link" @click="deleteBlog(blog, index)">删除</button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import {getScrollBarWidth} from '../utils/utils.js'
import $ from '../utils/NodeList.js'
export default {
  data () {
    return {
      blogs: [],
      keywords: ''
    }
  },
  props: {
    header: {type: String},
    placement: {type: String, default: 'right'},
    show: {type: Boolean, required: true},
    width: {type: Number, default: 320}
  },
  watch: {
    show (val, old) {
      if (this.show) {
        this.$getData().then((data) => {
          this.blogs = data
        })
      }
      console.log('this.blogs', this.blogs)
      this.$emit('input', val)
      this.$emit(this.show ? 'open' : 'close')
      const body = document.body
      const scrollBarWidth = getScrollBarWidth()
      if (val) {
        if (!this._backdrop) {
          this._backdrop = document.createElement('div')
        }
        this._backdrop.className = 'aside-backdrop'
        body.appendChild(this._backdrop)
        body.classList.add('modal-open')
        if (scrollBarWidth !== 0) {
          body.style.paddingRight = scrollBarWidth + 'px'
        }
        // request property that requires layout to force a layout
        // var x = this._backdrop.clientHeight
        this._backdrop.classList.add('in')
        $(this._backdrop).on('click', () => this.trigger_close())
      } else {
        $(this._backdrop).on('transitionend', () => {
          $(this._backdrop).off()
          try {
            body.classList.remove('modal-open')
            body.style.paddingRight = '0'
            body.removeChild(this._backdrop)
            this._backdrop = null
          } catch (e) {}
        })
        this._backdrop.className = 'aside-backdrop'
      }
    }
  },
  methods: {
    trigger () {
      return {
        close: () => this.trigger_close(),
        open: () => this.trigger_open()
      }
    },
    trigger_close () {
      console.log('发送关闭事件')
      this.$emit('close')
    },
    trigger_open () {
      this.$emit('open')
    },
    query () {
      let condition
      console.log('关键字搜索')
      if (this.keywords) {
        condition = {title: this.keywords, content: this.keywords}
      }
      this.$getData(condition).then((data) => {
        console.log('data', data)
        this.blogs = data
      })
    },
    modify (row) {
      this.$emit('modify', row)
    },
    deleteBlog (row, index) {
      if (window.confirm('确定删除吗?')) {
        this.$deteleData(row.id).then(() => {
          this.blogs.splice(index, 1)
        })
      }
    },
    deleteAll () {
      if (window.confirm('确定删除所有数据吗?')) {
        this.$deleteAll().then(() => {
          this.blogs = []
        })
      }
    }
  },
  mounted () {
    this.$emit('trigger', () => this.trigger)
  }
}
</script>

<style>
.aside-open {
  transition: transform 0.3s;
}
.aside-open.has-push-right {
  transform: translateX(-300px);
}
.aside {
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 10000;
  overflow: auto;
  background: #fff;
}
.aside.left {
  left: 0;
  right: auto;
}
.aside.right {
  left: auto;
  right: 0;
}
.slideleft-enter {
  transform:translateX(-100%);
}
.slideleft-enter-active {
  animation:slideleft-in .3s;
}
.slideleft-leave-active {
  animation:slideleft-out .3s;
}
@keyframes slideleft-in {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
@keyframes slideleft-out {
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(-100%);
    opacity: 0;
  }
}
.slideright-enter-active {
  animation:slideright-in .3s;
}
.slideright-leave-active {
  animation:slideright-out .3s;
}
@keyframes slideright-in {
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
@keyframes slideright-out {
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
}
.aside:focus {
    outline: 0;
}
@media (max-width: 991px) {
  .aside {
    min-width: 240px;
  }
}
.aside .aside-dialog .aside-header {
  border-bottom: 1px solid #e5e5e5;
  min-height: 16.43px;
  padding: 6px 15px;
  background: #337ab7;
  color: #fff;
}
.aside .aside-dialog .aside-header .close {
  margin-right: -8px;
  padding: 4px 8px;
  color: #fff;
  font-size: 25px;
  opacity: .8;
}
.aside .aside-dialog .aside-body {
  /* position: relative; */
  /* overflow: auto; */
  /* padding: 15px; */
}
.aside .aside-dialog .aside-footer {
  padding: 15px;
  text-align: right;
  border-top: 1px solid #e5e5e5;
}
.aside .aside-dialog .aside-footer .btn+.btn {
  margin-left: 5px;
  margin-bottom: 0;
}
.aside .aside-dialog .aside-footer .btn-group .btn+.btn {
  margin-left: -1px;
}
.aside .aside-dialog .aside-footer .btn-block+.btn-block {
  margin-left: 0;
}
.aside-backdrop {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;
  opacity: 0;
  transition: opacity .3s ease;
  background-color: #000;
}
.aside-backdrop.in {
  opacity: .5;
  filter: alpha(opacity=50);
}
.form-control {
  box-sizing: border-box;
  display: block;
  width: 100%;
  padding: .375rem .75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
}
.list-group {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  cursor: alias;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  padding-left: 0;
  margin-bottom: 0;
}
.list-group-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: .5rem 1.25rem;
  margin-bottom: -1px;
  background-color: #fff;
  border: 1px solid rgba(0,0,0,.125);
}
.btn-link {
  font-weight: 400;
  color: #007bff;
  background-color: transparent;
  cursor: pointer;
}
.btn {
  display: inline-block;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  border: 1px solid transparent;
  /* padding: .375rem .75rem; */
  font-size: 1rem;
  line-height: 1.5;
  border-radius: .25rem;
  transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
}
.flex {
  display: flex;
  flex-direction: column;
}
.span {
  flex: 1;
  overflow: auto;
  height: auto;
}
.aside-header-img {
  height: 20px;
  position: absolute;
  right: 20px;
  cursor: pointer;
}
</style>
