<template>
  <div>
    <h3>商品分类组件</h3>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!--添加分类按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 
         :data="catelist" 设置数据来源
         :columns="columns" 配置每列需要显示的数据
         :selection-type="false" 将每行数据配置为没有复选框
         :expand-type="false" 每行数据无需扩展
         show-index 添加索引列
         index-text="#" 设置索引列的列头
         :show-row-hover="false" 设置鼠标悬停不要变色
      -->
      <tree-table
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-error" style="color:red" v-if="scope.row.cat_deleted"></i>
          <i class="el-icon-success" style="color:lightgreen" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level == 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level == 1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!--操作  -->
        <template slot="opt" slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页导航 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 3, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed">
      <!--添加分类的表单 -->
      <el-form :model="addCateForm" ref="addCateFormRef" :rules="addCateFormRules" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- v-model="selectedKeys" :绑定级联选择器中的数据来源
          :options="parentCateList" :绑定级联选择器显示的数据来源
          expand-trigger="hover":设置级联选择器悬停触发
          :props="cascaderProps": 设置级联选择器中选项的配置信息
          @change="cascaderChange":当级联选择器中的选项发送改变时出发  change-on-select:级联选择器中的任何一项都可以选择
          clearable:可以按 x 删除选择的内容-->
          <el-cascader expand-trigger="hover" :options="parentCateList" :props="cascaderProps" v-model="selectedKeys" @change="cascaderChange" change-on-select clearable></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //查询条件  商品分类的数据列表,默认为空
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 用来保存商品分类的数组
      catelist: [],
      // 总数量
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      addCateDialogVisible: false,
      addCateForm: {
        cat_name: '',
        // 父级分类的id
        cat_pid: 0,
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 保存父级分类信息
      parentCateList: [],
      cascaderProps:{
        label:'cat_name',
        value:'cat_id',
        children:'children'
      },
      selectedKeys:[]
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      //判断一下获取是否成功
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类列表失败')
      }
      // console.log(res.data)
      this.$message.success('获取分类列表成功')
      // 获取数据成功,将获取到的数据保存到data中
      this.catelist = res.data.result
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      // @size-change事件是在选择每页多少条数据的下拉框时触发
      // console.log(newSize)
      // 将用户点击的每页数据条列更改到pagesize中
      this.queryInfo.pagesize = newSize
      // 根据最新的参数数据来进行查询
      this.getCateList()
    },
    handleCurrentChange(newPage) {
      // console.log(newPage)
      // 将queryInfo中的页码改变成用户点击的那个页码
      this.queryInfo.pagenum = newPage
      // 根据最新的参数数据来进行查询
      this.getCateList()
    },
    showAddCateDialog() {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    async getParentCateList() {
      // 获取一级和二级的分类
      const {data:res}=await this.$http.get('categories', {
        params: { type: 2 }
      })

      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类失败')
      }
      this.parentCateList=res.data
    },
    // 级联选择器的选项发生改变的时候会触发事件
    cascaderChange(){
      if(this.selectedKeys.length >0){
        this.addCateForm.cat_pid= this.selectedKeys[this.selectedKeys.length-1]
      // 为当前分类的等级赋值
        this.addCateForm.cat_level=this.selectedKeys.length
        return
      }else{
        // 父级分类的id
        this.addCateForm.cat_pid=0
        // 父级分类的等级
        this.addCateForm.cat_level=0
      }
       console.log(this.addCateForm)
    },
    // 发送请求完成分类的添加
    addCate(){
        this.$refs.addCateFormRef.validate(async valid=>{
          if(!valid) return;

          const {data:res}=await this.$http.post('categories',this.addCateForm)

          if(res.meta.status!==201){
            return this.$message.error('添加商品失败')
          }
          this.$message.success('添加商品成功')
          this.getCateList()
          this.addCateDialogVisible=false
        })
    },
    addCateDialogClosed(){
      // 重置表单中的数据
      this.selectedKeys=[],
      this.addCateForm.cat_name=''
    }
  }
}
</script>

<style lang="less" scoped>
  
</style>