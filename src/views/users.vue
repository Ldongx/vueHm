<template>
<el-card class="box-card">
    <!-- 面包屑 -->
    <my-bread level1="用户管理" level2="用户列表"></my-bread>

    <!-- 搜索框 -->
    <el-row class="searchArea">
        <el-col :span="8">
            <el-input clearable placeholder="请输入内容" class="input-with-select searchInput" v-model="searchVal">
                <el-button slot="append" icon="el-icon-search" @click="searchUser()"></el-button>
            </el-input>
        </el-col>

        <el-col :span="16">
            <el-button type="success" @click="dialogFormVisibleAdd = true">添加用户</el-button>

        </el-col>

    </el-row>

    <!-- 表格 -->
    <el-table v-loading="loading" :data="list" style="width: 100%">
        <el-table-column type="index" label="#" width="80">
        </el-table-column>

        <el-table-column prop="username" label="姓名" width="120">
        </el-table-column>

        <el-table-column
        prop="email"
        label="邮箱">
        </el-table-column>
        <el-table-column
        prop="mobile"
        label="电话">
        </el-table-column>
            <el-table-column label="创建日期">
                <template slot-scope="scope">
                    {{scope.row.create_time | formDate}}
                </template>
            </el-table-column>
      
        <el-table-column  label="用户状态"  width="100">
            <template slot-scope="scope">
                <el-switch @change="changeMgState(scope.row)" v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
            </template>
            
        </el-table-column>

        <el-table-column  label="操作">
            <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" circle size="mini" plain @click="showEdit(scope.row)"></el-button>
                    <el-button type="success" icon="el-icon-check" circle size="mini" plain @click="showUser(scope.row)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" circle size="mini" plain @click="deleteUser(scope.row)"></el-button>
            </template>
        </el-table-column>

    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 弹出框 -->

    <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
        <el-form :model="formData">
            <el-form-item label="用户名" :label-width="formLabelWidth">
                <el-input v-model="formData.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" :label-width="formLabelWidth">
                <el-input v-model="formData.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" :label-width="formLabelWidth">
                <el-input v-model="formData.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话" :label-width="formLabelWidth">
                <el-input v-model="formData.mobile" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
            <el-button type="primary" @click="AddUser()">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 编辑用户 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
        <el-form :model="formData">
            <el-form-item label="用户名" :label-width="formLabelWidth">
                <el-input disabled v-model="formData.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" :label-width="formLabelWidth">
                <el-input v-model="formData.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话" :label-width="formLabelWidth">
                <el-input v-model="formData.mobile" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
            <el-button type="primary" @click="EditUser()">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleUser">
        <el-form :model="formData">
            <el-form-item label="用户名" :label-width="formLabelWidth">
                {{currtUserName}}
            </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
            <el-select v-model="currRoleId">
                <el-option disabled label="请选择" :value="-1"></el-option>
                <el-option
                    v-for="(item,index) in roles"
                    :key="index"
                    :label="item.roleName" :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleUser = false">取 消</el-button>
            <el-button type="primary" @click="EditRole()">确 定</el-button>
        </div>
    </el-dialog>
</el-card>


</template>

<script>
export default {
  mounted() {
    this.loadTableData();
  },
  methods: {
    // 分页
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val;
      this.loadTableData();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val;
      this.loadTableData();
    },
    // 加载视图
    async loadTableData() {
      this.loading = true;
      const res = await this.$http.get(
        `users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${
          this.searchVal
        }`
      );
      console.log(res);
      const { meta, data } = res.data;
      if (meta.status === 200) {
        this.total = res.data.data.total;
        this.loading = false;
        this.list = data.users;
      }
    },
    // 查询数据
    async searchUser() {
      this.loadTableData();
    },
    // 修改用户状态
    async changeMgState(user) {
      // console.log(user)
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
      const { meta } = res.data;
      if (meta.status === 200) {
        this.$message.success(meta.msg);
      }
    },
    // 添加用户
    async AddUser() {
        this.dialogFormVisibleAdd = false
        const res = await this.$http.post('users',this.formData)
        // console.log(res)
        const {meta} = res.data
        if(meta.status === 201){
            for (const key in this.formData) {
                if(this.formData.hasOwnProperty(key)){
                    this.formData[key] = ''
                }
            }
            this.loadTableData()
            this.$message.success(meta.msg)
        }


    },
    // 编辑用户
    showEdit(user){
        this.dialogFormVisibleEdit = true
        this.formData = user
        this.currUserId = user.id 

    },
    async EditUser(){
       this.dialogFormVisibleEdit = false
       const res = await this.$http.put(`users/${this.currUserId}`,this.formData)
       const {meta} = res.data
       if(meta.status === 200){
           this.$message.success(meta.msg)
       }


    },
    // 删除用户
    deleteUser(user) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$http.delete(`users/${user.id}`);
          const { meta } = res.data;
          console.log(meta);
          if (meta.status === 200) {
            this.pagenum = 1;
            this.loadTableData();
            this.$message.success(meta.msg);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 修改角色
    async EditRole(){
        this.dialogFormVisibleUser = false
        const res = await this.$http.put(`users/${this.getRoleByUserId}/role`,{rid:this.currRoleId})
        console.log(res)
        const {meta} = res.data
        if(meta.status === 200){
            this.$message.success(meta.msg)
        }
    },
    // 分配角色
    async showUser(user){
        this.getRoleByUserId = user.id
        this.dialogFormVisibleUser = true
        this.currtUserName = user.username 
        const res = await this.$http.get('roles')
        // console.log(res)
        this.roles = res.data.data
        const res1 = await this.$http.get(`users/${user.id}`)
        // console.log(res1)
        this.currRoleId = res1.data.data.rid
    }

  },
  data() {
    return {
      list: [],
      loading: true,
      total: 10,
      pagenum: 1,
      pagesize: 2,
      searchVal: "",
      dialogFormVisibleEdit:false,
      dialogFormVisibleAdd:false,
      dialogFormVisibleUser:false,
      formData:{
          username:'',
          password:'',
          email:'',
          mobile:''
      },
      formLabelWidth:'120px',
      currRoleId:-1,
      currtUserName:'',
      roles: [],
      getRoleByUserId:-1



    };
  }
};
</script>

<style>
.box-card {
  height: 100%;
}

.searchArea {
  margin-top: 10px;
  margin-bottom: 10px;
}

.searchArea .searchInput {
  width: 350px;
}

</style>


