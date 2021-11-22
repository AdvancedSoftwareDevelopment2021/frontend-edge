<template>
  <!-- TODO: paceholder -->
  <div>
    <Form ref="formItem" :model="formItem" :label-width="80">
      <FormItem label="设备名称">
        <Input v-model="formItem.name"></Input>
      </FormItem>
      <!-- <FormItem label="类型">
            <Input v-model="category"></Input>
        </FormItem> -->
      <FormItem label="型号">
        <Input v-model="formItem.model"></Input>
      </FormItem>
      <FormItem label="设备描述">
        <Input
          v-model="formItem.description"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 5 }"
        ></Input>
      </FormItem>
      <!-- TODO: validate -->
      <FormItem
        v-for="(item, listIndex) in formItem.values"
        :key="listIndex"
        :label="'Data ' + item.valueIndex"
        :prop="'values.' + listIndex + '.value'"
        :rules="{
          required: true,
          message: 'Data ' + item.valueIndex + ' 不能为空',
          trigger: 'blur',
        }"
      >
        <Row :gutter="10">
          <Col span="10">
            <Input v-model="item.name" />
          </Col>
          <Col span="5">
            <Select v-model="item.type">
              <Option
                v-for="item in deviceDataTypeList"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</Option
              >
            </Select>
          </Col>
          <Col span="6">
            <Select v-model="item.protocol">
              <Option
                v-for="item in deviceDataProtocolList"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</Option
              >
            </Select>
          </Col>
          <Col span="1" offset="1">
            <!-- TODO: Button 美化 -->
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
              新增设备数据
            </Button>
          </Col>
        </Row>
      </FormItem>
      <Row :gutter="8" type="flex" justify="end">
        <Col>
          <!-- <span @click="cancelSlotClick">
            <slot name="cancelBtn" />
          </span> -->
          <Button @click="cancelBtnClick">取消</Button>
        </Col>
        <Col>
          <!-- <span @click="comfirmSlotClick">
            <slot name="comfirmBtn" />
          </span> -->
          <Button type="primary" :loading="loading" @click="comfirmBtnClick">
            确认
          </Button>
        </Col>
      </Row>
    </Form>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'deviceInfoForm',
  components: {},
  props: {
    deviceInfo: {
      type: Object
    },
    parentCancelBtnClick: {
      type: Function
    },
    parentComfirmBtnClick: {
      type: Function
    }
  },
  data () {
    let valueIndex = 1
    let formItem = JSON.parse(JSON.stringify(this.deviceInfo))
    // formItem.values[0] = {...formItem.values[0], valueIndex}
    return {
      valueIndex,
      formItem,
      loading: false
    }
  },
  computed: {
    ...mapState({
      deviceDataTypeList: (state) => state.device.deviceDataTypeList,
      deviceDataProtocolList: (state) => state.device.deviceDataProtocolList
    })
  },
  methods: {
    // 因为parentComfirmBtnClick当为Component addDevice所传的方法时，为异步方法，所以要在这加async用来等待异步完成
    async comfirmBtnClick () {
      let newDevice = this.formItem
      this.loading = true
      // 这里可以把不加 await，不过加了可读性比较高
      await this.parentComfirmBtnClick(newDevice)
      this.loading = false
      this.resetFormItem()
    },
    cancelBtnClick () {
      this.parentCancelBtnClick()
      this.resetFormItem()
    },
    resetFormItem () {
      this.valueIndex = 1
      this.formItem = JSON.parse(JSON.stringify(this.deviceInfo))
      // console.log(`reset: ${JSON.stringify(this.deviceInfo)}`)
    },
    handleAdd () {
      this.valueIndex++
      this.formItem.values.push({
        valueIndex: this.valueIndex,
        name: '',
        type: '',
        protocol: ''
      })
    },
    handleRemove (listIndex) {
      // console.log("Delete listItem: " + listIndex);
      this.formItem.values.splice(listIndex, 1)
    }
  },
  watch: {
    deviceInfo (val) {
      this.formItem = JSON.parse(JSON.stringify(this.deviceInfo))
      // console.log(`deviceInfo: ${JSON.stringify(val)}`)
    },
    formItem (val) {
      // console.log(`formItme: ${JSON.stringify(val)}`)
    }
  },
  mounted () {
    this.$nextTick(() => {
      // console.log(this._uid)
    })
  }
}
</script>
