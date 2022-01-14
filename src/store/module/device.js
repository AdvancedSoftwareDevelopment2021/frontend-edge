import {
  getDeviceListApi,
  deleteDeviceApi,
  addDeviceApi,
  modifyDeviceApi,
  getDeviceByIdApi
} from '@/api/device'

export default {
  state: {
    deviceList: [],
    deviceInfo: null,
    deviceInfoForHistory: null,
    _formItem: {
      name: null,
      // category: 'test2',
      model: null,
      description: null,
      values: [
        {
          valueIndex: 1,
          name: null,
          type: null,
          protocol: null
        }
      ]
    },
    deviceDataTypeList: [
      {
        value: 'Integer',
        label: 'Integer'
      },
      {
        value: 'Double',
        label: 'Double'
      },
      {
        value: 'String',
        label: 'String'
      },
      {
        value: 'Boolean',
        label: 'Boolean'
      }
    ],
    deviceDataProtocolList: [
      {
        value: 'Modbus',
        label: 'Modbus'
      },
      // {
      //   value: 'Canbus',
      //   label: 'Canbus'
      // },
      {
        value: 'ZigBee',
        label: 'ZigBee'
      },
      {
        value: 'WebSocket',
        label: 'WebSocket'
      },
      {
        value: 'Http',
        label: 'Http'
      }
    ],
    mode: 'ADD',
    deviceStatusList: []
  },
  getters: {
    formItem (state) {
      return { ...state._formItem }
    },
    deviceDataWithoutSensor (state) {
      if (state.deviceList.length === 0) return []
      let sensorList = state.deviceList.map((device) => {
        const { name, id, values } = device
        let list = []
        for (let value of values) {
          if (value.sensorId === null) list.push(value)
        }
        return {
          deviceName: name,
          deviceId: id,
          values: list
        }
      })
      return sensorList
    },
    deviceListWithIdAndName (state) {
      return state.deviceList.map(item => ({ name: item.name, id: item.id }))
    }
  },
  mutations: {
    resetFormItem (state) {
      state._formItem = {
        name: null,
        // category: 'test2',
        model: null,
        description: null,
        values: [
          {
            valueIndex: 1,
            name: null,
            type: null,
            protocol: null
          }
        ]
      }
    },
    setDeviceList (state, deviceList) {
      state.deviceList = deviceList
    },
    addDevice (state, newDevice) {
      state.deviceList.push(newDevice)
    },
    deleteDevice (state, { listId, deviceId }) {
      // TODO: assert(listId === indexOfDevice)
      // const deleteDevice = state.deviceList.splice(listId, 1)
      const indexOfDevice = state.deviceList
        .map((device) => device.id)
        .indexOf(deviceId)
      state.deviceList.splice(indexOfDevice, 1)
    },
    modifyDevice (state, updateDeviceInfo) {
      const indexOfDevice = state.deviceList
        .map((device) => device.id)
        .indexOf(updateDeviceInfo.id)
      state.deviceList[indexOfDevice] = updateDeviceInfo
    },
    modeChange (state, newMode) {
      state.mode = newMode
    },
    setDeviceInfo (state, deviceInfo) {
      state.deviceInfo = deviceInfo
    },
    setDeviceInfoForHistory (state, deviceInfoForHistory) {
      state.deviceInfoForHistory = deviceInfoForHistory
    },
    setDeviceStatus (state, deviceStatusList) {
      state.deviceStatusList.push(deviceStatusList)
    }
  },
  actions: {
    async getDeviceListAction ({ commit }) {
      // await new Promise((resolve) => {
      //   setTimeout(() => {
      //     resolve()
      //     return
      //   }, 3000)
      // })
      let res = await getDeviceListApi()
      commit('setDeviceList', res)
      console.log('Get deviceList from DB')
    },
    async addDeviceAction ({ state, commit, getters, dispatch }, newDeviceInfo) {
      // TODO: 数据内容检查, try catch
      // let newDevice = newDeviceInfo
      let newDevice = await addDeviceApi(newDeviceInfo)
      // newDevice = { ...newDevice, id: res.id }
      commit('addDevice', newDevice)
      console.log(`Add device ${JSON.stringify(newDevice)}`)
      await dispatch('getDeviceStatusAction')
    },
    async deleteDeviceAction ({ state, commit, dispatch }, listId) {
      // TODO: When delete device, I need to delete sensor that binding by this device
      const deviceId = state.deviceList[listId].id
      await deleteDeviceApi(deviceId)
      commit('deleteDevice', { listId, deviceId })
      console.log(`Delete device ${JSON.stringify(state.deviceList[listId])}`)
    },
    async modifyDeviceListAction (
      { state, commit, dispatch },
      updateDeviceInfo
    ) {
      await modifyDeviceApi(updateDeviceInfo)
      let res = await getDeviceByIdApi(updateDeviceInfo.id)
      commit('modifyDevice', res)
      await dispatch('getDeviceStatusAction')
      console.log(`Modify device: ${JSON.stringify(res)}`)
    },
    async getDeviceStatusAction ({ state, dispatch, rootState }) {
      state.deviceStatusList = []
      await dispatch('getSensorLatestStatusAction', {}, { root: true })
    }
  }
}
