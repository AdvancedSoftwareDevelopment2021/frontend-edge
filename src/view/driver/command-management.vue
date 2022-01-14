<template>
  <Card>
    <Button class="add-new-project" type="primary" icon="md-add" @click="addCommand" style="margin-bottom: 10px">
      新增命令
    </Button>
    <Modal
      v-model="addCommandModalVisible"
      title="命令详情"
      footer-hide
    >
      <Form :label-width="80">
        <Row>
          <FormItem label="名称">
            <Input v-model="command.name" placeholder="请输入命令名称" :disabled="isUpdate"></Input>
          </FormItem>
        </Row>
        <Row>
          <FormItem label="描述">
            <Input v-model="command.description" placeholder="请输入命令描述" type="textarea"></Input>
          </FormItem>
        </Row>
        <Row>
          <FormItem label="命令类型">
            <Select v-model="command.commandType">
              <Option
                v-for="item in commandTypeList"
                :value="item.value"
                :key="item.value"
              >
                {{ item.label }}
              </Option>
            </Select>
          </FormItem>
        </Row>
        <Row>
          <FormItem label="执行类型">
            <Select v-model="command.tag">
              <Option
                v-for="item in commandTag"
                :value="item.value"
                :key="item.value"
              >
                {{ item.label }}
              </Option>
            </Select>
          </FormItem>
        </Row>
        <div v-if="command.commandType === 'PROPERTY'">
         <Row>
           <Col>
             <FormItem label="属性类型">
               <Select v-model="command.type">
                 <Option
                   v-for="item in deviceDataTypeList"
                   :value="item.value"
                   :key="item.value"
                 >
                   {{ item.label }}
                 </Option>
               </Select>
             </FormItem>
           </Col>
           <Col>
             <FormItem label="属性值">
               <Input v-model="command.value" placeholder="请输入属性值"></Input>
             </FormItem>
           </Col>
         </Row>
        </div>
        <div v-if="command.commandType === 'CUSTOM'">
          <FormItem
            v-for="(item, listIndex) in command.params"
            :key="listIndex"
            :label="'参数 ' + `${listIndex + 1}`"
            :prop="'values.' + listIndex + '.value'"
          >
            <Row :gutter="10">
              <Col span="10">
                <Input v-model="item.name" placeholder="参数名称"/>
              </Col>
              <Col span="10">
                  <Input v-model="item.value" placeholder="参数内容"/>
              </Col>
              <Col span="1">
                <Button
                  @click="handleRemove(listIndex)"
                  size="small"
                  shape="circle"
                >
                  <Icon type="md-close" />
                </Button>
              </Col>
            </Row>
          </FormItem>
          <FormItem>
            <Row type="flex" justify="start">
              <Col span="24">
                <Button type="dashed" long @click="handleAdd" icon="md-add">
                  新增参数
                </Button>
              </Col>
            </Row>
          </FormItem>
        </div>
        <div v-if="command.commandType === 'ML'">
          <FormItem label="绑定模型">
            <Row :gutter="10">
              <Col>
                <Select v-model="command.mlId">
                  <Option
                    v-for="item in mlModalList"
                    :value="item.id"
                    :key="item.id"
                  >
                    {{ item.name }}
                  </Option>
                </Select>
              </Col>
            </Row>
          </FormItem>
          <FormItem label="阈值">
            <Row :gutter="10">
              <Col>
                <Input v-model="command.threshold" />
              </Col>
            </Row>
          </FormItem>
          <FormItem label="低于阈值的联动设备">
            <Row :gutter="10">
              <Col>
                <Select v-model="command.relatedDeviceId">
                  <Option
                    v-for="item in deviceList"
                    :value="item.id"
                    :key="item.id"
                  >
                    {{ item.name }}
                  </Option>
                </Select>
              </Col>
            </Row>
          </FormItem>
        </div>
        <Row :gutter="8" type="flex" justify="end">
          <Col>
            <Button @click="cancelBtnClick">取消</Button>
          </Col>
          <Col>
            <Button type="primary" @click="confirmBtnClick">
              确认
            </Button>
          </Col>
        </Row>
      </Form>

    </Modal>
    <paged-table
      ref="table"
      :loading="loading"
      :columns="columns"
      :data-source="commandList"
      :total="commandList.length"></paged-table>
  </Card>
</template>

