let uuid = function uuid (len, radix) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  var uuid = []
  var i
  radix = radix || chars.length

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
  } else {
    // rfc4122, version 4 form
    var r

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16
        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
      }
    }
  }

  return uuid.join('')
}
let IndexedDB = {
  install (Vue, options) {
    // 初始化库
    console.debug('initDb ...')
    const DB_NAME = 'blogs'
    const DB_VERSION = 1 // Use a long long for this value (don't use a float)
    const DB_STORE_NAME = 'user'
    var db
    var req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onsuccess = function (evt) {
    // Better use "this" than "req" to get the result to avoid problems with
    // garbage collection.
    // db = req.result;
      db = this.result
      console.debug('initDb DONE')
    }
    req.onerror = function (evt) {
      console.error('initDb:', evt.target.errorCode)
      alert('Database error: ' + event.target.errorCode)
    }

    req.onupgradeneeded = function (evt) {
      console.debug('initDb.onupgradeneeded')
      var store = evt.currentTarget.result.createObjectStore(
        DB_STORE_NAME, { keyPath: 'id', autoIncrement: true })

      store.createIndex('biblioid', 'biblioid', { unique: true })
      store.createIndex('title', 'title', { unique: false })
      store.createIndex('content', 'content', { unique: false })
    }
    // 添加数据或更新数据
    Vue.dbAdd = Vue.prototype.$dbAdd = function (id, title, content, biblioid) {
      let rl
      let rj
      if (!biblioid) {
        biblioid = uuid(8, 16)
      }
      if (!db) {
        console.error('addPublication: the db is not initialized')
        return
      }

      let transaction = db.transaction(DB_STORE_NAME, 'readwrite')
      transaction.oncomplete = function (event) {
        // console.log('全部存储完成', event)
      }

      transaction.onerror = function (event) {
        // 不要忘记进行错误处理！
      }
      let store = transaction.objectStore(DB_STORE_NAME)
      let request
      if (id) {
        request = store.put({ id: id, content: content, title: title, date: new Date().getTime() })
      } else {
        request = store.add({ biblioid: biblioid, content, title: title, date: new Date().getTime() })
      }
      request.onsuccess = function (evt) {
        rl(request.result, biblioid)
      }
      request.onerror = function () {
        rj(this.error)
        window.alert('添加数据失败' + JSON.stringify(this.error))
      }
      return new Promise((resolve, reject) => {
        rl = resolve
        rj = reject
      })
    }

    // 获取所有数据
    Vue.getData = Vue.prototype.$getData = function (params) {
      // console.log(`db is `, db)
      let data = []
      let rl
      let objectStore = db.transaction(DB_STORE_NAME).objectStore(DB_STORE_NAME)
      objectStore.openCursor().onsuccess = function (event) {
        // console.log(`event is `, event)
        let cursor = event.target.result
        if (cursor) {
          // alert('Name for SSN ' + cursor.key + ' is ' + cursor.value.name)
          // console.log('Name for SSN ', cursor.key, ' is ', cursor.value.biblioid)
          if (params) {
            let keys = Object.keys(params)
            for (let i = 0; i < keys.length; i++) {
              if (cursor.value[keys[i]].toString().includes(params[keys[i]])) {
                data.push(cursor.value)
                break
              }
            }
          } else {
            data.push(cursor.value)
          }
          cursor.continue()
        } else {
          // alert('No more entries!')
        }
        if (!cursor) {
          data = data.sort((item1, itme2) => {
            return item1.date < itme2.date
          })
          rl(data)
        }
      }
      return new Promise((resolve, reject) => {
        rl = resolve
      })
    }
    // 删除一条数据
    Vue.deteleData = Vue.prototype.$deteleData = function (id) {
      let rl
      let rj
      let request = db.transaction(DB_STORE_NAME, 'readwrite')
        .objectStore(DB_STORE_NAME)
        .delete(id)
      request.onsuccess = function (event) {
        // 删除数据成功！
        rl(event)
        window.alert('删除成功')
      }
      request.onerror = function (event) {
        rj(event)
      }
      return new Promise((resolve, reject) => {
        rl = resolve
        rj = reject
      })
    }
    // 清空文档
    Vue.deleteAll = Vue.prototype.$deleteAll = function (id) {
      let rl
      let rj
      let request = db.transaction(DB_STORE_NAME, 'readwrite')
        .objectStore(DB_STORE_NAME)
        .clear()
      request.onsuccess = function (event) {
        // 删除数据成功！
        rl(event)
        window.alert('全部删除成功')
      }
      request.onerror = function (event) {
        rj(event)
      }
      return new Promise((resolve, reject) => {
        rl = resolve
        rj = reject
      })
    }
  }
}
export default IndexedDB
