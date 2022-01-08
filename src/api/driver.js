import axios from '@/libs/api.request'

export const getDriverByDevice = (id) => {
  return axios.request({
    url: `driver/${id}`,
    method: 'get'
  })
}

export const createDriver = (data) => {
  return axios.request({
    url: `driver`,
    method: 'post',
    data
  })
}

export const updateDriver = (data) => {
  return axios.request({
    url: `driver`,
    method: 'put',
    data
  })
}

export const deleteDriver = (id) => {
  return axios.request({
    url: `driver/${id}`,
    method: 'delete'
  })
}

export const getDriverById = (id) => {
  return axios.request({
    url: `driver/${id}/one`,
    method: 'get'
  })
}
