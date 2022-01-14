import axios from '@/libs/api.request'

export const getMLModal = () => {
  return axios.request({
    url: 'ml',
    method: 'get'
  })
}
