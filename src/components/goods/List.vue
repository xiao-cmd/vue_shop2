<template>
  <div>
    <h3>商品列表</h3>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!--添加商品按钮 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model='queryInfo.query' clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- table表格区域 -->
      <el-table :data="goodslist" border stripe>
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="goods_name" label="商品名称"></el-table-column>
          <el-table-column prop="goods_price" label="商品价格(元)" width="95px"></el-table-column>
          <el-table-column prop="goods_weight" label="商品重量" width="70px"></el-table-column>
          <el-table-column prop="add_time" label="创建时间" width="140px">
             <template slot-scope="scope"> 
                {{scope.row.add_time | dateFormat}}
             </template>
          </el-table-column>
            <el-table-column label="操作" width="180px">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="delGoodsById(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10,20, 30, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      goodslist: [],
      // 总数量
      total: 0
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      // 发送请求 获取商品列表
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      //判断一下获取是否成功
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      this.$message.success('获取商品列表成功')
      // 获取数据成功,将获取到的数据保存到data中
      // console.log(res.data)
      this.goodslist = res.data.goods
      this.total = res.data.total
      console.log(this.goodslist);
      
    },
    handleSizeChange(newSize) {
      // @size-change事件是在选择每页多少条数据的下拉框时触发
      // console.log(newSize)
      // 将用户点击的每页数据条列更改到pagesize中
      this.queryInfo.pagesize = newSize
      // 根据最新的参数数据来进行查询
      this.getGoodsList()
    },
    handleCurrentChange(newPage) {
      // console.log(newPage)
      // 将queryInfo中的页码改变成用户点击的那个页码
      this.queryInfo.pagenum = newPage
      // 根据最新的参数数据来进行查询
      this.getGoodsList()
    },
    async delGoodsById(row){
      // 弹出确定取消窗
      const result= await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
       }).catch(err=>err);

       if(result === 'confirm'){
         console.log(row.goods_id)

         const {data:res}=await this.$http.delete(`goods/${row.goods_id}`)

         if(res.meta.status !==200){
           return this.$message.error('删除商品失败')
         }
           this.$message.success('删除商品成功')
           this.getGoodsList()
       }
    },
    goAddPage(){
      this.$router.push(`goods/add`)
    }
  }
}
</script>
    <style lang="less" scoped>
</style>
    