// values -> type: Integer、String、Object、Boolean
// values -> protocol: MODBUS、CANBUS、ZIGBEE、WEBSOCKET、HTTP

export default {
  state: {
    deviceList: [
      {
        id: 1,
        name: 'machine1',
        model: 'RTX1',
        // category: '加热器',
        description: '',
        status: 1,
        values: [
          {
            'valueIndex': 1,
            'name': 'name',
            'type': 'String',
            'protocol': 'MODBUS'
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
            'valueIndex': 1,
            'name': 'name',
            'type': 'String',
            'protocol': 'MODBUS'
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
            'valueIndex': 1,
            'name': 'name',
            'type': 'String',
            'protocol': 'MODBUS'
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
            'valueIndex': 1,
            'name': 'name',
            'type': 'String',
            'protocol': 'MODBUS'
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
            'valueIndex': 1,
            'name': 'name',
            'type': 'String',
            'protocol': 'MODBUS'
          }
        ]
      }
    ],
    _formItem: {
      id: null,
      name: 'test1',
      // category: 'test2',
      model: 'test3',
      description: 'test4',
      status: 2,
      values: [
        {
          'valueIndex': 1,
          'name': 'name',
          'type': 'String',
          'protocol': 'WEBSOCKET'
        }
      ]
    },
    newFormItemID: 5,
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
        value: 'MODBUS',
        label: 'MODBUS'
      },
      {
        value: 'CANBUS',
        label: 'CANBUS'
      },
      {
        value: 'ZIGBEE',
        label: 'ZIGBEE'
      },
      {
        value: 'WEBSOCKET',
        label: 'WEBSOCKET'
      },
      {
        value: 'HTTP',
        label: 'HTTP'
      }
    ]
  },
  getters: {
    formItem (state, getters) {
      return { ...state._formItem }
    }
  },
  mutations: {
    deleteDevice (state, listId) {
      // FIXME: delete by listId
      const deleteItem = state.deviceList.splice(listId, 1)
      console.log(`Delete device ${JSON.stringify(deleteItem)}`)
    }
  },
  actions: {
    addDevice ({ state, commit, getters }, newState) {
      // TODO: 數據內容檢查, try catch
      state.newFormItemID += 1
      const deviceId = state.newFormItemID
      console.log(`Add ${deviceId}`)
      const formItem = { ...newState, id: deviceId }
      state.deviceList.push(formItem)
      console.log(`Add device ${JSON.stringify(formItem)}`)
      // TODO: 发给后端存入数据库
    },
    modifyDeviceList ({ state, commit }, newState) {
      const indexOfDevice = state.deviceList.map((device) => (device.id)).indexOf(newState.id)
      // console.log(state.deviceList[indexOfDevice])
      state.deviceList[indexOfDevice] = newState
      console.log(`Modify device: ${JSON.stringify(newState)}`)
    }
  }
}
