// 公用方法
export default {
  // 表单数据处理
  flowListData(fields) {
    let tableList = []
    fields.forEach((field) => {
      let objData = {}

      if (field.type === 'Field::Detail') {
        objData.field_id = field.id
        objData.identity_key = field.identity_key
        objData.type = field.type
        objData.title = field.title
        objData.children = []

        // 明细字段内部构建
        field.children.forEach((field) => {
          let objDataChildren = {}
          switch (field.type) {
            case 'Field::RadioButton': {
              objDataChildren.field_id = field.id
              objDataChildren.identity_key = field.identity_key
              objDataChildren.type = field.type
              objDataChildren.title = field.title
              objDataChildren.option_id = ''
              objDataChildren.options = field.options
              break
            }
            case 'Field::DateTime': {
              objDataChildren.field_id = field.id
              objDataChildren.identity_key = field.identity_key
              objDataChildren.type = field.type
              objDataChildren.title = field.title
              objDataChildren.value = ''
              break
            }
            default: {
              objDataChildren.field_id = field.id
              objDataChildren.identity_key = field.identity_key
              objDataChildren.type = field.type
              objDataChildren.title = field.title
              objDataChildren.value = ''
            }
          }
          objData.children.push(objDataChildren)
        })
        console.log(objData)
      } else {
        switch (field.type) {
          case 'Field::RadioButton': {
            objData.field_id = field.id
            objData.identity_key = field.identity_key
            objData.type = field.type
            objData.title = field.title
            objData.option_id = ''
            objData.options = field.options
            break
          }
          case 'Field::CheckBox': {
            objData.field_id = field.id
            objData.identity_key = field.identity_key
            objData.type = field.type
            objData.title = field.title
            objData.option_id = []
            objData.value = ''
            objData.other_option = field.other_option
            objData.options = field.options
            break
          }
          case 'Field::DateTime': {
            objData.field_id = field.id
            objData.identity_key = field.identity_key
            objData.type = field.type
            objData.title = field.title
            objData.value = ''
            break
          }
          default: {
            objData.field_id = field.id
            objData.identity_key = field.identity_key
            objData.type = field.type
            objData.title = field.title
            objData.value = ''
          }
        }
      }

      tableList.push(objData)
    })

    return tableList
  },

  // 获取今天时间
  formatDateTime() {
    let date = new Date()
    let y = date.getFullYear()
    let MM = date.getMonth() + 1
    MM = MM < 10 ? '0' + MM : MM
    let d = date.getDate()
    d = d < 10 ? '0' + d : d
    // let h = date.getHours();
    // h = h < 10 ? "0" + h : h;
    // let m = date.getMinutes();
    // m = m < 10 ? "0" + m : m;

    return y + '-' + MM + '-' + d
  },
  // 房屋状态
  houseStatus(array) {
    array.forEach((el) => {
      switch (el.room_status) {
        case '签约': {
          el.class = 'signing'
          break
        }
        case '认购': {
          el.class = 'buy'
          break
        }
        case '退房': {
          el.class = 'change'
          break
        }
        case '空闲': {
          break
        }
        default: {
        }
      }
    })
    return array
  },

  // 时间格式化
  createData(data) {
    for (let i = 0; i < data.length; i++) {
      let firstDataTime = data[i].created_at.slice(0, 10)
      let lastDataTime = data[i].created_at.slice(11, 16)
      data[i].dataTime = firstDataTime + '  ' + lastDataTime
    }
    return data
  },
  // 表单数据处理
  tableListData(fields, orderFieldList) {
    let tableList = []
    orderFieldList.forEach((element) => {
      let field = fields.find((field) => field.identity_key === element)
      let objData = {}

      if (field) {
        switch (field.type) {
          case 'Field::RadioButton': {
            objData.field_id = field.id
            objData.identity_key = field.identity_key
            objData.type = field.type
            objData.title = field.title
            objData.option_id = ''
            objData.options = field.options
            break
          }
          case 'Field::CheckBox': {
            objData.field_id = field.id
            objData.identity_key = field.identity_key
            objData.type = field.type
            objData.title = field.title
            objData.option_id = []
            objData.value = ''
            objData.other_option = field.other_option
            objData.options = field.options
            break
          }
          case 'Field::DateTime': {
            objData.field_id = field.id
            objData.identity_key = field.identity_key
            objData.type = field.type
            objData.title = field.title
            objData.value = ''
            break
          }

          default: {
            objData.field_id = field.id
            objData.identity_key = field.identity_key
            objData.type = field.type
            objData.title = field.title
            objData.value = ''
          }
        }
        switch (field.identity_key) {
          // case "living_area": {
          //   objData.field_id = field.id;
          //   objData.identity_key = field.identity_key;
          //   objData.type = field.type;
          //   objData.title = field.title;
          //   objData.value = [];
          //   objData.columns = this.cascade(field.cascaded_select.choices);
          //   break;
          // }
          case 'working_area': {
            objData.field_id = field.id
            objData.identity_key = field.identity_key
            objData.type = field.type
            objData.title = field.title
            objData.value = []
            objData.columnsCe = this.cascade(field.cascaded_select.choices)
            break
          }
          default: {
            objData.field_id = field.id
            objData.identity_key = field.identity_key
            objData.type = field.type
            objData.title = field.title
            objData.value = ''
          }
        }
        tableList.push(objData)
      }
    })

    return tableList
  },

  // 排行榜排序
  rank(list) {
    for (let i = 0; i < list.length; i++) {
      list[i].top = i + 1
    }
    return list
  },
  // 级联数据渲染
  cascade(res) {
    let columns = []
    res.forEach((el) => {
      let obj = {}
      if (!el.parent_id) {
        obj.text = el.name
        obj.id = el.id
        columns.push(obj)
      }
    })
    // 二级级联
    this.cascadeChildren(columns, res)
    return columns
  },
  cascadeChildren(columns, res) {
    columns.forEach((columns) => {
      let children = []
      res.forEach((res) => {
        let obj = {}
        if (columns.id === res.parent_id) {
          obj.text = res.name
          obj.id = res.id
          if (obj.text) {
            children.push(obj)
          }
        }
      })
      columns.children = children
      this.cascadeChildrenThird(children, res)
    })
  },
  cascadeChildrenThird(children, res) {
    children.forEach((children) => {
      let childrens = []
      res.forEach((res) => {
        let obj = {}
        if (children.id === res.parent_id) {
          obj.text = res.name
          obj.id = res.id
          if (obj.text) {
            childrens.push(obj)
          }
        }
      })
      children.children = childrens
    })
  },
}
