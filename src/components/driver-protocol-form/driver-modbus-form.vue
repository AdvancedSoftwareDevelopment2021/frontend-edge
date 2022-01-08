<template>
  <div>
    <Form :model="newDriverForm" :label-width="80">
      <Row>
          <FormItem label="IP地址">
            <Input
              v-model="newDriverForm.point.ip"
              placeholder="请输入IP地址"
            ></Input>
          </FormItem>
      </Row>
      <Row>
          <FormItem label="端口">
            <Input
              v-model="newDriverForm.point.port"
              placeholder="请输入端口"
            ></Input>
          </FormItem>
      </Row>
      <Row>
          <FormItem label="slaveId">
            <Input
              v-model="newDriverForm.point.slaveId"
              placeholder="请输入slaveId"
            ></Input>
          </FormItem>
      </Row>
      <Row>
          <FormItem label="offset">
            <Input
              v-model="newDriverForm.point.offset"
              placeholder="请输入offset"
            ></Input>
          </FormItem>
      </Row>
    </Form>
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
  </div>
</template>

<script>
export default {
  props: {
    driverForm: {
      required: true
    },
    parentCancelBtnClick: {
      type: Function
    },
    parentConfirmBtnClick: {
      type: Function
    }
  },
  data () {
    return {
      newDriverForm: this.driverForm
    }
  },
  methods: {
    cancelBtnClick () {
      this.parentCancelBtnClick()
    },
    confirmBtnClick () {
      this.parentConfirmBtnClick(this.newDriverForm)
    }
  }
}
</script>
