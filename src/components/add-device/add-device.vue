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
            @on-ok="modalComfirmBtnClick">
            <device-info-form :deviceInfo="deviceInfo"/>
        </Modal>
    </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex'
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
        ...mapState({
            formItem: state => state.device.formItem
        })
    },
    methods: {
        ...mapMutations([
            'addDevice'
        ]),
        modalComfirmBtnClick () {
            const { name, model, category, info } = this.formItem
            // TODO: 數據內容檢查, try catch
            let newDevice = {
                name,
                model,
                category,
                status: 1
            }
            setTimeout(() => {
                this.addDevice(newDevice)
                this.modalControl = false;
            }, 1000);
        }
    }
}
</script>
