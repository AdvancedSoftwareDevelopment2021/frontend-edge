import {
  getDeviceListApi,
  deleteDeviceApi,
  addDeviceApi,
  modifyDeviceApi
} from '@/api/device'
import Mock from 'mockjs'

export default {
  state: {
    /* deviceList: [
      {
        id: 1,
        name: 'machine1',
        model: 'RTX1',
        // category: '加热器',
        description: '',
        status: 1,
        values: [
          {
            valueIndex: 1,
            name: 'name',
            type: 'String',
            protocol: 'Modbus'
          }
        ]
      },
      {
        id: 2,
        name: 'machine2',
        model: 'RTX2',
        // category: '加热器',
        description: '',
        status: 2,
        values: [
          {
            valueIndex: 1,
            name: 'name',
            type: 'String',
            protocol: 'Modbus'
          }
        ]
      },
      {
        id: 3,
        name: 'machine3',
        model: 'RTX3',
        // category: '加热器',
        description: '',
        status: 3,
        values: [
          {
            valueIndex: 1,
            name: 'name',
            type: 'String',
            protocol: 'Modbus'
          }
        ]
      },
      {
        id: 4,
        name: 'machine4',
        model: 'RTX4',
        // category: '加热器',
        description: '',
        status: 2,
        values: [
          {
            valueIndex: 1,
            name: 'name',
            type: 'String',
            protocol: 'Modbus'
          }
        ]
      },
      {
        id: 5,
        name: 'machine5',
        model: 'RTX5',
        // category: '加热器',
        description: '',
        status: 3,
        values: [
          {
            valueIndex: 1,
            name: 'name',
            type: 'String',
            protocol: 'Modbus'
          }
        ]
      }
    ], */
    deviceList: [],
    // _formItem: Mock.mock({
    //   id: 0,
    //   'name|1': /[a-zA-Z0-9]{5,8}/,
    //   // category: 'test2',
    //   'model|1': /[A-Z]{5,8}[0-9]{2,3}/,
    //   'description|2': /[a-zA-Z0-9]{5,8} /,
    //   'status|1': 2,
    //   'values|1-4': [
    //     {
    //       'valueIndex|+1': 1,
    //       'name|1': /[a-zA-Z0-9]{5,8}/,
    //       'type|1': ['Integer', 'String', 'Object', 'Boolean'],
    //       'protocol|1': ['Modbus', 'Canbus', 'ZigBee', 'WebSocket', 'Http']
    //     }
    //   ]
    // }),
    _formItem: Mock.mock({
      id: 0,
      name: null,
      // category: 'test2',
      model: null,
      description: null,
      status: 2,
      values: [
        {
          valueIndex: 1,
          name: null,
          type: null,
          protocol: null
        }
      ]
    }),
    deviceDataTypeList: [
      {
        value: 'Integer',
        label: 'Integer'
      },
      {
        value: 'String',
        label: 'String'
      },
      {
        value: 'Object',
        label: 'Object'
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
    mode: 'ADD'
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
    }
  },
  mutations: {
    resetFormItem (state) {
      state._formItem = Mock.mock({
        id: 0,
        'name|1': /[a-zA-Z0-9]{5,8}/,
        // category: 'test2',
        'model|1': /[A-Z]{5,8}[0-9]{2,3}/,
        'description|2': /[a-zA-Z0-9]{5,8} /,
        'status|1': 2,
        'values|1-4': [
          {
            'valueIndex|+1': 1,
            'name|1': /[a-zA-Z0-9]{5,8}/,
            'type|1': ['Integer', 'String', 'Object', 'Boolean'],
            'protocol|1': ['Modbus', 'Canbus', 'ZigBee', 'WebSocket', 'Http']
          }
        ]
      })
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
      console.log(newMode)
    }
  },
  actions: {
    async getDeviceListAction ({ state, commit }) {
      await getDeviceListApi().then((res) => {
        commit('setDeviceList', res.data.object)
        // console.log(JSON.stringify(state.deviceList))
      })
      console.log('Get deviceList from DB')
    },
    async addDeviceAction ({ state, commit, getters, dispatch }, newDeviceInfo) {
      // TODO: 数据内容检查, try catch
      let newDevice = newDeviceInfo
      await addDeviceApi(newDeviceInfo).then((res) => {
        console.log(res.data.object.id)
        newDevice = { ...newDevice, id: res.data.object.id }
        commit('addDevice', newDevice)
      })
      console.log(`Add device ${JSON.stringify(newDevice)}`)
    },
    async deleteDeviceAction ({ state, commit, dispatch }, listId) {
      // TODO: delete data sources
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
      commit('modifyDevice', updateDeviceInfo)
      console.log(`Modify device: ${JSON.stringify(updateDeviceInfo)}`)
    }
  }
}
