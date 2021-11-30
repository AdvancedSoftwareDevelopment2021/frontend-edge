import axios from '@/libs/api.request'

export const addSensorApi = ({ deviceId, newSensor }) => {
  console.log(deviceId, newSensor)
  return axios.request({
    url: `sensor/${deviceId}`,
    method: 'post',
    data: newSensor
  })
}
