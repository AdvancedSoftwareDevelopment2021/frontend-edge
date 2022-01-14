<template>
  <!-- <div>Process Management</div> -->
  <div>
    <Table border :columns="columns" :data="processList">
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row.name }}</strong>
      </template>
      <template slot-scope="{ row }" slot="action">
            <Button type="primary" size="small" style='margin-right:1%' @click="bindingBtnClick(row)">
              绑定设备
            </Button>
            <Button type="error" size="small" style='margin-right:1%' @click="deleteBtnClick(row.id)">
              删除
            </Button>
            <Button  size="small" style='margin-right:1%' @click="processStopBtnClick(row.id)">结束流程</Button>
            <Button
              type="primary"
              size="small"
              @click="processStartBtnClick(row.id)"
            >
              开始流程
            </Button>
      </template>
    </Table>
    <Modal title="请输入执行次数" v-model="visibleModal" @on-ok="processStartBtnClick2()">
      <label>
        <Input v-model="number" placeholder="请输入流程运行次数"></Input>
      </label>
    </Modal>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'

const columns = [
  {
    title: '流程名',
    slot: 'name'
  },
  {
    title: '创建日期',
    key: 'createdTime'
  },
  {
    title: '操作',
    slot: 'action',
    align: 'center'
  }
]

export default {
  name: 'processManagement',
  data: function () {
    return {
      columns,
      number: 1,
      visibleModal: false,
      processId: null
    }
  },
  computed: {
    ...mapState({
      processList: (state) => state.process.processList
    })
  },
  methods: {
    ...mapMutations(['setActiveProcess']),
    ...mapActions(['getAllProcessesAction', 'getBindingListAction', 'processStopAction',
      'processStartAction', 'processDeleteAction']),
    bindingBtnClick (row) {
      this.setActiveProcess(row.id)
      this.getBindingListAction()
      this.$router.push({
        path: '/process/binding'
      })
    },
    deleteBtnClick (id) {
      this.processDeleteAction(id)
    },
    processStopBtnClick (id) {
      this.processStopAction(id).then(() => {
        this.$Message.success('停止成功')
      }).catch(e => {
        this.$Message.error('停止流程失败')
      })
    },
    processStartBtnClick (id) {
      this.visibleModal = true
      this.processId = id
    },
    processStartBtnClick2 () {
      this.processStartAction({ id: this.processId, number: this.number }).then(() => {
        this.$Message.success('开启成功')
      }).catch(e => {
        this.$Message.error('启动流程失败')
      })
    }
  },
  mounted () {
    this.getAllProcessesAction()
  }
}
</script>

<style lang=scss scoped>
</style>
