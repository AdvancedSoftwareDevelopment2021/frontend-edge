<template>
  <Card>
    <paged-table
      ref="table"
      :loading="loading"
      :columns="columns"
      :data-source="history"
      :total="history.length">
    </paged-table>
  </Card>
</template>

<script>
import { getDriverHistory, getDriverById } from '@/api/driver'
import PagedTable from '_c/paged-table'
export default {
  name: 'command-management',
  components: {
    PagedTable
  },
  data: function () {
    return {
      loading: true,
      history: [],
      columns: [
        {
          title: '设备id',
          key: 'deviceId',
          align: 'center'
        },
        {
          title: '检测值',
          key: 'data',
          align: 'center'
        },
        {
          title: '失败时间',
          key: 'timestamp',
          align: 'center'
        }
      ]
    }
  },
  mounted () {
    this.refresh()
  },
  created () {
    this.refresh()
  },
  methods: {
    async refresh () {
      this.loading = true
      const id = this.$route.params.id
      this.driver = await getDriverById(id)
      getDriverHistory(this.driver.deviceId, this.driver.name).then(() => {
      }).catch((e) => {
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
