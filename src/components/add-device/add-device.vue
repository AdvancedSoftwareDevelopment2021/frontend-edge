<template>
    <div>
        <Button type="primary" @click="modalControl = true">
            <Icon type="ios-add-circle-outline" />
            新增设备
        </Button>
        <Modal
            v-model="modalControl"
            title="新增设备"
            :loading="loading"
            @on-ok="modalComfirmBtnClick"
            @on-cancel="modalCancelBtnClick">
            <device-info-form :deviceInfo="deviceInfo"/>
        </Modal>
    </div>
</template>
<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import deviceInfoForm from '_c/device-info-form';
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
            loading: true,
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
            setTimeout(() => {
                this.addDevice()
                this.modalControl = false;
            }, 1000);
        },
        modalCancelBtnClick() {
            this.initFormItem()
        }
    }
}
</script>