<script>
import { getDriverById, updateDriver } from '@/api/driver'
import { getMLModal } from '@/api/ml'
import { getDeviceListApi } from '@/api/device'
import { mapState } from 'vuex'
import PagedTable from '_c/paged-table'
const commandTag = [
  {
    value: 'START',
    label: '启动'
  },
  {
    value: 'EXECUTE',
    label: '执行'
  },
  {
    value: 'END',
    label: '关闭'
  },
  {
    value: 'FREE',
    label: '暂不使用'
  }
]
export default {
  name: 'command-management',
  components: {
    PagedTable
  },
  data: function () {
    return {
      loading: true,
      isUpdate: false,
      addCommandModalVisible: false,
      commandTypeList: [],
      driver: null,
      command: {
        name: null,
        description: '',
        commandType: '',
        type: 'String',
        value: '',
        params: [],
        tag: 'FREE',
        mlId: null,
        threshold: null,
        relatedDeviceId: null
      },
      deviceList: [],
      commandList: [],
      commandTag,
      columns: [
        {
          title: '名称',
          key: 'name',
          align: 'center'
        },
        {
          title: '描述',
          key: 'description',
          align: 'center'
        },
        {
          title: '命令执行种类',
          key: 'tag',
          align: 'center'
        },
        {
          title: '操作',
          key: 'operation',
          minWidth: 150,
          align: 'center',
          render: (h, { row }) => h('div',
            [h('Button', {
              props: { size: 'small', type: 'primary' },
              style: {
                margin: '1%'
              },
              on: {
                click: () => {
                  this.addCommandModalVisible = true
                  this.isUpdate = true
                  this.command = row
                }
              }
            }, '修改')
            ]
          )
        }
      ],
      mlModalList: []
    }
  },
  mounted () {
    this.refresh()
  },
  created () {
    this.refresh()
  },
  computed: {
    ...mapState({
      deviceDataTypeList: (state) => {
        const list = state.device.deviceDataTypeList
        return list.filter(c => c.value !== 'Object')
      } })
  },
  methods: {
    async refresh () {
      this.loading = true
      this.command = {
        name: null,
        description: '',
        commandType: '',
        type: 'String',
        value: '',
        params: [],
        tag: 'FREE',
        mlId: null,
        threshold: null,
        relatedDeviceId: null
      }
      const id = this.$route.params.id
      this.driver = await getDriverById(id)
      this.deviceList = await getDeviceListApi()
      this.deviceList = this.deviceList.filter(c => {
        return c.id !== this.driver.deviceId
      })
      this.mlModalList = await getMLModal()
      this.commandList = this.driver.commands || []
      if (this.driver.point.type === 'Modbus' || this.driver.point.type === 'ZigBee') {
        this.command.commandType = 'PROPERTY'
        this.commandTypeList = [
          {
            value: 'PROPERTY',
            label: '属性设置'
          }
        ]
      }
      if (this.driver.point.type === 'Http') {
        this.command.commandType = 'CUSTOM'
        this.commandTypeList = [
          {
            value: 'CUSTOM',
            label: '自定义命令'
          },
          {
            value: 'ML',
            label: '机器学习'
          }
        ]
      }
      this.loading = false
    },
    handleRemove (listIndex) {
      this.command.params.splice(listIndex, 1)
    },
    handleAdd () {
      this.command.params.push({
        name: '',
        value: ''
      })
    },
    async confirmBtnClick () {
      let commands = this.driver.commands
      if (commands === null || commands.length < 1) {
        commands = []
      }
      if (this.command.name === null) {
        this.$Message.error('名字不能为空')
        return
      }
      if (commands.some(c => c.tag === 'START' && this.command.name !== c.name) && this.command.tag === 'START') {
        this.$Message.error('一个控制器只能有一个启动命令')
        return
      }
      if (commands.some(c => c.tag === 'END' && this.command.name !== c.name) && this.command.tag === 'END') {
        this.$Message.error('一个控制器只能有一个停止命令')
        return
      }
      if (this.command.commandType === 'CUSTOM') {
        let params = this.command.params
        if (params.length < 1) {
          this.$Message.error('自定义命令时至少包含一个参数')
          return
        }
        if (params.some(c => c.name === '' || c.value === '')) {
          this.$Message.error('已有参数不能为空')
          return
        }
      }
      if (this.command.commandType === 'PROPERTY') {
        if (this.command.value === '') {
          this.$Message.error('属性命令参数不能为空')
          return
        }
      }
      if (this.command.commandType === 'ML') {
        let numReg = /^\d+(\.\d+)?$/
        let numRe = new RegExp(numReg)
        if (this.command.mlId === null || this.command.threshold === null || this.command.relatedDeviceId === null) {
          this.$Message.error('机器学习模型参数不完整')
          return
        } else if (!numRe.test(this.command.threshold)) {
          this.$Message.error('阈值设置请输入非负浮点数或整数')
          return
        }
      }
      if (this.isUpdate) {
        commands = commands.map((item) => {
          if (item.name === this.command.name) {
            return this.command
          }
          return item
        })
        this.isUpdate = false
      } else {
        if (commands.some(c => c.name === this.command.name)) {
          this.$Message.error('命令名称重复')
          return
        }
        commands.push(this.command)
      }
      this.driver.commands = commands
      await updateDriver(this.driver)
      this.refresh().then(() => {
        this.addCommandModalVisible = false
      })
    },
    cancelBtnClick () {
      this.addCommandModalVisible = false
      this.refresh()
    },
    addCommand () {
      this.isUpdate = false
      this.refresh().then(() => {
        this.addCommandModalVisible = true
      })
    }
  }
}
</script>

<style scoped>

</style>
