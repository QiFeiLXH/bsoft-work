import { Menu, Icon, Input } from 'ant-design-vue'
import './style.less'
const { Item, SubMenu } = Menu
const { Search } = Input

export default {
  name: 'Tree',
  data () {
    return {
      isFinished: false
    }
  },
  props: {
    dataSource: {
      type: Array,
      required: true
    },
    openKeys: {
      type: Array,
      default: () => []
    },
    selectKey: {
      type: Array,
      default: () => []
    },
    search: {
      type: Boolean,
      default: false
    },
    showTitle: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '项目计划'
    },
    showTime: {
      type: Boolean,
      default: false
    },
    noPlan: {
      type: Boolean,
      default: false
    },
    time: {
      type: Array,
      default: () => []
    },
    checkTime: {
      type: String,
      default: ''
    },
    showLognum: {
      type: Boolean,
      default: true
    },
    totalWorkloadRate: {
      type: Number,
      default: 0.0
    },
    noProject: {
      type: Boolean,
      default: false
    }
  },
  render () {
    const { dataSource, showTitle, title, showTime, time, noPlan, noProject, } = this.$props
    const list = dataSource.map(item => {
      item.blod = true
      const stage = item.milepostId
      return this.renderItem(item, stage)
    })

    return (
      <div class="tree-wrapper">
        { showTitle ? this.renderTitle(title, showTime, time, noPlan, noProject, dataSource) : null }
        <Menu mode="inline" class="custom-tree" {...{ on: { click: (item) => this.treeClick(item) } }} openKeys={this.openKeys} selectedKeys={this.selectKey}>
          { list }
        </Menu>
      </div>
    )
  },
  methods: {
    treeClick (item) {
      this.$emit('click', item)
    },
    // 渲染时间
    renderTime (item) {
      return item.flag === 0 ? (
        <a-menu-item key={item.key} {...{ on: { click: () => this.changTreeTime(item) } }}>{ item.attendanceDate.substring(0, 10) }<span style="margin-left:20px;color:red">未填写</span></a-menu-item>
      ) : (
        <a-menu-item key={item.key} {...{ on: { click: () => this.changTreeTime(item) } }}>{ item.attendanceDate.substring(0, 10) }</a-menu-item>
      )
    },

    // 时间组件选择时触发
    changTreeTime (item) {
      this.$emit('timeItemClick', item)
    },

    /**
     * 渲染标题
     * @param title 标题名称
     * @param showTime 是否显示时间组件
     * @param time 时间数据
     */
    renderTitle (title, showTime, time, noPlan, noProject, dataSource) {
      this.judgeIsFinished(dataSource)
      let titleSuffix
      if (noPlan) {
        titleSuffix = <span className="tree-title" style="color:red">(未维护计划)</span>
      } else if (noProject) {
        titleSuffix = <span className="tree-title" style="color:red">(请选择项目)</span>
      } else if (this.isFinished) {
        titleSuffix = <span className="tree-title" style="color:red">(计划已完成)</span>
      } else {
        titleSuffix = <span></span>
      }

      if (showTime) {
        let key = 0
        const times = time.map(o => {
          o.key = key++
          return this.renderTime(o)
        })
        return (
          <a-row>
            <span class="tree-title" style="margin-left:10px;"><b>{ title }</b></span>
            {titleSuffix}
            <a-dropdown class="tree-title" style="float:right;margin-right:16px">
              <span>{ this.checkTime }<a-icon type="down" /></span>
              <a-menu slot="overlay">
                { times }
              </a-menu>
            </a-dropdown>
          </a-row>
        )
      } else {
        if (this.totalWorkloadRate > 0) {
          titleSuffix = <span style="float: right;margin-right:32px;font-weight: bold;">小计：&nbsp;&nbsp;<span style="color:#1890ff">{this.totalWorkloadRate}</span>(人日)</span>
        }
        if (noProject) {
          return (
            <a-row>
              <span class="tree-title" style="margin-left:10px"><b>{title}</b></span>
              {titleSuffix}
            </a-row>
          )
        } else {
          return (
            <a-row>
              <span class="tree-title" style="margin-left:10px"><b>{title}</b></span>
              {titleSuffix}
            </a-row>
          )
        }
      }
    },
    judgeIsFinished (Array) {
      if (Array.length === 1 && Array[0].id === -1) {
        this.isFinished = true
      } else if (Array.length > 1) {
        for (var i = 0; i < Array.length; i++) {
          if (!Array[i].finishFlag || Array[i].finishFlag === 0) {
            this.isFinished = false
            return
          }
          if (Array[i].children) {
            this.judgeIsFinished(Array[i].children)
          }
        }
      }
    },

    // 渲染搜索框
    renderSearch () {
      return (
        <Search
          placeholder="input search text"
          style="width: 100%; margin-bottom: 1rem"
        />
      )
    },

    renderItem (item, stage) {
      return item.children ? this.renderSubItem(item, stage) : this.renderMenuItem(item, stage)
    },
    renderSubItem (item, stage) {
      let fontStyle = ''
      let labelStyle = ''
      if (item.logoff === 1) {
        fontStyle = 'color:rgb(217,217,217)'
      } else if (this.selectKey[0] === item.id) {
        fontStyle = 'color:#1890ff'
        labelStyle = 'background:#e6f7ff'
      }
      item.stage = stage
      const childrenItems = item.children && item.children.map(o => {
        return this.renderItem(o, stage)
      })
      let title
      if (this.showLognum) {
        if (item.logNum > 0) {
          title = (
            <span slot="title" style={fontStyle}>
              {this.renderIcon(item.icon)}
              {this.tipTitle(item.finishFlag, item.milepostName, item.logNum, item.blod)}
              {<span style="float: right;color:#1890ff">{item.logNum}</span>}
            </span>
          )
        } else {
          title = (
            <span slot="title" style={fontStyle}>
              {this.renderIcon(item.icon)}
              {this.tipTitle(item.finishFlag, item.milepostName, 0, item.blod)}
            </span>
          )
        }
      } else {
        if (item.workloadSum > 0) {
          title = (
            <span slot="title" style={fontStyle}>
              {this.renderIcon(item.icon)}
              {this.tipTitle(item.finishFlag, item.milepostName, item.workloadSum, item.blod)}
              {<span style="float: right;color:#1890ff">{item.workloadSum}</span>}
            </span>
          )
        } else {
          title = (
            <span slot="title" style={fontStyle}>
              {this.renderIcon(item.icon)}
              {this.tipTitle(item.finishFlag, item.milepostName, 0, item.blod)}
            </span>
          )
        }
      }

      return (
        <SubMenu style={labelStyle} key={item.id} {...{ on: { titleClick: () => this.expandMenu(item) } }}>
          { title }
          { childrenItems }
        </SubMenu>
      )
    },
    tipTitle (finishFlag, title, number, blod) {
      let titleStyle
      if (blod) {
        titleStyle = 'font-weight: bold;'
      } else {
        titleStyle = 'font-weight: normal;'
      }
      let check = <span> </span>
      if (finishFlag === 1) {
        titleStyle += 'color:rgb(217,217,217)'
        check = <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
      }
      if (title.length > 20) {
        return (
          <a-tooltip placement="top">
            <template slot="title">
              {check}<span>{title}</span>
            </template>
            <span style={titleStyle}>{title.substring(0, 20) + '...'}</span>
          </a-tooltip>
        )
      } else {
        return (<span style={titleStyle}>{check}{title}</span>)
      }
    },
    renderMenuItem (item, stage) {
      let fontStyle
      if (item.logoff === 1) {
        fontStyle = 'color:rgb(217,217,217)'
      } else if (item.id === -1) {
        fontStyle = this.selectKey[0] === -1 ? 'background:#e6f7ff' : 'background:#f3f1f194'
      } else {
        fontStyle = ''
      }
      item.stage = stage
      if (this.showLognum) {
        if (item.logNum > 0) {
          return (
            <Item key={item.id} style={fontStyle} value={item}>
              {this.renderIcon(item.icon)}
              {this.tipTitle(item.finishFlag, item.milepostName, item.logNum, item.blod)}
              {/* 根节点后缀 */}
              {<span style="float: right;margin-right:18px;color:#1890ff">{item.logNum}</span>}
            </Item>
          )
        } else {
          return (
            <Item key={item.id} style={fontStyle} value={item}>
              {this.renderIcon(item.icon)}
              {this.tipTitle(item.finishFlag, item.milepostName, 0, item.blod)}
            </Item>
          )
        }
      } else {
        if (item.workloadSum > 0) {
          return (
            <Item key={item.id} style={fontStyle} value={item}>
              {this.renderIcon(item.icon)}
              {this.tipTitle(item.finishFlag, item.milepostName, item.workloadSum, item.blod)}
              {/* 根节点后缀 */}
              {<span style="float: right;margin-right:18px;color:#1890ff">{item.workloadSum}</span>}
            </Item>
          )
        } else {
          return (
            <Item key={item.id} style={fontStyle} value={item}>
              {this.renderIcon(item.icon)}
              {this.tipTitle(item.finishFlag, item.milepostName, 0, item.blod)}
            </Item>
          )
        }
      }
    },

    expandMenu (item) {
      /* const index = this.openKeys.indexOf(item.id)
      if (index > -1) {
        this.openKeys.splice(index, 1)
      } else {
        this.openKeys.push(item.id)
      } */
      this.$emit('parentClick', item)
    },

    renderIcon (icon) {
      return icon && (<Icon type={icon} theme="twoTone" twoToneColor="#1890ff"/>) || null
    },
    handlePlus (item) {
      this.$emit('add', item)
    },
    handleTitleClick (...args) {
      this.$emit('titleClick', { args })
    }
  }
}
