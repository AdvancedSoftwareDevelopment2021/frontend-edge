<template>
<!-- TODO: paceholder -->
    <Form :label-width="80">
        <FormItem label="设备名称">
            <Input v-model="name"></Input>
        </FormItem>
        <FormItem label="类型">
            <Input v-model="category"></Input>
        </FormItem>
        <FormItem label="型号">
            <Input v-model="model"></Input>
        </FormItem>
        <FormItem label="设备描述">
            <Input v-model="description" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
        </FormItem>
        <!-- <Row>
            <Col span="21">
                <Input v-model="name"></Input>
            </Col>
            <Col span="1" offset="1">
                <Button type="circle" shape="circle" icon="ios-add"></Button>
            </Col>
        </Row> -->
        <device-info-form-demo />
        <Row :gutter="8" type="flex" justify="end">
            <Col>
                <slot name="cancelBtn"/>
            </Col>
            <Col>
                <span @click="comfirmSlotClick">
                    <slot name="comfirmBtn" />
                </span>
            </Col>
        </Row>
    </Form>
</template>
<script>
import { mapMutations } from 'vuex'
import deviceInfoFormDemo from './index2'
export default {
  name: 'deviceInfoForm',
  components: {
    deviceInfoFormDemo
  },
  props: {
    deviceInfo: {
      type: Object
    }
  },
  data () {
    return {
    }
  },
  computed: {
    // ...mapState({
    //     formItem: state => state.device.formItem
    // })
    name: {
      get () {
        return this.deviceInfo.name
      },
      set (value) {
        this.modifyFormItem({ name: value })
      }
    },
    category: {
      get () {
        return this.deviceInfo.category
      },
      set (value) {
        this.modifyFormItem({ category: value })
      }
    },
    model: {
      get () {
        return this.deviceInfo.model
      },
      set (value) {
        this.modifyFormItem({ model: value })
      }
    },
    description: {
      get () {
        return this.deviceInfo.description
      },
      set (value) {
        this.modifyFormItem({ description: value })
      }
    }
  },
  methods: {
    ...mapMutations([
      'modifyFormItem'
    ]),
    comfirmSlotClick () {
      console.log('Click comfirm slot area')
    }
  }
}
</script>
