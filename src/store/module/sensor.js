import {
  addSensorApi,
  sensorStartCommandApi,
  sensorStopCommandApi,
  sensorMonitorStopCommandApi,
  sensorMonitorStartCommandApi,
  getSensorAllHistoryDataApi
} from '@/api/sensor'

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
        // collectScheduler: {
        //   interval: 1,
        //   unit: 'SECOND'
        // },
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
        label: '秒'
      }, {
        value: 'MINUTE',
        label: '分'
      }, {
        value: 'HOUR',
        label: '小时'
      }, {
        value: 'DAY',
        label: '天'
      }, {
        value: 'WEEK',
        label: '周'
      }, {
        value: 'MONTH',
        label: '月'
      }
    ],
    allHistoryDataList: []
  },
  mutations: {
    setSensorAllHistoryData (state, { sensorName, allHistoryDataList }) {
      if (!state.allHistoryDataList.some(c => c.sensorName === sensorName)) {
        state.allHistoryDataList.push({ sensorName, historyDataList: allHistoryDataList })
      }
    },
    releaseSensorAllHistoryData (state) {
      state.allHistoryDataList = []
    }
  },
  actions: {
    async addSensorAction (
      { state },
      { deviceId, newSensor }
    ) {
      if (newSensor.dataCollector.type === 'WebSocket') {
        newSensor.dataCollector.uri = newSensor.dataCollector.uri + '/' + deviceId
      }
      await addSensorApi({ deviceId, newSensor })
      console.log(
        `Add sensor deviceId: ${deviceId}, sensorName: ${newSensor.name}}`
      )
      // FIXME: vuex找不到device的actions getDeviceListAction
      //   await dispatch('device/getDeviceListAction', {}, {root: true})
    },
    async sensorStartCommandAction (
      { state },
      { deviceId, sensorId, sensorName }
    ) {
      await sensorStartCommandApi({ deviceId, sensorId })
      console.log(`${sensorName}(${deviceId}): start`)
    },
    async sensorStopCommandAction ({ state }, { deviceId, sensorId, sensorName }) {
      await sensorStopCommandApi({ deviceId, sensorId })
      console.log(`${sensorName}(${deviceId}): stop`)
    },
    async sensorMonitorStartCommandAction (
      { state },
      { deviceId, sensorId, sensorName }
    ) {
      await sensorMonitorStartCommandApi({ deviceId, sensorId })
      console.log(`${sensorName}(${deviceId}): start`)
    },
    async sensorMonitorStopCommandAction ({ state }, { deviceId, sensorId, sensorName }) {
      await sensorMonitorStopCommandApi({ deviceId, sensorId })
      console.log(`${sensorName}(${deviceId}): stop`)
    },
    async getSensorAllHistoryDataAction (
      { commit },
      { deviceId, sensorId, sensorName }
    ) {
      await getSensorAllHistoryDataApi({ deviceId, sensorName })
        .then((res) => {
          commit('setSensorAllHistoryData', {
            sensorName,
            allHistoryDataList: res.data
          })
        }).catch(e => {
          commit('setSensorAllHistoryData', {
            sensorName,
            allHistoryDataList: []
          })
        })
      console.log(`Get ${sensorName} sensor all history data`)
    }
  }
}
