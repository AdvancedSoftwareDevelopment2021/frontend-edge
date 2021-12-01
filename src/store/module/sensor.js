import { addSensorApi } from '@/api/sensor'

// TODO: 可能要做Number和String的转换
export default {
  state: {
    sensorFormItem: {
      Modbus: {
        name: '',
        collectScheduler: {
          interval: 10,
          unit: 'SECOND'
        },
        dataCollector: {
          type: 'Modbus',
          ip: '127.0.0.1',
          port: 502,
          slaveId: 3,
          offset: 0,
          modbusFunction: 'HOLDING_REGISTER',
          datatype: 'BINARY',
          num: 2
        }
      },
      Canbus: {},
      ZigBee: {
        name: '',
        dataCollector: {
          type: 'ZigBee',
          serialNumber: 'COM2',
          baudRate: 9600,
          checkoutBit: null,
          dataBit: 8,
          stopBit: 1
        }
      },
      WebSocket: {
        name: '',
        collectScheduler: {
          interval: 1,
          unit: 'SECOND'
        },
        dataCollector: {
          type: 'WebSocket',
          uri: 'http://localhost:8000/websocket'
        }
      },
      Http: {
        name: '',
        collectScheduler: {
          interval: 1,
          unit: 'SECOND'
        },
        dataCollector: {
          type: 'Http',
          url: 'http://localhost:8000/getdata'
        }
      }
    },
    unitList: [
      {
        value: 'SECOND',
        label: 'SECOND'
      }
    ]
  },
  actions: {
    async addSensorAction (
      { state, commit, dispatch, rootState },
      { deviceId, newSensor }
    ) {
      await addSensorApi({ deviceId, newSensor })
      console.log(
        `Add sensor deviceId: ${deviceId}, sensorName: ${newSensor.name}}`
      )
      // FIXME: vuex找不到device的actions getDeviceListAction
      //   await dispatch('device/getDeviceListAction', {}, {root: true})
    }
  }
}
