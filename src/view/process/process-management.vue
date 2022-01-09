<template>
  <!-- <div>Process Management</div> -->
  <div>
    <Table border :columns="columns" :data="processList">
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row.name }}</strong>
      </template>
      <template slot-scope="{ row }" slot="action">
        <Row>
          <Col span="8">
            <Button type="primary" size="small" @click="bindingBtnClick(row)">
              绑定设备
            </Button>
          </Col>
          <Col span="8">
            <Button type="primary" size="small" @click="updateBtnClick(row)">
              修改
            </Button>
          </Col>
          <Col span="8">
            <Button type="error" size="small" @click="deleteBtnClick(row)">
              删除
            </Button>
          </Col>
        </Row>
      </template>
    </Table>
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
      columns
    }
  },
  computed: {
    ...mapState({
      processList: (state) => state.process.processList
    })
  },
  methods: {
    ...mapMutations(['setActiveProcess']),
    ...mapActions(['getAllProcessesAction', 'getBindingListAction']),
    bindingBtnClick (row) {
      this.setActiveProcess(row.id)
      this.getBindingListAction()
      this.$router.push({
        path: '/process/binding'
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
