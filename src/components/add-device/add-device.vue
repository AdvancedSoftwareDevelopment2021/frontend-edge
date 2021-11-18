<template>
    <div>
        <Button type="primary" @click="modalControl = true" icon="md-add-circle">
            <!-- <Icon type="md-add-circle" /> -->
            新增设备
        </Button>
        <Modal
            v-model="modalControl"
            title="新增设备"
            footer-hide
            >
            <device-info-form :deviceInfo="deviceInfo">
                <template v-slot:cancelBtn>
                    <Button @click="modalCancelBtnClick">取消</Button>
                </template>
                <template v-slot:comfirmBtn>
                    <Button type="primary" :loading="loading" @click="modalComfirmBtnClick">新增</Button>
                </template>
            </device-info-form>
        </Modal>
    </div>
</template>
<script>
import { mapActions, mapMutations } from 'vuex'
import deviceInfoForm from '_c/device-info-form'
export default {
  name: 'addDevice',
  components: {
    deviceInfoForm
  },
  props: {
    deviceInfo: {
      type: Object
    }
  },
  data () {
    return {
      modalControl: false,
      loading: false
    }
  },
  computed: {
  },
  methods: {
    ...mapMutations([
      'initFormItem'
    ]),
    ...mapActions([
      'addDevice'
    ]),
    modalComfirmBtnClick () {
      this.loading = true
      setTimeout(() => {
        this.addDevice()
        this.loading = false
        this.modalControl = false
      }, 1000)
    },
    modalCancelBtnClick () {
      this.initFormItem()
      this.modalControl = false
    }
  }
}
</script>
