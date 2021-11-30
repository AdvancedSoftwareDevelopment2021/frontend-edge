import { addSensor } from '@/api/sensor'

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
        name: 'vf7WX4',
        collectScheduler: {
          interval: 10,
          unit: 'SECOND'
        },
        dataCollector: {
          type: 'ZigBee',
          protocol: 'ZigBee协议',
          ip: '127.0.0.1',
          port: 502,
          slaveId: 3,
          offset: 0,
          zigbeeFunction: 'HOLDING_REGISTER',
          datatype: 'BINARY',
          num: 2
        }
      },
      WebSocket: {},
      Http: {}
    },
    unitList: [
      {
        value: 'SECOND',
        label: 'SECOND'
      }
    ]
  },
  actions: {
    async addSensorAction ({ state, commit, dispatch, rootState }, { deviceId, newSensor }) {
    //   console.log(deviceId, newSensor);
      await addSensor({ deviceId, newSensor })
      console.log(`Add sensor deviceId: ${deviceId}, sensorName: ${newSensor.name}}`)
      // FIXME: vuex找不到device的actions getDeviceListAction
    //   await dispatch('device/getDeviceListAction', {}, {root: true})
    }
  }
}
