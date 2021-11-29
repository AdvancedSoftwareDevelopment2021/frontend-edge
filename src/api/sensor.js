import axios from '@/libs/api.request'

export const addSensor = ({ deviceId, newSensor }) => {
  return axios.request({
    url: `sensor/${deviceId}`,
    method: 'post',
    data: newSensor
  })
}
