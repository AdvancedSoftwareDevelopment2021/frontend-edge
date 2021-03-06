import {
  getAllProcessesApi,
  bindingProcessAndDeviceApi,
  cancelBindingProcessAndDeviceApi,
  getBindingListApi,
  processStopApi,
  processStartApi,
  deleteProcess
} from '@/api/process'

export default {
  state: {
    activeElement: {},
    modal: false,
    processList: [],
    activeProcess: {},
    activeBindingList: []
  },
  mutations: {
    setActiveElement (state, element) {
      state.activeElement = element
    },
    setProcessModal (state, value) {
      state.modal = value
    },
    setActiveProcess (state, id) {
      const process = state.processList.find((process) => process.id === id)
      state.activeProcess = process
    }
  },
  actions: {
    async getAllProcessesAction ({ state }) {
      let res = await getAllProcessesApi()
      state.processList = res
      console.log(`Get All processes from DB`)
    },
    async bindingDeviceAction ({ state, dispatch }, { device }) {
      // const processId = state.businessObject.parent.id
      // TODO: process id
      const processId = state.activeProcess.id
      const taskId = state.activeElement.id
      const deviceId = device.id
      await bindingProcessAndDeviceApi({ processId, taskId, deviceId })
      dispatch('getBindingListAction')
    },
    async cancelBindingDeviceAction ({ state, dispatch }, taskId) {
      const processId = state.activeProcess.id
      await cancelBindingProcessAndDeviceApi({ processId, taskId })
      console.log(
        `Cancel binding process id: ${processId}, task id: ${taskId}`
      )
      dispatch('getBindingListAction')
    },
    async getBindingListAction ({ state }) {
      const processId = state.activeProcess.id
      let res = await getBindingListApi(processId)
      state.activeBindingList = res
    },
    async processStopAction ({ state }, id) {
      await processStopApi(id)
    },
    async processStartAction ({ state }, { id, number }) {
      await processStartApi(id, number)
    },
    async processDeleteAction ({ state }, id) {
      await deleteProcess(id)
      state.processList = state.processList.filter(c => c.id !== id)
    }
  }
}
