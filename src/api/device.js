import axios from '@/libs/api.request'

export const getDeviceListApi = () => {
  return axios.request({
    url: 'device',
    method: 'get'
  })
}

export const addDeviceApi = (device) => {
  let { name, model, description, values } = device
  values = values.map(({ name, type, protocol }) => ({ name, type, protocol }))
  return axios.request({
    url: 'device',
    method: 'post',
    data: {
      name,
      model,
      description,
      values
    }
  })
}

export const deleteDeviceApi = (deviceId) => {
  return axios.request({
    url: `device/${deviceId}`,
    method: 'delete'
  })
}

export const modifyDeviceApi = (updateDeviceInfo) => {
  const { id, name, model, description, values } = updateDeviceInfo
  return axios.request({
    url: `device/${id}`,
    method: 'put',
    data: {
      name,
      model,
      description,
      values
    }
  })
}

export const getDeviceByIdApi = (deviceId) => {
  return axios.request({
    url: `device/${deviceId}`,
    method: 'get'
  })
}
